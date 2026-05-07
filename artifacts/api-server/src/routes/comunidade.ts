import { Router, Response } from "express";
import { requireAuth, requireAdmin, AuthRequest } from "../lib/authMiddleware";
import { db } from "@workspace/db";
import {
  comunidadeTable,
  reacoesTable,
  usuariosTable,
  notificacoesTable,
  comentariosComunidadeTable,
  salvosComunidadeTable,
  compartilhamentosComunidadeTable,
  visualizacoesComunidadeTable,
} from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";

const router = Router();
const objectStorage = new ObjectStorageService();

// GET /api/comunidade — list posts with reactions
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const posts = await db
      .select({
        id: comunidadeTable.id,
        autorId: comunidadeTable.autorId,
        tipo: comunidadeTable.tipo,
        conteudo: comunidadeTable.conteudo,
        mediaUrl: comunidadeTable.mediaUrl,
        criadoEm: comunidadeTable.criadoEm,
        autorNome: usuariosTable.nome,
      })
      .from(comunidadeTable)
      .leftJoin(usuariosTable, eq(usuariosTable.id, comunidadeTable.autorId))
      .orderBy(desc(comunidadeTable.criadoEm));

    const postIds = posts.map(p => p.id);
    if (postIds.length === 0) return res.json([]);

    // Registra visualização única por usuário/publicação.
    await db
      .insert(visualizacoesComunidadeTable)
      .values(postIds.map((id) => ({
        publicacaoId: id,
        usuarioId: req.user!.id,
      })))
      .onConflictDoNothing();

    const reacoes = await db
      .select({
        publicacaoId: reacoesTable.publicacaoId,
        emoji: reacoesTable.emoji,
        usuarioId: reacoesTable.usuarioId,
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(reacoesTable)
      .where(sql`${reacoesTable.publicacaoId} = ANY(${sql`ARRAY[${sql.join(postIds.map(id => sql`${id}`), sql`, `)}]::int[]`})`)
      .groupBy(reacoesTable.publicacaoId, reacoesTable.emoji, reacoesTable.usuarioId);

    const comentarios = await db
      .select({
        id: comentariosComunidadeTable.id,
        publicacaoId: comentariosComunidadeTable.publicacaoId,
        autorId: comentariosComunidadeTable.autorId,
        autorNome: usuariosTable.nome,
        autorAdmin: usuariosTable.isAdmin,
        conteudo: comentariosComunidadeTable.conteudo,
        criadoEm: comentariosComunidadeTable.criadoEm,
      })
      .from(comentariosComunidadeTable)
      .leftJoin(usuariosTable, eq(usuariosTable.id, comentariosComunidadeTable.autorId))
      .where(sql`${comentariosComunidadeTable.publicacaoId} = ANY(${sql`ARRAY[${sql.join(postIds.map(id => sql`${id}`), sql`, `)}]::int[]`})`)
      .orderBy(comentariosComunidadeTable.criadoEm);

    const salvos = await db
      .select({
        publicacaoId: salvosComunidadeTable.publicacaoId,
        usuarioId: salvosComunidadeTable.usuarioId,
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(salvosComunidadeTable)
      .where(sql`${salvosComunidadeTable.publicacaoId} = ANY(${sql`ARRAY[${sql.join(postIds.map(id => sql`${id}`), sql`, `)}]::int[]`})`)
      .groupBy(salvosComunidadeTable.publicacaoId, salvosComunidadeTable.usuarioId);

    const compartilhamentos = await db
      .select({
        publicacaoId: compartilhamentosComunidadeTable.publicacaoId,
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(compartilhamentosComunidadeTable)
      .where(sql`${compartilhamentosComunidadeTable.publicacaoId} = ANY(${sql`ARRAY[${sql.join(postIds.map(id => sql`${id}`), sql`, `)}]::int[]`})`)
      .groupBy(compartilhamentosComunidadeTable.publicacaoId);

    const visualizacoes = await db
      .select({
        publicacaoId: visualizacoesComunidadeTable.publicacaoId,
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(visualizacoesComunidadeTable)
      .where(sql`${visualizacoesComunidadeTable.publicacaoId} = ANY(${sql`ARRAY[${sql.join(postIds.map(id => sql`${id}`), sql`, `)}]::int[]`})`)
      .groupBy(visualizacoesComunidadeTable.publicacaoId);

    const userId = req.user!.id;

    const result = posts.map(post => {
      const postReacoes = reacoes.filter(r => r.publicacaoId === post.id);
      const postComentarios = comentarios.filter(c => c.publicacaoId === post.id);
      const postCompart = compartilhamentos.find(c => c.publicacaoId === post.id);
      const postViews = visualizacoes.find(c => c.publicacaoId === post.id);
      const postSalvos = salvos.filter(s => s.publicacaoId === post.id);
      const contagens: Record<string, number> = {};
      const minhasReacoes: string[] = [];

      postReacoes.forEach(r => {
        contagens[r.emoji] = (contagens[r.emoji] ?? 0) + Number(r.count);
        if (r.usuarioId === userId) minhasReacoes.push(r.emoji);
      });

      const totalSalvos = postSalvos.reduce((sum, it) => sum + Number(it.count), 0);
      const salvoPorMim = postSalvos.some((it) => it.usuarioId === userId);

      return {
        ...post,
        reacoes: contagens,
        minhasReacoes,
        comentarios: postComentarios.map((c) => ({
          id: c.id,
          autorId: c.autorId,
          autorNome: c.autorNome ?? "Usuário",
          autorAdmin: Boolean(c.autorAdmin),
          conteudo: c.conteudo,
          criadoEm: c.criadoEm,
        })),
        totalComentarios: postComentarios.length,
        totalCompartilhamentos: Number(postCompart?.count ?? 0),
        totalVisualizacoes: Number(postViews?.count ?? 0),
        totalSalvos,
        salvoPorMim,
      };
    });

    return res.json(result);
  } catch (err) {
    req.log.error({ err }, "Erro ao buscar posts");
    return res.status(500).json({ error: "Erro ao buscar publicações" });
  }
});

// GET /api/comunidade/admin/comentarios — list all comments for admin moderation
router.get("/admin/comentarios", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select({
        id: comentariosComunidadeTable.id,
        publicacaoId: comentariosComunidadeTable.publicacaoId,
        conteudo: comentariosComunidadeTable.conteudo,
        criadoEm: comentariosComunidadeTable.criadoEm,
        autorId: comentariosComunidadeTable.autorId,
        autorNome: usuariosTable.nome,
        autorAdmin: usuariosTable.isAdmin,
        publicacaoTipo: comunidadeTable.tipo,
        publicacaoConteudo: comunidadeTable.conteudo,
        publicacaoAutorId: comunidadeTable.autorId,
      })
      .from(comentariosComunidadeTable)
      .innerJoin(comunidadeTable, eq(comunidadeTable.id, comentariosComunidadeTable.publicacaoId))
      .leftJoin(usuariosTable, eq(usuariosTable.id, comentariosComunidadeTable.autorId))
      .orderBy(desc(comentariosComunidadeTable.criadoEm));

    return res.json(
      rows.map((r) => ({
        id: r.id,
        publicacaoId: r.publicacaoId,
        conteudo: r.conteudo,
        criadoEm: r.criadoEm,
        autorId: r.autorId,
        autorNome: r.autorNome ?? "Usuário",
        autorAdmin: Boolean(r.autorAdmin),
        publicacaoTipo: r.publicacaoTipo,
        publicacaoConteudo: r.publicacaoConteudo ?? "",
        publicacaoAutorId: r.publicacaoAutorId,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Erro ao listar comentários admin");
    return res.status(500).json({ error: "Erro ao listar comentários" });
  }
});

// POST /api/comunidade — admin create post
router.post("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { tipo, conteudo, mediaUrl, notificar } = req.body as {
      tipo?: string; conteudo?: string; mediaUrl?: string; notificar?: boolean;
    };

    const texto = (conteudo ?? "").trim();
    const midia = (mediaUrl ?? "").trim();
    if (!texto && !midia) {
      return res.status(400).json({ error: "Inclua um texto ou uma mídia (imagem / link de vídeo)" });
    }
    const tiposValidos = ["texto", "imagem", "video"];
    if (tipo && !tiposValidos.includes(tipo)) {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const [post] = await db
      .insert(comunidadeTable)
      .values({
        autorId: req.user!.id,
        tipo: tipo || "texto",
        conteudo: texto || " ",
        mediaUrl: midia || null,
      })
      .returning();

    if (notificar) {
      const usuarios = await db
        .select({ id: usuariosTable.id })
        .from(usuariosTable)
        .where(and(eq(usuariosTable.isAdmin, false), eq(usuariosTable.ativo, true)));

      if (usuarios.length > 0) {
        const previewBase = texto || (midia ? "Nova publicação com mídia" : "Comunidade");
        const preview = previewBase.slice(0, 100) + (previewBase.length > 100 ? "..." : "");
        await db.insert(notificacoesTable).values(
          usuarios.map(u => ({
            usuarioId: u.id,
            titulo: "Nova publicação na Comunidade",
            mensagem: preview,
            tipo: "comunidade",
            link: "/comunidade",
          }))
        );
      }
    }

    return res.status(201).json(post);
  } catch (err) {
    req.log.error({ err }, "Erro ao criar post");
    return res.status(500).json({ error: "Erro ao criar publicação" });
  }
});

// DELETE /api/comunidade/:id — admin delete
router.delete("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
    await db.delete(comunidadeTable).where(eq(comunidadeTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Erro ao deletar post");
    return res.status(500).json({ error: "Erro ao deletar publicação" });
  }
});

// POST /api/comunidade/:id/reagir — toggle reaction
router.post("/:id/reagir", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const publicacaoId = parseInt(String(req.params.id), 10);
    if (isNaN(publicacaoId)) return res.status(400).json({ error: "ID inválido" });

    const { emoji } = req.body as { emoji?: string };
    const EMOJIS_VALIDOS = ["❤️", "🔥", "💫", "🙏", "✨"];
    if (!emoji || !EMOJIS_VALIDOS.includes(emoji)) {
      return res.status(400).json({ error: "Emoji inválido" });
    }

    const [post] = await db
      .select({ id: comunidadeTable.id })
      .from(comunidadeTable)
      .where(eq(comunidadeTable.id, publicacaoId))
      .limit(1);

    if (!post) return res.status(404).json({ error: "Publicação não encontrada" });

    const [existing] = await db
      .select()
      .from(reacoesTable)
      .where(and(
        eq(reacoesTable.publicacaoId, publicacaoId),
        eq(reacoesTable.usuarioId, req.user!.id),
        eq(reacoesTable.emoji, emoji),
      ))
      .limit(1);

    if (existing) {
      await db.delete(reacoesTable).where(eq(reacoesTable.id, existing.id));
      return res.json({ ativo: false, emoji });
    } else {
      await db.insert(reacoesTable).values({
        publicacaoId,
        usuarioId: req.user!.id,
        emoji,
      });
      return res.json({ ativo: true, emoji });
    }
  } catch (err) {
    req.log.error({ err }, "Erro ao reagir");
    return res.status(500).json({ error: "Erro ao processar reação" });
  }
});

// POST /api/comunidade/:id/comentarios — add comment
router.post("/:id/comentarios", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const publicacaoId = parseInt(String(req.params.id), 10);
    if (isNaN(publicacaoId)) return res.status(400).json({ error: "ID inválido" });
    const conteudo = String((req.body as { conteudo?: string })?.conteudo ?? "").trim();
    if (!conteudo) return res.status(400).json({ error: "Comentário vazio." });

    const [post] = await db
      .select({ id: comunidadeTable.id })
      .from(comunidadeTable)
      .where(eq(comunidadeTable.id, publicacaoId))
      .limit(1);
    if (!post) return res.status(404).json({ error: "Publicação não encontrada." });

    const [comentario] = await db
      .insert(comentariosComunidadeTable)
      .values({
        publicacaoId,
        autorId: req.user!.id,
        conteudo,
      })
      .returning();

    return res.status(201).json(comentario);
  } catch (err) {
    req.log.error({ err }, "Erro ao comentar");
    return res.status(500).json({ error: "Erro ao comentar publicação" });
  }
});

// POST /api/comunidade/:id/salvar — toggle save
router.post("/:id/salvar", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const publicacaoId = parseInt(String(req.params.id), 10);
    if (isNaN(publicacaoId)) return res.status(400).json({ error: "ID inválido" });

    const [existing] = await db
      .select()
      .from(salvosComunidadeTable)
      .where(and(
        eq(salvosComunidadeTable.publicacaoId, publicacaoId),
        eq(salvosComunidadeTable.usuarioId, req.user!.id),
      ))
      .limit(1);

    if (existing) {
      await db.delete(salvosComunidadeTable).where(eq(salvosComunidadeTable.id, existing.id));
      return res.json({ salvo: false });
    }
    await db.insert(salvosComunidadeTable).values({ publicacaoId, usuarioId: req.user!.id });
    return res.json({ salvo: true });
  } catch (err) {
    req.log.error({ err }, "Erro ao salvar publicação");
    return res.status(500).json({ error: "Erro ao salvar publicação" });
  }
});

