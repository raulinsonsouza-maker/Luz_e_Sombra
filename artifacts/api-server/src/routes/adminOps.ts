import { Router, Response } from "express";
import { db } from "@workspace/db";
import {
  usuariosTable,
  comprasCaktoTable,
  webhookEventosCaktoTable,
  emailEnviosTable,
  gamificacaoTable,
} from "@workspace/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { requireAdmin, AuthRequest } from "../lib/authMiddleware";
import { buildModulosJornadaLista } from "./modulosJornada";
import { temAnalise } from "../lib/temAnaliseJornada";
import { sendAccessGrantedEmail, sendAccessRevokedEmail } from "../lib/email";
import {
  sendPaymentPendingReminderEmail,
  sendJourneyNudgeEmail,
} from "../lib/email/retention";

const router = Router();

// GET /api/admin/compras
router.get("/compras", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select({
        id: comprasCaktoTable.id,
        usuarioId: comprasCaktoTable.usuarioId,
        checkoutToken: comprasCaktoTable.checkoutToken,
        caktoOrderId: comprasCaktoTable.caktoOrderId,
        valor: comprasCaktoTable.valor,
        metodoPagamento: comprasCaktoTable.metodoPagamento,
        status: comprasCaktoTable.status,
        variant: comprasCaktoTable.variant,
        utmSource: comprasCaktoTable.utmSource,
        utmMedium: comprasCaktoTable.utmMedium,
        utmCampaign: comprasCaktoTable.utmCampaign,
        criadoEm: comprasCaktoTable.criadoEm,
        pagoEm: comprasCaktoTable.pagoEm,
        nome: usuariosTable.nome,
        email: usuariosTable.email,
        statusAcesso: usuariosTable.statusAcesso,
        ativo: usuariosTable.ativo,
      })
      .from(comprasCaktoTable)
      .innerJoin(usuariosTable, eq(comprasCaktoTable.usuarioId, usuariosTable.id))
      .orderBy(desc(comprasCaktoTable.criadoEm))
      .limit(200);

    return res.json(rows);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao listar compras" });
  }
});

// GET /api/admin/webhooks
router.get("/webhooks", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(webhookEventosCaktoTable)
      .orderBy(desc(webhookEventosCaktoTable.processadoEm))
      .limit(100);
    return res.json(rows);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao listar webhooks" });
  }
});

// GET /api/admin/emails
router.get("/emails", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(emailEnviosTable)
      .orderBy(desc(emailEnviosTable.criadoEm))
      .limit(200);
    return res.json(rows);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao listar e-mails" });
  }
});

// GET /api/admin/funnel-stats
router.get("/funnel-stats", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const [totais] = await db
      .select({
        cadastros: sql<number>`count(*)::int`,
        pagos: sql<number>`sum(case when ${comprasCaktoTable.status} = 'paid' then 1 else 0 end)::int`,
        pendentes: sql<number>`sum(case when ${comprasCaktoTable.status} = 'pending' then 1 else 0 end)::int`,
        revogados: sql<number>`sum(case when ${comprasCaktoTable.status} = 'refunded' then 1 else 0 end)::int`,
      })
      .from(comprasCaktoTable);

    const utms = await db
      .select({
        utmSource: comprasCaktoTable.utmSource,
        total: sql<number>`count(*)::int`,
        pagos: sql<number>`sum(case when ${comprasCaktoTable.status} = 'paid' then 1 else 0 end)::int`,
      })
      .from(comprasCaktoTable)
      .groupBy(comprasCaktoTable.utmSource)
      .orderBy(desc(sql`count(*)`))
      .limit(20);

    const cadastros = totais?.cadastros ?? 0;
    const pagos = totais?.pagos ?? 0;

    return res.json({
      cadastros,
      pagos,
      pendentes: totais?.pendentes ?? 0,
      revogados: totais?.revogados ?? 0,
      taxaConversao: cadastros > 0 ? Math.round((pagos / cadastros) * 1000) / 10 : 0,
      utms: utms.map((u) => ({
        source: u.utmSource || "(direto)",
        total: u.total,
        pagos: u.pagos,
      })),
    });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar stats do funil" });
  }
});

// GET /api/admin/usuarios/:id/ficha
router.get("/usuarios/:id/ficha", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = parseInt(String(req.params.id), 10);
    if (!Number.isFinite(usuarioId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const [usuario] = await db
      .select()
      .from(usuariosTable)
      .where(eq(usuariosTable.id, usuarioId))
      .limit(1);
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    const [compra] = await db
      .select()
      .from(comprasCaktoTable)
      .where(eq(comprasCaktoTable.usuarioId, usuarioId))
      .limit(1);

    const [gam] = await db
      .select()
      .from(gamificacaoTable)
      .where(eq(gamificacaoTable.usuarioId, usuarioId))
      .limit(1);

    const modulos = await buildModulosJornadaLista(usuarioId);
    const analisesConcluidas = await Promise.all(
      modulos.map(async (m) => ({
        slug: m.slug,
        concluida: m.analiseConcluida,
        status: m.status,
      })),
    );

    const emails = await db
      .select()
      .from(emailEnviosTable)
      .where(eq(emailEnviosTable.usuarioId, usuarioId))
      .orderBy(desc(emailEnviosTable.criadoEm))
      .limit(30);

    const totalAnalises = analisesConcluidas.filter((a) => a.concluida).length;

    return res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        username: usuario.username,
        ativo: usuario.ativo,
        statusAcesso: usuario.statusAcesso,
        criadoEm: usuario.criadoEm,
        primeiroAcesso: usuario.primeiroAcesso,
      },
      compra: compra ?? null,
      gamificacao: gam
        ? { xp: gam.xp, nivel: gam.nivel, streakDias: gam.streakDias, ultimoAcessoEm: gam.ultimoAcessoEm }
        : null,
      jornada: {
        modulos: analisesConcluidas,
        totalAnalises,
      },
      emails,
    });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar ficha do usuário" });
  }
});

