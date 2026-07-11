import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { db } from "@workspace/db";
import { fotosTracoTable, analiseTracoTable, pessoasAnaliseTable } from "@workspace/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";
import {
  parseBody,
  tracoAnalisarEnvelopeSchema,
  tracoPessoaCreateSchema,
  tracoPessoaUpdateSchema,
} from "../lib/schemas";
import {
  aplicarFusaoTracoDiagnostico,
  diagnosticoEmocionalFusaoSchema,
  ESTRUTURAS_TRACO,
  type EstruturaTraco,
} from "@workspace/traco-diagnostico-fusion";

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

async function assertPessoaDoUsuario(
  usuarioId: number,
  pessoaId: number | null
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (pessoaId === null) return { ok: true };
  const [pessoa] = await db
    .select({ id: pessoasAnaliseTable.id, nome: pessoasAnaliseTable.nome })
    .from(pessoasAnaliseTable)
    .where(and(eq(pessoasAnaliseTable.id, pessoaId), eq(pessoasAnaliseTable.usuarioId, usuarioId)));
  if (!pessoa) return { ok: false, status: 404, error: "Pessoa não encontrada" };
  return { ok: true };
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

const TIPOS_FOTO_MARCADORES = ["rosto", "corpo-frente", "corpo-lado"] as const;

function parseMarcadoresPorFoto(raw: unknown): boolean {
  if (!Array.isArray(raw) || raw.length === 0) return false;
  const tipos = new Set<string>(TIPOS_FOTO_MARCADORES);
  for (const item of raw) {
    if (!item || typeof item !== "object") return false;
    const o = item as Record<string, unknown>;
    if (typeof o.tipo !== "string" || !tipos.has(o.tipo)) return false;
    if (typeof o.poseDetectada !== "boolean") return false;
    if (typeof o.qualidadeFoto !== "number" || !Number.isFinite(o.qualidadeFoto)) return false;
  }
  return true;
}

function parseEvidenciasMotor(raw: unknown): boolean {
  if (!Array.isArray(raw)) return false;
  for (const item of raw) {
    if (!item || typeof item !== "object") return false;
    const o = item as Record<string, unknown>;
    if (!ESTRUTURAS_TRACO.includes(o.estrutura as EstruturaTraco)) return false;
    if (typeof o.peso !== "number" || !Number.isFinite(o.peso)) return false;
    if (typeof o.descricao !== "string") return false;
  }
  return true;
}

function parseMarcadoresAgregados(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  const nums = [
    "shrMedio",
    "wsrMedio",
    "ulrMedio",
    "simetriaMedia",
    "densidadeMedia",
    "definicaoMedia",
    "inclinacaoMedia",
    "projecaoPeitoMedia",
    "projecaoCranianaMedia",
    "ombrosAdiantadosMedio",
    "colapsoToracicoMedio",
  ];
  for (const k of nums) {
    const v = o[k];
    if (v !== null && v !== undefined && typeof v !== "number") return false;
  }
  if (typeof o.fotosComPoseCorpo !== "number" || !Number.isFinite(o.fotosComPoseCorpo)) return false;
  return true;
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
    const parsed = parseBody(tracoPessoaCreateSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, detalhes: parsed.detalhes });
    }
    const { nome, relacao, ordem } = parsed.data;

    const existentes = await db
      .select({ id: pessoasAnaliseTable.id })
      .from(pessoasAnaliseTable)
      .where(eq(pessoasAnaliseTable.usuarioId, req.user!.id));
    if (existentes.length >= 6) {
      return res.status(400).json({ error: "Limite de 6 pessoas adicionais atingido" });
    }

    const [pessoa] = await db
      .insert(pessoasAnaliseTable)
      .values({ usuarioId: req.user!.id, nome, relacao: relacao?.trim() || null, ordem: ordem ?? existentes.length })
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
    const parsed = parseBody(tracoPessoaUpdateSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, detalhes: parsed.detalhes });
    }
    const { nome, relacao } = parsed.data;
    const [existing] = await db.select().from(pessoasAnaliseTable)
      .where(and(eq(pessoasAnaliseTable.id, id), eq(pessoasAnaliseTable.usuarioId, req.user!.id)));
    if (!existing) return res.status(404).json({ error: "Pessoa não encontrada" });

    const updates: Partial<typeof pessoasAnaliseTable.$inferInsert> = {};
    if (nome !== undefined) updates.nome = nome;
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
    const owned = await assertPessoaDoUsuario(req.user!.id, pessoaId);
    if (!owned.ok) return res.status(owned.status).json({ error: owned.error });
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
    const envelope = parseBody(tracoAnalisarEnvelopeSchema, req.body);
    if (!envelope.success) {
      return res.status(400).json({ error: envelope.error, detalhes: envelope.detalhes });
    }
    const {
      resultado,
      pessoaId: pessoaIdRaw,
      snapshotPessoaId: snapshotPessoaIdRaw,
      pessoaNome: pessoaNomeRaw,
      diagnosticoEmocional,
    } = envelope.data;

    const r = resultado;
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

    if (!parseMarcadoresPorFoto(r.marcadoresPorFoto)) {
      return res.status(400).json({
        error:
          "marcadoresPorFoto é obrigatório: inclua o array devolvido pela análise no navegador (MediaPipe) para auditoria.",
      });
    }
    if (!parseEvidenciasMotor(r.evidenciasMotor)) {
      return res.status(400).json({
        error: "evidenciasMotor é obrigatório (array de evidências; pode ser vazio).",
      });
    }
    if (r.marcadoresAgregados !== undefined && !parseMarcadoresAgregados(r.marcadoresAgregados)) {
      return res.status(400).json({ error: "marcadoresAgregados inválido." });
    }

    const metadata = normalizeMetadata(r.metadata, toSafeNumber(r.confiancaAnalise, 50));

    const somenteFotosParsed = parseEstruturasTraco(r.estruturasSomenteFotos);
    const estruturasSomenteFotos = somenteFotosParsed ?? { ...estParsed };
    const jaFusionadoNoCliente = !!r.fusaoDiagnosticoEmocional;

    let resultadoFusao = { ...r, metadata } as Record<string, unknown>;
    resultadoFusao.estruturasSomenteFotos = { ...estruturasSomenteFotos };

    // Fusão no servidor só se o cliente ainda não enviou resultado integrado (retrocompat).
    if (diagnosticoEmocional !== undefined && diagnosticoEmocional !== null && !jaFusionadoNoCliente) {
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
        const metaFs = (metadata.featureSummary ?? {}) as Record<string, unknown>;
        const varianciaFotos = toSafeNumber(metaFs.varianciaEntreFotos, 0);
        const fusao = aplicarFusaoTracoDiagnostico(estruturasSomenteFotos, diagParsed.data, confFotos, {
          varianciaEntreFotos: varianciaFotos,
        });
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

    const pessoaId = parsePessoaId(pessoaIdRaw);
    const snapshotPessoaId = parsePessoaId(snapshotPessoaIdRaw);

    if (snapshotPessoaIdRaw !== undefined && snapshotPessoaId !== pessoaId) {
      return res.status(409).json({ error: "pessoaId divergente do snapshot" });
    }

    const owned = await assertPessoaDoUsuario(req.user!.id, pessoaId);
    if (!owned.ok) return res.status(owned.status).json({ error: owned.error });

    let pessoaNomeSnapshot: string | null =
      typeof pessoaNomeRaw === "string" && pessoaNomeRaw.trim() ? pessoaNomeRaw.trim().slice(0, 120) : null;
    if (pessoaId !== null && !pessoaNomeSnapshot) {
      const [pessoaRow] = await db
        .select({ nome: pessoasAnaliseTable.nome })
        .from(pessoasAnaliseTable)
        .where(and(eq(pessoasAnaliseTable.id, pessoaId), eq(pessoasAnaliseTable.usuarioId, req.user!.id)));
      pessoaNomeSnapshot = pessoaRow?.nome ?? null;
    }

    resultadoFusao.pessoaId = pessoaId;
    resultadoFusao.pessoaNome = pessoaNomeSnapshot;
    const resultadoComMetadata = resultadoFusao;

    const fotosDaPessoa = await db
      .select()
      .from(fotosTracoTable)
      .where(and(
        eq(fotosTracoTable.usuarioId, req.user!.id),
        pessoaId === null ? isNull(fotosTracoTable.pessoaId) : eq(fotosTracoTable.pessoaId, pessoaId),
      ));

    if (fotosDaPessoa.length === 0) {
      return res.status(400).json({ error: "Sem fotos para a pessoa selecionada" });
    }

    const [analise] = await db
      .insert(analiseTracoTable)
      .values({ usuarioId: req.user!.id, pessoaId, resultado: resultadoComMetadata })
      .returning();

    req.log?.info({
      usuarioId: req.user!.id,
      pessoaId,
      fotosCount: fotosDaPessoa.length,
      estruturaPrincipal: String((resultadoComMetadata as Record<string, unknown>).estruturaPrincipal ?? ""),
    }, "Análise de traço salva");

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
    const owned = await assertPessoaDoUsuario(req.user!.id, pessoaId);
    if (!owned.ok) return res.status(owned.status).json({ error: owned.error });
    const [analise] = await db
      .select()
      .from(analiseTracoTable)
      .where(and(
        eq(analiseTracoTable.usuarioId, req.user!.id),
        pessoaId === null ? isNull(analiseTracoTable.pessoaId) : eq(analiseTracoTable.pessoaId, pessoaId),
      ))
      .orderBy(desc(analiseTracoTable.criadoEm))
      .limit(1);
    return res.json(analise ?? null);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar análise" });
  }
});

export default router;
