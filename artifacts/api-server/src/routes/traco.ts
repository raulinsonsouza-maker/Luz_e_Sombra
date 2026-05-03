import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { db } from "@workspace/db";
import { fotosTracoTable, analiseTracoTable, pessoasAnaliseTable } from "@workspace/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";
import {
  aplicarFusaoTracoDiagnostico,
  diagnosticoEmocionalFusaoSchema,
  ESTRUTURAS_TRACO,
  type EstruturaTraco,
} from "@workspace/traco-diagnostico-fusion";
import {
  executarModeloMultimodal,
  metricasResumoSchema,
  questionario20RespostasSchema,
} from "@workspace/traco-eixos-multimodal";

const router = Router();
const objectStorage = new ObjectStorageService();

const TIPOS_FOTO = ["rosto", "corpo-frente", "corpo-lado"] as const;
type TipoFoto = (typeof TIPOS_FOTO)[number];

type AnalysisMetadata = {
  analysisVersion: string;
  confidenceBreakdown: {
    imageQuality: number;
    bodyDetection: number;
    photoCoverage: number;
    featureVariance: number;
  };
  featureSummary: {
    mediaSimetria: number;
    mediaDensidadeCorporal: number;
    mediaRazaoOmbroQuadril: number;
    mediaMassaSuperiorInferior: number;
    varianciaEntreFotos: number;
  };
};

function parsePessoaId(raw: unknown): number | null {
  if (raw === undefined || raw === null || raw === "" || raw === "null") return null;
  const n = parseInt(String(raw), 10);
  return isNaN(n) ? null : n;
}

function toSafeNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseEstruturasTraco(raw: unknown): Record<EstruturaTraco, number> | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const out = {} as Record<EstruturaTraco, number>;
  for (const k of ESTRUTURAS_TRACO) {
    if (!(k in o)) return null;
    const n = Number(o[k]);
    if (!Number.isFinite(n)) return null;
    out[k] = n;
  }
  return out;
}

function normalizeMetadata(raw: unknown, fallbackConfidence: number): AnalysisMetadata {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const conf = (data.confidenceBreakdown && typeof data.confidenceBreakdown === "object"
    ? data.confidenceBreakdown
    : {}) as Record<string, unknown>;
  const summary = (data.featureSummary && typeof data.featureSummary === "object"
    ? data.featureSummary
    : {}) as Record<string, unknown>;

  return {
    analysisVersion: typeof data.analysisVersion === "string" && data.analysisVersion.trim()
      ? data.analysisVersion.trim().slice(0, 64)
      : "traco-legacy",
    confidenceBreakdown: {
      imageQuality: toSafeNumber(conf.imageQuality, fallbackConfidence / 100),
      bodyDetection: toSafeNumber(conf.bodyDetection, fallbackConfidence / 100),
      photoCoverage: toSafeNumber(conf.photoCoverage, 0),
      featureVariance: toSafeNumber(conf.featureVariance, 0.5),
    },
    featureSummary: {
      mediaSimetria: toSafeNumber(summary.mediaSimetria, 0),
      mediaDensidadeCorporal: toSafeNumber(summary.mediaDensidadeCorporal, 0),
      mediaRazaoOmbroQuadril: toSafeNumber(summary.mediaRazaoOmbroQuadril, 0),
      mediaMassaSuperiorInferior: toSafeNumber(summary.mediaMassaSuperiorInferior, 0),
      varianciaEntreFotos: toSafeNumber(summary.varianciaEntreFotos, 0),
    },
  };
}

// ── GET /traco/pessoas ─────────────────────────────────────────────────────────
router.get("/pessoas", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const pessoas = await db
      .select()
      .from(pessoasAnaliseTable)
      .where(eq(pessoasAnaliseTable.usuarioId, req.user!.id))
      .orderBy(pessoasAnaliseTable.ordem);
    return res.json(pessoas);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar pessoas" });
  }
});

