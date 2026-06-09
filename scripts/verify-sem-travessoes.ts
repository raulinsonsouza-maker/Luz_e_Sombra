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
  "artifacts/luz-e-sombra/src/lib/mensagensDiarias.ts",
  "artifacts/luz-e-sombra/src/pages",
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

function shouldSkipLine(line: string): boolean {
  const trimmed = line.trim();
  if (/^\s*(\/\/|\*|\/\*)/.test(trimmed)) return true;
  if (trimmed.includes("{/*") && trimmed.includes("*/}")) return true;
  if (/\|\|\s*"—"/.test(line) || /:\s*"—"/.test(line)) return true;
  if (/>\s*—\s*</.test(line)) return true;
  if (/AdminPage|LandingPage|LoginPage/.test(line)) return false;
  return false;
}

const SKIP_FILES = new Set([
  "artifacts/luz-e-sombra/src/pages/LandingPage.tsx",
  "artifacts/luz-e-sombra/src/pages/AdminPage.tsx",
  "artifacts/luz-e-sombra/src/pages/LoginPage.tsx",
  "artifacts/luz-e-sombra/src/pages/NumerologiaPage.tsx",
]);

let failures = 0;
for (const entry of GLOBS) {
  for (const file of collectFiles(entry)) {
    const rel = path.relative(ROOT, file);
    if (SKIP_FILES.has(rel.replace(/\\/g, "/"))) continue;

    const content = fs.readFileSync(file, "utf8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      if (!line.includes("—")) continue;
      if (shouldSkipLine(line)) continue;
      console.error(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} linha(s) com travessão em copy user-facing.`);
  process.exit(1);
}
console.log("OK: nenhuma travessão em copy user-facing (excl. comentários e placeholders).");