// POST /api/comunidade/:id/compartilhar — register share click
router.post("/:id/compartilhar", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const publicacaoId = parseInt(String(req.params.id), 10);
    if (isNaN(publicacaoId)) return res.status(400).json({ error: "ID inválido" });
    await db.insert(compartilhamentosComunidadeTable).values({
      publicacaoId,
      usuarioId: req.user!.id,
    });
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Erro ao compartilhar publicação");
    return res.status(500).json({ error: "Erro ao compartilhar publicação" });
  }
});

// POST /api/comunidade/upload-url — get presigned upload URL for image
router.post("/upload-url", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    return res.json({ uploadURL, objectPath });
  } catch (err) {
    req.log.error({ err }, "Erro ao gerar URL de upload");
    return res.status(500).json({ error: "Erro ao gerar URL de upload" });
  }
});

// GET /api/comunidade/:id/imagem — stream image
router.get("/:id/imagem", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const [post] = await db
      .select({ mediaUrl: comunidadeTable.mediaUrl, tipo: comunidadeTable.tipo })
      .from(comunidadeTable)
      .where(eq(comunidadeTable.id, id))
      .limit(1);

    if (!post || post.tipo !== "imagem" || !post.mediaUrl) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    const file = await objectStorage.getObjectEntityFile(post.mediaUrl);
    const response = await objectStorage.downloadObject(file, 3600);
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "private, max-age=3600");
    return res.send(buffer);
  } catch (err) {
    req.log.error({ err }, "Erro ao carregar imagem");
    return res.status(500).json({ error: "Erro ao carregar imagem" });
  }
});

export default router;
