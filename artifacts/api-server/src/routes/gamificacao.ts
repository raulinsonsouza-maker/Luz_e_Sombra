import { Router, Response } from "express";
import { db } from "@workspace/db";
import {
  gamificacaoTable,
  convitesDiariosTable,
  missoesDiariasTable,
  avaliacoesTable,
  analiseTracoTable,
  analiseTemperamento40Table,
  analiseLinguagensAmorTable,
  configuracoesModulosTable,
  notificacoesTable,
} from "@workspace/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { minicursoCompletoParaUsuario } from "./modulosJornada";
import { temAnalise } from "../lib/temAnaliseJornada";
import { awardXp, getOrCreateGamificacao } from "../lib/awardXp";
import { awardLuzDiaria, temLuzEventoHoje, type TipoLuzEvento } from "../lib/awardLuz";

const router = Router();

const NIVEIS = [
  { nivel: 1, nome: "Iniciante",     xpMin: 0,    xpMax: 499,      desc: "Cada passo conta. Continue." },
  { nivel: 2, nome: "Observador",    xpMin: 500,  xpMax: 1199,     desc: "Você está aprendendo a se observar." },
  { nivel: 3, nome: "Explorador",    xpMin: 1200, xpMax: 2499,     desc: "Sua consciência se expande a cada dia." },
  { nivel: 4, nome: "Transformador", xpMin: 2500, xpMax: 4999,     desc: "A mudança está em suas mãos." },
  { nivel: 5, nome: "Iluminado",     xpMin: 5000, xpMax: 999999,   desc: "Você floresceu na sua essência." },
];

function getNivelInfo(xp: number) {
  return [...NIVEIS].reverse().find((n) => xp >= n.xpMin) ?? NIVEIS[0];
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
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
    const [conviteHoje] = await db
      .select({ id: convitesDiariosTable.id })
      .from(convitesDiariosTable)
      .where(and(eq(convitesDiariosTable.usuarioId, userId), eq(convitesDiariosTable.dataReferencia, today)))
      .limit(1);

    const nivelInfo = getNivelInfo(gam.xp);
    const nextNivel = NIVEIS.find(n => n.nivel === nivelInfo.nivel + 1);
    const xpNoNivel = gam.xp - nivelInfo.xpMin;
    const xpParaProximo = nextNivel
      ? nextNivel.xpMin - nivelInfo.xpMin
      : nivelInfo.xpMax - nivelInfo.xpMin;

    const [analise] = await db
      .select({ id: analiseTracoTable.id })
      .from(analiseTracoTable)
      .where(
        and(
          eq(analiseTracoTable.usuarioId, userId),
          isNull(analiseTracoTable.pessoaId)
        )
      )
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

    const [linguagensRow] = await db
      .select({ id: analiseLinguagensAmorTable.id })
      .from(analiseLinguagensAmorTable)
      .where(
        and(
          eq(analiseLinguagensAmorTable.usuarioId, userId),
          isNull(analiseLinguagensAmorTable.pessoaId)
        )
      )
      .limit(1);

    const configsMod = await db.select().from(configuracoesModulosTable);
    const minicursoConcluido: {
      traco: boolean;
      temperamento: boolean;
      linguagensAmor: boolean;
      roda: boolean;
      numerologia: boolean;
    } = {
      traco: true,
      temperamento: true,
      linguagensAmor: true,
      roda: true,
      numerologia: true,
    };
    for (const c of configsMod) {
      const ok = await minicursoCompletoParaUsuario(userId, c.cursoVinculadoId);
      if (c.slug === "traco") minicursoConcluido.traco = ok;
      else if (c.slug === "temperamento") minicursoConcluido.temperamento = ok;
      else if (c.slug === "linguagens-amor") minicursoConcluido.linguagensAmor = ok;
      else if (c.slug === "roda") minicursoConcluido.roda = ok;
      else if (c.slug === "numerologia") minicursoConcluido.numerologia = ok;
    }

    const numerologiaConcluida = await temAnalise(userId, "numerologia");

    const [momentoLuzHoje, pausaLuzHoje] = await Promise.all([
      temLuzEventoHoje(userId, "momento"),
      temLuzEventoHoje(userId, "pausa"),
    ]);

    res.json({
      xp: gam.xp,
      luzes: gam.luzes ?? 0,
      conviteConcluido: !!conviteHoje,
      momentoLuzHoje,
      pausaLuzHoje,
      nivel: nivelInfo.nivel,
      nomeNivel: nivelInfo.nome,
      descNivel: nivelInfo.desc,
      xpNoNivel,
      xpParaProximo,
      luzesNoNivel: xpNoNivel,
      luzesParaProximo: xpParaProximo,
      streakDias: gam.streakDias,
      melhorStreak: gam.melhorStreak,
      missoes: [],
      jornada: {
        traco: !!analise,
        temperamento: !!temperamento,
        roda: !!avaliacao,
        linguagensAmor: !!linguagensRow,
        numerologia: numerologiaConcluida,
        dossie: await temAnalise(userId, "dossie"),
        minicursoConcluido,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar progresso" });
  }
});

router.post("/luz/:tipo", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const tipoRaw = String(req.params.tipo || "");
    if (tipoRaw !== "momento" && tipoRaw !== "pausa") {
      return res.status(400).json({ error: "Tipo de luz inválido" });
    }
    const tipo = tipoRaw as TipoLuzEvento;
    const result = await awardLuzDiaria(req.user!.id, tipo);
    if (result.already) {
      return res.status(400).json({
        error: "Luz já recebida hoje",
        already: true,
        luzes: result.luzes,
      });
    }
    return res.json({ success: true, luzes: result.luzes, tipo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao conceder luz" });
  }
});

router.post("/convite/concluir", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const today = getTodayStr();
    const gam = await getOrCreateGamificacao(userId);
    const [existente] = await db
      .select({ id: convitesDiariosTable.id })
      .from(convitesDiariosTable)
      .where(and(eq(convitesDiariosTable.usuarioId, userId), eq(convitesDiariosTable.dataReferencia, today)))
      .limit(1);
    if (existente) {
      return res.status(400).json({ error: "Convite já concluído", luzes: gam.luzes ?? 0 });
    }

    await db.insert(convitesDiariosTable).values({ usuarioId: userId, dataReferencia: today });
    const [updated] = await db
      .update(gamificacaoTable)
      .set({ luzes: (gam.luzes ?? 0) + 1, atualizadoEm: new Date() })
      .where(eq(gamificacaoTable.usuarioId, userId))
      .returning();

    await db.insert(notificacoesTable).values({
      usuarioId: userId,
      titulo: "+1 Luz",
      mensagem: "Você concluiu o convite do dia.",
      tipo: "luz",
      link: "/",
    });

    return res.json({ success: true, luzes: updated.luzes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao concluir convite" });
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

    const result = await awardXp(userId, missao.xpRecompensa);

    return res.json({
      success: true,
      xpGanho: result.xpGanho,
      totalXp: result.xp,
      nivel: result.nivel,
      nomeNivel: result.nomeNivel,
      leveledUp: result.leveledUp,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao concluir missão" });
  }
});

export default router;
