#!/usr/bin/env node
/**
 * Configura pipeline + campos custom na Kommo e imprime bloco .env.
 * Uso: KOMMO_SUBDOMAIN=xxx KOMMO_API_TOKEN=xxx node scripts/kommo-setup.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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
  console.error("Defina KOMMO_SUBDOMAIN e KOMMO_API_TOKEN (ou .env.kommo.local na raiz)");
  process.exit(1);
}

const base = `https://${subdomain}.kommo.com/api/v4`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastAt = 0;

async function api(method, path, body) {
  const gap = Math.max(0, 150 - (Date.now() - lastAt));
  if (gap) await sleep(gap);
  lastAt = Date.now();

  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 400)}`);
  }
  return data;
}

const PIPELINE_NAME = "Portal Iluminando";
const STAGES = [
  { name: "Novo cadastro", sort: 20, color: "#d6eaff" },
  { name: "Pagamento pendente", sort: 30, color: "#fffd7f" },
  { name: "Pago / Acesso liberado", sort: 40, color: "#87f2c0" },
];

const WON_STATUS_NAMES = ["Fechado - ganho", "Closed - won"];
const LOST_STATUS_NAMES = ["Fechado - perdido", "Closed - lost"];

function findStageId(stages, names) {
  for (const name of names) {
    if (stages[name]) return stages[name];
  }
  return "";
}

const CUSTOM_FIELDS = [
  { name: "CHECKOUT_URL", type: "url", code: "CHECKOUT_URL" },
  { name: "LOGIN_URL", type: "url", code: "LOGIN_URL" },
  { name: "EMAIL_CADASTRO", type: "text", code: "EMAIL_CADASTRO" },
  { name: "USUARIO_ID", type: "numeric", code: "USUARIO_ID" },
];

function findPipeline(pipelines) {
  return pipelines.find((p) => p.name === PIPELINE_NAME);
}

function stageMap(pipeline) {
  const map = {};
  for (const s of pipeline._embedded?.statuses ?? []) {
    map[s.name] = s.id;
  }
  return map;
}

async function ensurePipeline() {
  const data = await api("GET", "/leads/pipelines");
  const pipelines = data._embedded?.pipelines ?? [];
  let pipeline = findPipeline(pipelines);

  if (!pipeline) {
    const created = await api("POST", "/leads/pipelines", [
      {
        name: PIPELINE_NAME,
        sort: pipelines.length + 1,
        is_main: false,
        is_unsorted_on: true,
        _embedded: { statuses: STAGES },
      },
    ]);
    pipeline = created._embedded?.pipelines?.[0];
    console.log("Pipeline criado:", PIPELINE_NAME, "id=", pipeline?.id);
    const refreshed = await api("GET", `/leads/pipelines/${pipeline.id}`);
    pipeline = refreshed;
  } else {
    console.log("Pipeline existente:", PIPELINE_NAME, "id=", pipeline.id);
    const existing = stageMap(pipeline);
    for (const stage of STAGES) {
      if (!existing[stage.name]) {
        console.warn("Etapa ausente no pipeline — crie manualmente na Kommo:", stage.name);
      }
    }
  }

  return pipeline;
}

async function ensureCustomFields() {
  const data = await api("GET", "/leads/custom_fields");
  const fields = data._embedded?.custom_fields ?? [];
  const byName = Object.fromEntries(fields.map((f) => [f.name, f]));

  const ids = {};
  for (const spec of CUSTOM_FIELDS) {
    if (byName[spec.name]) {
      ids[spec.code] = byName[spec.name].id;
      console.log("Campo existente:", spec.name, "id=", byName[spec.name].id);
      continue;
    }
    const created = await api("POST", "/leads/custom_fields", [
      {
        name: spec.name,
        type: spec.type,
        sort: fields.length + 1,
      },
    ]);
    const field = created._embedded?.custom_fields?.[0];
    ids[spec.code] = field?.id;
    console.log("Campo criado:", spec.name, "id=", field?.id);
  }
  return ids;
}

async function listBots() {
  try {
    const data = await api("GET", "/bots");
    const bots = data._embedded?.items ?? data._embedded?.bots ?? [];
    console.log("\nSalesbots na conta (API lista; criação só no painel):");
    for (const b of bots) {
      console.log(`  - id=${b.id} name="${b.name}" type=${b.type_functionality ?? "?"}`);
    }
    return bots;
  } catch (e) {
    console.warn("Não foi possível listar bots via API:", e.message);
    return [];
  }
}

async function main() {
  const account = await api("GET", "/account");
  console.log("Conta Kommo:", account.name ?? account.id ?? "OK");

  const pipeline = await ensurePipeline();
  const stages = stageMap(pipeline);
  const cf = await ensureCustomFields();
  const bots = await listBots();

  const pickBot = (keywords) =>
    bots.find((b) => keywords.some((k) => (b.name ?? "").toLowerCase().includes(k)))?.id ?? "";

  const env = {
    KOMMO_ENABLED: "true",
    KOMMO_SUBDOMAIN: subdomain,
    KOMMO_PIPELINE_ID: String(pipeline.id),
    KOMMO_STATUS_NOVO_CADASTRO: String(stages["Novo cadastro"] ?? ""),
    KOMMO_STATUS_PAGAMENTO_PENDENTE: String(stages["Pagamento pendente"] ?? ""),
    KOMMO_STATUS_PAGO: String(stages["Pago / Acesso liberado"] ?? findStageId(stages, WON_STATUS_NAMES) ?? ""),
    KOMMO_STATUS_PERDIDO: String(findStageId(stages, LOST_STATUS_NAMES) ?? ""),
    KOMMO_BOT_WELCOME_ID: String(pickBot(["boas-vindas", "welcome", "cadastro"]) || ""),
    KOMMO_BOT_PENDING_ID: String(pickBot(["pendente", "pix", "pending"]) || ""),
    KOMMO_BOT_PAID_ID: String(pickBot(["acesso", "pago", "paid", "liberado"]) || ""),
    KOMMO_CF_CHECKOUT_URL: String(cf.CHECKOUT_URL ?? ""),
    KOMMO_CF_LOGIN_URL: String(cf.LOGIN_URL ?? ""),
    KOMMO_CF_EMAIL: String(cf.EMAIL_CADASTRO ?? ""),
    KOMMO_CF_USUARIO_ID: String(cf.USUARIO_ID ?? ""),
  };

  console.log("\n# Cole na VPS (/opt/luzesombra/.env) — KOMMO_API_TOKEN separado\n");
  for (const [k, v] of Object.entries(env)) {
    console.log(`${k}=${v}`);
  }

  if (!env.KOMMO_BOT_WELCOME_ID || !env.KOMMO_BOT_PAID_ID) {
    console.log("\n⚠ Salesbots e Digital Pipeline são configurados SOMENTE no painel Kommo.");
    console.log("  O Portal move leads entre etapas; o DP dispara WhatsApp ao entrar na etapa.");
    console.log("  Crie no painel: PI - Boas-vindas, PI - PIX pendente, PI - Acesso liberado");
    console.log("  Digital Pipeline: automatizar por etapa em Portal Iluminando (delays 2h/24h em Pendente).");
    console.log("  KOMMO_TRIGGER_BOTS=false (padrão) — não dispare bots via API se usar DP.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
