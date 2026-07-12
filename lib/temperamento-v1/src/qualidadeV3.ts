import type { AlertaQualidade } from "./qualidade";
import { ITENS_EYSENCK, type RespostaSimNao } from "./itens";

function proporcaoResposta(answers: Record<string, RespostaSimNao>, resposta: RespostaSimNao): number {
  const vals = ITENS_EYSENCK.map((i) => answers[i.id]).filter(Boolean);
  if (vals.length === 0) return 0;
  return vals.filter((v) => v === resposta).length / vals.length;
}

export function calcularAlertasV3(
  answers: Record<string, RespostaSimNao>,
  scoreE: number,
  scoreN: number,
  tempoTotalSegundos: number | undefined,
): AlertaQualidade[] {
  const alertas: AlertaQualidade[] = [];
  if (tempoTotalSegundos !== undefined && tempoTotalSegundos < 45) {
    alertas.push("FAST_COMPLETION");
  }
  const propSim = proporcaoResposta(answers, "sim");
  if (propSim > 0.85 || propSim < 0.15) {
    alertas.push("HIGH_VARIANCE");
  }
  if (Math.abs(scoreE - 50) < 5 && Math.abs(scoreN - 50) < 5) {
    alertas.push("EXTREME_PROFILE");
  }
  return alertas;
}

export function calcularConfiabilidadeV3(
  answers: Record<string, RespostaSimNao>,
  scoreE: number,
  scoreN: number,
  tempoTotalSegundos: number | undefined,
): number {
  let score = 100;
  const alertas = calcularAlertasV3(answers, scoreE, scoreN, tempoTotalSegundos);
  if (alertas.includes("FAST_COMPLETION")) score -= 20;
  if (alertas.includes("HIGH_VARIANCE")) score -= 25;
  if (alertas.includes("EXTREME_PROFILE")) score -= 10;
  if (tempoTotalSegundos !== undefined && tempoTotalSegundos >= 90 && tempoTotalSegundos <= 360) {
    score += 5;
  }
  const dist = Math.sqrt((scoreE - 50) ** 2 + (scoreN - 50) ** 2);
  if (dist >= 20) score += 5;
  return Math.max(0, Math.min(100, score));
}
