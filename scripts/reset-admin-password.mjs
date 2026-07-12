#!/usr/bin/env node
/**
 * Redefine senha do usuário admin no banco.
 * Uso na VPS: source .env && node scripts/reset-admin-password.mjs [senha] [username]
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

for (const envPath of [resolve(root, ".env"), "/opt/luzesombra/.env"]) {
  if (!existsSync(envPath)) continue;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    if (!process.env[k]) process.env[k] = t.slice(i + 1).trim();
  }
}

const newPassword = process.argv[2] ?? "admin";
const username = process.argv[3] ?? "admin";
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL não configurada");
  process.exit(1);
}

const hash = await bcrypt.hash(newPassword, 10);
const client = new pg.Client({ connectionString: dbUrl });
await client.connect();

let result = await client.query(
  "UPDATE usuarios SET senha = $1, atualizado_em = NOW() WHERE username = $2 AND is_admin = true RETURNING id, username, nome",
  [hash, username],
);

if (result.rowCount === 0) {
  result = await client.query(
    "UPDATE usuarios SET senha = $1, atualizado_em = NOW() WHERE is_admin = true RETURNING id, username, nome",
    [hash],
  );
}

await client.end();

if (result.rowCount === 0) {
  console.error("Nenhum usuário admin encontrado para atualizar.");
  process.exit(1);
}

console.log("Senha atualizada para:", result.rows.map((r) => `${r.username} (id ${r.id})`).join(", "));
