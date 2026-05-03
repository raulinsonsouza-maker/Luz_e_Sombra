import type { Dimensao } from "./types";

export type AlertaQualidade =
  | "HIGH_VARIANCE"
  | "FAST_COMPLETION"
  | "EXTREME_PROFILE";

/** Desvio padrão populacional (n = 40). */
export function desvioPadrao(valores: number[]): number {
  if (valores.length === 0) return 0;
  const m = valores.reduce((a, b) => a + b, 0) / valores.length;
  const v = valores.reduce((s, x) => s + (x - m) ** 2, 0) / valores.length;
  return Math.sqrt(v);
}

export function proporcaoRespostas3(valores: number[]): number {
  if (valores.length === 0) return 0;
  return valores.filter((x) => x === 3).length / valores.length;
}

export function calcularAlertas(
  valoresResposta: number[],
  tempoTotalSegundos: number | undefined,
  scoresNormalizados: Record<Dimensao, number>,
): AlertaQualidade[] {
  const alertas: AlertaQualidade[] = [];
  const dp = desvioPadrao(valoresResposta);
  if (dp > 2.0) alertas.push("HIGH_VARIANCE");
  if (tempoTotalSegundos !== undefined && tempoTotalSegundos < 90) {
    alertas.push("FAST_COMPLETION");
  }
  const dims: Dimensao[] = ["ENG", "SOC", "DOM", "EST", "PRO"];
  for (const d of dims) {
    const s = scoresNormalizados[d];
    if (s < 0.05 || s > 0.95) {
      alertas.push("EXTREME_PROFILE");
      break;
    }
  }
  return alertas;
}

/**
 * Módulo 7.2 — índice 0–100.
 */
export function calcularConfiabilidade(
  valoresResposta: number[],
  tempoTotalSegundos: number | undefined,
): number {
  let score = 100;
  const dp = desvioPadrao(valoresResposta);
  const prop3 = proporcaoRespostas3(valoresResposta);
  const t = tempoTotalSegundos;

  if (dp < 0.5) score -= 30;
  if (prop3 > 0.7) score -= 25;
  if (t !== undefined && t < 90) score -= 20;
  if (t !== undefined && t > 1800) score -= 10;

  if (dp > 0.8 && dp < 1.5) score += 5;
  if (t !== undefined && t >= 180 && t <= 600) score += 5;

  return Math.max(0, Math.min(100, score));
}
