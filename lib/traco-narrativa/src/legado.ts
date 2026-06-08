import type { ResultadoAnalise } from "./types.js";
import { VERSAO_NARRATIVA } from "./constants.js";

const PREFIXOS_LEGADO = [
  /^Integração fotos \+ questionário:\s*/i,
  /^Leitura integrada \(fotos \+ questionário\):\s*/i,
  /^Sinais convergentes:\s*/i,
];

function limparInterpretacao(texto: string): string {
  let t = texto;
  for (const re of PREFIXOS_LEGADO) {
    t = t.replace(re, "");
  }
  const paragrafos = t.split(/\n\n+/).filter((p) => {
    const lower = p.toLowerCase();
    if (lower.startsWith("sinais convergentes")) return false;
    if (lower.includes("alinhamento fotos/formulário")) return false;
    if (lower.includes("leitura integrada (fotos")) return false;
    return p.trim().length > 0;
  });
  return paragrafos.join("\n\n");
}

/** Limpa texto de resultados guardados antes da narrativa v3. */
export function sanitizarResultadoLegado(resultado: ResultadoAnalise): ResultadoAnalise {
  if (resultado.versaoNarrativa === VERSAO_NARRATIVA) return resultado;
  const out = { ...resultado };
  if (out.interpretacao) {
    out.interpretacao = limparInterpretacao(out.interpretacao);
  }
  return out;
}

export function isResultadoLegado(resultado: ResultadoAnalise): boolean {
  return resultado.versaoNarrativa !== VERSAO_NARRATIVA;
}
