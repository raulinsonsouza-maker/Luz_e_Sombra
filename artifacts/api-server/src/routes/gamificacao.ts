import { Router, Response } from "express";
import { db } from "@workspace/db";
import {
  gamificacaoTable,
  missoesDiariasTable,
  avaliacoesTable,
  analiseTracoTable,
  analiseTemperamento40Table,
  usuariosTable,
} from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";

const router = Router();

const NIVEIS = [
  { nivel: 1, nome: "Iniciante",     xpMin: 0,    xpMax: 499,      desc: "Cada passo conta. Continue." },
  { nivel: 2, nome: "Observador",    xpMin: 500,  xpMax: 1199,     desc: "Você está aprendendo a se observar." },
  { nivel: 3, nome: "Explorador",    xpMin: 1200, xpMax: 2499,     desc: "Sua consciência se expande a cada dia." },
  { nivel: 4, nome: "Transformador", xpMin: 2500, xpMax: 4999,     desc: "A mudança está em suas mãos." },
  { nivel: 5, nome: "Iluminado",     xpMin: 5000, xpMax: 999999,   desc: "Você floresceu na sua essência." },
];

function getNivelInfo(xp: number) {
  return [...NIVEIS].reverse().find(n => xp >= n.xpMin) ?? NIVEIS[0];
}

const MISSAO_POOL = [
  { titulo: "Reflita sobre um comportamento", xp: 30 },
  { titulo: "Medite por 5 minutos", xp: 20 },
  { titulo: "Registre uma emoção que sentiu hoje", xp: 20 },
  { titulo: "Leia um conteúdo de autoconhecimento", xp: 20 },
  { titulo: "Faça algo que te aproxima do seu objetivo", xp: 70 },
  { titulo: "Anote 3 gratidões do dia", xp: 25 },
  { titulo: "Respire fundo em um momento difícil", xp: 30 },
  { titulo: "Registre 1 insight no seu diário", xp: 40 },
  { titulo: "Evite reagir impulsivamente em 1 situação", xp: 50 },
  { titulo: "Faça uma pausa consciente de 10 minutos", xp: 25 },
];

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

async function getOrCreateGamificacao(usuarioId: number) {
  let [gam] = await db.select().from(gamificacaoTable).where(eq(gamificacaoTable.usuarioId, usuarioId));
  if (!gam) {
    [gam] = await db.insert(gamificacaoTable).values({ usuarioId }).returning();
  }
  return gam;
}

async function ensureTodayMissions(usuarioId: number, today: string) {
  const existing = await db
    .select()
    .from(missoesDiariasTable)
    .where(and(eq(missoesDiariasTable.usuarioId, usuarioId), eq(missoesDiariasTable.dataReferencia, today)));

  if (existing.length > 0) return existing;

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );

  const selected = [];
  for (let i = 0; i < 4; i++) {
    selected.push(MISSAO_POOL[(dayOfYear + i) % MISSAO_POOL.length]);
  }

  const inserted = await db
    .insert(missoesDiariasTable)
    .values(selected.map(m => ({ usuarioId, titulo: m.titulo, xpRecompensa: m.xp, dataReferencia: today })))
    .returning();

  return inserted;
}

async function updateStreak(usuarioId: number) {
  const gam = await getOrCreateGamificacao(usuarioId);
  const today = getTodayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (gam.ultimoAcessoEm === today) return gam;

  let newStreak = gam.streakDias;
  if (gam.ultimoAcessoEm === yesterday) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  const melhorStreak = Math.max(gam.melhorStreak, newStreak);
  const [updated] = await db
    .update(gamificacaoTable)
    .set({ streakDias: newStreak, melhorStreak, ultimoAcessoEm: today, atualizadoEm: new Date() })
    .where(eq(gamificacaoTable.usuarioId, usuarioId))
    .returning();

  return updated;
}

