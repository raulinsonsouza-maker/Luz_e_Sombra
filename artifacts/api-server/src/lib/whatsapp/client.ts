import { createHmac, timingSafeEqual } from "node:crypto";
import type { Logger } from "pino";
import { getWhatsAppConfig, isWhatsAppConfigured } from "./config";
import { WA_TEMPLATE_LANG, type WaTemplateName } from "./templates";

export class WhatsAppApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "WhatsAppApiError";
  }
}

export type TemplateParam = { type: "text"; text: string };

export type UrlButtonParam = { index: number; suffix: string };
export type PaymentRequestPixParam = { index: number; pixCode: string };

export async function sendWhatsAppTemplate(params: {
  to: string;
  template: WaTemplateName;
  bodyParams?: string[];
  urlButtons?: UrlButtonParam[];
  paymentRequestPix?: PaymentRequestPixParam;
  log?: Logger;
}): Promise<{ messageId: string | null }> {
  if (!isWhatsAppConfigured()) {
    params.log?.debug("WhatsApp nao configurado — envio ignorado");
    return { messageId: null };
  }

  const cfg = getWhatsAppConfig();
  const components: Array<Record<string, unknown>> = [];

  if (params.bodyParams && params.bodyParams.length > 0) {
    components.push({
      type: "body",
      parameters: params.bodyParams.map(
        (text): TemplateParam => ({ type: "text", text: text.slice(0, 1024) }),
      ),
    });
  }

  for (const btn of params.urlButtons ?? []) {
    components.push({
      type: "button",
      sub_type: "url",
      index: String(btn.index),
      parameters: [{ type: "text", text: btn.suffix.slice(0, 2000) }],
    });
  }

  if (params.paymentRequestPix?.pixCode) {
    components.push({
      type: "button",
      sub_type: "payment_request",
      index: String(params.paymentRequestPix.index),
      parameters: [
        {
          type: "action",
          action: {
            payment_request: {
              payment_setting: {
                type: "pix_dynamic_code",
                pix_dynamic_code: {
                  code: params.paymentRequestPix.pixCode,
                },
              },
            },
          },
        },
      ],
    });
  }

  const url = `https://graph.facebook.com/${cfg.apiVersion}/${cfg.phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: params.to,
    type: "template",
    template: {
      name: params.template,
      language: { code: WA_TEMPLATE_LANG },
      ...(components.length > 0 ? { components } : {}),
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = (await res.json().catch(() => null)) as
    | { messages?: Array<{ id?: string }>; error?: { message?: string; code?: number } }
    | null;

  if (!res.ok) {
    const msg = body?.error?.message ?? `WhatsApp API HTTP ${res.status}`;
    params.log?.error(
      { status: res.status, err: body?.error, template: params.template, to: params.to },
      "Falha envio template WhatsApp",
    );
    throw new WhatsAppApiError(msg, res.status, body);
  }

  const messageId = body?.messages?.[0]?.id ?? null;
  params.log?.info(
    { messageId, template: params.template, to: params.to },
    "Template WhatsApp enviado",
  );
  return { messageId };
}

export async function sendWhatsAppText(params: {
  to: string;
  text: string;
  log?: Logger;
}): Promise<{ messageId: string | null }> {
  if (!isWhatsAppConfigured()) {
    return { messageId: null };
  }

  const cfg = getWhatsAppConfig();
  const url = `https://graph.facebook.com/${cfg.apiVersion}/${cfg.phoneNumberId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: params.to,
      type: "text",
      text: { body: params.text.slice(0, 4096) },
    }),
  });

  const body = (await res.json().catch(() => null)) as
    | { messages?: Array<{ id?: string }>; error?: { message?: string } }
    | null;

  if (!res.ok) {
    throw new WhatsAppApiError(body?.error?.message ?? `WhatsApp API HTTP ${res.status}`, res.status, body);
  }

  return { messageId: body?.messages?.[0]?.id ?? null };
}

/** Card nativo Copiar Pix (Payments BR) — requer elegibilidade na WABA. */
export async function sendWhatsAppPixOrderDetails(params: {
  to: string;
  referenceId: string;
  pixCode: string;
  amountBrl: number;
  bodyText: string;
  log?: Logger;
}): Promise<{ messageId: string | null; ok: boolean }> {
  if (!isWhatsAppConfigured()) {
    return { messageId: null, ok: false };
  }

  const cfg = getWhatsAppConfig();
  if (!cfg.pixKey) {
    params.log?.debug("WHATSAPP_PIX_KEY ausente — order_details Pix ignorado");
    return { messageId: null, ok: false };
  }

  const cents = Math.round(params.amountBrl * 100);
  const url = `https://graph.facebook.com/${cfg.apiVersion}/${cfg.phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: params.to,
    type: "interactive",
    interactive: {
      type: "order_details",
      body: { text: params.bodyText.slice(0, 1024) },
      action: {
        name: "review_and_pay",
        parameters: {
          reference_id: params.referenceId.slice(0, 60),
          type: "digital-goods",
          payment_type: "br",
          payment_settings: [
            {
              type: "pix_dynamic_code",
              pix_dynamic_code: {
                code: params.pixCode,
                merchant_name: cfg.pixMerchantName.slice(0, 60),
                key: cfg.pixKey,
                key_type: cfg.pixKeyType,
              },
            },
          ],
          currency: "BRL",
          total_amount: { value: cents, offset: 100 },
        },
      },
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = (await res.json().catch(() => null)) as
    | { messages?: Array<{ id?: string }>; error?: { message?: string } }
    | null;

  if (!res.ok) {
    params.log?.warn(
      { err: body?.error, to: params.to },
      "order_details Pix nao enviado — usar fallback",
    );
    return { messageId: null, ok: false };
  }

  return { messageId: body?.messages?.[0]?.id ?? null, ok: true };
}

export function verifyWhatsAppSignature(rawBody: Buffer, signatureHeader: string | undefined): boolean {
  const cfg = getWhatsAppConfig();
  if (!cfg.appSecret) {
    return process.env.NODE_ENV !== "production";
  }
  if (!signatureHeader?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", cfg.appSecret).update(rawBody).digest("hex");
  const received = signatureHeader.slice("sha256=".length);
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(received, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
