import type { Eixo, MetricasResumo, ModeloMultimodalScores } from "./types";

const EIXOS_LIST = ["controle", "retracao", "dependencia", "expansao", "rigidez"] as const;

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export const VERSAO_IMAGEM_EIXOS = "imagem_eixos_v1";

/**
 * Proxies determinísticos a partir de `MetricasResumo` (silhueta / postura).
 * Não usa landmarks faciais; calibrar com `VERSAO_IMAGEM_EIXOS`.
 */
export function metricasResumoParaEixos01(agg: MetricasResumo["agregado"]): Record<Eixo, number> {
  const {
    shrMedio,
    whrMedio,
    symmMedio,
    forwardLeanMedio,
    edgeDensityMedio,
    chestExpansionProxy,
    pernasMedio,
    ulrMedio,
  } = agg;

  // Proxies 0–1 alinhados ao espírito do plano (não medições clínicas diretas).
  const proxyJawShoulderTension = clamp01(edgeDensityMedio * 1.15);
  const proxyShoulderForward = clamp01(forwardLeanMedio + 0.35);
  const proxyChestExpansion = clamp01((chestExpansionProxy - 0.75) / 0.45);
  const proxyGazeDisconnect = clamp01(1 - symmMedio);
  const proxyStance = clamp01((pernasMedio - 0.08) / 0.2);
  const proxyPelvicStability = clamp01(1 - Math.abs(whrMedio - 0.72) / 0.28);
  const proxyLegTension = clamp01(edgeDensityMedio * (ulrMedio > 1.2 ? 1.1 : 1) * 1.05);
  const shrSignal = clamp01((shrMedio - 0.82) / 0.38);

  const controle =
    0.32 * proxyJawShoulderTension + 0.28 * shrSignal + 0.25 * clamp01(whrMedio) + 0.15 * proxyShoulderForward;

  const retracao =
    0.38 * (1 - proxyChestExpansion) + 0.32 * proxyShoulderForward + 0.3 * proxyGazeDisconnect;

  const expansao =
    0.48 * proxyChestExpansion + 0.32 * proxyStance + 0.2 * (1 - proxyShoulderForward);

  const rigidez =
    0.34 * proxyLegTension + 0.33 * proxyJawShoulderTension + 0.33 * clamp01(shrSignal * 0.7 + edgeDensityMedio * 0.3);

  const dependencia =
    0.38 * (1 - proxyStance) + 0.32 * (1 - proxyPelvicStability) + 0.3 * proxyShoulderForward;

  const raw = { controle, retracao, dependencia, expansao, rigidez };
  const out = {} as Record<Eixo, number>;
  for (const k of EIXOS_LIST) out[k] = clamp01(raw[k]);
  return out;
}

export function metricasResumoParaScores100(m: MetricasResumo): ModeloMultimodalScores {
  const r = metricasResumoParaEixos01(m.agregado);
  const s = {} as ModeloMultimodalScores;
  for (const k of EIXOS_LIST) s[k] = Math.round(100 * r[k]);
  return s;
}