// ── POST /traco/pessoas ────────────────────────────────────────────────────────
router.post("/pessoas", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { nome, relacao, ordem } = req.body as { nome?: string; relacao?: string; ordem?: number };
    if (!nome?.trim()) return res.status(400).json({ error: "Nome é obrigatório" });

    const existentes = await db
      .select({ id: pessoasAnaliseTable.id })
      .from(pessoasAnaliseTable)
      .where(eq(pessoasAnaliseTable.usuarioId, req.user!.id));
    if (existentes.length >= 2) {
      return res.status(400).json({ error: "Limite de 2 pessoas adicionais atingido" });
    }

    const [pessoa] = await db
      .insert(pessoasAnaliseTable)
      .values({ usuarioId: req.user!.id, nome: nome.trim(), relacao: relacao?.trim() || null, ordem: ordem ?? existentes.length })
      .returning();
    return res.status(201).json(pessoa);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao criar pessoa" });
  }
});

// ── PUT /traco/pessoas/:id ─────────────────────────────────────────────────────
router.put("/pessoas/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { nome, relacao } = req.body as { nome?: string; relacao?: string };
    const [existing] = await db.select().from(pessoasAnaliseTable)
      .where(and(eq(pessoasAnaliseTable.id, id), eq(pessoasAnaliseTable.usuarioId, req.user!.id)));
    if (!existing) return res.status(404).json({ error: "Pessoa não encontrada" });

    const updates: Partial<typeof pessoasAnaliseTable.$inferInsert> = {};
    if (nome?.trim()) updates.nome = nome.trim();
    if (relacao !== undefined) updates.relacao = relacao?.trim() || null;

    const [pessoa] = await db.update(pessoasAnaliseTable).set(updates).where(eq(pessoasAnaliseTable.id, id)).returning();
    return res.json(pessoa);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao atualizar pessoa" });
  }
});

// ── DELETE /traco/pessoas/:id ──────────────────────────────────────────────────
router.delete("/pessoas/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const [existing] = await db.select().from(pessoasAnaliseTable)
      .where(and(eq(pessoasAnaliseTable.id, id), eq(pessoasAnaliseTable.usuarioId, req.user!.id)));
    if (!existing) return res.status(404).json({ error: "Pessoa não encontrada" });
    await db.delete(pessoasAnaliseTable).where(eq(pessoasAnaliseTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao remover pessoa" });
  }
});

// ── GET /traco/fotos ───────────────────────────────────────────────────────────
router.get("/fotos", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const pessoaId = parsePessoaId(req.query.pessoaId);
    const fotos = await db
      .select()
      .from(fotosTracoTable)
      .where(and(
        eq(fotosTracoTable.usuarioId, req.user!.id),
        pessoaId === null ? isNull(fotosTracoTable.pessoaId) : eq(fotosTracoTable.pessoaId, pessoaId),
      ));
    return res.json(fotos);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar fotos" });
  }
});

// ── POST /traco/fotos/upload-url ───────────────────────────────────────────────
router.post("/fotos/upload-url", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { tipo } = req.body as { tipo: TipoFoto };
    if (!TIPOS_FOTO.includes(tipo)) {
      return res.status(400).json({ error: "Tipo de foto inválido. Use: rosto, corpo-frente ou corpo-lado" });
    }
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    return res.json({ uploadURL, objectPath });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao gerar URL de upload" });
  }
});

// ── POST /traco/fotos ──────────────────────────────────────────────────────────
router.post("/fotos", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { tipo, objectPath, pessoaId: pessoaIdRaw } = req.body as { tipo: TipoFoto; objectPath: string; pessoaId?: unknown };
    if (!TIPOS_FOTO.includes(tipo)) {
      return res.status(400).json({ error: "Tipo de foto inválido" });
    }
    if (!objectPath?.startsWith("/objects/")) {
      return res.status(400).json({ error: "objectPath inválido" });
    }
    const pessoaId = parsePessoaId(pessoaIdRaw);

    // Validate pessoaId belongs to user if provided
    if (pessoaId !== null) {
      const [pessoa] = await db.select({ id: pessoasAnaliseTable.id }).from(pessoasAnaliseTable)
        .where(and(eq(pessoasAnaliseTable.id, pessoaId), eq(pessoasAnaliseTable.usuarioId, req.user!.id)));
      if (!pessoa) return res.status(404).json({ error: "Pessoa não encontrada" });
    }

    // Delete existing photo of this type for this user+pessoa
    await db.delete(fotosTracoTable).where(and(
      eq(fotosTracoTable.usuarioId, req.user!.id),
      eq(fotosTracoTable.tipo, tipo),
      pessoaId === null ? isNull(fotosTracoTable.pessoaId) : eq(fotosTracoTable.pessoaId, pessoaId),
    ));

    const [foto] = await db
      .insert(fotosTracoTable)
      .values({ usuarioId: req.user!.id, pessoaId, tipo, objectPath })
      .returning();
    return res.json(foto);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao salvar foto" });
  }
});

