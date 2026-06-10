import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { db, analiseTemperamento40Table } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import {
  computarTemperamento,
  entradaTemperamentoSchema,
  VERSAO_TEMPERAMENTO_ATUAL,
} from "@workspace/temperamento-v1";

const router = Router();

router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = entradaTemperamentoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Corpo inválido: são necessárias as 24 escolhas (a ou b) e metadados opcionais.",
        detalhes: parsed.error.flatten(),
      });
    }
    const comp = computarTemperamento(parsed.data);
    const computedAt = new Date().toISOString();
    const resultado = {
      ...comp,
      computed_at: computedAt,
      metadata: parsed.data.metadata,
    };
    const [row] = await db
      .insert(analiseTemperamento40Table)
      .values({
        usuarioId: req.user!.id,
        respostas: parsed.data.answers,
        resultado,
        versao: VERSAO_TEMPERAMENTO_ATUAL,
      })
      .returning();
    return res.json({ id: row.id, ...resultado });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao guardar análise de temperamento." });
  }
});

router.get("/ultimo", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const [row] = await db
      .select()
      .from(analiseTemperamento40Table)
      .where(eq(analiseTemperamento40Table.usuarioId, req.user!.id))
      .orderBy(desc(analiseTemperamento40Table.criadoEm))
      .limit(1);
    return res.json(row ?? null);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar análise de temperamento." });
  }
});

export default router;
