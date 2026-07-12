#!/usr/bin/env node
const { readFileSync, existsSync } = require("node:fs");
const { resolve } = require("node:path");
const bcrypt = require("bcryptjs");
const { Client } = require("pg");

const envPath = "/opt/luzesombra/.env";
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    if (!process.env[k]) process.env[k] = t.slice(i + 1).trim();
  }
}

const newPassword = process.argv[2] || "admin";
const username = process.argv[3] || "admin";

(async () => {
  const hash = await bcrypt.hash(newPassword, 10);
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  let r = await client.query(
    "UPDATE usuarios SET senha = $1, atualizado_em = NOW() WHERE username = $2 AND is_admin = true RETURNING id, username, nome",
    [hash, username],
  );
  if (r.rowCount === 0) {
    r = await client.query(
      "UPDATE usuarios SET senha = $1, atualizado_em = NOW() WHERE is_admin = true RETURNING id, username, nome",
      [hash],
    );
  }
  await client.end();
  if (r.rowCount === 0) {
    console.error("Nenhum admin encontrado");
    process.exit(1);
  }
  console.log("OK:", r.rows);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
