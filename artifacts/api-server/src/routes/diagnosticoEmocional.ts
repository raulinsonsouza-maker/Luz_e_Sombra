import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { db, diagnosticoEmocional30Table } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import {
  computarDiagnostico30,
  entradaDiagnostico30Schema,
} from "@workspace/traco-diagnostico-emocional";

const router = Router();

/** Guarda respostas + payload de fusão (última submissão por utilizador). */
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = entradaDiagnostico30Schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Corpo inválido: passado e presente (25 inteiros 1–5 cada) e consciência (5 inteiros 1–5).",
        detalhes: parsed.error.flatten(),
      });
    }
    const comp = computarDiagnostico30(parsed.data);
    const [row] = await db
      .insert(diagnosticoEmocional30Table)
      .values({
        usuarioId: req.user!.id,
        respostas: parsed.data,
        resultado: comp.diagnosticoEmocional,
        versao: comp.versao,
      })
      .returning();
    return res.json({ id: row.id, diagnosticoEmocional: comp.diagnosticoEmocional });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao guardar diagnóstico emocional." });
  }
});

router.get("/ultimo", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const [row] = await db
      .select()
      .from(diagnosticoEmocional30Table)
      .where(eq(diagnosticoEmocional30Table.usuarioId, req.user!.id))
      .orderBy(desc(diagnosticoEmocional30Table.criadoEm))
      .limit(1);
    return res.json(row ?? null);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar diagnóstico." });
  }
});

export default router;
