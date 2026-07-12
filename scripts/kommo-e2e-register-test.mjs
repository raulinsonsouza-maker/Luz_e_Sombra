#!/usr/bin/env node
/**
 * Teste E2E: cadastro no portal → sync Kommo → WPP boas-vindas + PIX.
 * Uso: node scripts/kommo-e2e-register-test.mjs [telefone] [apiBase]
 *
 * Exemplo: node scripts/kommo-e2e-register-test.mjs 19993200958 https://portaliluminando.com.br
 */
const phone = process.argv[2] ?? "19993200958";
const apiBase = (process.argv[3] ?? "https://portaliluminando.com.br").replace(/\/$/, "");
const suffix = Date.now().toString(36);
const email = `teste.kommo.${suffix}@example.com`;
const nome = `Teste Kommo ${suffix}`;
const senha = "Teste@2025";

const body = {
  nome,
  email,
  telefone: phone,
  senha,
  confirmarSenha: senha,
  aceiteTermos: true,
};

console.log("API:", apiBase);
console.log("Telefone:", phone);
console.log("Email:", email);
console.log("Nome:", nome);
console.log("");

const r = await fetch(`${apiBase}/api/funnel/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify(body),
});

const text = await r.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  json = text;
}

console.log("Status:", r.status);
console.log("Resposta:", JSON.stringify(json, null, 2));

if (r.status >= 200 && r.status < 300) {
  console.log("\nOK — aguarde ~30s e confira no WhatsApp:");
  console.log("  1. Boas-vindas");
  console.log("  2. PIX pendente (Talks API)");
  console.log("\nLembretes 2h/24h: node scripts/kommo-reminders-run.mjs --force");
} else {
  process.exit(1);
}
