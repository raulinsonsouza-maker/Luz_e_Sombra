import type { LinguagemAmor, LadoEscolha, ParForcado, PontuacaoPorLinguagem } from "../types.js";

const ZERO: PontuacaoPorLinguagem = {
  palavras: 0,
  tempo: 0,
  presentes: 0,
  servicos: 0,
  toque: 0,
};

function addPoint(acc: PontuacaoPorLinguagem, lang: LinguagemAmor): void {
  acc[lang] += 1;
}

export function pontuarBloco(
  pares: ParForcado[],
  answers: Record<string, LadoEscolha>,
): PontuacaoPorLinguagem {
  const pontuacoes: PontuacaoPorLinguagem = { ...ZERO };
  for (const par of pares) {
    const lado = answers[par.id];
    if (lado === "a") addPoint(pontuacoes, par.linguagemA);
    else addPoint(pontuacoes, par.linguagemB);
  }
  return pontuacoes;
}
