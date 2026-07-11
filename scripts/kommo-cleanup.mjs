#!/usr/bin/env node
/**
 * Remove pipelines de teste criados por scripts de debug na Kommo.
 * Uso:
 *   node scripts/kommo-cleanup.mjs           # dry-run (padrão)
 *   node scripts/kommo-cleanup.mjs --execute # apaga de verdade
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const KEEP_NAMES = new Set(["Funil de vendas", "Portal Iluminando"]);
const JUNK_PATTERNS = [/^col[a-f0-9]+$/i, /^PI test /i];

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
const execute = process.argv.includes("--execute");

if (!subdomain || !token) {
  console.error("Defina KOMMO_SUBDOMAIN e KOMMO_API_TOKEN (ou .env.kommo.local)");
  process.exit(1);
}

const base = `https://${subdomain}.kommo.com/api/v4`;
let lastAt = 0;

async function api(method, path, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const gap = Math.max(0, 150 - (Date.now() - lastAt));
    if (gap) await new Promise((r) => setTimeout(r, gap));
    lastAt = Date.now();

    try {
      const res = await fetch(`${base}${path}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`);
      }
      if (res.status === 204) return null;
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

function isJunk(name) {
  if (KEEP_NAMES.has(name)) return false;
  return JUNK_PATTERNS.some((p) => p.test(name));
}

async function main() {
  const data = await api("GET", "/leads/pipelines");
  const pipelines = data._embedded?.pipelines ?? [];

  const keep = pipelines.filter((p) => !isJunk(p.name));
  const junk = pipelines.filter((p) => isJunk(p.name));

  console.log(execute ? "=== EXECUTE ===" : "=== DRY-RUN (use --execute para apagar) ===\n");
  console.log("Manter:");
  for (const p of keep) console.log(`  [${p.id}] ${p.name}`);

  console.log("\nApagar:");
  if (junk.length === 0) {
    console.log("  (nenhum pipeline de teste encontrado)");
    return;
  }
  for (const p of junk) console.log(`  [${p.id}] ${p.name}`);

  if (!execute) {
    console.log(`\n${junk.length} pipeline(s) seriam apagados. Rode com --execute.`);
    return;
  }

  for (const p of junk) {
    await api("DELETE", `/leads/pipelines/${p.id}`);
    console.log(`  apagado: [${p.id}] ${p.name}`);
  }
  console.log(`\n${junk.length} pipeline(s) apagados.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
