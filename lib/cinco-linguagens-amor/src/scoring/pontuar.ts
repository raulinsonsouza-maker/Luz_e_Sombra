import type { DimensaoPerfil, IntensidadePerfil, LinguagemAmor, LadoEscolha, ParForcado } from "../types.js";

const ZERO: Record<LinguagemAmor, number> = {
  palavras: 0,
  tempo: 0,
  presentes: 0,
  servicos: 0,
  toque: 0,
};

function addPoint(acc: Record<LinguagemAmor, number>, lang: LinguagemAmor): void {
  acc[lang] += 1;
}

export function pontuarBloco(
  pares: ParForcado[],
  answers: Record<string, LadoEscolha>,
): Record<LinguagemAmor, number> {
  const pontuacoes = { ...ZERO };
  for (const par of pares) {
    const lado = answers[par.id];
    if (lado === "a") addPoint(pontuacoes, par.linguagemA);
    else if (lado === "b") addPoint(pontuacoes, par.linguagemB);
  }
  return pontuacoes;
}

export function mesclarPontuacoes(
  base: Record<LinguagemAmor, number>,
  extra: Record<LinguagemAmor, number>,
): Record<LinguagemAmor, number> {
  const out = { ...ZERO };
  for (const lang of Object.keys(out) as LinguagemAmor[]) {
    out[lang] = base[lang] + extra[lang];
  }
  return out;
}

export function intensidadeDeGap(gap: number): IntensidadePerfil {
  if (gap >= 3) return "forte";
  if (gap === 2) return "moderada";
  return "equilibrada";
}

export function gapPerfil(perfil: DimensaoPerfil): number {
  return (perfil.ranking[0]?.pontos ?? 0) - (perfil.ranking[1]?.pontos ?? 0);
}
