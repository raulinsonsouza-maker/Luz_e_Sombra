import { createHmac, timingSafeEqual } from "node:crypto";
import { PRECO_OFERTA_NUM } from "../acesso/periodo";

const MAX_INSTALLMENTS = 6;

export type SanitizedMpForm = {
  payment_method_id?: string;
  token?: string;
  installments?: number;
  payer?: {
    email?: string;
    identification?: { type?: string; number?: string };
  };
};

export function sanitizeMpFormData(
  raw: unknown,
  payerEmail: string,
): { ok: true; data: SanitizedMpForm } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Dados do pagamento inválidos" };
  }
  const src = raw as Record<string, unknown>;
  const out: SanitizedMpForm = {};

  if (typeof src.payment_method_id === "string" && src.payment_method_id.trim()) {
    out.payment_method_id = src.payment_method_id.trim();
  }
  if (typeof src.token === "string" && src.token.trim()) {
    out.token = src.token.trim();
  }

  if (src.installments != null) {
    const n = Number(src.installments);
    if (!Number.isInteger(n) || n < 1 || n > MAX_INSTALLMENTS) {
      return { ok: false, error: `Parcelas devem ser entre 1 e ${MAX_INSTALLMENTS}` };
    }
    out.installments = n;
  }

  const payerRaw =
    src.payer && typeof src.payer === "object" && !Array.isArray(src.payer)
      ? (src.payer as Record<string, unknown>)
      : {};
  const identificationRaw =
    payerRaw.identification &&
    typeof payerRaw.identification === "object" &&
    !Array.isArray(payerRaw.identification)
      ? (payerRaw.identification as Record<string, unknown>)
      : null;

  out.payer = { email: payerEmail };
  if (identificationRaw) {
    const type =
      typeof identificationRaw.type === "string" ? identificationRaw.type.trim() : undefined;
    const number =
      typeof identificationRaw.number === "string"
        ? identificationRaw.number.replace(/\D/g, "")
        : undefined;
    if (type || number) {
      out.payer.identification = { type, number };
    }
  }

  if (out.payment_method_id === "pix") {
    // PIX não usa token de cartão
  } else if (!out.token && out.payment_method_id !== "pix") {
    return { ok: false, error: "Token do cartão ou Pix obrigatório" };
  }

  if (!out.payment_method_id && !out.token) {
    return { ok: false, error: "Informe o meio de pagamento" };
  }

  return { ok: true, data: out };
}

export function buildMpPaymentBody(params: {
  form: SanitizedMpForm;
  checkoutToken: string;
  notificationUrl: string;
  payerEmail: string;
}): Record<string, unknown> {
  const body: Record<string, unknown> = {
    transaction_amount: PRECO_OFERTA_NUM,
    description: "Portal Iluminando · Jornada Da Sombra à Luz",
    external_reference: params.checkoutToken,
    notification_url: params.notificationUrl,
    payment_method_id: params.form.payment_method_id,
    payer: {
      email: params.payerEmail,
      ...(params.form.payer?.identification
        ? { identification: params.form.payer.identification }
        : {}),
    },
  };
  if (params.form.token) body.token = params.form.token;
  if (params.form.installments) body.installments = params.form.installments;
  return body;
}

/** Remove campos sensíveis de payloads para log. */
export function sanitizePaymentLog(payment: Record<string, unknown>): Record<string, unknown> {
  const clone = { ...payment };
  for (const key of Object.keys(clone)) {
    const lower = key.toLowerCase();
    if (
      lower.includes("card") ||
      lower.includes("cvv") ||
      lower.includes("security") ||
      lower === "token" ||
      lower.includes("pan")
    ) {
      clone[key] = "[redacted]";
    }
  }
  return clone;
}

/**
 * Valida x-signature do webhook MP quando MP_WEBHOOK_SECRET está definido.
 * Formato: ts=...,v1=...
 */
export function verifyMpWebhookSignature(params: {
  xSignature: string | undefined;
  xRequestId: string | undefined;
  dataId: string;
  secret: string;
}): boolean {
  const { xSignature, xRequestId, dataId, secret } = params;
  if (!secret) return true; // sem secret configurado: não bloqueia (re-fetch ainda protege)
  if (!xSignature || !xRequestId || !dataId) return false;

  const parts = Object.fromEntries(
    xSignature.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k?.trim(), v?.trim()];
    }),
  ) as Record<string, string | undefined>;

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(v1, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function stableIdempotencyKey(
  checkoutToken: string,
  paymentMethodId: string | undefined,
  token: string | undefined,
): string {
  const method = paymentMethodId || "pay";
  const tokenPart = token ? token.slice(0, 12) : "notoken";
  // Estável por tentativa lógica (mesmo cartão tokenizado / mesmo pix) — sem Date.now().
  return `${checkoutToken}-${method}-${tokenPart}`;
}
