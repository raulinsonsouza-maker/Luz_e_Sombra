import { Router, Response } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { frasesGuardadasTable } from "@workspace/db/schema";
import { requireAuth, type AuthRequest } from "../lib/authMiddleware";

const router = Router();

function parseDia(valor: unknown): number | null {
  const n = typeof valor === "number" ? valor : Number.parseInt(String(valor ?? ""), 10);
  if (!Number.isFinite(n) || n < 1 || n > 366) return null;
  return Math.trunc(n);
}

function limparTexto(valor: unknown, max: number): string {
  return String(valor ?? "").trim().slice(0, max);
}

/** GET /api/frases-guardadas — lista da conta, mais recente primeiro. */
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const itens = await db
      .select()
      .from(frasesGuardadasTable)
      .where(eq(frasesGuardadasTable.usuarioId, req.user!.id))
      .orderBy(desc(frasesGuardadasTable.guardadaEm));
    return res.json(itens);
  } catch (err) {
    req.log.error({ err }, "Erro ao listar frases guardadas");
    return res.status(500).json({ error: "Erro ao listar frases guardadas" });
  }
});

/** GET /api/frases-guardadas/:dia — status do dia. */
router.get("/:dia", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const dia = parseDia(req.params.dia);
    if (dia == null) return res.status(400).json({ error: "Dia inválido" });

    const [item] = await db
      .select()
      .from(frasesGuardadasTable)
      .where(and(
        eq(frasesGuardadasTable.usuarioId, req.user!.id),
        eq(frasesGuardadasTable.dia, dia),
      ))
      .limit(1);

    return res.json({ guardada: !!item, item: item ?? null });
  } catch (err) {
    req.log.error({ err }, "Erro ao consultar frase guardada");
    return res.status(500).json({ error: "Erro ao consultar frase guardada" });
  }
});

/**
 * POST /api/frases-guardadas — guarda (idempotente).
 * Body: { dia, frase, reflexao?, convite? } — snapshot vindo do calendário editorial do app.
 */
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const dia = parseDia(req.body?.dia);
    const frase = limparTexto(req.body?.frase, 800);
    const reflexao = limparTexto(req.body?.reflexao, 4000);
    const convite = limparTexto(req.body?.convite, 800);
    if (dia == null || !frase) {
      return res.status(400).json({ error: "Informe o dia e a frase" });
    }

    const [existente] = await db
      .select()
      .from(frasesGuardadasTable)
      .where(and(
        eq(frasesGuardadasTable.usuarioId, req.user!.id),
        eq(frasesGuardadasTable.dia, dia),
      ))
      .limit(1);

    if (existente) {
      return res.json({ guardada: true, item: existente });
    }

    const [item] = await db
      .insert(frasesGuardadasTable)
      .values({
        usuarioId: req.user!.id,
        dia,
        frase,
        reflexao,
        convite,
      })
      .returning();

    return res.status(201).json({ guardada: true, item });
  } catch (err) {
    req.log.error({ err }, "Erro ao guardar frase");
    return res.status(500).json({ error: "Erro ao guardar frase" });
  }
});

/** DELETE /api/frases-guardadas/:dia — remove da conta. */
router.delete("/:dia", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const dia = parseDia(req.params.dia);
    if (dia == null) return res.status(400).json({ error: "Dia inválido" });

    await db
      .delete(frasesGuardadasTable)
      .where(and(
        eq(frasesGuardadasTable.usuarioId, req.user!.id),
        eq(frasesGuardadasTable.dia, dia),
      ));

    return res.json({ guardada: false });
  } catch (err) {
    req.log.error({ err }, "Erro ao remover frase guardada");
    return res.status(500).json({ error: "Erro ao remover frase guardada" });
  }
});

export default router;
