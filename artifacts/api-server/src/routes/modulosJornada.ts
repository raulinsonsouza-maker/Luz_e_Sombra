import { Router, Response } from "express";
import { requireAuth, requireAdmin, AuthRequest } from "../lib/authMiddleware";
import {
  db,
  configuracoesModulosTable,
  aulasTable,
  progressoCursosTable,
  usuariosTable,
} from "@workspace/db";
import { and, asc, eq, inArray } from "drizzle-orm";
import { temAnalise } from "../lib/temAnaliseJornada";
import { tryAwardJornadaModuloXp } from "../lib/jornadaXp";

const router = Router();

export const SLUGS_MODULO_JORNADA = ["traco", "temperamento", "linguagens-amor", "roda", "numerologia", "dossie"] as const;
export type SlugModuloJornada = (typeof SLUGS_MODULO_JORNADA)[number];

function hrefAnalise(slug: string): string {
  switch (slug) {
    case "traco":
      return "/traco-de-carater";
    case "temperamento":
      return "/temperamento";
    case "linguagens-amor":
      return "/linguagens-amor";
    case "roda":
      return "/avaliacao";
    case "numerologia":
      return "/numerologia";
    case "dossie":
      return "/quem-sou-eu";
    default:
      return "/jornada";
  }
}

/** Curso vinculado com aulas: exige conclusão. Sem curso ou sem aulas: não bloqueia a jornada. */
export async function minicursoCompletoParaUsuario(
  usuarioId: number,
  cursoVinculadoId: number | null,
): Promise<boolean> {
  if (cursoVinculadoId == null) return false;
  const aulas = await db
    .select({ id: aulasTable.id })
    .from(aulasTable)
    .where(eq(aulasTable.cursoId, cursoVinculadoId));
  if (aulas.length === 0) return false;
  const ids = aulas.map((a) => a.id);
  const prog = await db
    .select({ aulaId: progressoCursosTable.aulaId })
    .from(progressoCursosTable)
    .where(
      and(eq(progressoCursosTable.usuarioId, usuarioId), inArray(progressoCursosTable.aulaId, ids)),
    );
  return prog.length >= ids.length;
}

export function minicursoEstaDisponivel(
  cursoVinculadoId: number | null,
  totalAulas: number,
): boolean {
  return cursoVinculadoId != null && totalAulas > 0;
}

export async function moduloInicianteCompleto(
  usuarioId: number,
  slug: string,
  cursoVinculadoId: number | null,
  totalAulas = 0,
): Promise<boolean> {
  const analise = await temAnalise(usuarioId, slug);
  const miniDisponivel = minicursoEstaDisponivel(cursoVinculadoId, totalAulas);
  if (!miniDisponivel) return analise;
  const mini = await minicursoCompletoParaUsuario(usuarioId, cursoVinculadoId);
  return analise && mini;
}

export type ModuloJornadaItem = {
  slug: string;
  tituloIntro: string;
  descricaoIntro: string;
  videoIntroUrl: string | null;
  cursoVinculadoId: number | null;
  ordem: number;
  nivelDificuldade: string;
  hrefAnalise: string;
  hubHref: string;
  analiseConcluida: boolean;
  minicursoDisponivel: boolean;
  minicursoConcluido: boolean;
  minicursoProgresso: { total: number; concluidas: number } | null;
  status: "done" | "active" | "locked";
};

export async function buildModulosJornadaLista(usuarioId: number): Promise<ModuloJornadaItem[]> {
  const configs = await db
    .select()
    .from(configuracoesModulosTable)
    .orderBy(asc(configuracoesModulosTable.ordem));

  let todosAnterioresCompletos = true;
  const lista: ModuloJornadaItem[] = [];
  for (const c of configs) {
    const analiseOk = await temAnalise(usuarioId, c.slug);
    const totalAulas =
      c.cursoVinculadoId != null
        ? (
            await db
              .select({ id: aulasTable.id })
              .from(aulasTable)
              .where(eq(aulasTable.cursoId, c.cursoVinculadoId))
          ).length
        : 0;
    let concluidas = 0;
    if (c.cursoVinculadoId != null && totalAulas > 0) {
      const ids = (
        await db
          .select({ id: aulasTable.id })
          .from(aulasTable)
          .where(eq(aulasTable.cursoId, c.cursoVinculadoId))
      ).map((a) => a.id);
      const prog = await db
        .select({ aulaId: progressoCursosTable.aulaId })
        .from(progressoCursosTable)
        .where(
          and(eq(progressoCursosTable.usuarioId, usuarioId), inArray(progressoCursosTable.aulaId, ids)),
        );
      concluidas = prog.length;
    }
    const miniDisponivel = minicursoEstaDisponivel(c.cursoVinculadoId, totalAulas);
    const miniOk = miniDisponivel
      ? await minicursoCompletoParaUsuario(usuarioId, c.cursoVinculadoId)
      : false;
    const completo = analiseOk && (!miniDisponivel || miniOk);

    let status: "done" | "active" | "locked";
    if (completo) {
      status = "done";
    } else if (todosAnterioresCompletos) {
      status = "active";
    } else {
      status = "locked";
    }

    todosAnterioresCompletos = todosAnterioresCompletos && completo;

    lista.push({
      slug: c.slug,
      tituloIntro: c.tituloIntro,
      descricaoIntro: c.descricaoIntro,
      videoIntroUrl: c.videoIntroUrl,
      cursoVinculadoId: c.cursoVinculadoId,
      ordem: c.ordem,
      nivelDificuldade: c.nivelDificuldade,
      hrefAnalise: hrefAnalise(c.slug),
      hubHref: `/jornada/${c.slug}`,
      analiseConcluida: analiseOk,
      minicursoDisponivel: miniDisponivel,
      minicursoConcluido: miniOk,
      minicursoProgresso:
        c.cursoVinculadoId != null && totalAulas > 0
          ? { total: totalAulas, concluidas: concluidas }
          : null,
      status,
    });
  }
  return lista;
}

