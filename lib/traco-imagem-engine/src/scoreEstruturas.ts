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

/** Temperatura do softmax — valores maiores = distribuição menos extrema. */
export const LOGIT_TEMPERATURE = 1.4;

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
}

/**
 * Pontua estruturas a partir de métricas agregadas + lista de evidências para auditoria.
 * v2: menos viés para Masoquista; Oral/Rígido fortalecidos com novos marcadores posturais.
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
  const def = ag.definicaoMedia;
  const lean = ag.inclinacaoMedia;
  const chest = ag.projecaoPeitoMedia;
  const cran = ag.projecaoCranianaMedia;
  const ombros = ag.ombrosAdiantadosMedio;
  const colapso = ag.colapsoToracicoMedio;

  // ── Psicópata — V / domínio superior ─────────────────────────────────────
  if (shr !== null) {
    if (shr > 1.42) push("psicopata", 2.2, `OMR alto (${shr.toFixed(2)}): ombros dominantes vs quadril.`);
    else if (shr > 1.28) push("psicopata", 1.5, `OMR elevado (${shr.toFixed(2)}).`);
    else if (shr > 1.12) push("psicopata", 0.85, `OMR moderado (${shr.toFixed(2)}).`);
    else if (shr < 0.92) push("psicopata", -0.6, `OMR baixo (${shr.toFixed(2)}) — menos evidência de silhueta em V.`);
  }

  if (ulr !== null) {
    if (ulr > 1.28) push("psicopata", 1.1, `Massa/visual superior dominante (razão vertical ${ulr.toFixed(2)}).`);
    else if (ulr > 1.08) push("psicopata", 0.55, `Leve predominância superior (${ulr.toFixed(2)}).`);
  }

  if (chest !== null && chest > 0.02)
    push("psicopata", 0.7 + band(chest, 0.02, 0.08), "Projeção anterior do tronco.");

  if (lean !== null && lean > 0.04)
    push("psicopata", 1.0 + band(lean, 0.04, 0.14), `Inclinação anterior no perfil (${lean.toFixed(3)}).`);

  // ── Oral — colapso superior / projeção craniana ───────────────────────────
  if (ulr !== null) {
    if (ulr < 0.82) push("oral", 1.2, `Predominância inferior / colapso superior (${ulr.toFixed(2)}).`);
    else if (ulr < 0.95) push("oral", 0.7, `Volume relativamente mais baixo no tronco (${ulr.toFixed(2)}).`);
    else if (ulr <= 1.08 && ((cran !== null && cran > 0.04) || (ombros !== null && ombros > 0.04)))
      push("oral", 0.5, `ULR neutro (${ulr.toFixed(2)}) com sinais posturais de colapso anterior.`);
  }

  if (lean !== null && lean < -0.04)
    push("oral", 0.85, `Recuo / colapso anterior no perfil (${lean.toFixed(3)}).`);

  if (cran !== null && cran > 0.06)
    push("oral", 0.9 + band(cran, 0.06, 0.18), `Projeção craniana no perfil (${cran.toFixed(3)}).`);
  else if (cran !== null && cran > 0.035)
    push("oral", 0.45, `Leve projeção craniana (${cran.toFixed(3)}).`);

  if (ombros !== null && ombros > 0.05)
    push("oral", 0.8 + band(ombros, 0.05, 0.14), `Ombros adiantados vs pelve (${ombros.toFixed(3)}).`);

  if (colapso !== null && colapso > 0.52)
    push("oral", 1.0 + band(colapso, 0.52, 0.72), `Colapso torácico na frente (${colapso.toFixed(2)}).`);
  else if (colapso !== null && colapso > 0.42)
    push("oral", 0.45, `Leve colapso torácico (${colapso.toFixed(2)}).`);

  // ── Masoquista — exige sinais fortes combinados (sem densidade de enquadramento) ─
  let sinaisMasoquista = 0;
  if (shr !== null && shr < 0.85) {
    push("masoquista", 1.2, `Quadril claramente dominante (OMR ${shr.toFixed(2)}).`);
    sinaisMasoquista++;
  } else if (shr !== null && shr < 0.88) {
    push("masoquista", 0.55, `OMR baixo (${shr.toFixed(2)}).`);
    sinaisMasoquista++;
  }

  if (shr !== null && shr < 0.85 && ulr !== null && ulr < 0.9) {
    push("masoquista", 0.5, `Quadril dominante com massa inferior (${ulr.toFixed(2)}).`);
    sinaisMasoquista++;
  }

  if (wsr !== null && wsr > 1.05 && shr !== null && shr < 0.92) {
    push("masoquista", 0.5, `Cintura larga vs quadril com OMR baixo (WSR ${wsr.toFixed(2)}).`);
    sinaisMasoquista++;
  }

  if (sinaisMasoquista === 0 && shr !== null && shr >= 0.88 && shr <= 1.08) {
    push("masoquista", -0.35, "OMR equilibrado — sem evidência masoquista por proporção.");
  }

  // ── Esquizóide — assimetria / estreitez ───────────────────────────────────
  if (symm !== null && symm < 0.78) push("esquizoide", 1.3 + (1 - symm), `Assimetria bilateral (${symm.toFixed(2)}).`);
  else if (symm !== null && symm < 0.85) push("esquizoide", 0.55, `Assimetria leve (${symm.toFixed(2)}).`);

  if (shr !== null && shr < 1.05 && shr > 0.92 && ag.densidadeMedia !== null && ag.densidadeMedia < 0.14)
    push("esquizoide", 0.65, "Silhueta estreita com pouca ocupação.");

  // ── Rígido — simetria + definição + OMR equilibrado ────────────────────────
  if (symm !== null && symm > 0.88) push("rigido", 1.2 + band(symm, 0.88, 0.97), `Alta simetria (${symm.toFixed(2)}).`);
  if (def !== null && def > 0.22) push("rigido", 0.65 + band(def, 0.22, 0.45), `Definição / bordas na máscara (${def.toFixed(2)}).`);
  if (shr !== null && shr > 1.0 && shr < 1.32 && symm !== null && symm > 0.82)
    push("rigido", 0.85, "Proporções equilibradas entre ombros e quadril.");

  // ── Penalidades cruzadas ──────────────────────────────────────────────────
  if (symm !== null && symm > 0.92) push("esquizoide", -0.35, "Simetria alta reduz leitura esquizóide.");

  if (symm !== null && symm > 0.88) {
    push("masoquista", -0.6, `Simetria alta (${symm.toFixed(2)}) contradiz compressão masoquista.`);
    if (def !== null && def > 0.22)
      push("rigido", 0.4, "Simetria + definição reforçam organização rígida.");
  }

  const estruturas = logitsParaPercentuais(logits);
  return { estruturas, evidencias: ev, logits };
}

export function rankingPrincipalSecundaria(
  pct: EstruturasPct
): { principal: EstruturaTraco; secundaria: EstruturaTraco } {
  const sorted = (Object.entries(pct) as [EstruturaTraco, number][]).sort((a, b) => b[1] - a[1]);
  return { principal: sorted[0]![0], secundaria: sorted[1]![0] };
}
