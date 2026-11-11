import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import {
  comprasMpTable,
  usuariosTable,
  webhookEventosMpTable,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import {
  activateMpPurchase,
  countFundadoresPaid,
  revokeMpPurchase,
} from "../../lib/acesso/activateMpPurchase";
import { FUNDADORES_CAP, PRECO_OFERTA_NUM } from "../../lib/acesso/periodo";
import {
  getConnectedMpIntegration,
  refreshMpAccessTokenIfNeeded,
} from "../../lib/mp/tokens";
import { getEmailConfig } from "../../lib/email/config";
import { sendPaymentPendingReminderEmail } from "../../lib/email/retention";

const router = Router();

// GET /api/payments/mp/public-config
router.get("/public-config", async (_req: Request, res: Response) => {
  try {
    const integration = await getConnectedMpIntegration();
    const publicKey =
      integration?.publicKey || process.env.MP_PUBLIC_KEY?.trim() || null;
    const fundadores = await countFundadoresPaid();
    return res.json({
      connected: Boolean(integration?.accessToken),
      publicKey,
      amount: PRECO_OFERTA_NUM,
      currency: "BRL",
      fundadoresRestantes: Math.max(0, FUNDADORES_CAP - fundadores),
      edicaoEspecialAtiva: fundadores < FUNDADORES_CAP,
      fundadoresCap: FUNDADORES_CAP,
    });
  } catch {
    return res.status(500).json({ error: "Erro ao carregar config de pagamento" });
  }
});

// POST /api/payments/mp/process
router.post("/process", async (req: Request, res: Response) => {
  try {
    const checkoutToken = String(req.body?.checkoutToken ?? "").trim();
    const formData = req.body?.formData ?? req.body?.payment ?? null;
    if (!checkoutToken) {
      return res.status(400).json({ error: "checkoutToken obrigatório" });
    }
    if (!formData || typeof formData !== "object") {
      return res.status(400).json({ error: "Dados do pagamento inválidos" });
    }

    const accessToken = await refreshMpAccessTokenIfNeeded();
    if (!accessToken) {
      return res.status(503).json({
        error: "Pagamento temporariamente indisponível. Tente novamente em instantes.",
        code: "mp_not_connected",
      });
    }

    const [compra] = await db
      .select({
        id: comprasMpTable.id,
        status: comprasMpTable.status,
        usuarioId: comprasMpTable.usuarioId,
        email: usuariosTable.email,
        nome: usuariosTable.nome,
        telefone: usuariosTable.telefone,
      })
      .from(comprasMpTable)
      .innerJoin(usuariosTable, eq(comprasMpTable.usuarioId, usuariosTable.id))
      .where(eq(comprasMpTable.checkoutToken, checkoutToken))
      .limit(1);

    if (!compra) {
      return res.status(404).json({ error: "Checkout não encontrado" });
    }

    if (compra.status === "paid") {
      return res.json({ status: "approved", alreadyPaid: true });
    }

    const { publicUrl } = getEmailConfig();
    const notificationUrl = `${publicUrl}/api/webhooks/mercadopago`;

    const paymentBody: Record<string, unknown> = {
      transaction_amount: PRECO_OFERTA_NUM,
      description: "Portal Iluminando · Jornada Da Sombra à Luz",
      external_reference: checkoutToken,
      notification_url: notificationUrl,
      payer: {
        email: compra.email,
        ...(formData.payer && typeof formData.payer === "object" ? formData.payer : {}),
      },
      ...formData,
      transaction_amount: PRECO_OFERTA_NUM,
      external_reference: checkoutToken,
      description: "Portal Iluminando · Jornada Da Sombra à Luz",
      notification_url: notificationUrl,
    };

    // Garante e-mail do cadastro
    const payer = (paymentBody.payer as Record<string, unknown>) || {};
    payer.email = compra.email;
    paymentBody.payer = payer;

    const idempotencyKey = `${checkoutToken}-${String(formData.payment_method_id ?? "pay")}-${Date.now()}`;

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(paymentBody),
    });

    const payment = (await mpRes.json()) as Record<string, unknown>;
    if (!mpRes.ok) {
      req.log?.error({ payment }, "Falha ao criar pagamento MP");
      const message =
        typeof payment.message === "string"
          ? payment.message
          : "Não foi possível processar o pagamento";
      return res.status(400).json({ error: message, details: payment });
    }

    const status = String(payment.status ?? "pending");
    const paymentId = payment.id != null ? String(payment.id) : null;
    const paymentMethod =
      typeof payment.payment_method_id === "string" ? payment.payment_method_id : null;

    await db
      .update(comprasMpTable)
      .set({
        mpPaymentId: paymentId ?? undefined,
        metodoPagamento: paymentMethod ?? undefined,
        atualizadoEm: new Date(),
      })
      .where(eq(comprasMpTable.id, compra.id));

    if (status === "approved") {
      await activateMpPurchase({
        checkoutToken,
        mpPaymentId: paymentId,
        paymentMethod,
        pagoEm: payment.date_approved
          ? new Date(String(payment.date_approved))
          : new Date(),
        log: req.log,
      });
      return res.json({
        status: "approved",
        paymentId,
        statusDetail: payment.status_detail ?? null,
      });
    }

    if (status === "pending" || status === "in_process") {
      if (compra.email) {
        void sendPaymentPendingReminderEmail(
          {
            usuarioId: compra.usuarioId,
            nome: compra.nome,
            email: compra.email,
            checkoutToken,
          },
          req.log,
        );
      }
      return res.json({
        status: "pending",
        paymentId,
        statusDetail: payment.status_detail ?? null,
        pointOfInteraction: payment.point_of_interaction ?? null,
      });
    }

    return res.json({
      status,
      paymentId,
      statusDetail: payment.status_detail ?? null,
      error: status === "rejected" ? "Pagamento recusado. Tente outro meio." : undefined,
    });
  } catch (error) {
    req.log?.error({ error }, "Erro ao processar pagamento MP");
    return res.status(500).json({ error: "Erro ao processar pagamento" });
  }
});

