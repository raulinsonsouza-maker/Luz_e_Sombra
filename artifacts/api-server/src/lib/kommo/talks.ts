import type { Logger } from "pino";
import { kommoRequest } from "./client";

type KommoTalk = {
  talk_id: number;
  contact_id?: number;
  origin?: string;
  status?: string;
};

type KommoTalksResponse = {
  _embedded?: { talks?: KommoTalk[] };
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function findTalkByLeadId(leadId: number): Promise<KommoTalk | null> {
  const data = await kommoRequest<KommoTalksResponse>({
    path: `/talks?filter[entity_id][]=${leadId}&filter[entity_type]=lead&limit=5`,
  });
  return data._embedded?.talks?.[0] ?? null;
}

export async function findTalkByContactId(contactId: number): Promise<KommoTalk | null> {
  const data = await kommoRequest<KommoTalksResponse>({
    path: `/talks?filter[contact_id][]=${contactId}&limit=5`,
  });
  return data._embedded?.talks?.[0] ?? null;
}

export async function findTalkForLead(
  leadId: number,
  contactId?: number | null,
): Promise<KommoTalk | null> {
  const byLead = await findTalkByLeadId(leadId);
  if (byLead) return byLead;
  if (contactId) return findTalkByContactId(contactId);
  return null;
}

/**
 * Aguarda a conversa WPP ficar disponível após disparar o bot de boas-vindas.
 */
export async function waitForTalk(
  leadId: number,
  contactId?: number | null,
  options?: { attempts?: number; delayMs?: number },
): Promise<KommoTalk | null> {
  const attempts = options?.attempts ?? 5;
  const delayMs = options?.delayMs ?? 3000;

  for (let i = 0; i < attempts; i++) {
    const talk = await findTalkForLead(leadId, contactId);
    if (talk) return talk;
    if (i < attempts - 1) await sleep(delayMs);
  }
  return null;
}

/** Endpoint correto: send_message (underscore), não send-message. */
export async function sendTalkMessage(talkId: number, text: string): Promise<string> {
  const data = await kommoRequest<{ id?: string }>({
    method: "POST",
    path: `/talks/${talkId}/send_message`,
    body: { text },
  });
  return data.id ?? "";
}

export async function sendTalkMessageToLead(
  params: {
    leadId: number;
    contactId?: number | null;
    text: string;
    waitForTalk?: boolean;
    log?: Logger;
  },
): Promise<boolean> {
  const talk = params.waitForTalk
    ? await waitForTalk(params.leadId, params.contactId)
    : await findTalkForLead(params.leadId, params.contactId);

  if (!talk?.talk_id) {
    params.log?.warn(
      { leadId: params.leadId, contactId: params.contactId },
      "Talk Kommo não encontrado — mensagem WPP via Talks API ignorada",
    );
    return false;
  }

  const messageId = await sendTalkMessage(talk.talk_id, params.text);
  params.log?.debug(
    { leadId: params.leadId, talkId: talk.talk_id, messageId },
    "Mensagem WPP enviada via Talks API",
  );
  return true;
}
