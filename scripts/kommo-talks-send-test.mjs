#!/usr/bin/env node
/**
 * Testa envio WPP via Talks API (modelo híbrido).
 * Uso: node scripts/kommo-talks-send-test.mjs [leadId] [mensagem]
 *
 * Requer .env.kommo.local com KOMMO_API_TOKEN e KOMMO_SUBDOMAIN.
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const path = resolve(root, ".env.kommo.local");
  if (!existsSync(path)) throw new Error("Arquivo .env.kommo.local não encontrado");
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const env = loadEnv();
const token = env.KOMMO_API_TOKEN;
const subdomain = env.KOMMO_SUBDOMAIN ?? "leticiabemvideos";
if (!token) throw new Error("KOMMO_API_TOKEN ausente");

const leadId = Number(process.argv[2] ?? "7030880");
const text =
  process.argv[3] ??
  "Teste Portal Iluminando — envio direto via Talks API (sem bot). Se recebeu, o modelo híbrido funciona. Pode ignorar.";

const base = `https://${subdomain}.kommo.com/api/v4`;
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function api(method, path, body) {
  const r = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const raw = await r.text();
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    json = raw;
  }
  return { status: r.status, json };
}

console.log(`Lead: ${leadId}`);
console.log(`Subdomínio: ${subdomain}\n`);

const lead = await api("GET", `/leads/${leadId}?with=contacts`);
if (lead.status !== 200) {
  console.error("Lead não encontrado:", lead.json);
  process.exit(1);
}
const contactId = lead.json?._embedded?.contacts?.[0]?.id;
console.log("Contato:", contactId, "| Nome:", lead.json?.name);

let talks = await api("GET", `/talks?filter[entity_id][]=${leadId}&filter[entity_type]=lead&limit=5`);
let talk = talks.json?._embedded?.talks?.[0];

if (!talk && contactId) {
  talks = await api("GET", `/talks?filter[contact_id][]=${contactId}&limit=5`);
  talk = talks.json?._embedded?.talks?.[0];
}

if (!talk?.talk_id) {
  console.error("\nNenhum talk_id — canal WPP não aberto. Dispare boas-vindas primeiro.");
  process.exit(1);
}

console.log(`Talk: ${talk.talk_id} | origin: ${talk.origin} | status: ${talk.status}\n`);

const send = await api("POST", `/talks/${talk.talk_id}/send_message`, { text });
console.log("POST /talks/{id}/send_message →", send.status, send.json);

if (send.status < 200 || send.status >= 300) {
  process.exit(1);
}

const msgs = await api("GET", `/talks/${talk.talk_id}/messages?limit=3`);
const last = msgs.json?._embedded?.messages?.[0];
console.log("\nÚltima mensagem na conversa:");
console.log("  tipo:", last?.type, "| autor:", last?.author?.name);
console.log("  texto:", (last?.text ?? "").slice(0, 120));
console.log("\nOK — confirme recebimento no WhatsApp.");
