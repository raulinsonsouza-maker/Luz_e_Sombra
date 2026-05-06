import { PARES_FORCADOS } from "./perguntas.js";
import { ORDEM_DESEMPATE, textoDominante, textoParPrincipalSecundaria } from "./interpretacao.js";
import type {
  EntradaLinguagensAmor,
  LinguagemAmor,
  PontuacaoPorLinguagem,
  RankingItem,
  ResultadoLinguagensAmorComputado,
} from "./types.js";

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

export function computarLinguagensAmor(entrada: EntradaLinguagensAmor): ResultadoLinguagensAmorComputado {
  const pontuacoes: PontuacaoPorLinguagem = { ...ZERO };

  for (const par of PARES_FORCADOS) {
    const lado = entrada.answers[par.id];
    if (lado === "a") addPoint(pontuacoes, par.linguagemA);
    else addPoint(pontuacoes, par.linguagemB);
  }

  const total = Object.values(pontuacoes).reduce((a, b) => a + b, 0);
  if (total !== 30) {
    throw new Error(`Pontuação interna inconsistente: esperado 30, obtido ${total}`);
  }

  const ranking: RankingItem[] = (Object.keys(pontuacoes) as LinguagemAmor[]).map((linguagem) => ({
    linguagem,
    pontos: pontuacoes[linguagem],
    pct: Math.round((pontuacoes[linguagem] / 30) * 1000) / 10,
  }));

  ranking.sort((x, y) => {
    if (y.pontos !== x.pontos) return y.pontos - x.pontos;
    return ORDEM_DESEMPATE.indexOf(x.linguagem) - ORDEM_DESEMPATE.indexOf(y.linguagem);
  });

  const principal = ranking[0].linguagem;
  const secundaria = ranking[1].linguagem;

  return {
    pontuacoes,
    ranking,
    principal,
    secundaria,
    interpretacaoPrincipal: textoDominante(principal),
    interpretacaoPar: textoParPrincipalSecundaria(principal, secundaria),
  };
}
