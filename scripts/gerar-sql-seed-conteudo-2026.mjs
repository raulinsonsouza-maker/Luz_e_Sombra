import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const dias = JSON.parse(fs.readFileSync(path.join(dir, "seed-conteudo-2026-nov-dez.json"), "utf8"));

function esc(s) {
  return String(s).replace(/'/g, "''");
}

let sql = "BEGIN;\n";
for (const d of dias) {
  sql +=
    "INSERT INTO conteudo_dia (data, frase, reflexao, convite, imagem_url, atualizado_em) VALUES (" +
    `'${d.data}', '${esc(d.frase)}', '${esc(d.reflexao)}', '${esc(d.convite)}', NULL, NOW()) ` +
    "ON CONFLICT (data) DO UPDATE SET " +
    "frase = EXCLUDED.frase, reflexao = EXCLUDED.reflexao, convite = EXCLUDED.convite, atualizado_em = NOW();\n";
}
sql += "COMMIT;\n";
sql += "SELECT count(*) AS total FROM conteudo_dia WHERE data BETWEEN '2026-11-09' AND '2026-12-31';\n";

const out = path.join(dir, "seed-conteudo-2026-nov-dez.sql");
fs.writeFileSync(out, sql);
console.log(`ok ${dias.length} -> ${out}`);
