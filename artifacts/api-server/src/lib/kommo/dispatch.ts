import type { Logger } from "pino";
import { runSalesbot } from "./bots";
import { KommoApiError } from "./client";
import { getKommoConfig } from "./config";
import { sendTalkMessage, sendTalkMessageToLead, findTalkForLead, waitForTalk } from "./talks";

async function safeRunBot(
  botId: number | null,
  leadId: number,
  log?: Logger,
): Promise<boolean> {
  if (!botId) return false;
  try {
    await runSalesbot(botId, leadId);
    log?.debug({ leadId, botId }, "Salesbot Kommo disparado");
    return true;
  } catch (error) {
    if (error instanceof KommoApiError && error.status === 400) {
      log?.warn({ leadId, botId, error: error.message }, "Salesbot Kommo não disparado (pode já estar ativo)");
      return false;
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

export async function sendKommoWelcome(
  params: {
    leadId: number;
    contactId?: number | null;
    text?: string;
    log?: Logger;
  },
): Promise<boolean> {
  const cfg = getKommoConfig();
  if (!cfg.triggerBotsViaApi) return false;

  const existingTalk = await findTalkForLead(params.leadId, params.contactId);
  if (existingTalk && params.text) {
    await sendTalkMessage(existingTalk.talk_id, params.text);
    params.log?.info(
      { leadId: params.leadId, talkId: existingTalk.talk_id },
      "Boas-vindas enviada via Talks API (canal WPP existente)",
    );
    return true;
  }

  const botRan = await safeRunBot(cfg.botWelcomeId, params.leadId, params.log);
  const talk = await waitForTalk(params.leadId, params.contactId, {
    attempts: 10,
    delayMs: 3000,
  });

  if (talk) {
    params.log?.info(
      { leadId: params.leadId, talkId: talk.talk_id, viaBot: botRan },
      "Canal WPP aberto — boas-vindas pelo Salesbot",
    );
    return true;
  }

  params.log?.warn(
    { leadId: params.leadId, contactId: params.contactId, viaBot: botRan },
    "Canal WPP não aberto — vincule WhatsApp no contato no Kommo",
  );
  return false;
}
