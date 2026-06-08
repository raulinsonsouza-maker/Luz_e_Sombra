import {
  aplicarAjustesReich,
  calcularEixosReich,
  calcularSegmentosReich,
  eixosParaLogitsBase,
  VERSAO_EIXOS_REICH,
} from "./eixosReich.js";
import type {
  EstruturaTraco,
  EstruturasPct,
  EvidenciaItem,
  MarcadoresAgregados,
  MarcadoresFoto,
} from "./types.js";

const ESTRUTURAS: EstruturaTraco[] = [
  "esquizoide",
  "oral",
  "psicopata",
  "masoquista",
  "rigido",
];

/** Temperatura do softmax — valores maiores = distribuição menos extrema. */
export const LOGIT_TEMPERATURE = 1.4;

export { VERSAO_EIXOS_REICH };

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** Converte logits em percentagens inteiras que somam 100. */
export function logitsParaPercentuais(
  logits: Record<EstruturaTraco, number>,
  temperature = LOGIT_TEMPERATURE
): EstruturasPct {
  const keys = ESTRUTURAS;
  const mx = Math.max(...keys.map((k) => logits[k]));
  const exp = keys.map((k) => Math.exp((logits[k] - mx) / temperature));
  const s = exp.reduce((a, b) => a + b, 0);
  const raw = keys.map((_, i) => ((exp[i] ?? 0) / s) * 100);
  const floors = raw.map((v) => Math.floor(v));
  const rem = 100 - floors.reduce((a, b) => a + b, 0);
  const frac = keys.map((_, i) => ({ i, r: raw[i]! - floors[i]! }));
  frac.sort((a, b) => b.r - a.r);
  const out = {} as EstruturasPct;
  keys.forEach((k, i) => {
    out[k] = floors[i] ?? 0;
  });
  for (let j = 0; j < rem; j++) {
    const ki = keys[frac[j]?.i ?? 0];
    if (ki) out[ki] += 1;
  }
  return out;
}

export interface ScoreInput {
  ag: MarcadoresAgregados;
  /** Cobertura de fotos 1–3. */
  numFotos: number;
  /** Foto de rosto para eixos Reich (opcional). */
  fotoRosto?: MarcadoresFoto | null;
}

/**
 * Pontua estruturas via camada Reich/Lowen (eixos_v2) + ajustes auditáveis.
 */
export function scoreEstruturas(input: ScoreInput): {
  estruturas: EstruturasPct;
  evidencias: EvidenciaItem[];
  logits: Record<EstruturaTraco, number>;
} {
  const { ag, fotoRosto } = input;
  const eixos = ag.eixosReich ?? calcularEixosReich(ag, fotoRosto);
  const segmentos = ag.segmentosReich ?? calcularSegmentosReich(ag, eixos, fotoRosto);

  ag.eixosReich = eixos;
  ag.segmentosReich = segmentos;

  const logits = eixosParaLogitsBase(eixos);
  const ev: EvidenciaItem[] = [];

  const eixoMap: [keyof typeof eixos, EstruturaTraco][] = [
    ["indiceExpansao", "psicopata"],
    ["indiceRetracao", "oral"],
    ["indiceContencao", "rigido"],
    ["indiceCompressao", "masoquista"],
    ["indiceFragmentacao", "esquizoide"],
  ];
  for (const [k, est] of eixoMap) {
    const v = eixos[k];
    if (v > 0.35) {
      ev.push({
        estrutura: est,
        peso: Math.round(v * 100) / 100,
        descricao: `Eixo Reich ${k}: ${v.toFixed(2)}`,
      });
    }
  }

  const ajustes = aplicarAjustesReich(logits, { ag, eixos });
  ev.push(...ajustes);

  const estruturas = logitsParaPercentuais(logits);
  return { estruturas, evidencias: ev, logits };
}

export function rankingPrincipalSecundaria(
  pct: EstruturasPct
): { principal: EstruturaTraco; secundaria: EstruturaTraco } {
  const sorted = (Object.entries(pct) as [EstruturaTraco, number][]).sort((a, b) => b[1] - a[1]);
  return { principal: sorted[0]![0], secundaria: sorted[1]![0] };
}
