import type {
  EstruturaTraco,
  EstruturasPct,
  EvidenciaItem,
  MarcadoresAgregados,
} from "./types.js";

const ESTRUTURAS: EstruturaTraco[] = [
  "esquizoide",
  "oral",
  "psicopata",
  "masoquista",
  "rigido",
];

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** Band linear 0–1 entre min e max. */
function band(v: number | null, min: number, max: number): number {
  if (v === null || !Number.isFinite(v)) return 0;
  if (max <= min) return 0;
  return clamp((v - min) / (max - min), 0, 1);
}

/** Converte logits em percentagens inteiras que somam 100. */
export function logitsParaPercentuais(logits: Record<EstruturaTraco, number>): EstruturasPct {
  const keys = ESTRUTURAS;
  const mx = Math.max(...keys.map((k) => logits[k]));
  const exp = keys.map((k) => Math.exp(logits[k] - mx));
  const s = exp.reduce((a, b) => a + b, 0);
  const raw = keys.map((_, i) => ((exp[i] ?? 0) / s) * 100);
  const floors = raw.map((v) => Math.floor(v));
  let sumFloors = floors.reduce((a, b) => a + b, 0);
  const rem = 100 - sumFloors;
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
}

/**
 * Pontua estruturas a partir de métricas agregadas + lista de evidências para auditoria.
 * Sem “EPS” artificial: baixa qualidade deve aparecer em confiancaAnalise, não em empate forçado.
 */
export function scoreEstruturas(input: ScoreInput): {
  estruturas: EstruturasPct;
  evidencias: EvidenciaItem[];
  logits: Record<EstruturaTraco, number>;
} {
  const { ag } = input;
  const ev: EvidenciaItem[] = [];

  const logits: Record<EstruturaTraco, number> = {
    esquizoide: 0,
    oral: 0,
    psicopata: 0,
    masoquista: 0,
    rigido: 0,
  };

  const push = (e: EstruturaTraco, peso: number, descricao: string) => {
    logits[e] += peso;
    ev.push({ estrutura: e, peso, descricao });
  };

  const shr = ag.shrMedio;
  const wsr = ag.wsrMedio;
  const ulr = ag.ulrMedio;
  const symm = ag.simetriaMedia;
  const dens = ag.densidadeMedia;
  const def = ag.definicaoMedia;
  const lean = ag.inclinacaoMedia;
  const chest = ag.projecaoPeitoMedia;

  // Psicópata — V / domínio superior
  if (shr !== null) {
    if (shr > 1.42) push("psicopata", 2.2, `OMR alto (${shr.toFixed(2)}): ombros dominantes vs quadril.`);
    else if (shr > 1.28) push("psicopata", 1.5, `OMR elevado (${shr.toFixed(2)}).`);
    else if (shr > 1.12) push("psicopata", 0.85, `OMR moderado (${shr.toFixed(2)}).`);
    else if (shr < 0.92) push("psicopata", -0.6, `OMR baixo (${shr.toFixed(2)}) — menos evidência de silhueta em V.`);
  }

  if (ulr !== null) {
    if (ulr > 1.28) push("psicopata", 1.1, `Massa/visual superior dominante (razão vertical ${ulr.toFixed(2)}).`);
    else if (ulr > 1.08) push("psicopata", 0.55, `Leve predominância superior (${ulr.toFixed(2)}).`);
    else if (ulr < 0.82) push("oral", 1.2, `Predominância inferior / colapso superior (${ulr.toFixed(2)}).`);
    else if (ulr < 0.95) push("oral", 0.65, `Volume relativamente mais baixo no tronco (${ulr.toFixed(2)}).`);
  }

  if (chest !== null && chest > 0.02) push("psicopata", 0.7 + band(chest, 0.02, 0.08), "Projeção anterior do tronco.");

  if (lean !== null) {
    if (lean > 0.04) push("psicopata", 1.0 + band(lean, 0.04, 0.14), `Inclinação anterior no perfil (${lean.toFixed(3)}).`);
    else if (lean < -0.04) push("oral", 0.85, `Recuo / colapso anterior (${lean.toFixed(3)}).`);
  }

  // Masoquista — quadril / densidade
  if (shr !== null && shr < 0.88) push("masoquista", 1.8, `Quadril dominante (OMR ${shr.toFixed(2)}).`);
  else if (shr !== null && shr < 1.0) push("masoquista", 0.75, `OMR baixo (${shr.toFixed(2)}).`);

  if (dens !== null && dens > 0.35) push("masoquista", 1.1 + band(dens, 0.35, 0.55), `Corpo ocupa muito do quadro (${(dens * 100).toFixed(0)}% máscara).`);
  else if (dens !== null && dens > 0.22) push("masoquista", 0.55, `Ocupação corporal elevada na imagem.`);

  if (wsr !== null && wsr > 0.88) push("masoquista", 0.85, `Cintura larga vs quadril (WSR ${wsr.toFixed(2)}).`);

  // Esquizóide — assimetria / estreitez
  if (symm !== null && symm < 0.78) push("esquizoide", 1.3 + (1 - symm), `Assimetria bilateral (${symm.toFixed(2)}).`);
  else if (symm !== null && symm < 0.85) push("esquizoide", 0.55, `Assimetria leve (${symm.toFixed(2)}).`);

  if (shr !== null && shr < 1.05 && shr > 0.92 && dens !== null && dens < 0.14)
    push("esquizoide", 0.65, "Silhueta estreita com pouca ocupação.");

  // Oral — colapso / baixo ulr já tratado
  if (ulr !== null && ulr < 0.88) push("oral", 0.45, "Reforço: distribuição inferior.");

  // Rígido — simetria + definição + OMR equilibrado
  if (symm !== null && symm > 0.88) push("rigido", 1.2 + band(symm, 0.88, 0.97), `Alta simetria (${symm.toFixed(2)}).`);
  if (def !== null && def > 0.22) push("rigido", 0.65 + band(def, 0.22, 0.45), `Definição / bordas na máscara (${def.toFixed(2)}).`);
  if (shr !== null && shr > 1.05 && shr < 1.32 && symm !== null && symm > 0.82)
    push("rigido", 0.85, "Proporções equilibradas entre ombros e quadril.");

  // Penalidades cruzadas leves
  if (symm !== null && symm > 0.92) push("esquizoide", -0.35, "Simetria alta reduz leitura esquizóide.");

  const estruturas = logitsParaPercentuais(logits);
  return { estruturas, evidencias: ev, logits };
}

export function rankingPrincipalSecundaria(
  pct: EstruturasPct
): { principal: EstruturaTraco; secundaria: EstruturaTraco } {
  const sorted = (Object.entries(pct) as [EstruturaTraco, number][]).sort((a, b) => b[1] - a[1]);
  return { principal: sorted[0]![0], secundaria: sorted[1]![0] };
}
