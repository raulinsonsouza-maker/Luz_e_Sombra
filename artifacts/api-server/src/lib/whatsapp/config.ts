export type WhatsAppConfig = {
  enabled: boolean;
  token: string;
  phoneNumberId: string;
  businessAccountId: string;
  appSecret: string;
  verifyToken: string;
  apiVersion: string;
  publicUrl: string;
  reminder2hHours: number;
  reminder24hHours: number;
  reminderCronIntervalMs: number;
  reminderCronEnabled: boolean;
};

function parseFloatEnv(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseIntEnv(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function getWhatsAppConfig(): WhatsAppConfig {
  const publicUrl = (process.env.APP_PUBLIC_URL ?? "https://portaliluminando.com.br").replace(
    /\/$/,
    "",
  );

  return {
    enabled: process.env.WHATSAPP_ENABLED === "true",
    token: process.env.WHATSAPP_TOKEN?.trim() ?? "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() ?? "",
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID?.trim() ?? "",
    appSecret: process.env.WHATSAPP_APP_SECRET?.trim() ?? "",
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN?.trim() ?? "",
    apiVersion: process.env.WHATSAPP_API_VERSION?.trim() || "v21.0",
    publicUrl,
    reminder2hHours: parseFloatEnv("WHATSAPP_REMINDER_2H_HOURS", 2),
    reminder24hHours: parseFloatEnv("WHATSAPP_REMINDER_24H_HOURS", 24),
    reminderCronIntervalMs: parseIntEnv("WHATSAPP_REMINDER_CRON_MS", 5 * 60 * 1000),
    reminderCronEnabled: process.env.WHATSAPP_REMINDER_CRON_ENABLED !== "false",
  };
}

export function isWhatsAppConfigured(): boolean {
  const cfg = getWhatsAppConfig();
  return (
    cfg.enabled &&
    cfg.token.length > 0 &&
    cfg.phoneNumberId.length > 0
  );
}
