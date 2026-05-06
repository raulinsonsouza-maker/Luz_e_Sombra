import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { db, analiseLinguagensAmorTable, gamificacaoTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import {
  computarLinguagensAmor,
  entradaLinguagensAmorSchema,
  VERSAO_LINGUAGENS_AMOR_V1,
} from "@workspace/cinco-linguagens-amor";

const router = Router();

const XP_ANALISE_LINGUAGENS = 60;

const NIVEIS = [
  { nivel: 1, nome: "Iniciante", xpMin: 0, xpMax: 499 },
  { nivel: 2, nome: "Observador", xpMin: 500, xpMax: 1199 },
  { nivel: 3, nome: "Explorador", xpMin: 1200, xpMax: 2499 },
  { nivel: 4, nome: "Transformador", xpMin: 2500, xpMax: 4999 },
  { nivel: 5, nome: "Iluminado", xpMin: 5000, xpMax: 999999 },
];

function getNivelInfo(xp: number) {
  return [...NIVEIS].reverse().find((n) => xp >= n.xpMin) ?? NIVEIS[0];
}

async function getOrCreateGamificacao(usuarioId: number) {
  let [gam] = await db.select().from(gamificacaoTable).where(eq(gamificacaoTable.usuarioId, usuarioId));
  if (!gam) {
    [gam] = await db.insert(gamificacaoTable).values({ usuarioId }).returning();
  }
  return gam;
}

router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = entradaLinguagensAmorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Corpo inválido: são necessárias as 30 escolhas (a/b) e metadados opcionais.",
        detalhes: parsed.error.flatten(),
      });
    }
    const comp = computarLinguagensAmor(parsed.data);
    const computedAt = new Date().toISOString();
    const resultado = {
      ...comp,
      computed_at: computedAt,
      metadata: parsed.data.metadata,
    };

    const gam = await getOrCreateGamificacao(req.user!.id);
    const newXp = gam.xp + XP_ANALISE_LINGUAGENS;
    const nivelInfo = getNivelInfo(newXp);
    await db
      .update(gamificacaoTable)
      .set({ xp: newXp, nivel: nivelInfo.nivel, atualizadoEm: new Date() })
      .where(eq(gamificacaoTable.usuarioId, req.user!.id));

    const [row] = await db
      .insert(analiseLinguagensAmorTable)
      .values({
        usuarioId: req.user!.id,
        respostas: parsed.data.answers,
        pontuacoes: comp.pontuacoes,
        linguagemPrincipal: comp.principal,
        linguagemSecundaria: comp.secundaria,
        resultado,
        versao: VERSAO_LINGUAGENS_AMOR_V1,
      })
      .returning();

    return res.json({
      id: row.id,
      xpGanho: XP_ANALISE_LINGUAGENS,
      xpTotal: newXp,
      nivel: nivelInfo.nivel,
      ...resultado,
    });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao guardar análise das linguagens do amor." });
  }
});

router.get("/ultimo", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const [row] = await db
      .select()
      .from(analiseLinguagensAmorTable)
      .where(eq(analiseLinguagensAmorTable.usuarioId, req.user!.id))
      .orderBy(desc(analiseLinguagensAmorTable.criadoEm))
      .limit(1);
    return res.json(row ?? null);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar análise das linguagens do amor." });
  }
});

export default router;
