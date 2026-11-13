import { Router, Response } from "express";
import { db } from "@workspace/db";
import {
  usuariosTable,
  comprasCaktoTable,
  comprasMpTable,
  webhookEventosCaktoTable,
  emailEnviosTable,
  gamificacaoTable,
} from "@workspace/db/schema";
import { computeAccessWindow, addMonths } from "../lib/acesso/periodo";
import { and, desc, eq, sql } from "drizzle-orm";
import { requireAdmin, AuthRequest } from "../lib/authMiddleware";
import { buildModulosJornadaLista } from "./modulosJornada";
import { temAnalise } from "../lib/temAnaliseJornada";
import { sendAccessGrantedEmail, sendAccessRevokedEmail } from "../lib/email";
import {
  sendPaymentPendingReminderEmail,
  sendJourneyNudgeEmail,
} from "../lib/email/retention";
import {
  isWhatsAppConfigured,
  notifyActiveSubscribersWhatsApp,
  type NotifyKind,
} from "../lib/whatsapp";

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

    const [compraMp] = await db
      .select({
        id: comprasMpTable.id,
        status: comprasMpTable.status,
        checkoutToken: comprasMpTable.checkoutToken,
        waWelcomeSentAt: comprasMpTable.waWelcomeSentAt,
        waPixPendingSentAt: comprasMpTable.waPixPendingSentAt,
        waReminder2hSentAt: comprasMpTable.waReminder2hSentAt,
        waReminder24hSentAt: comprasMpTable.waReminder24hSentAt,
        waAccessGrantedSentAt: comprasMpTable.waAccessGrantedSentAt,
      })
      .from(comprasMpTable)
      .where(eq(comprasMpTable.usuarioId, usuarioId))
      .orderBy(desc(comprasMpTable.criadoEm))
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
        telefone: usuario.telefone,
        whatsappOptOut: usuario.whatsappOptOut,
        criadoEm: usuario.criadoEm,
        primeiroAcesso: usuario.primeiroAcesso,
      },
      compra: compra ?? null,
      compraMp: compraMp ?? null,
      whatsapp: {
        configured: isWhatsAppConfigured(),
        optOut: usuario.whatsappOptOut,
        flags: compraMp
          ? {
              welcome: compraMp.waWelcomeSentAt,
              pixPending: compraMp.waPixPendingSentAt,
              reminder2h: compraMp.waReminder2hSentAt,
              reminder24h: compraMp.waReminder24hSentAt,
              accessGranted: compraMp.waAccessGrantedSentAt,
            }
          : null,
      },
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
    if (!Number.isFinite(usuarioId) || !["grant", "revoke", "extend"].includes(acao)) {
      return res.status(400).json({ error: "Parâmetros inválidos (acao: grant | revoke | extend)" });
    }

    const [usuario] = await db
      .select()
      .from(usuariosTable)
      .where(eq(usuariosTable.id, usuarioId))
      .limit(1);
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    if (acao === "grant") {
      const meses = Number(req.body?.meses);
      const withPrazo = Number.isFinite(meses) ? meses > 0 : true;
      const window = withPrazo
        ? computeAccessWindow(new Date())
        : { acessoInicio: null as Date | null, acessoAte: null as Date | null, garantiaAte: null as Date | null };

      if (withPrazo && Number.isFinite(meses) && meses !== 6) {
        window.acessoAte = addMonths(window.acessoInicio!, meses);
      }

      await db
        .update(usuariosTable)
        .set({
          ativo: true,
          statusAcesso: "active",
          acessoInicio: window.acessoInicio,
          acessoAte: window.acessoAte,
          garantiaAte: window.garantiaAte,
          atualizadoEm: new Date(),
        })
        .where(eq(usuariosTable.id, usuarioId));

      await db
        .update(comprasCaktoTable)
        .set({ status: "paid", pagoEm: new Date(), atualizadoEm: new Date() })
        .where(eq(comprasCaktoTable.usuarioId, usuarioId));

      await db
        .update(comprasMpTable)
        .set({
          status: "paid",
          pagoEm: new Date(),
          acessoInicio: window.acessoInicio ?? undefined,
          acessoAte: window.acessoAte ?? undefined,
          garantiaAte: window.garantiaAte ?? undefined,
          atualizadoEm: new Date(),
        })
        .where(eq(comprasMpTable.usuarioId, usuarioId));

      if (usuario.email) {
        sendAccessGrantedEmail(
          {
            usuarioId,
            nome: usuario.nome,
            email: usuario.email,
            acessoAte: window.acessoAte,
          },
          req.log,
        );
      }
    } else if (acao === "extend") {
      const meses = Number(req.body?.meses ?? 6);
      if (!Number.isFinite(meses) || meses <= 0) {
        return res.status(400).json({ error: "meses inválido" });
      }
      const base =
        usuario.acessoAte && usuario.acessoAte.getTime() > Date.now()
          ? usuario.acessoAte
          : new Date();
      const novoAte = addMonths(base, meses);
      await db
        .update(usuariosTable)
        .set({
          ativo: true,
          statusAcesso: "active",
          acessoAte: novoAte,
          atualizadoEm: new Date(),
        })
        .where(eq(usuariosTable.id, usuarioId));
    } else {
      await db
        .update(usuariosTable)
        .set({ ativo: false, statusAcesso: "revoked", atualizadoEm: new Date() })
        .where(eq(usuariosTable.id, usuarioId));

      await db
        .update(comprasCaktoTable)
        .set({ status: "refunded", atualizadoEm: new Date() })
        .where(eq(comprasCaktoTable.usuarioId, usuarioId));

      await db
        .update(comprasMpTable)
        .set({ status: "refunded", atualizadoEm: new Date() })
        .where(eq(comprasMpTable.usuarioId, usuarioId));

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

// POST /api/admin/whatsapp/notify — broadcast Marketing a assinantes ativos
router.post("/whatsapp/notify", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (!isWhatsAppConfigured()) {
      return res.status(503).json({ error: "WhatsApp Cloud API não configurada" });
    }

    const { kind, titulo, detalhe, link, usuarioId } = req.body as {
      kind?: NotifyKind;
      titulo?: string;
      detalhe?: string;
      link?: string;
      usuarioId?: number;
    };

    if (!kind || !["curso", "comunidade", "dia"].includes(kind)) {
      return res.status(400).json({ error: "kind deve ser curso | comunidade | dia" });
    }
    if (!titulo?.trim()) {
      return res.status(400).json({ error: "titulo obrigatório" });
    }

    const result = await notifyActiveSubscribersWhatsApp(
      {
        kind,
        titulo: titulo.trim(),
        detalhe,
        link,
        usuarioId: typeof usuarioId === "number" ? usuarioId : undefined,
      },
      req.log,
    );

    return res.json({ ok: true, ...result });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao enviar WhatsApp" });
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
