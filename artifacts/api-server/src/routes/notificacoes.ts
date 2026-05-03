import { Router, Response } from "express";
import { requireAuth, requireAdmin, AuthRequest } from "../lib/authMiddleware";
import { db } from "@workspace/db";
import { notificacoesTable, usuariosTable } from "@workspace/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

const router = Router();

// GET /api/notificacoes — list user's notifications
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const notifs = await db
      .select()
      .from(notificacoesTable)
      .where(eq(notificacoesTable.usuarioId, req.user!.id))
      .orderBy(desc(notificacoesTable.criadoEm))
      .limit(50);
    return res.json(notifs);
  } catch (err) {
    req.log.error({ err }, "Erro ao buscar notificações");
    return res.status(500).json({ error: "Erro ao buscar notificações" });
  }
});

// GET /api/notificacoes/nao-lidas-count — unread count
router.get("/nao-lidas-count", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(notificacoesTable)
      .where(and(
        eq(notificacoesTable.usuarioId, req.user!.id),
        eq(notificacoesTable.lida, false),
      ));
    return res.json({ count: result?.count ?? 0 });
  } catch (err) {
    req.log.error({ err }, "Erro ao contar notificações");
    return res.status(500).json({ error: "Erro" });
  }
});

// POST /api/notificacoes/marcar-lidas — mark all as read
router.post("/marcar-lidas", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await db
      .update(notificacoesTable)
      .set({ lida: true })
      .where(and(
        eq(notificacoesTable.usuarioId, req.user!.id),
        eq(notificacoesTable.lida, false),
      ));
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Erro ao marcar notificações");
    return res.status(500).json({ error: "Erro ao marcar como lidas" });
  }
});

// POST /api/notificacoes/enviar — admin sends notification
router.post("/enviar", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { titulo, mensagem, tipo = "geral", link, usuarioId } = req.body as {
      titulo?: string;
      mensagem?: string;
      tipo?: string;
      link?: string;
      usuarioId?: number;
    };

    if (!titulo?.trim() || !mensagem?.trim()) {
      return res.status(400).json({ error: "Título e mensagem são obrigatórios" });
    }

    if (usuarioId) {
      await db.insert(notificacoesTable).values({
        usuarioId,
        titulo: titulo.trim(),
        mensagem: mensagem.trim(),
        tipo,
        link: link?.trim() || null,
      });
      return res.json({ ok: true, enviadas: 1 });
    }

    const usuarios = await db
      .select({ id: usuariosTable.id })
      .from(usuariosTable)
      .where(and(
        eq(usuariosTable.isAdmin, false),
        eq(usuariosTable.ativo, true),
      ));

    if (usuarios.length === 0) return res.json({ ok: true, enviadas: 0 });

    await db.insert(notificacoesTable).values(
      usuarios.map(u => ({
        usuarioId: u.id,
        titulo: titulo.trim(),
        mensagem: mensagem.trim(),
        tipo,
        link: link?.trim() || null,
      }))
    );

    return res.json({ ok: true, enviadas: usuarios.length });
  } catch (err) {
    req.log.error({ err }, "Erro ao enviar notificação");
    return res.status(500).json({ error: "Erro ao enviar notificação" });
  }
});

export default router;
