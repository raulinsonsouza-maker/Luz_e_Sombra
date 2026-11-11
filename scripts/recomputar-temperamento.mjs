#!/usr/bin/env node
/**
 * Recomputa o JSON `resultado` de todas as análises de temperamento com respostas v3 (16 itens).
 * Uso na VPS (após deploy):
 *   cd /opt/luzesombra && node --import tsx scripts/recomputar-temperamento.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  computarTemperamento,
  entradaTemperamentoSchema,
  VERSAO_TEMPERAMENTO_ATUAL,
  VERSAO_NARRATIVA_ATUAL,
  TOTAL_ITENS,
} from "../lib/temperamento-v1/src/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const requireFromDb = createRequire(resolve(root, "lib/db/package.json"));
const { default: pg } = requireFromDb("pg");

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

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL não configurada");
  process.exit(1);
}

const client = new pg.Client({ connectionString: dbUrl });
await client.connect();

const { rows } = await client.query(
  `SELECT id, respostas, resultado, versao
   FROM analise_temperamento_40
   ORDER BY id ASC`,
);

let atualizados = 0;
let pulados = 0;
let erros = 0;

for (const row of rows) {
  const answers = row.respostas;
  if (!answers || typeof answers !== "object") {
    pulados += 1;
    continue;
  }

  const keys = Object.keys(answers);
  if (keys.length !== TOTAL_ITENS) {
    pulados += 1;
    continue;
  }

  const parsed = entradaTemperamentoSchema.safeParse({
    answers,
    metadata: row.resultado?.metadata ?? {},
  });
  if (!parsed.success) {
    pulados += 1;
    continue;
  }

  try {
    const comp = computarTemperamento(parsed.data);
    const anterior = row.resultado && typeof row.resultado === "object" ? row.resultado : {};
    const resultado = {
      ...comp,
      computed_at: new Date().toISOString(),
      recomputado_em: new Date().toISOString(),
      recomputado_de: anterior.versaoNarrativa ?? row.versao ?? null,
      metadata: parsed.data.metadata,
    };

    await client.query(
      `UPDATE analise_temperamento_40
       SET resultado = $1::jsonb, versao = $2
       WHERE id = $3`,
      [JSON.stringify(resultado), VERSAO_TEMPERAMENTO_ATUAL, row.id],
    );
    atualizados += 1;
  } catch (err) {
    erros += 1;
    console.error(`Falha no id=${row.id}:`, err instanceof Error ? err.message : err);
  }
}

await client.end();

console.log(
  JSON.stringify(
    {
      total: rows.length,
      atualizados,
      pulados,
      erros,
      versaoNarrativa: VERSAO_NARRATIVA_ATUAL,
      versaoQuestionario: VERSAO_TEMPERAMENTO_ATUAL,
    },
    null,
    2,
  ),
);
