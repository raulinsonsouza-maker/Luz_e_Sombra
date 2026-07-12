export type KommoConfig = {
  enabled: boolean;
  subdomain: string;
  apiToken: string;
  publicUrl: string;
  pipelineId: number | null;
  statusNovoCadastro: number | null;
  statusPagamentoPendente: number | null;
  statusPago: number | null;
  statusPerdido: number | null;
  botWelcomeId: number | null;
  botPendingId: number | null;
  botPaidId: number | null;
  cfCheckoutUrl: number | null;
  cfLoginUrl: number | null;
  cfEmail: number | null;
  cfUsuarioId: number | null;
  /** Horas após entrar em pendente para lembrete 2h (padrão 2). */
  reminder2hHours: number;
  /** Horas após entrar em pendente para lembrete 24h (padrão 24). */
  reminder24hHours: number;
  /** Intervalo do cron de lembretes em ms (padrão 5 min). */
  reminderCronIntervalMs: number;
  reminderCronEnabled: boolean;
  /**
   * Dispara Salesbots via API.
   * WhatsApp Lite não suporta Digital Pipeline (is_work_with_dp=false) — com bot IDs configurados,
   * o padrão é true, salvo KOMMO_TRIGGER_BOTS=false explícito.
   */
  triggerBotsViaApi: boolean;
  /**
   * Modelo híbrido: boas-vindas via Salesbot (abre canal WPP), demais mensagens via Talks API.
   * Endpoint: POST /talks/{id}/send_message
   */
  useTalksApi: boolean;
  /** Boas-vindas pelo Digital Pipeline (Novo cadastro). API não dispara — evita duplicata. */
  welcomeViaDp: boolean;
};

function resolveTriggerBotsViaApi(
  botWelcomeId: number | null,
  botPendingId: number | null,
  botPaidId: number | null,
): boolean {
  const explicit = process.env.KOMMO_TRIGGER_BOTS?.trim();
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  return botWelcomeId !== null || botPendingId !== null || botPaidId !== null;
}

function parseIntEnv(name: string): number | null {
  const raw = process.env[name]?.trim();
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

function parseFloatEnv(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function getKommoConfig(): KommoConfig {
  const publicUrl = (process.env.APP_PUBLIC_URL ?? "https://portaliluminando.com.br").replace(
    /\/$/,
    "",
  );

  return {
    enabled: process.env.KOMMO_ENABLED === "true",
    subdomain: process.env.KOMMO_SUBDOMAIN?.trim() ?? "",
    apiToken: process.env.KOMMO_API_TOKEN?.trim() ?? "",
    publicUrl,
    pipelineId: parseIntEnv("KOMMO_PIPELINE_ID"),
    statusNovoCadastro: parseIntEnv("KOMMO_STATUS_NOVO_CADASTRO"),
    statusPagamentoPendente: parseIntEnv("KOMMO_STATUS_PAGAMENTO_PENDENTE"),
    statusPago: parseIntEnv("KOMMO_STATUS_PAGO"),
    statusPerdido: parseIntEnv("KOMMO_STATUS_PERDIDO"),
    botWelcomeId: parseIntEnv("KOMMO_BOT_WELCOME_ID"),
    botPendingId: parseIntEnv("KOMMO_BOT_PENDING_ID"),
    botPaidId: parseIntEnv("KOMMO_BOT_PAID_ID"),
    cfCheckoutUrl: parseIntEnv("KOMMO_CF_CHECKOUT_URL"),
    cfLoginUrl: parseIntEnv("KOMMO_CF_LOGIN_URL"),
    cfEmail: parseIntEnv("KOMMO_CF_EMAIL"),
    cfUsuarioId: parseIntEnv("KOMMO_CF_USUARIO_ID"),
    reminder2hHours: parseFloatEnv("KOMMO_REMINDER_2H_HOURS", 2),
    reminder24hHours: parseFloatEnv("KOMMO_REMINDER_24H_HOURS", 24),
    reminderCronIntervalMs: parseIntEnv("KOMMO_REMINDER_CRON_MS") ?? 5 * 60 * 1000,
    reminderCronEnabled: process.env.KOMMO_REMINDER_CRON_ENABLED !== "false",
    triggerBotsViaApi: resolveTriggerBotsViaApi(
      parseIntEnv("KOMMO_BOT_WELCOME_ID"),
      parseIntEnv("KOMMO_BOT_PENDING_ID"),
      parseIntEnv("KOMMO_BOT_PAID_ID"),
    ),
    useTalksApi: process.env.KOMMO_USE_TALKS_API !== "false",
    welcomeViaDp: process.env.KOMMO_WELCOME_VIA_DP !== "false",
  };
}

export function isKommoConfigured(): boolean {
  const cfg = getKommoConfig();
  return (
    cfg.enabled &&
    cfg.subdomain.length > 0 &&
    cfg.apiToken.length > 0 &&
    cfg.pipelineId !== null &&
    (cfg.statusPagamentoPendente !== null || cfg.statusNovoCadastro !== null)
  );
}

export function kommoLeadUrl(subdomain: string, leadId: number): string {
  return `https://${subdomain}.kommo.com/leads/detail/${leadId}`;
}
