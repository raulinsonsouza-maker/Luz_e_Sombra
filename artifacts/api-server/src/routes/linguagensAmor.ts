import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { db, analiseLinguagensAmorTable, gamificacaoTable, pessoasAnaliseTable } from "@workspace/db";
import { and, desc, eq, isNull } from "drizzle-orm";
import {
  computarLinguagensAmor,
  computarCompatibilidade,
  entradaLinguagensAmorSchema,
  entradaCompatibilidadeSchema,
  VERSAO_LINGUAGENS_AMOR_V2,
  type ResultadoLinguagensAmorComputado,
} from "@workspace/cinco-linguagens-amor";

const router = Router();

const XP_EU_PRIMEIRA = 60;
const XP_PESSOA_NOVA = 15;

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

async function getOrCreateGamificacao(usuarioId: number) {
  let [gam] = await db.select().from(gamificacaoTable).where(eq(gamificacaoTable.usuarioId, usuarioId));
  if (!gam) {
    [gam] = await db.insert(gamificacaoTable).values({ usuarioId }).returning();
  }
  return gam;
}

async function jaTemAnalise(usuarioId: number, pessoaId: number | null): Promise<boolean> {
  const [row] = await db
    .select({ id: analiseLinguagensAmorTable.id })
    .from(analiseLinguagensAmorTable)
    .where(
      and(
        eq(analiseLinguagensAmorTable.usuarioId, usuarioId),
        pessoaId === null
          ? isNull(analiseLinguagensAmorTable.pessoaId)
          : eq(analiseLinguagensAmorTable.pessoaId, pessoaId)
      )
    )
    .limit(1);
  return !!row;
}

function calcularXpGanho(primeiraVez: boolean, pessoaId: number | null): number {
  if (!primeiraVez) return 0;
  return pessoaId === null ? XP_EU_PRIMEIRA : XP_PESSOA_NOVA;
}

function extrairPerfilV2(resultado: ResultadoLinguagensAmorComputado) {
  return {
    receber: resultado.receber,
    expressar: resultado.expressar,
  };
}

router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { pessoaId: pessoaIdRaw, ...bodyRest } = req.body as { pessoaId?: unknown };
    const pessoaId = parsePessoaId(pessoaIdRaw);
    const owned = await assertPessoaDoUsuario(req.user!.id, pessoaId);
    if (!owned.ok) return res.status(owned.status).json({ error: owned.error });

    const parsed = entradaLinguagensAmorSchema.safeParse(bodyRest);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Corpo inválido: são necessárias as 30 escolhas (R01–E15, a/b) e metadados opcionais.",
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

    const primeiraVez = !(await jaTemAnalise(req.user!.id, pessoaId));
    const xpGanho = calcularXpGanho(primeiraVez, pessoaId);

    const gam = await getOrCreateGamificacao(req.user!.id);
    const newXp = gam.xp + xpGanho;
    const nivelInfo = getNivelInfo(newXp);
    if (xpGanho > 0) {
      await db
        .update(gamificacaoTable)
        .set({ xp: newXp, nivel: nivelInfo.nivel, atualizadoEm: new Date() })
        .where(eq(gamificacaoTable.usuarioId, req.user!.id));
    }

    const [row] = await db
      .insert(analiseLinguagensAmorTable)
      .values({
        usuarioId: req.user!.id,
        pessoaId,
        respostas: parsed.data.answers,
        pontuacoes: comp.pontuacoes,
        linguagemPrincipal: comp.principal,
        linguagemSecundaria: comp.secundaria,
        resultado,
        versao: VERSAO_LINGUAGENS_AMOR_V2,
      })
      .returning();

    return res.json({
      id: row.id,
      pessoaId,
      xpGanho,
      xpTotal: xpGanho > 0 ? newXp : gam.xp,
      nivel: xpGanho > 0 ? nivelInfo.nivel : gam.nivel,
      primeiraVez,
      ...resultado,
    });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao guardar análise das linguagens do amor." });
  }
});

