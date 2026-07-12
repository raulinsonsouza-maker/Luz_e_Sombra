#!/usr/bin/env node
/**
 * Envia todas as mensagens do modelo novo via Talks API (teste visual no WPP).
 * Uso: node --import tsx scripts/kommo-e2e-messages-test.mjs [leadId] [nome]
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  for (const f of [".env.kommo.local", ".env"]) {
    const p = resolve(root, f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      if (!process.env[k]) process.env[k] = t.slice(i + 1).trim();
    }
  }
}

loadEnv();
process.env.APP_PUBLIC_URL = process.env.APP_PUBLIC_URL ?? "https://portaliluminando.com.br";

const leadId = Number(process.argv[2] ?? "7030880");
const nome = process.argv[3] ?? "Raul Teste WPP";

const {
  buildPixPendenteMessage,
  buildPixLembrete2hMessage,
  buildPixLembrete24hMessage,
  buildAcessoLiberadoMessage,
} = await import("../artifacts/api-server/src/lib/kommo/messages.ts");
const { findTalkForLead, sendTalkMessage } = await import("../artifacts/api-server/src/lib/kommo/talks.ts");
const { kommoRequest } = await import("../artifacts/api-server/src/lib/kommo/client.ts");

process.env.KOMMO_ENABLED = "true";
process.env.KOMMO_SUBDOMAIN = process.env.KOMMO_SUBDOMAIN ?? "leticiabemvideos";

const lead = await kommoRequest({ path: `/leads/${leadId}?with=contacts` });
const contactId = lead._embedded?.contacts?.[0]?.id;
const talk = await findTalkForLead(leadId, contactId);
if (!talk?.talk_id) {
  console.error("Sem talk_id — vincule WPP ou dispare boas-vindas primeiro");
  process.exit(1);
}

const checkoutUrl = `${process.env.APP_PUBLIC_URL}/checkout?token=teste-e2e`;
const loginUrl = `${process.env.APP_PUBLIC_URL}/login`;
const ctx = { nome, checkoutUrl, loginUrl, email: "teste@example.com" };

const messages = [
  ["PIX pendente", buildPixPendenteMessage(ctx)],
  ["Lembrete 2h", buildPixLembrete2hMessage(ctx)],
  ["Lembrete 24h", buildPixLembrete24hMessage(ctx)],
  ["Acesso liberado", buildAcessoLiberadoMessage(ctx)],
];

console.log(`Lead ${leadId} | talk ${talk.talk_id}\n`);

for (const [label, text] of messages) {
  const id = await sendTalkMessage(talk.talk_id, `[TESTE ${label}]\n\n${text}`);
  console.log(`OK ${label} → message id ${id}`);
  await new Promise((r) => setTimeout(r, 2000));
}

console.log("\nConfira 4 mensagens no WhatsApp.");
