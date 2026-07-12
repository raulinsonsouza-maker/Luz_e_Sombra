import type {
  AlertaQualidade,
  DimensaoPerfil,
  LadoEscolha,
  MetricasQualidade,
  ParForcado,
} from "../types.js";
import { confiancaLabelDe } from "./ranking.js";
import { gapPerfil, intensidadeDeGap } from "./pontuar.js";

function proporcaoLado(pares: ParForcado[], answers: Record<string, LadoEscolha>, lado: LadoEscolha): number {
  if (pares.length === 0) return 0;
  const count = pares.filter((p) => answers[p.id] === lado).length;
  return count / pares.length;
}

function spreadPerfil(perfil: DimensaoPerfil): number {
  const r = perfil.ranking;
  return (r[0]?.pontos ?? 0) - (r[4]?.pontos ?? 0);
}

export function calcularMetricas(input: {
  receber: DimensaoPerfil;
  expressar: DimensaoPerfil;
  paresReceber: ParForcado[];
  paresExpressar: ParForcado[];
  answers: Record<string, LadoEscolha>;
  tempoTotalSegundos: number | undefined;
  desempateUsado: boolean;
}): MetricasQualidade {
  const { receber, expressar, paresReceber, paresExpressar, answers, tempoTotalSegundos, desempateUsado } = input;
  const alertas: AlertaQualidade[] = [];
  const gapReceber = gapPerfil(receber);
  const gapExpressar = gapPerfil(expressar);

  if (tempoTotalSegundos !== undefined && tempoTotalSegundos < 60) {
    alertas.push("FAST_COMPLETION");
  }
  if (proporcaoLado(paresReceber, answers, "a") > 0.8 || proporcaoLado(paresReceber, answers, "b") > 0.8) {
    alertas.push("SIDE_BIAS_RECEBER");
  }
  if (paresExpressar.length > 0) {
    if (proporcaoLado(paresExpressar, answers, "a") > 0.8 || proporcaoLado(paresExpressar, answers, "b") > 0.8) {
      alertas.push("SIDE_BIAS_EXPRESSAR");
    }
  }
  if (spreadPerfil(receber) < 4) alertas.push("FLAT_PROFILE_RECEBER");
  if (paresExpressar.length > 0 && spreadPerfil(expressar) < 2) alertas.push("FLAT_PROFILE_EXPRESSAR");

  let confianca = 100;
  if (alertas.includes("FAST_COMPLETION")) confianca -= 20;
  if (alertas.includes("SIDE_BIAS_RECEBER")) confianca -= 15;
  if (alertas.includes("SIDE_BIAS_EXPRESSAR")) confianca -= 15;
  if (alertas.includes("FLAT_PROFILE_RECEBER")) confianca -= 10;
  if (alertas.includes("FLAT_PROFILE_EXPRESSAR")) confianca -= 5;
  if (desempateUsado) confianca += 10;
  if (tempoTotalSegundos !== undefined && tempoTotalSegundos >= 120 && tempoTotalSegundos <= 480) {
    confianca += 5;
  }
  confianca = Math.max(0, Math.min(100, confianca));

  return {
    confianca,
    confiancaLabel: confiancaLabelDe(confianca),
    intensidade: intensidadeDeGap(gapReceber),
    alertas,
    perfilEquilibradoReceber: gapReceber <= 2 && receber.principal !== receber.secundaria,
    perfilEquilibradoExpressar: gapExpressar <= 1 && expressar.principal !== expressar.secundaria,
    gapReceber,
    gapExpressar,
    desempateUsado,
  };
}
