/**
 * Normaliza strings literais em ficheiros de copy user-facing (remove —, « », PT-PT).
 * Uso: node --import tsx scripts/normalizar-copy-fontes.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizarTextoUsuario } from "../lib/copy-voz/src/normalizar.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "lib/temperamento-v1/src/interpretacao.ts",
  "lib/traco-narrativa/src/tabelas.ts",
  "lib/traco-narrativa/src/gerarNarrativa.ts",
  "lib/traco-narrativa/src/cruzamentos.ts",
  "lib/cinco-linguagens-amor/src/narrativa/tabelas.ts",
  "lib/cinco-linguagens-amor/src/interpretacao.ts",
  "artifacts/luz-e-sombra/src/lib/dossieIntegrado.ts",
  "artifacts/luz-e-sombra/src/pages/QuemSouEuPage.tsx",
  "artifacts/luz-e-sombra/src/pages/ResultadoPage.tsx",
  "artifacts/luz-e-sombra/src/lib/types.ts",
  "artifacts/luz-e-sombra/src/lib/numerologia-data.ts",
  "artifacts/luz-e-sombra/src/lib/numerologia-utils.ts",
  "artifacts/luz-e-sombra/src/lib/jornadaHubConfig.ts",
  "artifacts/luz-e-sombra/src/pages/TemperamentoPage.tsx",
  "artifacts/luz-e-sombra/src/pages/traco/components/Diagnostico30Form.tsx",
  "artifacts/luz-e-sombra/src/pages/linguagens-amor/enriquecerResultado.ts",
  "artifacts/luz-e-sombra/src/pages/linguagens-amor/LinguagensPainelResultado.tsx",
  "artifacts/luz-e-sombra/src/pages/temperamento/TemperamentoPainelResultado.tsx",
  "artifacts/luz-e-sombra/src/pages/JornadaHubPage.tsx",
  "artifacts/luz-e-sombra/src/pages/LinguagensAmorPage.tsx",
  "artifacts/luz-e-sombra/src/pages/TracodeCaraterPage.tsx",
  "lib/cinco-linguagens-amor/src/narrativa/gerar.ts",
  "lib/cinco-linguagens-amor/src/narrativa/compatibilidade.ts",
  "lib/traco-eixos-multimodal/src/textoPorLimiares.ts",
  "artifacts/luz-e-sombra/src/pages/traco/components/TracoPainelResultado.tsx",
];

const NEEDS_NORM = /—|«|»|\bComo pensas\b|\ba olhar\b|\bbreakthrough\b|\bteu Eu\b|\bao invés de\b|\bVais ver\b|\bteu\b/i;

function unescapeDouble(s: string): string {
  return s.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
}

function escapeDouble(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function processSingleQuoted(content: string): string {
  return content.replace(/'((?:[^'\\]|\\.)*)'/g, (full, inner) => {
    if (!/—|«|»/.test(inner) && !NEEDS_NORM.test(inner)) return full;
    const unescaped = inner.replace(/\\'/g, "'");
    const norm = normalizarTextoUsuario(unescaped).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    return `'${norm}'`;
  });
}

function processDoubleQuoted(content: string): string {
  return content.replace(/"((?:[^"\\]|\\.)*)"/g, (full, inner) => {
    if (!/—|«|»/.test(inner) && !NEEDS_NORM.test(inner)) return full;
    return `"${escapeDouble(normalizarTextoUsuario(unescapeDouble(inner)))}"`;
  });
}

function processBacktick(content: string): string {
  return content.replace(/`((?:[^`\\]|\\.|$\{[^}]*\})*)`/g, (full, inner) => {
    if (!/—|«|»/.test(inner) && !NEEDS_NORM.test(inner)) return full;
    const parts = inner.split(/(\$\{[^}]+\})/);
    const normParts = parts.map((p) => (p.startsWith("${") ? p : normalizarTextoUsuario(p)));
    return `\`${normParts.join("")}\``;
  });
}

let changed = 0;
for (const rel of FILES) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.warn("skip (missing):", rel);
    continue;
  }
  const before = fs.readFileSync(abs, "utf8");
  let after = processBacktick(processSingleQuoted(processDoubleQuoted(before)));
  if (after !== before) {
    fs.writeFileSync(abs, after, "utf8");
    changed++;
    const dashesBefore = (before.match(/—/g) ?? []).length;
    const dashesAfter = (after.match(/—/g) ?? []).length;
    console.log(`${rel}: — ${dashesBefore} → ${dashesAfter}`);
  }
}
console.log(`Done. ${changed} files updated.`);
