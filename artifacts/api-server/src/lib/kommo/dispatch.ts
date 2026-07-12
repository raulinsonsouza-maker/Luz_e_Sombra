import type { Logger } from "pino";
import { runSalesbot } from "./bots";
import { KommoApiError } from "./client";
import { getKommoConfig } from "./config";
import { sendTalkMessageToLead } from "./talks";

async function safeRunBot(botId: number | null, leadId: number, log?: Logger): Promise<void> {
  if (!botId) return;
  try {
    await runSalesbot(botId, leadId);
  } catch (error) {
    if (error instanceof KommoApiError && error.status === 400) {
      log?.warn({ leadId, botId, error: error.message }, "Salesbot Kommo não disparado (pode já estar ativo)");
      return;
    }
    throw error;
  }
}

/**
 * Envia WPP via Talks API (texto dinâmico). Modelo novo: sem fallback para Salesbots legados.
 */
export async function sendKommoWhatsApp(
  params: {
    leadId: number;
    contactId?: number | null;
    text: string;
    waitForTalk?: boolean;
    log?: Logger;
  },
): Promise<boolean> {
  const cfg = getKommoConfig();
  if (!cfg.useTalksApi) {
    params.log?.warn({ leadId: params.leadId }, "KOMMO_USE_TALKS_API=false — mensagem WPP ignorada");
    return false;
  }

  return sendTalkMessageToLead({
    leadId: params.leadId,
    contactId: params.contactId,
    text: params.text,
    waitForTalk: params.waitForTalk,
    log: params.log,
  });
}

export async function sendKommoWelcome(leadId: number, log?: Logger): Promise<void> {
  const cfg = getKommoConfig();
  if (!cfg.triggerBotsViaApi) return;
  await safeRunBot(cfg.botWelcomeId, leadId, log);
}
