#!/usr/bin/env node
/**
 * Remove leads de teste da Kommo.
 * O token de integração não expõe DELETE (405) — arquiva via PATCH (perdido + is_deleted).
 * Uso: node scripts/kommo-purge-leads.mjs [--execute]
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvFile() {
  for (const name of [".env.kommo.local", ".kommo-vps.env"]) {
    const path = resolve(root, name);
    if (!existsSync(path)) continue;
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
}

loadEnvFile();

const subdomain = process.env.KOMMO_SUBDOMAIN?.trim();
const token = process.env.KOMMO_API_TOKEN?.trim();
const execute = process.argv.includes("--execute");
const statusPerdido = Number.parseInt(process.env.KOMMO_STATUS_PERDIDO ?? "143", 10);

if (!subdomain || !token) {
  console.error("Defina KOMMO_SUBDOMAIN e KOMMO_API_TOKEN");
  process.exit(1);
}

const base = `https://${subdomain}.kommo.com/api/v4`;
let lastAt = 0;

async function api(method, path, body) {
  const gap = Math.max(0, 150 - (Date.now() - lastAt));
  if (gap) await new Promise((r) => setTimeout(r, gap));
  lastAt = Date.now();

  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok && res.status !== 204) {
    throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : null;
}

async function listAllLeads() {
  const all = [];
  let path = "/leads?limit=250";
  while (path) {
    const data = await api("GET", path);
    all.push(...(data._embedded?.leads ?? []));
    const next = data._links?.next?.href;
    path = next ? next.replace(base, "") : null;
  }
  return all;
}

async function main() {
  const leads = await listAllLeads();
  console.log(execute ? "=== EXECUTE ===" : "=== DRY-RUN (use --execute) ===\n");
  console.log(`Leads ativos na conta: ${leads.length}`);
  for (const lead of leads) {
    console.log(`  [${lead.id}] ${lead.name} | pipeline ${lead.pipeline_id} | status ${lead.status_id}`);
  }

  if (!execute) {
    console.log("\nRode com --execute para arquivar (perdido + is_deleted).");
    return;
  }

  if (leads.length === 0) {
    console.log("\nNada a fazer.");
    return;
  }

  for (const lead of leads) {
    await api("PATCH", `/leads/${lead.id}`, {
      status_id: statusPerdido,
      is_deleted: true,
    });
    console.log(`  arquivado: [${lead.id}] ${lead.name}`);
  }

  console.log(`\n${leads.length} lead(s) arquivados. O Portal ignora leads em perdido/is_deleted em novos cadastros.`);
  console.log("Para remover do painel Kommo, apague manualmente (API não permite DELETE neste token).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