export default router;

// Webhook separado
export async function handleMpWebhook(req: Request, res: Response) {
  try {
    const body = req.body ?? {};
    const queryId = String(req.query["data.id"] ?? req.query.id ?? "").trim();
    const type = String(req.query.type ?? body.type ?? body.topic ?? "payment").trim();
    const dataId = String(body?.data?.id ?? queryId ?? "").trim();

    const eventId =
      String(body.id ?? body.data?.id ?? `${type}-${dataId}-${Date.now()}`).trim() ||
      `mp-${Date.now()}`;

    try {
      await db.insert(webhookEventosMpTable).values({
        eventId,
        eventType: type,
        payload: body,
      });
    } catch {
      // evento já processado
      return res.status(200).json({ ok: true, duplicate: true });
    }

    if (!dataId && type !== "payment") {
      return res.status(200).json({ ok: true });
    }

    const paymentId = dataId;
    if (!paymentId) return res.status(200).json({ ok: true });

    const accessToken = await refreshMpAccessTokenIfNeeded();
    if (!accessToken) {
      return res.status(200).json({ ok: true, skipped: "not_connected" });
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!mpRes.ok) {
      return res.status(200).json({ ok: true, skipped: "fetch_failed" });
    }

    const payment = (await mpRes.json()) as Record<string, unknown>;
    const status = String(payment.status ?? "");
    const checkoutToken =
      typeof payment.external_reference === "string" ? payment.external_reference : null;
    const paymentMethod =
      typeof payment.payment_method_id === "string" ? payment.payment_method_id : null;
    const email =
      typeof (payment.payer as { email?: string } | undefined)?.email === "string"
        ? (payment.payer as { email: string }).email
        : null;

    if (status === "approved") {
      await activateMpPurchase({
        checkoutToken,
        email,
        mpPaymentId: String(payment.id),
        paymentMethod,
        pagoEm: payment.date_approved
          ? new Date(String(payment.date_approved))
          : new Date(),
        log: req.log,
      });
    } else if (status === "refunded" || status === "charged_back" || status === "cancelled") {
      // Só revoga em refund/chargeback; cancelled de pending não revoga acesso ativo
      if (status === "refunded" || status === "charged_back") {
        await revokeMpPurchase({
          checkoutToken,
          email,
          mpPaymentId: String(payment.id),
          log: req.log,
        });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    req.log?.error({ error }, "Erro no webhook Mercado Pago");
    return res.status(200).json({ ok: true });
  }
}
