import type { ConfiancaLabel, DimensaoPerfil, LinguagemAmor, PontuacaoPorLinguagem, RankingItem } from "../types.js";

export function montarDimensaoPerfil(
  pontuacoes: PontuacaoPorLinguagem,
  total: number,
): DimensaoPerfil {
  const ranking: RankingItem[] = (Object.keys(pontuacoes) as LinguagemAmor[]).map((linguagem) => ({
    linguagem,
    pontos: pontuacoes[linguagem],
    pct: total > 0 ? Math.round((pontuacoes[linguagem] / total) * 1000) / 10 : 0,
    posicao: 0,
  }));

  ranking.sort((x, y) => {
    if (y.pontos !== x.pontos) return y.pontos - x.pontos;
    return 0;
  });

  ranking.forEach((item, idx) => {
    item.posicao = idx + 1;
  });

  const empatePrincipal = ranking[0].pontos === ranking[1].pontos;

  return {
    pontuacoes,
    ranking,
    principal: ranking[0].linguagem,
    secundaria: ranking[1].linguagem,
    terciaria: ranking[2].linguagem,
    anti: ranking[4].linguagem,
    empatePrincipal,
  };
}

export function normalizarDistribuicao(ranking: RankingItem[]): RankingItem[] {
  const total = ranking.reduce((s, r) => s + r.pontos, 0);
  if (total === 0) return ranking;
  return ranking.map((r) => ({
    ...r,
    pct: Math.round((r.pontos / total) * 1000) / 10,
  }));
}

export function confiancaLabelDe(valor: number): ConfiancaLabel {
  if (valor >= 80) return "alta";
  if (valor >= 60) return "media";
  return "baixa";
}
