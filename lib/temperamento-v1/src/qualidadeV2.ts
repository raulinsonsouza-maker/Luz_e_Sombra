import type { TemperamentoCodigo } from "./types";
import { TEMPERAMENTOS } from "./types";
import type { AlertaQualidade } from "./qualidade";
import type { LadoEscolha, ParForcadoTemperamento } from "./pares";

function proporcaoLado(pares: readonly ParForcadoTemperamento[], answers: Record<string, LadoEscolha>, lado: LadoEscolha): number {
  if (pares.length === 0) return 0;
  return pares.filter((p) => answers[p.id] === lado).length / pares.length;
}

function gapTemperamentos(votos: Record<TemperamentoCodigo, number>): number {
  const ord = [...TEMPERAMENTOS].map((t) => votos[t]!).sort((a, b) => b - a);
  return (ord[0] ?? 0) - (ord[1] ?? 0);
}

export function calcularAlertasV2(
  pares: readonly ParForcadoTemperamento[],
  answers: Record<string, LadoEscolha>,
  votos: Record<TemperamentoCodigo, number>,
  tempoTotalSegundos: number | undefined,
): AlertaQualidade[] {
  const alertas: AlertaQualidade[] = [];
  if (tempoTotalSegundos !== undefined && tempoTotalSegundos < 60) {
    alertas.push("FAST_COMPLETION");
  }
  if (proporcaoLado(pares, answers, "a") > 0.8 || proporcaoLado(pares, answers, "b") > 0.8) {
    alertas.push("HIGH_VARIANCE");
  }
  if (gapTemperamentos(votos) < 2) {
    alertas.push("EXTREME_PROFILE");
  }
  return alertas;
}

export function calcularConfiabilidadeV2(
  pares: readonly ParForcadoTemperamento[],
  answers: Record<string, LadoEscolha>,
  votos: Record<TemperamentoCodigo, number>,
  tempoTotalSegundos: number | undefined,
): number {
  let score = 100;
  const alertas = calcularAlertasV2(pares, answers, votos, tempoTotalSegundos);
  if (alertas.includes("FAST_COMPLETION")) score -= 20;
  if (alertas.includes("HIGH_VARIANCE")) score -= 25;
  if (alertas.includes("EXTREME_PROFILE")) score -= 15;
  if (tempoTotalSegundos !== undefined && tempoTotalSegundos >= 120 && tempoTotalSegundos <= 480) {
    score += 5;
  }
  const gap = gapTemperamentos(votos);
  if (gap >= 4) score += 5;
  return Math.max(0, Math.min(100, score));
}
