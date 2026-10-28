import { MOLDURA, type LeituraPortal, type SlotsLeitura } from "./moldura.js";
import { normalizarTextoUsuario } from "./normalizar.js";

/**
 * Jargão que não faz parte do modelo ensinado.
 * Esquizoide, Oral, Psicopata, Masoquista e Rígido permanecem.
 * A troca é global: o texto chega limpo em qualquer módulo.
 */
const TROCA_JARGAO: ReadonlyArray<[RegExp, string]> = [
  [/\bchakras\b/gi, "centros de energia"],
  [/\bchakra\b/gi, "centro de energia"],
  [/\bplexo solar\b/gi, "centro do peito"],
  [/\bplexos?\b/gi, "centro"],
  [/\bcouraças\b/gi, "proteções"],
  [/\bcouraça\b/gi, "proteção"],
  [/\bcouracas\b/gi, "proteções"],
  [/\bcouraca\b/gi, "proteção"],
];

const AINDA_PROIBIDO = /chakra|plexo|couraça|couraca/i;

export function limparJargao(texto: string): string {
  let t = texto;
  for (const [re, rep] of TROCA_JARGAO) {
    t = t.replace(re, rep);
  }
  return t;
}

export function comporLeitura(slots: SlotsLeitura): LeituraPortal {
  const secoes = MOLDURA.secoes.map((secao) => {
    const bruto = slots[secao.id] ?? "";
    const texto = normalizarTextoUsuario(limparJargao(bruto)).trim();
    if (!texto) {
      throw new Error(`Leitura sem o bloco "${secao.titulo}".`);
    }
    if (AINDA_PROIBIDO.test(texto)) {
      throw new Error(`A leitura ainda traz um termo fora do modelo em "${secao.titulo}".`);
    }
    return { id: secao.id, titulo: secao.titulo, texto };
  });
  return { secoes };
}
