/**
 * Upsert editorial (frase/reflexão/convite) para 09/11/2026–31/12/2026.
 * Mantém imagem_url existente; se o dia ainda não existe, deixa null (usa padrão do app).
 *
 * Uso: DATABASE_URL=... node scripts/seed-conteudo-2026-nov-dez.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "seed-conteudo-2026-nov-dez.json");

const dias = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
if (!Array.isArray(dias) || dias.length === 0) {
  console.error("JSON vazio ou inválido");
  process.exit(1);
}

for (const d of dias) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.data) || !d.data.startsWith("2026-")) {
    console.error("Data fora de 2026:", d.data);
    process.exit(1);
  }
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Defina DATABASE_URL");
  process.exit(1);
}

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();

try {
  await client.query("BEGIN");
  let upserts = 0;
  for (const d of dias) {
    await client.query(
      `INSERT INTO conteudo_dia (data, frase, reflexao, convite, imagem_url, atualizado_em)
       VALUES ($1, $2, $3, $4, NULL, NOW())
       ON CONFLICT (data) DO UPDATE SET
         frase = EXCLUDED.frase,
         reflexao = EXCLUDED.reflexao,
         convite = EXCLUDED.convite,
         atualizado_em = NOW()`,
      [d.data, d.frase, d.reflexao, d.convite],
    );
    upserts += 1;
  }
  await client.query("COMMIT");
  console.log(`OK: ${upserts} dias de 2026 (nov–dez) atualizados.`);
} catch (err) {
  await client.query("ROLLBACK");
  console.error(err);
  process.exit(1);
} finally {
  await client.end();
}
