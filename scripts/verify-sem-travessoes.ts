/**
 * Falha se ficheiros de copy user-facing ainda contiverem travessões em strings.
 * Uso: node --import tsx scripts/verify-sem-travessoes.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const GLOBS = [
  "lib/temperamento-v1/src/interpretacao.ts",
  "lib/traco-narrativa/src/tabelas.ts",
  "lib/cinco-linguagens-amor/src/narrativa",
  "artifacts/luz-e-sombra/src/lib/dossieIntegrado.ts",
  "artifacts/luz-e-sombra/src/lib/types.ts",
];

function collectFiles(entry: string): string[] {
  const abs = path.join(ROOT, entry);
  if (!fs.existsSync(abs)) return [];
  if (fs.statSync(abs).isFile()) return [abs];
  const out: string[] = [];
  for (const name of fs.readdirSync(abs)) {
    if (name.endsWith(".ts") || name.endsWith(".tsx")) {
      out.push(...collectFiles(path.join(entry, name)));
    }
  }
  return out;
}

let failures = 0;
for (const entry of GLOBS) {
  for (const file of collectFiles(entry)) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      if (!line.includes("—")) continue;
      if (/^\s*(\/\/|\*|\/\*)/.test(line.trim())) continue;
      console.error(`${path.relative(ROOT, file)}:${i + 1}: ${line.trim().slice(0, 120)}`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} linha(s) com travessão em copy user-facing.`);
  process.exit(1);
}
console.log("OK: nenhuma travessão em copy user-facing (excl. comentários).");