// ── DELETE /traco/fotos/:id ────────────────────────────────────────────────────
router.delete("/fotos/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const [foto] = await db
      .select()
      .from(fotosTracoTable)
      .where(and(eq(fotosTracoTable.id, id), eq(fotosTracoTable.usuarioId, req.user!.id)));
    if (!foto) return res.status(404).json({ error: "Foto não encontrada" });
    await db.delete(fotosTracoTable).where(eq(fotosTracoTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao remover foto" });
  }
});

// ── GET /traco/fotos/:id/view ──────────────────────────────────────────────────
router.get("/fotos/:id/view", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const [foto] = await db
      .select()
      .from(fotosTracoTable)
      .where(and(eq(fotosTracoTable.id, id), eq(fotosTracoTable.usuarioId, req.user!.id)));
    if (!foto) return res.status(404).json({ error: "Foto não encontrada" });

    const file = await objectStorage.getObjectEntityFile(foto.objectPath);
    const response = await objectStorage.downloadObject(file, 3600);
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "private, max-age=3600");
    return res.send(buffer);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao carregar foto" });
  }
});

// ── POST /traco/analisar ───────────────────────────────────────────────────────
router.post("/analisar", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { resultado, pessoaId: pessoaIdRaw, diagnosticoEmocional, questionario20 } = req.body as {
      resultado?: Record<string, unknown>;
      pessoaId?: unknown;
      diagnosticoEmocional?: unknown;
      /** 20 inteiros 1–5 ou `{ respostas: number[] }` */
      questionario20?: unknown;
    };

    if (!resultado || typeof resultado !== "object") {
      return res.status(400).json({ error: "Resultado da análise não fornecido." });
    }

    const r = resultado as Record<string, unknown>;
    if (!r.estruturas || !r.estruturaPrincipal || !r.estruturaSecundaria) {
      return res.status(400).json({ error: "Resultado da análise incompleto ou inválido." });
    }

    const estParsed = parseEstruturasTraco(r.estruturas);
    if (!estParsed) {
      return res.status(400).json({ error: "Estruturas inválidas: são necessários os cinco percentuais (esquizoide, oral, psicopata, masoquista, rigido)." });
    }

    const sum = Object.values(estParsed).reduce((a: number, b) => a + Number(b), 0);
    if (Math.abs(sum - 100) > 2) {
      return res.status(400).json({ error: "Percentagens inválidas: devem somar 100." });
    }
    const metadata = normalizeMetadata(r.metadata, toSafeNumber(r.confiancaAnalise, 50));

    const estruturasSomenteFotos = { ...estParsed };
    let resultadoFusao = { ...r, metadata } as Record<string, unknown>;
    resultadoFusao.estruturasSomenteFotos = { ...estruturasSomenteFotos };

    const rawQ20 =
      questionario20 === undefined || questionario20 === null
        ? undefined
        : Array.isArray(questionario20)
          ? questionario20
          : typeof questionario20 === "object" &&
              questionario20 !== null &&
              Array.isArray((questionario20 as { respostas?: unknown }).respostas)
            ? (questionario20 as { respostas: number[] }).respostas
            : undefined;

    const q20Parsed =
      rawQ20 === undefined ? null : questionario20RespostasSchema.safeParse(rawQ20);

    if (rawQ20 !== undefined && (!q20Parsed || !q20Parsed.success)) {
      const msg = q20Parsed?.error?.issues.map((issue) => issue.message).join(" ") ?? "Formato inválido.";
      return res.status(400).json({
        error: "questionario20 inválido: envie 20 valores inteiros de 1 a 5 (índice 0 = pergunta 1).",
        detalhes: msg,
      });
    }

    if (q20Parsed?.success) {
      const mrParsed = metricasResumoSchema.safeParse(r.metricasResumo);
      if (!mrParsed.success) {
        return res.status(400).json({
          error: "resultado.metricasResumo é obrigatório quando questionario20 é enviado (cliente deve atualizar o app).",
          detalhes: mrParsed.error.flatten(),
        });
      }
      try {
        const mm = executarModeloMultimodal({
          metricasResumo: mrParsed.data,
          respostas20: q20Parsed.data,
        });
        resultadoFusao = { ...resultadoFusao, modeloMultimodal: mm };
      } catch (me: unknown) {
        const msg = me instanceof Error ? me.message : "Erro no modelo multimodal.";
        return res.status(400).json({ error: msg });
      }
    }

    // Fusão legada (5 padrões internos): só quando não há questionário de 20 — evita dupla alteração de estruturas.
    if (
      diagnosticoEmocional !== undefined &&
      diagnosticoEmocional !== null &&
      !q20Parsed?.success
    ) {
      const diagParsed = diagnosticoEmocionalFusaoSchema.safeParse(diagnosticoEmocional);
      if (!diagParsed.success) {
        const msg = diagParsed.error.issues.map((issue) => issue.message).join(" ");
        return res.status(400).json({
          error: "diagnosticoEmocional inválido.",
          detalhes: msg || diagParsed.error.flatten(),
        });
      }

      try {
        const confFotos = toSafeNumber(r.confiancaAnalise, 50);
        const fusao = aplicarFusaoTracoDiagnostico(estruturasSomenteFotos, diagParsed.data, confFotos);
        resultadoFusao = {
          ...resultadoFusao,
          estruturas: fusao.estruturasFusionadas,
          estruturaPrincipal: fusao.estruturaPrincipal,
          estruturaSecundaria: fusao.estruturaSecundaria,
          confiancaAnalise: fusao.confiancaAnaliseAjustada,
          sinteseIntegradaFotosQuestionario: fusao.metadata.sinteseIntegrada,
          fusaoDiagnosticoEmocional: {
            versaoMatriz: fusao.metadata.versaoMatriz,
            alinhamentoFotosFormulario: fusao.metadata.alinhamentoFotosFormulario,
            assertividadeLeitura: fusao.metadata.assertividadeLeitura,
            pesoFormulario: Math.round(fusao.metadata.pesoFormulario * 1000) / 1000,
            padroesEmocionaisNormalizados: fusao.metadata.padroesEmocionaisNormalizados,
            vetorFormularioEstruturas: fusao.metadata.vetorFormularioEstruturas,
            sinaisConvergentes: fusao.metadata.sinaisConvergentes,
            entradaDiagnostico: diagParsed.data,
          },
        };
      } catch (fe: unknown) {
        const msg = fe instanceof Error ? fe.message : "Erro na fusão fotos + questionário.";
        return res.status(400).json({ error: msg });
      }
    }

    const resultadoComMetadata = resultadoFusao;

    const pessoaId = parsePessoaId(pessoaIdRaw);

    if (pessoaId !== null) {
      const [pessoa] = await db.select({ id: pessoasAnaliseTable.id }).from(pessoasAnaliseTable)
        .where(and(eq(pessoasAnaliseTable.id, pessoaId), eq(pessoasAnaliseTable.usuarioId, req.user!.id)));
      if (!pessoa) return res.status(404).json({ error: "Pessoa não encontrada" });
    }

    const existing = await db
      .select()
      .from(analiseTracoTable)
      .where(and(
        eq(analiseTracoTable.usuarioId, req.user!.id),
        pessoaId === null ? isNull(analiseTracoTable.pessoaId) : eq(analiseTracoTable.pessoaId, pessoaId),
      ));

    let analise;
    if (existing.length > 0) {
      [analise] = await db
        .update(analiseTracoTable)
        .set({ resultado: resultadoComMetadata, criadoEm: new Date() })
        .where(eq(analiseTracoTable.id, existing[0].id))
        .returning();
    } else {
      [analise] = await db
        .insert(analiseTracoTable)
        .values({ usuarioId: req.user!.id, pessoaId, resultado: resultadoComMetadata })
        .returning();
    }

    return res.json(analise);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao salvar análise. Tente novamente." });
  }
});

// ── GET /traco/analise ─────────────────────────────────────────────────────────
router.get("/analise", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const pessoaId = parsePessoaId(req.query.pessoaId);
    const [analise] = await db
      .select()
      .from(analiseTracoTable)
      .where(and(
        eq(analiseTracoTable.usuarioId, req.user!.id),
        pessoaId === null ? isNull(analiseTracoTable.pessoaId) : eq(analiseTracoTable.pessoaId, pessoaId),
      ));
    return res.json(analise ?? null);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar análise" });
  }
});

export default router;
