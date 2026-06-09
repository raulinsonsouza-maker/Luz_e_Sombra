import { MAPA_LEXICO, MAPA_PT_BR } from "./guia.js";

/** Remove travessões longos, substituindo por vírgula ou ponto. */
export function removerTravessoes(texto: string): string {
  if (!texto.includes("—")) return texto;
  let result = texto.replace(/\s—\s/g, (_match, offset: number, whole: string) => {
    const after = whole.slice(offset + _match.length);
    const trimmed = after.trimStart();
    if (!trimmed) return ", ";
    if (/^(mas|porém|pois|porque|e|ou|ainda|também|só|quando|se|não|nao)\b/i.test(trimmed)) return ", ";
    if (/^[a-záàâãéêíóôõúç]/.test(trimmed)) return ", ";
    return ". ";
  });
  return result.replace(/—/g, ", ");
}

/** « » → aspas duplas; espaços duplos. */
export function normalizarPontuacao(texto: string): string {
  return texto
    .replace(/«/g, '"')
    .replace(/»/g, '"')
    .replace(/\s{2,}/g, " ")
    .replace(/\.\s+\./g, ".");
}

export function normalizarPtBr(texto: string): string {
  let t = texto;
  for (const [re, rep] of MAPA_PT_BR) {
    t = t.replace(re, rep);
  }
  return t;
}

export function normalizarLexico(texto: string): string {
  let t = texto;
  for (const [re, rep] of MAPA_LEXICO) {
    t = t.replace(re, rep);
  }
  return t;
}

/** Pipeline completo para texto user-facing. */
export function normalizarTextoUsuario(texto: string | null | undefined): string {
  if (texto == null || texto === "") return texto ?? "";
  let t = texto;
  t = normalizarPontuacao(t);
  t = removerTravessoes(t);
  t = normalizarPtBr(t);
  t = normalizarLexico(t);
  return t.trim();
}

/** Percorre objeto/array e normaliza todas as strings. */
export function normalizarObjetoTextos<T>(valor: T): T {
  if (valor == null) return valor;
  if (typeof valor === "string") {
    return normalizarTextoUsuario(valor) as T;
  }
  if (Array.isArray(valor)) {
    return valor.map((item) => normalizarObjetoTextos(item)) as T;
  }
  if (typeof valor === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(valor as Record<string, unknown>)) {
      out[k] = normalizarObjetoTextos(v);
    }
    return out as T;
  }
  return valor;
}