// GET /modulos-jornada — módulos Iniciante com status
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const lista = await buildModulosJornadaLista(req.user!.id);
    return res.json(lista);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao listar módulos da jornada." });
  }
});

// POST /modulos-jornada/dossie/concluir-analise — marca passo 6 concluído na jornada
router.post("/dossie/concluir-analise", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = req.user!.id;
    const lista = await buildModulosJornadaLista(usuarioId);
    const dossie = lista.find((m) => m.slug === "dossie");
    if (!dossie) {
      return res.status(404).json({ error: "Módulo dossiê não configurado." });
    }
    if (dossie.status === "locked") {
      return res.status(403).json({ error: "Conclua os módulos anteriores da jornada para desbloquear o Dossiê de Vida." });
    }

    const fontesMinimas = Number((req.body as { fontesDisponiveis?: number })?.fontesDisponiveis ?? 0);
    if (fontesMinimas < 4) {
      return res.status(400).json({
        error: "Complete pelo menos 4 análises da jornada para gerar o dossiê integrado.",
        fontesMinimas: 4,
      });
    }

    const jaExistia = await temAnalise(usuarioId, "dossie");

    await db
      .update(usuariosTable)
      .set({ dossieJornadaConcluida: true, atualizadoEm: new Date() })
      .where(eq(usuariosTable.id, usuarioId));

    await tryAwardJornadaModuloXp(usuarioId, jaExistia);

    return res.json({ ok: true });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao concluir o Dossiê de Vida na jornada." });
  }
});

// POST /modulos-jornada/numerologia/concluir-analise — marca passo 5 concluído na jornada
router.post("/numerologia/concluir-analise", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = req.user!.id;
    const lista = await buildModulosJornadaLista(usuarioId);
    const numerologia = lista.find((m) => m.slug === "numerologia");
    if (!numerologia) {
      return res.status(404).json({ error: "Módulo numerologia não configurado." });
    }
    if (numerologia.status === "locked") {
      return res.status(403).json({ error: "Conclua os módulos anteriores da jornada para desbloquear a numerologia." });
    }

    const [usuario] = await db
      .select({ dataNascimento: usuariosTable.dataNascimento })
      .from(usuariosTable)
      .where(eq(usuariosTable.id, usuarioId))
      .limit(1);
    if (!usuario?.dataNascimento) {
      return res.status(400).json({ error: "Cadastre sua data de nascimento no perfil antes de concluir." });
    }

    const jaExistia = await temAnalise(usuarioId, "numerologia");

    await db
      .update(usuariosTable)
      .set({ numerologiaJornadaConcluida: true, atualizadoEm: new Date() })
      .where(eq(usuariosTable.id, usuarioId));

    await tryAwardJornadaModuloXp(usuarioId, jaExistia);

    return res.json({ ok: true });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao concluir análise numerológica na jornada." });
  }
});

// PUT /modulos-jornada/:slug — admin atualiza intro e curso vinculado
router.put("/:slug", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const slug = String(req.params.slug);
    if (!SLUGS_MODULO_JORNADA.includes(slug as SlugModuloJornada)) {
      return res.status(400).json({ error: "Slug de módulo inválido." });
    }

    const { tituloIntro, descricaoIntro, videoIntroUrl, cursoVinculadoId } = req.body as {
      tituloIntro?: string;
      descricaoIntro?: string;
      videoIntroUrl?: string | null;
      cursoVinculadoId?: number | null;
    };

    const updates: Record<string, unknown> = { atualizadoEm: new Date() };
    if (tituloIntro !== undefined) updates.tituloIntro = String(tituloIntro).trim();
    if (descricaoIntro !== undefined) updates.descricaoIntro = String(descricaoIntro).trim();
    if (videoIntroUrl !== undefined) {
      const v = videoIntroUrl === null || videoIntroUrl === "" ? null : String(videoIntroUrl).trim();
      updates.videoIntroUrl = v;
    }
    if (cursoVinculadoId !== undefined) {
      if (cursoVinculadoId === null) {
        updates.cursoVinculadoId = null;
      } else {
        const id = Number(cursoVinculadoId);
        if (!Number.isFinite(id)) return res.status(400).json({ error: "cursoVinculadoId inválido" });
        updates.cursoVinculadoId = id;
      }
    }

    if (updates.tituloIntro !== undefined && !(updates.tituloIntro as string)?.length) {
      return res.status(400).json({ error: "tituloIntro não pode ser vazio" });
    }
    if (updates.descricaoIntro !== undefined && !(updates.descricaoIntro as string)?.length) {
      return res.status(400).json({ error: "descricaoIntro não pode ser vazio" });
    }

    const [row] = await db
      .update(configuracoesModulosTable)
      .set(updates)
      .where(eq(configuracoesModulosTable.slug, slug))
      .returning();

    if (!row) return res.status(404).json({ error: "Módulo não encontrado" });
    return res.json(row);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao atualizar módulo da jornada." });
  }
});

export default router;
