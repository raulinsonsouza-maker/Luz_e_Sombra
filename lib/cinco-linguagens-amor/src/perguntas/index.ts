import type { LinguagemAmor, ParForcado } from "../types.js";
import { CODIGOS_EXPRESSAR, PARES_EXPRESSAR } from "./expressar.js";
import { CODIGOS_RECEBER, PARES_RECEBER } from "./receber.js";

export { CODIGOS_RECEBER, PARES_RECEBER, type CodigoReceber } from "./receber.js";
export { CODIGOS_EXPRESSAR, PARES_EXPRESSAR, type CodigoExpressar } from "./expressar.js";

/** Todos os 30 códigos v2: R01–R15 + E01–E15. */
export const CODIGOS_PAR = [...CODIGOS_RECEBER, ...CODIGOS_EXPRESSAR] as const;
export type CodigoPar = (typeof CODIGOS_PAR)[number];

export const PARES_FORCADOS: ParForcado[] = [...PARES_RECEBER, ...PARES_EXPRESSAR];

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

export function tituloBloco(bloco: "receber" | "expressar"): string {
  return bloco === "receber"
    ? "Como você se sente amado(a)"
    : "Como você costuma demonstrar amor";
}