router.get("/progresso", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const today = getTodayStr();

    const gam = await updateStreak(userId);
    const missoes = await ensureTodayMissions(userId, today);

    const nivelInfo = getNivelInfo(gam.xp);
    const nextNivel = NIVEIS.find(n => n.nivel === nivelInfo.nivel + 1);
    const xpNoNivel = gam.xp - nivelInfo.xpMin;
    const xpParaProximo = nextNivel
      ? nextNivel.xpMin - nivelInfo.xpMin
      : nivelInfo.xpMax - nivelInfo.xpMin;

    const [analise] = await db
      .select({ id: analiseTracoTable.id })
      .from(analiseTracoTable)
      .where(eq(analiseTracoTable.usuarioId, userId))
      .limit(1);

    const [temperamento] = await db
      .select({ id: analiseTemperamento40Table.id })
      .from(analiseTemperamento40Table)
      .where(eq(analiseTemperamento40Table.usuarioId, userId))
      .limit(1);

    const [avaliacao] = await db
      .select({ id: avaliacoesTable.id })
      .from(avaliacoesTable)
      .where(eq(avaliacoesTable.usuarioId, userId))
      .limit(1);

    const [usuario] = await db
      .select({ dataNascimento: usuariosTable.dataNascimento })
      .from(usuariosTable)
      .where(eq(usuariosTable.id, userId))
      .limit(1);

    res.json({
      xp: gam.xp,
      nivel: nivelInfo.nivel,
      nomeNivel: nivelInfo.nome,
      descNivel: nivelInfo.desc,
      xpNoNivel,
      xpParaProximo,
      streakDias: gam.streakDias,
      melhorStreak: gam.melhorStreak,
      missoes: missoes.map((m) => ({
        id: m.id,
        titulo: m.titulo,
        xpRecompensa: m.xpRecompensa,
        concluida: !!m.concluidaEm,
      })),
      jornada: {
        traco: !!analise,
        temperamento: !!temperamento,
        roda: !!avaliacao,
        numerologia: !!(usuario?.dataNascimento),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar progresso" });
  }
});

router.post("/adicionar-xp", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { xp, motivo } = req.body;
    if (!xp || typeof xp !== "number" || xp <= 0) {
      return res.status(400).json({ error: "XP inválido" });
    }

    const gam = await getOrCreateGamificacao(userId);
    const newXp = gam.xp + xp;
    const nivelInfo = getNivelInfo(newXp);
    const leveledUp = nivelInfo.nivel > gam.nivel;

    const [updated] = await db
      .update(gamificacaoTable)
      .set({ xp: newXp, nivel: nivelInfo.nivel, atualizadoEm: new Date() })
      .where(eq(gamificacaoTable.usuarioId, userId))
      .returning();

    return res.json({
      xp: updated.xp,
      nivel: updated.nivel,
      nomeNivel: nivelInfo.nome,
      leveledUp,
      xpGanho: xp,
      motivo: motivo ?? "",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao adicionar XP" });
  }
});

router.post("/missoes/:id/concluir", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const missaoId = parseInt(String(req.params.id), 10);

    const [missao] = await db
      .select()
      .from(missoesDiariasTable)
      .where(and(eq(missoesDiariasTable.id, missaoId), eq(missoesDiariasTable.usuarioId, userId)));

    if (!missao) return res.status(404).json({ error: "Missão não encontrada" });
    if (missao.concluidaEm) return res.status(400).json({ error: "Missão já concluída" });

    await db
      .update(missoesDiariasTable)
      .set({ concluidaEm: new Date() })
      .where(eq(missoesDiariasTable.id, missaoId));

    const gam = await getOrCreateGamificacao(userId);
    const newXp = gam.xp + missao.xpRecompensa;
    const nivelInfo = getNivelInfo(newXp);
    const leveledUp = nivelInfo.nivel > gam.nivel;

    await db
      .update(gamificacaoTable)
      .set({ xp: newXp, nivel: nivelInfo.nivel, atualizadoEm: new Date() })
      .where(eq(gamificacaoTable.usuarioId, userId));

    return res.json({
      success: true,
      xpGanho: missao.xpRecompensa,
      totalXp: newXp,
      nivel: nivelInfo.nivel,
      nomeNivel: nivelInfo.nome,
      leveledUp,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao concluir missão" });
  }
});

export default router;
