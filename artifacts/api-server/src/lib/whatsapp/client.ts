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

export async function sendWhatsAppTemplate(params: {
  to: string;
  template: WaTemplateName;
  bodyParams?: string[];
  log?: Logger;
}): Promise<{ messageId: string | null }> {
  if (!isWhatsAppConfigured()) {
    params.log?.debug("WhatsApp não configurado — envio ignorado");
    return { messageId: null };
  }

  const cfg = getWhatsAppConfig();
  const components =
    params.bodyParams && params.bodyParams.length > 0
      ? [
          {
            type: "body",
            parameters: params.bodyParams.map(
              (text): TemplateParam => ({ type: "text", text: text.slice(0, 1024) }),
            ),
          },
        ]
      : undefined;

  const url = `https://graph.facebook.com/${cfg.apiVersion}/${cfg.phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: params.to,
    type: "template",
    template: {
      name: params.template,
      language: { code: WA_TEMPLATE_LANG },
      ...(components ? { components } : {}),
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

export function verifyWhatsAppSignature(rawBody: Buffer, signatureHeader: string | undefined): boolean {
  const cfg = getWhatsAppConfig();
  if (!cfg.appSecret) {
    // Sem secret configurado, aceita (dev) — produção deve definir WHATSAPP_APP_SECRET.
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
