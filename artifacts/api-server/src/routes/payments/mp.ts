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
import {
  markImmediatePendingReminderSent,
  wasImmediatePendingReminderSent,
} from "../../lib/email/abandonedCheckoutReminders";
import { rateLimit } from "../../lib/security/rateLimit";
import {
  buildMpPaymentBody,
  sanitizeMpFormData,
  sanitizePaymentLog,
  stableIdempotencyKey,
  verifyMpWebhookSignature,
} from "../../lib/security/mpPaymentSanitize";

const router = Router();

const MP_WEBHOOK_SECRET = (process.env.MP_WEBHOOK_SECRET ?? "").trim();

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
router.post(
  "/process",
  rateLimit({
    name: "mp-process-ip",
    windowMs: 15 * 60 * 1000,
    max: 30,
  }),
  rateLimit({
    name: "mp-process-token",
    windowMs: 15 * 60 * 1000,
    max: 12,
    keyFrom: (req) => String(req.body?.checkoutToken ?? ""),
  }),
  async (req: Request, res: Response) => {
    try {
      const checkoutToken = String(req.body?.checkoutToken ?? "").trim();
      const formDataRaw = req.body?.formData ?? req.body?.payment ?? null;
      if (!checkoutToken) {
        return res.status(400).json({ error: "checkoutToken obrigatório" });
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

      if (!compra.email) {
        return res.status(400).json({ error: "Cadastro sem e-mail" });
      }

      const sanitized = sanitizeMpFormData(formDataRaw, compra.email);
      if (!sanitized.ok) {
        return res.status(400).json({ error: sanitized.error });
      }

      const { publicUrl } = getEmailConfig();
      const notificationUrl = `${publicUrl}/api/webhooks/mercadopago`;
      const paymentBody = buildMpPaymentBody({
        form: sanitized.data,
        checkoutToken,
        notificationUrl,
        payerEmail: compra.email,
      });

      const idempotencyKey = stableIdempotencyKey(
        checkoutToken,
        sanitized.data.payment_method_id,
        sanitized.data.token,
      );

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
        req.log?.error({ payment: sanitizePaymentLog(payment) }, "Falha ao criar pagamento MP");
        const message =
          typeof payment.message === "string"
            ? payment.message
            : "Não foi possível processar o pagamento";
        return res.status(400).json({ error: message });
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
        const already = await wasImmediatePendingReminderSent(checkoutToken);
        if (!already) {
          void sendPaymentPendingReminderEmail(
            {
              usuarioId: compra.usuarioId,
              nome: compra.nome,
              email: compra.email,
              checkoutToken,
            },
            req.log,
          ).then(() => markImmediatePendingReminderSent(checkoutToken));
        }
        const poi = (payment.point_of_interaction ?? null) as
          | { transaction_data?: { qr_code?: string; qr_code_base64?: string } }
          | null;
        const tx = poi?.transaction_data ?? {};
        return res.json({
          status: "pending",
          paymentId,
          statusDetail: payment.status_detail ?? null,
          pointOfInteraction: payment.point_of_interaction ?? null,
          pix: {
            qr_code: typeof tx.qr_code === "string" ? tx.qr_code : null,
            qr_code_base64: typeof tx.qr_code_base64 === "string" ? tx.qr_code_base64 : null,
          },
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
  },
);

export default router;

async function applyMpPaymentStatus(params: {
  payment: Record<string, unknown>;
  log?: Request["log"];
}): Promise<void> {
  const { payment } = params;
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
      log: params.log,
    });
    return;
  }

  if (status === "refunded" || status === "charged_back") {
    await revokeMpPurchase({
      checkoutToken,
      email,
      mpPaymentId: String(payment.id),
      log: params.log,
    });
  }
}

// Webhook separado
export async function handleMpWebhook(req: Request, res: Response) {
  try {
    const body = req.body ?? {};
    const queryId = String(req.query["data.id"] ?? req.query.id ?? "").trim();
    const type = String(req.query.type ?? body.type ?? body.topic ?? "payment").trim();
    const dataId = String(body?.data?.id ?? queryId ?? "").trim();

    if (MP_WEBHOOK_SECRET) {
      const ok = verifyMpWebhookSignature({
        xSignature: req.headers["x-signature"] as string | undefined,
        xRequestId: req.headers["x-request-id"] as string | undefined,
        dataId,
        secret: MP_WEBHOOK_SECRET,
      });
      if (!ok) {
        req.log?.warn("Webhook MP rejeitado: assinatura inválida");
        return res.status(401).json({ error: "Assinatura inválida" });
      }
    }

    const eventId =
      String(body.id ?? body.data?.id ?? `${type}-${dataId}`).trim() || `mp-${dataId || "unknown"}`;

    let isDuplicate = false;
    try {
      await db.insert(webhookEventosMpTable).values({
        eventId,
        eventType: type,
        payload: { id: dataId || null, type },
      });
    } catch {
      isDuplicate = true;
    }

    if (!dataId) {
      return res.status(200).json({ ok: true, duplicate: isDuplicate });
    }

    const accessToken = await refreshMpAccessTokenIfNeeded();
    if (!accessToken) {
      return res.status(200).json({ ok: true, skipped: "not_connected" });
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!mpRes.ok) {
      return res.status(200).json({ ok: true, skipped: "fetch_failed" });
    }

    const payment = (await mpRes.json()) as Record<string, unknown>;
    const checkoutToken =
      typeof payment.external_reference === "string" ? payment.external_reference : null;

    // Replay seguro: se evento duplicado mas compra ainda pending e payment approved, reativa.
    if (isDuplicate && checkoutToken && String(payment.status) === "approved") {
      const [compra] = await db
        .select({ status: comprasMpTable.status })
        .from(comprasMpTable)
        .where(eq(comprasMpTable.checkoutToken, checkoutToken))
        .limit(1);
      if (compra?.status === "pending") {
        await applyMpPaymentStatus({ payment, log: req.log });
        return res.status(200).json({ ok: true, reprocessed: true });
      }
      return res.status(200).json({ ok: true, duplicate: true });
    }

    if (isDuplicate) {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    await applyMpPaymentStatus({ payment, log: req.log });
    return res.status(200).json({ ok: true });
  } catch (error) {
    req.log?.error({ error }, "Erro no webhook Mercado Pago");
    return res.status(200).json({ ok: true });
  }
}
