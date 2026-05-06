import type { LinguagemAmor } from "./types.js";
import { LABEL_LINGUAGEM } from "./perguntas.js";

const TEXTO_DOMINANTE: Record<LinguagemAmor, string> = {
  palavras:
    "Você tende a sentir-se amado(a) quando ouve reconhecimento, validação e palavras gentis com consistência. Críticas pesam muito — prefira feedback específico e caloroso.",
  tempo:
    "Presença importa mais que pressa: conversas sem distrações e rituais juntos costumam ser seu combustível afetivo.",
  presentes:
    "Símbolos e lembranças tangíveis traduzem cuidado para você — não pelo valor, mas pelo significado e pela intenção.",
  servicos:
    "Ações concretas que aliviam sua carga mostram amor: resolver, apoiar e assumir o que importa no dia a dia.",
  toque:
    "Proximidade física reconfortante — abraços, carinho, encostar-se — frequentemente comunica mais segurança que palavras.",
};

/** Ordem fixa para desempate no ranking. */
export const ORDEM_DESEMPATE: LinguagemAmor[] = [
  "palavras",
  "tempo",
  "presentes",
  "servicos",
  "toque",
];

export function textoDominante(linguagem: LinguagemAmor): string {
  return TEXTO_DOMINANTE[linguagem];
}

export function textoParPrincipalSecundaria(
  principal: LinguagemAmor,
  secundaria: LinguagemAmor,
): string {
  if (principal === secundaria) {
    return textoDominante(principal);
  }
  return `Seu perfil combina ${LABEL_LINGUAGEM[principal]} com forte influência de ${LABEL_LINGUAGEM[secundaria]}. Na prática: expresse amor em ${LABEL_LINGUAGEM[principal].toLowerCase()} e confirme também em ${LABEL_LINGUAGEM[secundaria].toLowerCase()} — relações duradouras costumam nutrir as duas pontuações mais altas.`;
}
