import { Router, Response } from "express";
import { requireAuth, requireAdmin, AuthRequest } from "../lib/authMiddleware";
import { db } from "@workspace/db";
import { cursosTable, aulasTable, progressoCursosTable } from "@workspace/db/schema";
import { eq, and, asc, sql, count } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";

const router = Router();
const objectStorage = new ObjectStorageService();

// GET /api/cursos — list courses (published for users, all for admin)
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user!.isAdmin;

    const cursos = await db
      .select({
        id: cursosTable.id,
        titulo: cursosTable.titulo,
        descricao: cursosTable.descricao,
        imagemUrl: cursosTable.imagemUrl,
        categoria: cursosTable.categoria,
        nivel: cursosTable.nivel,
        moduloJornada: cursosTable.moduloJornada,
        publicado: cursosTable.publicado,
        criadoEm: cursosTable.criadoEm,
        aulasCount: count(aulasTable.id),
      })
      .from(cursosTable)
      .leftJoin(aulasTable, eq(aulasTable.cursoId, cursosTable.id))
      .where(isAdmin ? undefined : eq(cursosTable.publicado, true))
      .groupBy(cursosTable.id)
      .orderBy(cursosTable.criadoEm);

    if (cursos.length === 0) return res.json([]);

    const cursoIds = cursos.map(c => c.id);
    const progressos = await db
      .select({
        aulaId: progressoCursosTable.aulaId,
        cursoId: aulasTable.cursoId,
      })
      .from(progressoCursosTable)
      .innerJoin(aulasTable, eq(aulasTable.id, progressoCursosTable.aulaId))
      .where(and(
        eq(progressoCursosTable.usuarioId, req.user!.id),
        sql`${aulasTable.cursoId} = ANY(ARRAY[${sql.join(cursoIds.map(id => sql`${id}`), sql`, `)}]::int[])`
      ));

    const progressoPorCurso: Record<number, number> = {};
    progressos.forEach(p => {
      progressoPorCurso[p.cursoId] = (progressoPorCurso[p.cursoId] ?? 0) + 1;
    });

    const result = cursos.map(c => ({
      ...c,
      aulasCount: Number(c.aulasCount),
      aulasConcluidasCount: progressoPorCurso[c.id] ?? 0,
    }));

    return res.json(result);
  } catch (err) {
    req.log.error({ err }, "Erro ao buscar cursos");
    return res.status(500).json({ error: "Erro ao buscar cursos" });
  }
});

// POST /api/cursos/upload-url — capa do curso (armazenamento local / assinado)
router.post("/upload-url", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    return res.json({ uploadURL, objectPath });
  } catch (err) {
    req.log.error({ err }, "Erro ao gerar URL de upload (curso)");
    return res.status(500).json({ error: "Erro ao gerar URL de upload" });
  }
});

// GET /api/cursos/:id/capa — imagem da capa (JWT; paths internos ou redireciona URL absoluta)
router.get("/:id/capa", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const cursoId = parseInt(String(req.params.id), 10);
    if (isNaN(cursoId)) return res.status(400).json({ error: "ID inválido" });

    const [curso] = await db
      .select({ imagemUrl: cursosTable.imagemUrl, publicado: cursosTable.publicado })
      .from(cursosTable)
      .where(eq(cursosTable.id, cursoId))
      .limit(1);

    if (!curso?.imagemUrl) return res.status(404).json({ error: "Capa não encontrada" });
    if (!curso.publicado && !req.user!.isAdmin) {
      return res.status(404).json({ error: "Curso não encontrado" });
    }

    const src = curso.imagemUrl.trim();
    if (/^https?:\/\//i.test(src)) {
      return res.redirect(302, src);
    }

    const file = await objectStorage.getObjectEntityFile(src);
    const response = await objectStorage.downloadObject(file, 3600);
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "private, max-age=3600");
    return res.send(buffer);
  } catch (err) {
    req.log.error({ err }, "Erro ao carregar capa do curso");
    return res.status(500).json({ error: "Erro ao carregar capa" });
  }
});

