import { Router, Response } from "express";
import { db } from "@workspace/db";
import { avaliacoesTable, usuariosTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { createAvaliacaoSchema, parseBody } from "../lib/schemas";

import { tryAwardJornadaModuloXp } from "../lib/jornadaXp";
import { temAnalise } from "../lib/temAnaliseJornada";

const router = Router();

// GET /api/avaliacoes - List user's assessments (or all for admin)
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const avaliacoes = await db
      .select({
        id: avaliacoesTable.id,
        usuarioId: avaliacoesTable.usuarioId,
        dataAvaliacao: avaliacoesTable.dataAvaliacao,
        plenitudeFelicidade: avaliacoesTable.plenitudeFelicidade,
        espiritualidade: avaliacoesTable.espiritualidade,
        saudeDisposicao: avaliacoesTable.saudeDisposicao,
        desenvolvimentoIntelectual: avaliacoesTable.desenvolvimentoIntelectual,
        equilibrioEmocional: avaliacoesTable.equilibrioEmocional,
        familia: avaliacoesTable.familia,
        desenvolvimentoAmoroso: avaliacoesTable.desenvolvimentoAmoroso,
        vidaSocial: avaliacoesTable.vidaSocial,
        realizacaoProposito: avaliacoesTable.realizacaoProposito,
        recursosFinanceiros: avaliacoesTable.recursosFinanceiros,
        contribuicaoSocial: avaliacoesTable.contribuicaoSocial,
        criatividadeHobbyDiversao: avaliacoesTable.criatividadeHobbyDiversao,
        usuario: {
          id: usuariosTable.id,
          nome: usuariosTable.nome,
          username: usuariosTable.username,
        }
      })
      .from(avaliacoesTable)
      .leftJoin(usuariosTable, eq(avaliacoesTable.usuarioId, usuariosTable.id))
      .where(user.isAdmin ? undefined : eq(avaliacoesTable.usuarioId, user.id))
      .orderBy(desc(avaliacoesTable.dataAvaliacao));

    return res.json(avaliacoes);
  } catch (error) {
    req.log.error({ error }, "Erro ao buscar avaliações");
    return res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

// POST /api/avaliacoes - Create assessment
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const parsed = parseBody(createAvaliacaoSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, detalhes: parsed.detalhes });
    }
    const body = parsed.data;

    const jaExistia = await temAnalise(user.id, "roda");

    const [avaliacao] = await db.insert(avaliacoesTable).values({
      usuarioId: user.id,
      plenitudeFelicidade: body.plenitudeFelicidade,
      espiritualidade: body.espiritualidade,
      saudeDisposicao: body.saudeDisposicao,
      desenvolvimentoIntelectual: body.desenvolvimentoIntelectual,
      equilibrioEmocional: body.equilibrioEmocional,
      familia: body.familia,
      desenvolvimentoAmoroso: body.desenvolvimentoAmoroso,
      vidaSocial: body.vidaSocial,
      realizacaoProposito: body.realizacaoProposito,
      recursosFinanceiros: body.recursosFinanceiros,
      contribuicaoSocial: body.contribuicaoSocial,
      criatividadeHobbyDiversao: body.criatividadeHobbyDiversao,
    }).returning();

    await tryAwardJornadaModuloXp(user.id, jaExistia);

    return res.json(avaliacao);
  } catch (error) {
    req.log.error({ error }, "Erro ao criar avaliação");
    return res.status(500).json({ error: "Erro ao criar avaliação" });
  }
});

// GET /api/avaliacoes/:id - Get single assessment
router.get("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const avaliacaoId = parseInt(String(req.params.id), 10);
    if (isNaN(avaliacaoId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const [avaliacao] = await db
      .select({
        id: avaliacoesTable.id,
        usuarioId: avaliacoesTable.usuarioId,
        dataAvaliacao: avaliacoesTable.dataAvaliacao,
        plenitudeFelicidade: avaliacoesTable.plenitudeFelicidade,
        espiritualidade: avaliacoesTable.espiritualidade,
        saudeDisposicao: avaliacoesTable.saudeDisposicao,
        desenvolvimentoIntelectual: avaliacoesTable.desenvolvimentoIntelectual,
        equilibrioEmocional: avaliacoesTable.equilibrioEmocional,
        familia: avaliacoesTable.familia,
        desenvolvimentoAmoroso: avaliacoesTable.desenvolvimentoAmoroso,
        vidaSocial: avaliacoesTable.vidaSocial,
        realizacaoProposito: avaliacoesTable.realizacaoProposito,
        recursosFinanceiros: avaliacoesTable.recursosFinanceiros,
        contribuicaoSocial: avaliacoesTable.contribuicaoSocial,
        criatividadeHobbyDiversao: avaliacoesTable.criatividadeHobbyDiversao,
        usuario: {
          id: usuariosTable.id,
          nome: usuariosTable.nome,
          username: usuariosTable.username,
          dataNascimento: usuariosTable.dataNascimento,
        }
      })
      .from(avaliacoesTable)
      .leftJoin(usuariosTable, eq(avaliacoesTable.usuarioId, usuariosTable.id))
      .where(eq(avaliacoesTable.id, avaliacaoId))
      .limit(1);

    if (!avaliacao) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }

    if (!user.isAdmin && avaliacao.usuarioId !== user.id) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    return res.json(avaliacao);
  } catch (error) {
    req.log.error({ error }, "Erro ao buscar avaliação");
    return res.status(500).json({ error: "Erro ao buscar avaliação" });
  }
});

export default router;