// POST /api/admin/usuarios/:id/acesso
router.post("/usuarios/:id/acesso", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = parseInt(String(req.params.id), 10);
    const acao = String(req.body?.acao ?? "").trim();
    if (!Number.isFinite(usuarioId) || !["grant", "revoke"].includes(acao)) {
      return res.status(400).json({ error: "Parâmetros inválidos (acao: grant | revoke)" });
    }

    const [usuario] = await db
      .select()
      .from(usuariosTable)
      .where(eq(usuariosTable.id, usuarioId))
      .limit(1);
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    if (acao === "grant") {
      await db
        .update(usuariosTable)
        .set({ ativo: true, statusAcesso: "active", atualizadoEm: new Date() })
        .where(eq(usuariosTable.id, usuarioId));

      await db
        .update(comprasCaktoTable)
        .set({ status: "paid", pagoEm: new Date(), atualizadoEm: new Date() })
        .where(eq(comprasCaktoTable.usuarioId, usuarioId));

      if (usuario.email) {
        sendAccessGrantedEmail(
          { usuarioId, nome: usuario.nome, email: usuario.email },
          req.log,
        );
      }
    } else {
      await db
        .update(usuariosTable)
        .set({ ativo: false, statusAcesso: "revoked", atualizadoEm: new Date() })
        .where(eq(usuariosTable.id, usuarioId));

      await db
        .update(comprasCaktoTable)
        .set({ status: "refunded", atualizadoEm: new Date() })
        .where(eq(comprasCaktoTable.usuarioId, usuarioId));

      if (usuario.email) {
        sendAccessRevokedEmail(
          { usuarioId, nome: usuario.nome, email: usuario.email },
          req.log,
        );
      }
    }

    return res.json({ ok: true, acao });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao atualizar acesso" });
  }
});

// POST /api/admin/emails/pix-reminder/:usuarioId
router.post("/emails/pix-reminder/:usuarioId", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = parseInt(String(req.params.usuarioId), 10);
    const [usuario] = await db
      .select()
      .from(usuariosTable)
      .where(eq(usuariosTable.id, usuarioId))
      .limit(1);
    if (!usuario?.email) return res.status(404).json({ error: "Usuário sem e-mail" });

    const [compra] = await db
      .select({ checkoutToken: comprasCaktoTable.checkoutToken, status: comprasCaktoTable.status })
      .from(comprasCaktoTable)
      .where(eq(comprasCaktoTable.usuarioId, usuarioId))
      .limit(1);
    if (!compra || compra.status !== "pending") {
      return res.status(400).json({ error: "Compra não está pendente" });
    }

    await sendPaymentPendingReminderEmail(
      {
        usuarioId,
        nome: usuario.nome,
        email: usuario.email,
        checkoutToken: compra.checkoutToken,
      },
      req.log,
    );

    return res.json({ ok: true });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao enviar lembrete PIX" });
  }
});

// POST /api/admin/emails/journey-nudge/:usuarioId
router.post("/emails/journey-nudge/:usuarioId", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = parseInt(String(req.params.usuarioId), 10);
    const [usuario] = await db
      .select()
      .from(usuariosTable)
      .where(eq(usuariosTable.id, usuarioId))
      .limit(1);
    if (!usuario?.email) return res.status(404).json({ error: "Usuário sem e-mail" });

    const temAlgumaAnalise = await temAnalise(usuarioId, "traco")
      || await temAnalise(usuarioId, "temperamento")
      || await temAnalise(usuarioId, "linguagens-amor")
      || await temAnalise(usuarioId, "roda")
      || await temAnalise(usuarioId, "numerologia");

    if (temAlgumaAnalise) {
      return res.status(400).json({ error: "Usuário já iniciou a jornada" });
    }

    const modulos = await buildModulosJornadaLista(usuarioId);
    const primeiro = modulos.find((m) => m.status === "active") ?? modulos[0];

    await sendJourneyNudgeEmail(
      {
        usuarioId,
        nome: usuario.nome,
        email: usuario.email,
        moduloTitulo: primeiro?.tituloIntro ?? "Traço de Caráter",
        jornadaUrl: `/jornada/${primeiro?.slug ?? "traco"}`,
      },
      req.log,
    );

    return res.json({ ok: true });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao enviar nudge de jornada" });
  }
});

export default router;
