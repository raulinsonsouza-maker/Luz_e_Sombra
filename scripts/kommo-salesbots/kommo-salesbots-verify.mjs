#!/usr/bin/env node
/**
 * Verifica se os 5 Salesbots PI existem na Kommo após importação.
 * Uso: node scripts/kommo-salesbots/kommo-salesbots-verify.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

const EXPECTED = [
  "PI - Boas-vindas",
  "PI - PIX pendente",
  ["PI - PIX lembrete 2h", "PI - PIX lembrete-2h"],
  ["PI - PIX lembrete 24h", "PI - PIX lembrete-24h"],
  ["PI - Acesso liberado", "PI - Acesso Liberado"],
];

function matchesExpected(botName, expected) {
  if (typeof expected === "string") return botName === expected;
  return expected.includes(botName);
}

function loadEnvFile() {
  const path = resolve(root, ".env.kommo.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvFile();

const subdomain = process.env.KOMMO_SUBDOMAIN?.trim();
const token = process.env.KOMMO_API_TOKEN?.trim();

if (!subdomain || !token) {
  console.error("Defina KOMMO_SUBDOMAIN e KOMMO_API_TOKEN (ou .env.kommo.local)");
  process.exit(1);
}

const base = `https://${subdomain}.kommo.com/api/v4`;

const res = await fetch(`${base}/bots`, {
  headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
});

if (!res.ok) {
  console.error("GET /bots falhou:", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
const bots = data._embedded?.items ?? [];
const piBots = bots.filter((b) => (b.name ?? "").startsWith("PI -"));

console.log("Salesbots PI na conta:\n");
for (const expected of EXPECTED) {
  const label = Array.isArray(expected) ? expected[0] : expected;
  const found = piBots.find((b) => matchesExpected(b.name, expected));
  if (found) {
    console.log(`  ✓ ${found.name} (id ${found.id})`);
  } else {
    console.log(`  ✗ ${label} — NÃO ENCONTRADO`);
  }
}

const missing = EXPECTED.filter(
  (expected) => !piBots.some((b) => matchesExpected(b.name, expected)),
);
if (missing.length) {
  console.log("\nImporte os JSONs em scripts/kommo-salesbots/ — veja README.md");
  process.exit(1);
}

console.log("\nTodos os 5 bots PI encontrados.");
console.log("\nSugestão .env VPS (atualize IDs após reimportar):");
for (const expected of EXPECTED) {
  const b = piBots.find((x) => matchesExpected(x.name, expected));
  if (!b) continue;
  const label = Array.isArray(expected) ? expected[0] : expected;
  const key =
    label === "PI - Boas-vindas"
      ? "KOMMO_BOT_WELCOME_ID"
      : label === "PI - PIX pendente"
        ? "KOMMO_BOT_PENDING_ID"
        : label.startsWith("PI - PIX lembrete 2h")
          ? "KOMMO_BOT_PENDING_2H_ID"
          : label.startsWith("PI - PIX lembrete 24h")
            ? "KOMMO_BOT_PENDING_24H_ID"
            : "KOMMO_BOT_PAID_ID";
  console.log(`${key}=${b.id}`);
}
