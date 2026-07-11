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
  /** Dispara Salesbots via API (default false — WPP via Digital Pipeline no painel). */
  triggerBotsViaApi: boolean;
};

function parseIntEnv(name: string): number | null {
  const raw = process.env[name]?.trim();
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
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
    triggerBotsViaApi: process.env.KOMMO_TRIGGER_BOTS === "true",
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
