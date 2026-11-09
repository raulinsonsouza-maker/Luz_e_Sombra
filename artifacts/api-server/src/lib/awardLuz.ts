import { db } from "@workspace/db";
import { gamificacaoTable, luzesEventosTable } from "@workspace/db/schema";
import { and, eq } from "drizzle-orm";
import { getOrCreateGamificacao } from "./awardXp";

export type TipoLuzEvento = "momento" | "pausa";

export function todaySaoPaulo(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Concede +1 Luz uma vez por dia para cada tipo (momento | pausa). Sem notificação. */
export async function awardLuzDiaria(usuarioId: number, tipo: TipoLuzEvento) {
  const dataReferencia = todaySaoPaulo();
  const gam = await getOrCreateGamificacao(usuarioId);

  const [existente] = await db
    .select({ id: luzesEventosTable.id })
    .from(luzesEventosTable)
    .where(
      and(
        eq(luzesEventosTable.usuarioId, usuarioId),
        eq(luzesEventosTable.tipo, tipo),
        eq(luzesEventosTable.dataReferencia, dataReferencia),
      ),
    )
    .limit(1);

  if (existente) {
    return { success: false as const, already: true as const, luzes: gam.luzes ?? 0 };
  }

  await db.insert(luzesEventosTable).values({
    usuarioId,
    tipo,
    dataReferencia,
  });

  const [updated] = await db
    .update(gamificacaoTable)
    .set({ luzes: (gam.luzes ?? 0) + 1, atualizadoEm: new Date() })
    .where(eq(gamificacaoTable.usuarioId, usuarioId))
    .returning();

  return { success: true as const, already: false as const, luzes: updated.luzes };
}

export async function temLuzEventoHoje(usuarioId: number, tipo: TipoLuzEvento) {
  const dataReferencia = todaySaoPaulo();
  const [existente] = await db
    .select({ id: luzesEventosTable.id })
    .from(luzesEventosTable)
    .where(
      and(
        eq(luzesEventosTable.usuarioId, usuarioId),
        eq(luzesEventosTable.tipo, tipo),
        eq(luzesEventosTable.dataReferencia, dataReferencia),
      ),
    )
    .limit(1);
  return !!existente;
}