router.get("/ultimo", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const pessoaId = parsePessoaId(req.query.pessoaId);
    const owned = await assertPessoaDoUsuario(req.user!.id, pessoaId);
    if (!owned.ok) return res.status(owned.status).json({ error: owned.error });

    const [row] = await db
      .select()
      .from(analiseLinguagensAmorTable)
      .where(
        and(
          eq(analiseLinguagensAmorTable.usuarioId, req.user!.id),
          pessoaId === null
            ? isNull(analiseLinguagensAmorTable.pessoaId)
            : eq(analiseLinguagensAmorTable.pessoaId, pessoaId)
        )
      )
      .orderBy(desc(analiseLinguagensAmorTable.criadoEm))
      .limit(1);
    return res.json(row ?? null);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar análise das linguagens do amor." });
  }
});

router.get("/historico", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select({
        id: analiseLinguagensAmorTable.id,
        pessoaId: analiseLinguagensAmorTable.pessoaId,
        linguagemPrincipal: analiseLinguagensAmorTable.linguagemPrincipal,
        linguagemSecundaria: analiseLinguagensAmorTable.linguagemSecundaria,
        versao: analiseLinguagensAmorTable.versao,
        criadoEm: analiseLinguagensAmorTable.criadoEm,
        resultado: analiseLinguagensAmorTable.resultado,
        nomePessoa: pessoasAnaliseTable.nome,
      })
      .from(analiseLinguagensAmorTable)
      .leftJoin(pessoasAnaliseTable, eq(analiseLinguagensAmorTable.pessoaId, pessoasAnaliseTable.id))
      .where(eq(analiseLinguagensAmorTable.usuarioId, req.user!.id))
      .orderBy(desc(analiseLinguagensAmorTable.criadoEm));

    const historico = rows.map((r) => {
      const res = r.resultado as ResultadoLinguagensAmorComputado | null;
      return {
        id: r.id,
        pessoaId: r.pessoaId,
        nomePessoa: r.nomePessoa ?? null,
        principalReceber: r.linguagemPrincipal,
        principalExpressar: res?.expressar?.principal ?? null,
        criadoEm: r.criadoEm,
        versao: r.versao,
      };
    });
    return res.json(historico);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar histórico." });
  }
});

router.post("/compatibilidade", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = entradaCompatibilidadeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Corpo inválido.", detalhes: parsed.error.flatten() });
    }

    const [euRow] = await db
      .select()
      .from(analiseLinguagensAmorTable)
      .where(
        and(
          eq(analiseLinguagensAmorTable.usuarioId, req.user!.id),
          isNull(analiseLinguagensAmorTable.pessoaId)
        )
      )
      .orderBy(desc(analiseLinguagensAmorTable.criadoEm))
      .limit(1);

    if (!euRow) {
      return res.status(400).json({ error: "Faça primeiro a análise do Eu antes de cruzar perfis." });
    }

    const euRes = euRow.resultado as ResultadoLinguagensAmorComputado;
    const perfilEu = extrairPerfilV2(euRes);

    if ("pessoaIdOutro" in parsed.data) {
      const pessoaId = parsed.data.pessoaIdOutro;
      const owned = await assertPessoaDoUsuario(req.user!.id, pessoaId);
      if (!owned.ok) return res.status(owned.status).json({ error: owned.error });

      const [outroRow] = await db
        .select()
        .from(analiseLinguagensAmorTable)
        .where(
          and(
            eq(analiseLinguagensAmorTable.usuarioId, req.user!.id),
            eq(analiseLinguagensAmorTable.pessoaId, pessoaId)
          )
        )
        .orderBy(desc(analiseLinguagensAmorTable.criadoEm))
        .limit(1);

      if (!outroRow) {
        return res.status(400).json({ error: "Esta pessoa ainda não tem análise de linguagens do amor." });
      }

      const [pessoa] = await db
        .select({ nome: pessoasAnaliseTable.nome })
        .from(pessoasAnaliseTable)
        .where(eq(pessoasAnaliseTable.id, pessoaId));

      const outroRes = outroRow.resultado as ResultadoLinguagensAmorComputado;
      const compat = computarCompatibilidade(
        { ...perfilEu, nome: "Você" },
        { ...extrairPerfilV2(outroRes), nome: pessoa?.nome ?? "A outra pessoa" },
      );
      return res.json(compat);
    }

    const compat = computarCompatibilidade(
      { ...perfilEu, nome: "Você" },
      parsed.data.manual,
    );
    return res.json(compat);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao calcular compatibilidade." });
  }
});

export default router;
