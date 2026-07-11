#!/usr/bin/env node
/**
 * Teste E2E: cadastro no portal → lead Kommo → pagamento Cakto → etapa Pago.
 * Uso: node scripts/kommo-e2e-test.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

const kommoEnv = loadEnvFile(resolve(root, ".env.kommo.local"));
const kommoToken = kommoEnv.KOMMO_API_TOKEN ?? process.env.KOMMO_API_TOKEN;
const kommoSubdomain = kommoEnv.KOMMO_SUBDOMAIN ?? "leticiabemvideos";
const caktoSecret =
  process.env.CAKTO_WEBHOOK_SECRET ?? "516bf7e8-1e43-4b24-874c-cb76e0c44d5f";

const PORTAL = "https://portaliluminando.com.br";
const KOMMO_BASE = `https://${kommoSubdomain}.kommo.com/api/v4`;

const CFG = {
  pipelineId: Number(kommoEnv.KOMMO_PIPELINE_ID ?? 14099787),
  statusNovo: Number(kommoEnv.KOMMO_STATUS_NOVO_CADASTRO ?? 108842047),
  statusPago: Number(kommoEnv.KOMMO_STATUS_PAGO ?? 108842055),
  statusPerdido: Number(kommoEnv.KOMMO_STATUS_PERDIDO ?? 143),
};

const ts = Date.now();
const testEmail = `kommo.e2e.${ts}@portaliluminando.com.br`;
const testPhone = `119${String(ts).slice(-8)}`;
const testNome = "Teste Kommo E2E";
const testSenha = "Teste@1234";

const results = [];

function pass(msg, detail) {
  results.push({ ok: true, msg, detail });
  console.log(`✓ ${msg}`, detail ? `— ${detail}` : "");
}

function fail(msg, detail) {
  results.push({ ok: false, msg, detail });
  console.error(`✗ ${msg}`, detail ? `— ${detail}` : "");
}

function warn(msg, detail) {
  results.push({ ok: true, msg, detail, warn: true });
  console.log(`⚠ ${msg}`, detail ? `— ${detail}` : "");
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function kommoApi(method, path, body) {
  const res = await fetch(`${KOMMO_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${kommoToken}`,
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
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}: ${text.slice(0, 300)}`);
  return data;
}

async function findLeadByPhone(phone) {
  const query = phone.replace(/\D/g, "");
  await sleep(2000);
  const data = await kommoApi("GET", `/contacts?query=${encodeURIComponent(query)}&with=leads`);
  const contact = data._embedded?.contacts?.[0];
  if (!contact) return null;
  const leadId = contact._embedded?.leads?.[0]?.id;
  return leadId ? { leadId, contactId: contact.id } : null;
}

async function getLead(leadId) {
  return kommoApi("GET", `/leads/${leadId}?with=contacts`);
}

async function main() {
  console.log("=== Kommo E2E Test ===");
  console.log("Email:", testEmail);
  console.log("Telefone:", testPhone);
  console.log("");

  if (!kommoToken) {
    fail("Token Kommo ausente", ".env.kommo.local");
    process.exit(1);
  }

  // 1. Healthcheck
  try {
    const h = await fetch(`${PORTAL}/api/healthz`);
    const body = await h.json();
    if (body.status === "ok") pass("API produção online");
    else fail("API produção", JSON.stringify(body));
  } catch (e) {
    fail("API produção", e.message);
    process.exit(1);
  }

  // 2. Cadastro funil
  let checkoutToken;
  let userId;
  try {
    const res = await fetch(`${PORTAL}/api/funnel/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: testNome,
        email: testEmail,
        telefone: testPhone,
        senha: testSenha,
        variant: "control",
        utm: { source: "e2e-test", medium: "script", campaign: "kommo" },
      }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(body));
    checkoutToken = body.checkoutToken;
    userId = body.userId;
    pass("Cadastro funil", `userId=${userId} token=${checkoutToken?.slice(0, 8)}...`);
  } catch (e) {
    fail("Cadastro funil", e.message);
    process.exit(1);
  }

  // 3. Lead no Kommo (aguarda sync assíncrono)
  let leadInfo;
  for (let i = 0; i < 8; i++) {
    leadInfo = await findLeadByPhone(testPhone);
    if (leadInfo) break;
    console.log(`  aguardando lead Kommo... (${i + 1}/8)`);
    await sleep(3000);
  }

  if (!leadInfo) {
    fail("Lead criado no Kommo", "não encontrado após 24s");
    process.exit(1);
  }
  pass("Lead no Kommo", `leadId=${leadInfo.leadId}`);

  // 4. Validar pipeline e campos
  try {
    const lead = await getLead(leadInfo.leadId);
    const statusId = lead.status_id;
    const pipelineId = lead.pipeline_id;
    if (pipelineId === CFG.pipelineId) pass("Pipeline correto", String(pipelineId));
    else fail("Pipeline", `esperado ${CFG.pipelineId}, got ${pipelineId}`);

    if (statusId === CFG.statusNovo) pass("Etapa Novo cadastro", String(statusId));
    else fail("Etapa inicial", `esperado ${CFG.statusNovo}, got ${statusId}`);

    const cfs = lead.custom_fields_values ?? [];
    const checkoutField = cfs.find((f) => f.field_id === 1350222);
    const loginField = cfs.find((f) => f.field_id === 1350224);
    if (checkoutField?.values?.[0]?.value?.includes(checkoutToken))
      pass("Campo CHECKOUT_URL preenchido");
    else fail("Campo CHECKOUT_URL", JSON.stringify(checkoutField));
    if (loginField?.values?.[0]?.value?.includes("/login")) pass("Campo LOGIN_URL preenchido");
    else fail("Campo LOGIN_URL", JSON.stringify(loginField));
  } catch (e) {
    fail("Validação lead Kommo", e.message);
  }

  // 5. Webhook Cakto (pagamento)
  try {
    const eventId = `e2e-${ts}`;
    const res = await fetch(`${PORTAL}/api/webhooks/cakto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": caktoSecret,
      },
      body: JSON.stringify({
        event: "purchase_approved",
        event_id: eventId,
        email: testEmail,
        ref: checkoutToken,
        order_id: `e2e-order-${ts}`,
        payment_method: "pix",
      }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(body));
    pass("Webhook Cakto paid", JSON.stringify(body));
  } catch (e) {
    fail("Webhook Cakto paid", e.message);
  }

  // 6. Lead movido para Pago
  await sleep(4000);
  try {
    const lead = await getLead(leadInfo.leadId);
    if (lead.status_id === CFG.statusPago) pass("Etapa Pago após webhook", String(lead.status_id));
    else fail("Etapa após pagamento", `esperado ${CFG.statusPago}, got ${lead.status_id}`);
  } catch (e) {
    fail("Verificação etapa Pago", e.message);
  }

  // 7. Salesbots + Digital Pipeline (configuração manual no painel — não bloqueia E2E)
  try {
    const bots = await kommoApi("GET", "/bots");
    const items = bots._embedded?.items ?? bots._embedded?.bots ?? [];
    const piBots = items.filter((b) => /PI|boas-vindas|pendente|acesso|portal iluminando/i.test(b.name ?? ""));
    if (piBots.length >= 3) {
      pass("Salesbots PI no painel", String(piBots.length));
    } else {
      warn(
        "Salesbots/DP no painel (manual)",
        `${piBots.length}/3 bots PI — crie no painel Kommo + Digital Pipeline por etapa`,
      );
    }
  } catch (e) {
    warn("Salesbots/DP no painel (manual)", e.message);
  }

  console.log("\n=== Resumo ===");
  const ok = results.filter((r) => r.ok && !r.warn).length;
  const warns = results.filter((r) => r.warn).length;
  const bad = results.filter((r) => !r.ok).length;
  console.log(`${ok} passou, ${warns} aviso(s), ${bad} falhou`);
  console.log(`Lead teste: https://${kommoSubdomain}.kommo.com/leads/detail/${leadInfo.leadId}`);
  console.log(`Checkout: ${PORTAL}/checkout?token=${checkoutToken}`);

  process.exit(bad > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
