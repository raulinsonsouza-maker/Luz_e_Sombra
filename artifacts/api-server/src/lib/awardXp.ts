import { db } from "@workspace/db";
import { gamificacaoTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const NIVEIS = [
  { nivel: 1, nome: "Iniciante", xpMin: 0, xpMax: 499 },
  { nivel: 2, nome: "Observador", xpMin: 500, xpMax: 1199 },
  { nivel: 3, nome: "Explorador", xpMin: 1200, xpMax: 2499 },
  { nivel: 4, nome: "Transformador", xpMin: 2500, xpMax: 4999 },
  { nivel: 5, nome: "Iluminado", xpMin: 5000, xpMax: 999999 },
];

export function getNivelInfo(xp: number) {
  return [...NIVEIS].reverse().find((n) => xp >= n.xpMin) ?? NIVEIS[0];
}

export async function getOrCreateGamificacao(usuarioId: number) {
  let [gam] = await db.select().from(gamificacaoTable).where(eq(gamificacaoTable.usuarioId, usuarioId));
  if (!gam) {
    [gam] = await db.insert(gamificacaoTable).values({ usuarioId }).returning();
  }
  return gam;
}

/** Concede XP apenas via eventos server-side (ex.: missão concluída). */
export async function awardXp(usuarioId: number, xp: number) {
  if (!Number.isFinite(xp) || xp <= 0) {
    throw new Error("XP inválido");
  }

  const gam = await getOrCreateGamificacao(usuarioId);
  const newXp = gam.xp + xp;
  const nivelInfo = getNivelInfo(newXp);
  const leveledUp = nivelInfo.nivel > gam.nivel;

  const [updated] = await db
    .update(gamificacaoTable)
    .set({ xp: newXp, nivel: nivelInfo.nivel, atualizadoEm: new Date() })
    .where(eq(gamificacaoTable.usuarioId, usuarioId))
    .returning();

  return {
    xp: updated.xp,
    nivel: updated.nivel,
    nomeNivel: nivelInfo.nome,
    leveledUp,
    xpGanho: xp,
  };
}
