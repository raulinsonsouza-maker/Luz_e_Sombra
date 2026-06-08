import { ORDEM_DESEMPATE } from "../interpretacao.js";
import type { DimensaoPerfil, LinguagemAmor, PontuacaoPorLinguagem, RankingItem } from "../types.js";

export function montarDimensaoPerfil(pontuacoes: PontuacaoPorLinguagem, total: number): DimensaoPerfil {
  const ranking: RankingItem[] = (Object.keys(pontuacoes) as LinguagemAmor[]).map((linguagem) => ({
    linguagem,
    pontos: pontuacoes[linguagem],
    pct: Math.round((pontuacoes[linguagem] / total) * 1000) / 10,
    posicao: 0,
  }));

  ranking.sort((x, y) => {
    if (y.pontos !== x.pontos) return y.pontos - x.pontos;
    return ORDEM_DESEMPATE.indexOf(x.linguagem) - ORDEM_DESEMPATE.indexOf(y.linguagem);
  });

  ranking.forEach((item, idx) => {
    item.posicao = idx + 1;
  });

  return {
    pontuacoes,
    ranking,
    principal: ranking[0].linguagem,
    secundaria: ranking[1].linguagem,
    terciaria: ranking[2].linguagem,
    anti: ranking[4].linguagem,
  };
}
