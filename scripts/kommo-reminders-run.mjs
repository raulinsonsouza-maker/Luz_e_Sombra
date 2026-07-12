#!/usr/bin/env node
/**
 * Força execução do cron de lembretes PIX Kommo.
 * Uso: node scripts/kommo-reminders-run.mjs [--force]
 * --force: ignora delays 2h/24h (envia para todos pending elegíveis)
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");

function loadEnvFile(name) {
  const path = resolve(root, name);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    if (!process.env[k]) process.env[k] = t.slice(i + 1).trim();
  }
}

loadEnvFile(".env");
loadEnvFile(".env.kommo.local");

process.env.KOMMO_ENABLED = process.env.KOMMO_ENABLED ?? "true";
process.env.KOMMO_USE_TALKS_API = process.env.KOMMO_USE_TALKS_API ?? "true";

if (force) {
  process.env.KOMMO_REMINDER_2H_HOURS = "0";
  process.env.KOMMO_REMINDER_24H_HOURS = "0";
}

const { runKommoPixReminders, runKommoPixRemindersForced } = await import(
  "../artifacts/api-server/src/lib/kommo/reminders.ts"
);

const result = force ? await runKommoPixRemindersForced() : await runKommoPixReminders();
console.log("Lembretes enviados:", result);