// GET /api/cursos/:id — course detail with aulas + user progress
router.get("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const cursoId = parseInt(String(req.params.id), 10);
    if (isNaN(cursoId)) return res.status(400).json({ error: "ID inválido" });

    const [curso] = await db
      .select()
      .from(cursosTable)
      .where(eq(cursosTable.id, cursoId))
      .limit(1);

    if (!curso) return res.status(404).json({ error: "Curso não encontrado" });
    if (!curso.publicado && !req.user!.isAdmin) {
      return res.status(404).json({ error: "Curso não encontrado" });
    }

    const aulas = await db
      .select()
      .from(aulasTable)
      .where(eq(aulasTable.cursoId, cursoId))
      .orderBy(asc(aulasTable.ordem));

    const progressos = await db
      .select({ aulaId: progressoCursosTable.aulaId })
      .from(progressoCursosTable)
      .where(eq(progressoCursosTable.usuarioId, req.user!.id));

    const aulasConcluidasSet = new Set(progressos.map(p => p.aulaId));

    return res.json({
      ...curso,
      aulas: aulas.map(a => ({ ...a, concluida: aulasConcluidasSet.has(a.id) })),
    });
  } catch (err) {
    req.log.error({ err }, "Erro ao buscar curso");
    return res.status(500).json({ error: "Erro ao buscar curso" });
  }
});

// POST /api/cursos — admin create course
router.post("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { titulo, descricao, imagemUrl, categoria, nivel, publicado, moduloJornada } = req.body as {
      titulo?: string; descricao?: string; imagemUrl?: string;
      categoria?: string; nivel?: string; publicado?: boolean;
      moduloJornada?: string | null;
    };

    if (!titulo?.trim() || !descricao?.trim()) {
      return res.status(400).json({ error: "Título e descrição são obrigatórios" });
    }

    const modJn =
      moduloJornada === undefined || moduloJornada === null || moduloJornada === ""
        ? null
        : String(moduloJornada).trim();

    const [curso] = await db
      .insert(cursosTable)
      .values({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        imagemUrl: imagemUrl?.trim() || null,
        categoria: categoria?.trim() || null,
        nivel: nivel || "todos",
        moduloJornada: modJn,
        publicado: publicado ?? false,
      })
      .returning();

    return res.status(201).json(curso);
  } catch (err) {
    req.log.error({ err }, "Erro ao criar curso");
    return res.status(500).json({ error: "Erro ao criar curso" });
  }
});

// PUT /api/cursos/:id — admin update course
router.put("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const cursoId = parseInt(String(req.params.id), 10);
    if (isNaN(cursoId)) return res.status(400).json({ error: "ID inválido" });

    const { titulo, descricao, imagemUrl, categoria, nivel, publicado, moduloJornada } = req.body as {
      titulo?: string; descricao?: string; imagemUrl?: string;
      categoria?: string; nivel?: string; publicado?: boolean;
      moduloJornada?: string | null;
    };

    const updates: Record<string, unknown> = { atualizadoEm: new Date() };
    if (titulo !== undefined) updates.titulo = titulo.trim();
    if (descricao !== undefined) updates.descricao = descricao.trim();
    if (imagemUrl !== undefined) updates.imagemUrl = imagemUrl?.trim() || null;
    if (categoria !== undefined) updates.categoria = categoria?.trim() || null;
    if (nivel !== undefined) updates.nivel = nivel;
    if (publicado !== undefined) updates.publicado = publicado;
    if (moduloJornada !== undefined) {
      updates.moduloJornada =
        moduloJornada === null || moduloJornada === "" ? null : String(moduloJornada).trim();
    }

    const [curso] = await db
      .update(cursosTable)
      .set(updates)
      .where(eq(cursosTable.id, cursoId))
      .returning();

    if (!curso) return res.status(404).json({ error: "Curso não encontrado" });
    return res.json(curso);
  } catch (err) {
    req.log.error({ err }, "Erro ao atualizar curso");
    return res.status(500).json({ error: "Erro ao atualizar curso" });
  }
});

// DELETE /api/cursos/:id — admin delete
router.delete("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const cursoId = parseInt(String(req.params.id), 10);
    if (isNaN(cursoId)) return res.status(400).json({ error: "ID inválido" });
    await db.delete(cursosTable).where(eq(cursosTable.id, cursoId));
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Erro ao deletar curso");
    return res.status(500).json({ error: "Erro ao deletar curso" });
  }
});

