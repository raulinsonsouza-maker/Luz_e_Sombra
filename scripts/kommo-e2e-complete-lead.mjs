#!/usr/bin/env node
/** Completa fluxo Kommo para lead existente: boas-vindas + PIX + opcional acesso */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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

const leadId = Number(process.argv[2] ?? "7043854");
const checkoutToken = process.argv[3] ?? "b7a7c131-b498-4de8-bc3f-f3a7e61496fa";
const nome = process.argv[4] ?? "Teste";
const skipWelcome = process.argv.includes("--skip-welcome");

const token = process.env.KOMMO_API_TOKEN;
const sub = process.env.KOMMO_SUBDOMAIN;
const base = `https://${sub}.kommo.com/api/v4`;
const h = { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" };
const publicUrl = process.env.APP_PUBLIC_URL ?? "https://portaliluminando.com.br";
const checkout = `${publicUrl}/checkout?token=${encodeURIComponent(checkoutToken)}`;

async function api(method, path, body) {
  const r = await fetch(`${base}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text();
  let json = null;
  if (text) try { json = JSON.parse(text); } catch { json = text; }
  return { status: r.status, json, text };
}

if (!skipWelcome) {
  const bot = await api("POST", `/bots/42662/run`, { entity_id: leadId, entity_type: "leads" });
  console.log("Boas-vindas bot:", bot.status, bot.text || bot.json);
}

let talkId = null;
for (let i = 1; i <= 8; i++) {
  await new Promise((r) => setTimeout(r, 4000));
  const talks = await api("GET", `/talks?filter[entity_id][]=${leadId}&filter[entity_type]=lead&limit=3`);
  talkId = talks.json?._embedded?.talks?.[0]?.talk_id ?? null;
  console.log(`Talk tentativa ${i}:`, talkId ?? talks.status, talks.text?.slice(0, 80) ?? "");
  if (talkId) break;
}

if (!talkId) {
  console.error("\nSem talk WPP. Vincule WhatsApp manualmente no contato do lead no Kommo.");
  process.exit(1);
}

const pix = `Oi, ${nome}!

Seu cadastro está confirmado — falta só o pagamento para liberar o acesso completo ao Portal Iluminando.

PIX ou cartão: aprovação na hora e você já entra na Jornada Da Sombra à Luz.

👇 Concluir pagamento agora:
${checkout}`;

const pixSend = await api("POST", `/talks/${talkId}/send_message`, { text: pix });
console.log("PIX Talks API:", pixSend.status, pixSend.text || pixSend.json);
console.log("\nLead:", `https://${sub}.kommo.com/leads/detail/${leadId}`);
