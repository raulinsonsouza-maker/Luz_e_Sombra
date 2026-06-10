import type { TemperamentoCodigo, Dimensao } from "./types";
import { TEMPERAMENTOS, DIMENSOES } from "./types";
import type { LadoEscolha, ParForcadoTemperamento } from "./pares";

const ZERO: Record<TemperamentoCodigo, number> = {
  COLERICO: 0,
  SANGUINEO: 0,
  MELANCOLICO: 0,
  FLEUMATICO: 0,
};

/** Perfil dimensional médio por temperamento (para narrativa v3). */
const PERFIL_DIM: Record<TemperamentoCodigo, Record<Dimensao, number>> = {
  COLERICO: { ENG: 0.85, SOC: 0.55, DOM: 0.9, EST: 0.35, PRO: 0.45 },
  SANGUINEO: { ENG: 0.8, SOC: 0.9, DOM: 0.5, EST: 0.4, PRO: 0.35 },
  MELANCOLICO: { ENG: 0.4, SOC: 0.35, DOM: 0.5, EST: 0.65, PRO: 0.85 },
  FLEUMATICO: { ENG: 0.3, SOC: 0.4, DOM: 0.3, EST: 0.85, PRO: 0.55 },
};

export function pontuarPares(
  pares: readonly ParForcadoTemperamento[],
  answers: Record<string, LadoEscolha>,
): Record<TemperamentoCodigo, number> {
  const votos = { ...ZERO };
  for (const par of pares) {
    const lado = answers[par.id];
    if (lado === "a") votos[par.temperamentoA]++;
    else if (lado === "b") votos[par.temperamentoB]++;
  }
  return votos;
}

export function dimensoesFromVotos(
  votos: Record<TemperamentoCodigo, number>,
  total: number,
): Record<Dimensao, { bruto: number; normalizado: number }> {
  const out = {} as Record<Dimensao, { bruto: number; normalizado: number }>;
  for (const d of DIMENSOES) {
    let weighted = 0;
    for (const t of TEMPERAMENTOS) {
      weighted += (votos[t]! / total) * PERFIL_DIM[t][d];
    }
    out[d] = { bruto: weighted * total, normalizado: Math.round(weighted * 1000) / 1000 };
  }
  return out;
}
