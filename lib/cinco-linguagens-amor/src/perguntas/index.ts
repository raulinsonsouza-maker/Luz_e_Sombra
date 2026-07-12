import type { LinguagemAmor, ParForcado } from "../types.js";
import { CODIGOS_DESEMPATE, PARES_DESEMPATE_TODOS, paresDesempatePara } from "./desempate.js";
import { CODIGOS_EXPRESSAR, PARES_EXPRESSAR } from "./expressar.js";
import { CODIGOS_RECEBER, PARES_RECEBER } from "./receber.js";

export { CODIGOS_RECEBER, PARES_RECEBER, type CodigoReceber } from "./receber.js";
export { CODIGOS_DESEMPATE, PARES_DESEMPATE_TODOS, paresDesempatePara, type CodigoDesempate } from "./desempate.js";
export { CODIGOS_EXPRESSAR, PARES_EXPRESSAR, type CodigoExpressar } from "./expressar.js";

/** Códigos obrigatórios do questionário v3 (receber). */
export const CODIGOS_CORE = [...CODIGOS_RECEBER] as const;
export type CodigoCore = (typeof CODIGOS_CORE)[number];

/** Todos os códigos possíveis v3: R01–R20 + D01–D05 + E01–E05. */
export const CODIGOS_PAR = [...CODIGOS_RECEBER, ...CODIGOS_DESEMPATE, ...CODIGOS_EXPRESSAR] as const;
export type CodigoPar = (typeof CODIGOS_PAR)[number];

export const PARES_FORCADOS: ParForcado[] = [...PARES_RECEBER, ...PARES_DESEMPATE_TODOS, ...PARES_EXPRESSAR];

export const LABEL_LINGUAGEM: Record<LinguagemAmor, string> = {
  palavras: "Palavras de afirmação",
  tempo: "Tempo de qualidade",
  presentes: "Presentes",
  servicos: "Atos de serviço",
  toque: "Toque físico",
};

export function parPorId(id: string): ParForcado | undefined {
  return PARES_FORCADOS.find((p) => p.id === id);
}

export function tituloBloco(bloco: "receber" | "expressar" | "desempate"): string {
  if (bloco === "receber") return "Como você se sente amado(a)";
  if (bloco === "desempate") return "Para afinar seu perfil";
  return "Como você demonstra amor";
}

export const TOTAL_CORE = CODIGOS_RECEBER.length;
export const TOTAL_DESEMPATE_MAX = CODIGOS_DESEMPATE.length;
export const TOTAL_EXPRESSAR = CODIGOS_EXPRESSAR.length;
