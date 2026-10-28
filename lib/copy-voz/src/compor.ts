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

/** Só funde pedaços longos. Uma palavra curta dentro de uma frase não some. */
const MIN_REPETICAO = 40;

function contemInteiro(maior: string, menor: string): boolean {
  return menor.length >= MIN_REPETICAO && maior.includes(menor);
}

function pedacos(bruto: string | readonly string[] | undefined): string[] {
  const lista = Array.isArray(bruto) ? [...bruto] : [bruto ?? ""];
  const limpos = lista
    .map((parte) => normalizarTextoUsuario(limparJargao(String(parte ?? ""))).trim())
    .filter(Boolean);
  const saida: string[] = [];
  for (const parte of limpos) {
    if (saida.some((anterior) => contemInteiro(anterior, parte))) continue;
    const restantes = saida.filter((anterior) => !contemInteiro(parte, anterior));
    if (restantes.length !== saida.length) {
      saida.length = 0;
      saida.push(...restantes, parte);
    } else {
      saida.push(parte);
    }
  }
  return saida;
}

export function limparJargao(texto: string): string {
  let t = texto;
  for (const [re, rep] of TROCA_JARGAO) {
    t = t.replace(re, rep);
  }
  return t;
}

export function comporLeitura(slots: SlotsLeitura): LeituraPortal {
  const secoes = MOLDURA.secoes.map((secao) => {
    const paragrafos = pedacos(slots[secao.id]);
    const texto = paragrafos.join(" ");
    if (!texto) {
      throw new Error(`Leitura sem o bloco "${secao.titulo}".`);
    }
    if (AINDA_PROIBIDO.test(texto)) {
      throw new Error(`A leitura ainda traz um termo fora do modelo em "${secao.titulo}".`);
    }
    return { id: secao.id, titulo: secao.titulo, texto, paragrafos };
  });
  return { secoes };
}
