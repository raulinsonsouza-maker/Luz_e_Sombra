import { Router, type Response } from "express";
import { and, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import {
  conteudoPadraoParaData,
  hojeSaoPauloISO,
  mesclarOverride,
  parseDataISO,
  urlImagemPublica,
} from "@workspace/conteudo-dia-padrao";
import { db } from "@workspace/db";
import { conteudoDiaTable } from "@workspace/db/schema";
import { requireAdmin, type AuthRequest } from "../lib/authMiddleware";
import { ObjectStorageService } from "../lib/objectStorage";

const router = Router();
const objectStorage = new ObjectStorageService();

const putBodySchema = z.object({
  frase: z.string().min(1, "Frase é obrigatória"),
  reflexao: z.string().default(""),
  convite: z.string().default(""),
  imagemUrl: z.string().nullable().optional(),
});

function serializar(resolvido: ReturnType<typeof mesclarOverride>) {
  const imagemPath = resolvido.imagemUrl;
  const imagemUrl = urlImagemPublica(imagemPath, resolvido.overrideId);
  return { ...resolvido, imagemPath, imagemUrl };
}

function normalizarImagemEntrada(
  incoming: string | null | undefined,
  existente: string | null | undefined,
  padrao: string,
): string {
  if (incoming == null || incoming.trim() === "") return padrao;
  const v = incoming.trim();
  if (v.startsWith("/api/conteudo-dia/imagem/") || v.startsWith("blob:")) {
    return existente?.trim() || padrao;
  }
  return v;
}

function diasDoMes(ano: number, mes: number): string[] {
  const ultimo = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  const out: string[] = [];
  for (let d = 1; d <= ultimo; d++) {
    out.push(`${ano}-${String(mes).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  return out;
}

async function resolverData(dataISO: string) {
  const padrao = conteudoPadraoParaData(dataISO);
  if (!padrao) return null;
  const [override] = await db
    .select()
    .from(conteudoDiaTable)
    .where(eq(conteudoDiaTable.data, dataISO))
    .limit(1);
  return serializar(
    mesclarOverride(
      padrao,
      override
        ? {
            id: override.id,
            frase: override.frase,
            reflexao: override.reflexao,
            convite: override.convite,
            imagemUrl: override.imagemUrl,
          }
        : null,
    ),
  );
}

/** GET /api/conteudo-dia?data=YYYY-MM-DD — conteúdo do dia (padrão + override). */
router.get("/", async (req, res: Response) => {
  try {
    const raw = typeof req.query.data === "string" ? req.query.data : hojeSaoPauloISO();
    if (!parseDataISO(raw)) {
      return res.status(400).json({ error: "Data inválida. Use YYYY-MM-DD." });
    }
    const resolvido = await resolverData(raw);
    if (!resolvido) return res.status(400).json({ error: "Data inválida." });
    return res.json(resolvido);
  } catch (err) {
    req.log.error({ err }, "Erro ao buscar conteúdo do dia");
    return res.status(500).json({ error: "Erro ao buscar conteúdo do dia" });
  }
});

/** GET /api/conteudo-dia/imagem/:id — imagem enviada no override (pública). */
router.get("/imagem/:id", async (req, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
    const [row] = await db
      .select()
      .from(conteudoDiaTable)
      .where(eq(conteudoDiaTable.id, id))
      .limit(1);
    if (!row?.imagemUrl?.startsWith("/objects/")) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }
    const file = await objectStorage.getObjectEntityFile(row.imagemUrl);
    const response = await objectStorage.downloadObject(file, 3600);
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "public, max-age=3600");
    return res.send(buffer);
  } catch (err) {
    req.log.error({ err }, "Erro ao servir imagem do conteúdo do dia");
    return res.status(404).json({ error: "Imagem não encontrada" });
  }
});

/** GET /api/admin/conteudo-dia?ano=&mes= */
router.get("/admin", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const agora = hojeSaoPauloISO();
    const [yPadrao, mPadrao] = agora.split("-").map(Number);
    const ano = Number(req.query.ano ?? yPadrao);
    const mes = Number(req.query.mes ?? mPadrao);
    if (!Number.isInteger(ano) || ano < 2020 || ano > 2100) {
      return res.status(400).json({ error: "Ano inválido" });
    }
    if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
      return res.status(400).json({ error: "Mês inválido" });
    }

    const datas = diasDoMes(ano, mes);
    const inicio = datas[0]!;
    const fim = datas[datas.length - 1]!;
    const overrides = await db
      .select()
      .from(conteudoDiaTable)
      .where(and(gte(conteudoDiaTable.data, inicio), lte(conteudoDiaTable.data, fim)));
    const porData = new Map(overrides.map((o) => [o.data, o]));

    const dias = datas.map((dataISO) => {
      const padrao = conteudoPadraoParaData(dataISO)!;
      const override = porData.get(dataISO);
      return serializar(
        mesclarOverride(
          padrao,
          override
            ? {
                id: override.id,
                frase: override.frase,
                reflexao: override.reflexao,
                convite: override.convite,
                imagemUrl: override.imagemUrl,
              }
            : null,
        ),
      );
    });

    return res.json({ ano, mes, dias });
  } catch (err) {
    req.log.error({ err }, "Erro ao listar conteúdo do mês");
    return res.status(500).json({ error: "Erro ao listar conteúdo do mês" });
  }
});

/** POST /api/admin/conteudo-dia/upload-url */
router.post("/admin/upload-url", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    return res.json({ uploadURL, objectPath });
  } catch (err) {
    req.log.error({ err }, "Erro ao gerar URL de upload (conteúdo do dia)");
    return res.status(500).json({ error: "Erro ao gerar URL de upload" });
  }
});

/** PUT /api/admin/conteudo-dia/:data */
router.put("/admin/:data", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const dataISO = req.params.data;
    if (!parseDataISO(dataISO)) {
      return res.status(400).json({ error: "Data inválida. Use YYYY-MM-DD." });
    }
    const parsed = putBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message || "Dados inválidos" });
    }
    const { frase, reflexao, convite, imagemUrl } = parsed.data;
    const padrao = conteudoPadraoParaData(dataISO)!;

    const [existente] = await db
      .select()
      .from(conteudoDiaTable)
      .where(eq(conteudoDiaTable.data, dataISO))
      .limit(1);

    const imagemFinal = normalizarImagemEntrada(
      imagemUrl,
      existente?.imagemUrl,
      padrao.imagemUrl,
    );

    let row;
    if (existente) {
      [row] = await db
        .update(conteudoDiaTable)
        .set({
          frase,
          reflexao,
          convite,
          imagemUrl: imagemFinal,
          atualizadoEm: new Date(),
          atualizadoPor: req.user!.id,
        })
        .where(eq(conteudoDiaTable.id, existente.id))
        .returning();
    } else {
      [row] = await db
        .insert(conteudoDiaTable)
        .values({
          data: dataISO,
          frase,
          reflexao,
          convite,
          imagemUrl: imagemFinal,
          atualizadoPor: req.user!.id,
        })
        .returning();
    }

    const resolvido = serializar(
      mesclarOverride(padrao, {
        id: row!.id,
        frase: row!.frase,
        reflexao: row!.reflexao,
        convite: row!.convite,
        imagemUrl: row!.imagemUrl,
      }),
    );
    return res.json(resolvido);
  } catch (err) {
    req.log.error({ err }, "Erro ao salvar conteúdo do dia");
    return res.status(500).json({ error: "Erro ao salvar conteúdo do dia" });
  }
});

/** DELETE /api/admin/conteudo-dia/:data — restaura padrão. */
router.delete("/admin/:data", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const dataISO = req.params.data;
    if (!parseDataISO(dataISO)) {
      return res.status(400).json({ error: "Data inválida. Use YYYY-MM-DD." });
    }
    await db.delete(conteudoDiaTable).where(eq(conteudoDiaTable.data, dataISO));
    const padrao = conteudoPadraoParaData(dataISO)!;
    return res.json(serializar(padrao));
  } catch (err) {
    req.log.error({ err }, "Erro ao restaurar conteúdo do dia");
    return res.status(500).json({ error: "Erro ao restaurar conteúdo do dia" });
  }
});

export default router;
