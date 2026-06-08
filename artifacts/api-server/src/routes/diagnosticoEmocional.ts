import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { db, diagnosticoEmocional30Table, pessoasAnaliseTable } from "@workspace/db";
import { and, desc, eq, isNull } from "drizzle-orm";
import {
  computarDiagnostico30,
  entradaDiagnostico30Schema,
} from "@workspace/traco-diagnostico-emocional";

const router = Router();

function parsePessoaId(raw: unknown): number | null {
  if (raw === undefined || raw === null || raw === "" || raw === "null") return null;
  const n = parseInt(String(raw), 10);
  return Number.isNaN(n) ? null : n;
}

async function assertPessoaDoUsuario(
  usuarioId: number,
  pessoaId: number | null
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (pessoaId === null) return { ok: true };
  const [pessoa] = await db
    .select({ id: pessoasAnaliseTable.id })
    .from(pessoasAnaliseTable)
    .where(and(eq(pessoasAnaliseTable.id, pessoaId), eq(pessoasAnaliseTable.usuarioId, usuarioId)));
  if (!pessoa) return { ok: false, status: 404, error: "Pessoa não encontrada" };
  return { ok: true };
}

/** Guarda respostas + payload de fusão (histórico por utilizador + pessoa). */
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { pessoaId: pessoaIdRaw, ...bodyRest } = req.body as {
      pessoaId?: unknown;
      passado?: unknown;
      presente?: unknown;
      consciencia?: unknown;
    };
    const pessoaId = parsePessoaId(pessoaIdRaw);
    const owned = await assertPessoaDoUsuario(req.user!.id, pessoaId);
    if (!owned.ok) return res.status(owned.status).json({ error: owned.error });

    const parsed = entradaDiagnostico30Schema.safeParse(bodyRest);
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
        pessoaId,
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
    const pessoaId = parsePessoaId(req.query.pessoaId);
    const owned = await assertPessoaDoUsuario(req.user!.id, pessoaId);
    if (!owned.ok) return res.status(owned.status).json({ error: owned.error });

    const [row] = await db
      .select()
      .from(diagnosticoEmocional30Table)
      .where(
        and(
          eq(diagnosticoEmocional30Table.usuarioId, req.user!.id),
          pessoaId === null
            ? isNull(diagnosticoEmocional30Table.pessoaId)
            : eq(diagnosticoEmocional30Table.pessoaId, pessoaId)
        )
      )
      .orderBy(desc(diagnosticoEmocional30Table.criadoEm))
      .limit(1);
    return res.json(row ?? null);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar diagnóstico." });
  }
});

export default router;
