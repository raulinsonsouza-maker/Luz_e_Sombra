import type { AlertaQualidade, DimensaoPerfil, LadoEscolha, MetricasQualidade, ParForcado } from "../types.js";

function proporcaoLado(pares: ParForcado[], answers: Record<string, LadoEscolha>, lado: LadoEscolha): number {
  if (pares.length === 0) return 0;
  const count = pares.filter((p) => answers[p.id] === lado).length;
  return count / pares.length;
}

function gapPerfil(perfil: DimensaoPerfil): number {
  const r = perfil.ranking;
  return (r[0]?.pontos ?? 0) - (r[1]?.pontos ?? 0);
}

function spreadPerfil(perfil: DimensaoPerfil): number {
  const r = perfil.ranking;
  return (r[0]?.pontos ?? 0) - (r[4]?.pontos ?? 0);
}

export function calcularMetricas(
  receber: DimensaoPerfil,
  expressar: DimensaoPerfil,
  paresReceber: ParForcado[],
  paresExpressar: ParForcado[],
  answers: Record<string, LadoEscolha>,
  tempoTotalSegundos: number | undefined,
): MetricasQualidade {
  const alertas: AlertaQualidade[] = [];
  const gapReceber = gapPerfil(receber);
  const gapExpressar = gapPerfil(expressar);

  if (tempoTotalSegundos !== undefined && tempoTotalSegundos < 90) {
    alertas.push("FAST_COMPLETION");
  }
  if (proporcaoLado(paresReceber, answers, "a") > 0.8 || proporcaoLado(paresReceber, answers, "b") > 0.8) {
    alertas.push("SIDE_BIAS_RECEBER");
  }
  if (proporcaoLado(paresExpressar, answers, "a") > 0.8 || proporcaoLado(paresExpressar, answers, "b") > 0.8) {
    alertas.push("SIDE_BIAS_EXPRESSAR");
  }
  if (spreadPerfil(receber) < 3) alertas.push("FLAT_PROFILE_RECEBER");
  if (spreadPerfil(expressar) < 3) alertas.push("FLAT_PROFILE_EXPRESSAR");

  let confianca = 100;
  if (alertas.includes("FAST_COMPLETION")) confianca -= 20;
  if (alertas.includes("SIDE_BIAS_RECEBER")) confianca -= 15;
  if (alertas.includes("SIDE_BIAS_EXPRESSAR")) confianca -= 15;
  if (alertas.includes("FLAT_PROFILE_RECEBER")) confianca -= 10;
  if (alertas.includes("FLAT_PROFILE_EXPRESSAR")) confianca -= 10;
  if (tempoTotalSegundos !== undefined && tempoTotalSegundos >= 180 && tempoTotalSegundos <= 600) {
    confianca += 5;
  }
  confianca = Math.max(0, Math.min(100, confianca));

  return {
    confianca,
    alertas,
    perfilEquilibradoReceber: gapReceber <= 2 && receber.principal !== receber.secundaria,
    perfilEquilibradoExpressar: gapExpressar <= 2 && expressar.principal !== expressar.secundaria,
    gapReceber,
    gapExpressar,
  };
}
