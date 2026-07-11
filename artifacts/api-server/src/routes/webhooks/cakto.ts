import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import {
  usuariosTable,
  comprasCaktoTable,
  webhookEventosCaktoTable,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { sendAccessGrantedEmail, sendAccessRevokedEmail } from "../../lib/email";
import {
  syncKommoOnPaymentPaid,
  syncKommoOnAccessRevoked,
} from "../../lib/kommo";

const router = Router();

const WEBHOOK_SECRET = process.env.CAKTO_WEBHOOK_SECRET ?? "";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function pickString(obj: Record<string, unknown> | null, ...keys: string[]): string | null {
  if (!obj) return null;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return null;
}

function extractEventId(payload: Record<string, unknown>): string {
  const data = asRecord(payload.data);
  const fromData = pickString(data, "id", "order_id", "orderId");
  if (fromData) return fromData;
  return (
    pickString(payload, "id", "event_id", "eventId") ??
    `${pickString(payload, "event", "type", "custom_id") ?? "unknown"}-${Date.now()}`
  );
}

function extractEventType(payload: Record<string, unknown>): string {
  const direct = pickString(payload, "event", "type", "custom_id", "event_type");
  if (direct) return direct;
  const data = asRecord(payload.data);
  return pickString(data, "event", "type", "status") ?? "unknown";
}

function extractEmail(payload: Record<string, unknown>): string | null {
  const candidates = [
    payload,
    asRecord(payload.data),
    asRecord(payload.customer),
    asRecord(payload.buyer),
    asRecord(asRecord(payload.data)?.customer),
  ];
  for (const obj of candidates) {
    const email = pickString(obj, "email", "customer_email", "buyer_email");
    if (email) return email.toLowerCase();
  }
  return null;
}

function extractRef(payload: Record<string, unknown>): string | null {
  const candidates = [payload, asRecord(payload.data), asRecord(payload.metadata)];
  for (const obj of candidates) {
    const ref = pickString(obj, "ref", "refId", "checkout_token", "checkoutToken", "external_reference");
    if (ref) return ref;
  }
  return null;
}

function extractOrderId(payload: Record<string, unknown>): string | null {
  const candidates = [payload, asRecord(payload.data), asRecord(payload.order)];
  for (const obj of candidates) {
    const id = pickString(obj, "order_id", "orderId", "id", "transaction_id");
    if (id) return id;
  }
  return null;
}

function extractPaymentMethod(payload: Record<string, unknown>): string | null {
  const candidates = [payload, asRecord(payload.data), asRecord(payload.payment)];
  for (const obj of candidates) {
    const method = pickString(obj, "payment_method", "paymentMethod", "method");
    if (method) return method;
  }
  return null;
}

function verifyWebhookSecret(req: Request, payload: Record<string, unknown>): boolean {
  if (!WEBHOOK_SECRET) return true;
  const headerSecret =
    (req.headers["x-cakto-secret"] as string | undefined) ??
    (req.headers["x-webhook-secret"] as string | undefined);
  const bodySecret = pickString(payload, "secret");
  return headerSecret === WEBHOOK_SECRET || bodySecret === WEBHOOK_SECRET;
}

async function activatePurchase(params: {
  checkoutToken?: string | null;
  email?: string | null;
  orderId?: string | null;
  paymentMethod?: string | null;
}): Promise<number | null> {
  let compraId: number | null = null;
  let usuarioId: number | null = null;

  if (params.checkoutToken) {
    const [byToken] = await db
      .select({ id: comprasCaktoTable.id, usuarioId: comprasCaktoTable.usuarioId })
      .from(comprasCaktoTable)
      .where(eq(comprasCaktoTable.checkoutToken, params.checkoutToken))
      .limit(1);
    if (byToken) {
      compraId = byToken.id;
      usuarioId = byToken.usuarioId;
    }
  }

  if (!usuarioId && params.email) {
    const [user] = await db
      .select({ id: usuariosTable.id })
      .from(usuariosTable)
      .where(eq(usuariosTable.email, params.email))
      .limit(1);
    if (user) {
      usuarioId = user.id;
      const [compra] = await db
        .select({ id: comprasCaktoTable.id })
        .from(comprasCaktoTable)
        .where(eq(comprasCaktoTable.usuarioId, user.id))
        .limit(1);
      if (compra) compraId = compra.id;
    }
  }

  if (!usuarioId) return null;

  await db
    .update(usuariosTable)
    .set({ ativo: true, statusAcesso: "active", atualizadoEm: new Date() })
    .where(eq(usuariosTable.id, usuarioId));

  if (compraId) {
    await db
      .update(comprasCaktoTable)
      .set({
        status: "paid",
        caktoOrderId: params.orderId ?? undefined,
        metodoPagamento: params.paymentMethod ?? undefined,
        pagoEm: new Date(),
        atualizadoEm: new Date(),
      })
      .where(eq(comprasCaktoTable.id, compraId));
  }

  return usuarioId;
}

async function revokePurchase(params: {
  checkoutToken?: string | null;
  email?: string | null;
}): Promise<{ usuarioId: number; email: string | null; nome: string } | null> {
  let usuarioId: number | null = null;

  if (params.checkoutToken) {
    const [byToken] = await db
      .select({ usuarioId: comprasCaktoTable.usuarioId })
      .from(comprasCaktoTable)
      .where(eq(comprasCaktoTable.checkoutToken, params.checkoutToken))
      .limit(1);
    if (byToken) usuarioId = byToken.usuarioId;
  }

  if (!usuarioId && params.email) {
    const [user] = await db
      .select({ id: usuariosTable.id })
      .from(usuariosTable)
      .where(eq(usuariosTable.email, params.email))
      .limit(1);
    if (user) usuarioId = user.id;
  }

  if (!usuarioId) return null;

  const [usuario] = await db
    .select({ id: usuariosTable.id, email: usuariosTable.email, nome: usuariosTable.nome })
    .from(usuariosTable)
    .where(eq(usuariosTable.id, usuarioId))
    .limit(1);

  if (!usuario) return null;

  await db
    .update(usuariosTable)
    .set({ ativo: false, statusAcesso: "revoked", atualizadoEm: new Date() })
    .where(eq(usuariosTable.id, usuarioId));

  await db
    .update(comprasCaktoTable)
    .set({ status: "refunded", atualizadoEm: new Date() })
    .where(eq(comprasCaktoTable.usuarioId, usuarioId));

  return { usuarioId: usuario.id, email: usuario.email, nome: usuario.nome };
}

// POST /api/webhooks/cakto
router.post("/cakto", async (req: Request, res: Response) => {
  try {
    const payload = asRecord(req.body) ?? {};
    if (!verifyWebhookSecret(req, payload)) {
      return res.status(401).json({ error: "Webhook não autorizado" });
    }

    const eventId = extractEventId(payload);
    const eventType = extractEventType(payload);

    const [existing] = await db
      .select({ id: webhookEventosCaktoTable.id })
      .from(webhookEventosCaktoTable)
      .where(eq(webhookEventosCaktoTable.eventId, eventId))
      .limit(1);

    if (existing) {
      return res.json({ ok: true, duplicate: true });
    }

    await db.insert(webhookEventosCaktoTable).values({
      eventId,
      eventType,
      payload,
    });

    const email = extractEmail(payload);
    const ref = extractRef(payload);
    const orderId = extractOrderId(payload);
    const paymentMethod = extractPaymentMethod(payload);

    const normalizedType = eventType.toLowerCase();

    if (
      normalizedType.includes("purchase_approved") ||
      normalizedType.includes("approved") ||
      normalizedType === "paid"
    ) {
      const usuarioId = await activatePurchase({ checkoutToken: ref, email, orderId, paymentMethod });
      if (usuarioId) {
        const [usuario] = await db
          .select({
            id: usuariosTable.id,
            nome: usuariosTable.nome,
            email: usuariosTable.email,
            telefone: usuariosTable.telefone,
          })
          .from(usuariosTable)
          .where(eq(usuariosTable.id, usuarioId))
          .limit(1);
        if (usuario?.email) {
          sendAccessGrantedEmail(
            { usuarioId: usuario.id, nome: usuario.nome, email: usuario.email },
            req.log,
          );
          syncKommoOnPaymentPaid(
            {
              usuarioId: usuario.id,
              nome: usuario.nome,
              email: usuario.email,
              telefone: usuario.telefone,
              checkoutToken: ref ?? undefined,
            },
            req.log,
          );
        }
      }
    } else if (
      normalizedType.includes("refund") ||
      normalizedType.includes("chargeback")
    ) {
      const revoked = await revokePurchase({ checkoutToken: ref, email });
      if (revoked?.email) {
        sendAccessRevokedEmail(
          { usuarioId: revoked.usuarioId, nome: revoked.nome, email: revoked.email },
          req.log,
        );
        syncKommoOnAccessRevoked({ usuarioId: revoked.usuarioId }, req.log);
      }
    }

    return res.json({ ok: true });
  } catch (error) {
    req.log.error({ error }, "Erro no webhook Cakto");
    return res.status(500).json({ error: "Erro ao processar webhook" });
  }
});

export default router;