// POST /api/cursos/:id/aulas — admin add lesson
router.post("/:id/aulas", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const cursoId = parseInt(String(req.params.id), 10);
    if (isNaN(cursoId)) return res.status(400).json({ error: "ID inválido" });

    const [curso] = await db.select({ id: cursosTable.id }).from(cursosTable).where(eq(cursosTable.id, cursoId)).limit(1);
    if (!curso) return res.status(404).json({ error: "Curso não encontrado" });

    const { titulo, descricao, videoUrl, conteudo, ordem, duracaoMin } = req.body as {
      titulo?: string; descricao?: string; videoUrl?: string;
      conteudo?: string; ordem?: number; duracaoMin?: number;
    };

    if (!titulo?.trim()) return res.status(400).json({ error: "Título é obrigatório" });

    const [aula] = await db
      .insert(aulasTable)
      .values({
        cursoId,
        titulo: titulo.trim(),
        descricao: descricao?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        conteudo: conteudo?.trim() || null,
        ordem: ordem ?? 0,
        duracaoMin: duracaoMin ?? null,
      })
      .returning();

    return res.status(201).json(aula);
  } catch (err) {
    req.log.error({ err }, "Erro ao criar aula");
    return res.status(500).json({ error: "Erro ao criar aula" });
  }
});

// PUT /api/cursos/aulas/:aulaId — admin update lesson
router.put("/aulas/:aulaId", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const aulaId = parseInt(String(req.params.aulaId), 10);
    if (isNaN(aulaId)) return res.status(400).json({ error: "ID inválido" });

    const { titulo, descricao, videoUrl, conteudo, ordem, duracaoMin } = req.body as {
      titulo?: string; descricao?: string; videoUrl?: string;
      conteudo?: string; ordem?: number; duracaoMin?: number;
    };

    const updates: Record<string, unknown> = {};
    if (titulo !== undefined) updates.titulo = titulo.trim();
    if (descricao !== undefined) updates.descricao = descricao?.trim() || null;
    if (videoUrl !== undefined) updates.videoUrl = videoUrl?.trim() || null;
    if (conteudo !== undefined) updates.conteudo = conteudo?.trim() || null;
    if (ordem !== undefined) updates.ordem = ordem;
    if (duracaoMin !== undefined) updates.duracaoMin = duracaoMin;

    const [aula] = await db
      .update(aulasTable)
      .set(updates)
      .where(eq(aulasTable.id, aulaId))
      .returning();

    if (!aula) return res.status(404).json({ error: "Aula não encontrada" });
    return res.json(aula);
  } catch (err) {
    req.log.error({ err }, "Erro ao atualizar aula");
    return res.status(500).json({ error: "Erro ao atualizar aula" });
  }
});

// DELETE /api/cursos/aulas/:aulaId — admin delete lesson
router.delete("/aulas/:aulaId", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const aulaId = parseInt(String(req.params.aulaId), 10);
    if (isNaN(aulaId)) return res.status(400).json({ error: "ID inválido" });
    await db.delete(aulasTable).where(eq(aulasTable.id, aulaId));
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Erro ao deletar aula");
    return res.status(500).json({ error: "Erro ao deletar aula" });
  }
});

// POST /api/cursos/aulas/:aulaId/concluir — mark lesson complete
router.post("/aulas/:aulaId/concluir", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const aulaId = parseInt(String(req.params.aulaId), 10);
    if (isNaN(aulaId)) return res.status(400).json({ error: "ID inválido" });

    const [aula] = await db.select({ id: aulasTable.id }).from(aulasTable).where(eq(aulasTable.id, aulaId)).limit(1);
    if (!aula) return res.status(404).json({ error: "Aula não encontrada" });

    await db
      .insert(progressoCursosTable)
      .values({ usuarioId: req.user!.id, aulaId })
      .onConflictDoNothing();

    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Erro ao marcar aula");
    return res.status(500).json({ error: "Erro ao marcar aula como concluída" });
  }
});

// DELETE /api/cursos/aulas/:aulaId/concluir — unmark lesson
router.delete("/aulas/:aulaId/concluir", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const aulaId = parseInt(String(req.params.aulaId), 10);
    if (isNaN(aulaId)) return res.status(400).json({ error: "ID inválido" });
    await db.delete(progressoCursosTable).where(
      and(eq(progressoCursosTable.usuarioId, req.user!.id), eq(progressoCursosTable.aulaId, aulaId))
    );
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Erro ao desmarcar aula");
    return res.status(500).json({ error: "Erro ao desmarcar aula" });
  }
});

export default router;
