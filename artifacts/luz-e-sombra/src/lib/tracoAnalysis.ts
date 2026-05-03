/**
 * Traço de Caráter — Biomechanical Analysis Engine v2
 *
 * Runs entirely in the browser via Canvas API.
 * Zero external API calls, zero AI credits.
 *
 * Methodology: Based on the Bioenergetic Analysis of Alexander Lowen
 * and Character Analysis of Wilhelm Reich. Measures physical markers
 * visible in photos to identify dominant character structures.
 */

import type { MetricasFotoResumo, MetricasResumo } from "@workspace/traco-eixos-multimodal";

export type TipoFoto = "rosto" | "corpo-frente" | "corpo-lado";

export interface EstruturasPct {
  esquizoide: number;
  oral: number;
  psicopata: number;
  masoquista: number;
  rigido: number;
}

export interface EstiloComunicacao {
  tipo: string;
  descricao: string;
  emGrupos: string;
  emRelacoes: string;
  emConflito: string;
  emTensao: string;
}

export interface DinamicaFuncional {
  trabalho: string;
  relacoes: string;
  estresse: string;
  decisoes: string;
  energia: string;
  sombra: string;
}

export interface ResultadoAnalise {
  estruturas: EstruturasPct;
  estruturaPrincipal: keyof EstruturasPct;
  estruturaSecundaria: keyof EstruturasPct;
  observacoesPorFoto: Partial<Record<TipoFoto, string>>;
  padraoPostural: string;
  caracteristicasFisicasObservadas: string[];
  interpretacao: string;
  centroEnergetico: string;
  padraoEnergetico: string;
  mensagemTerapeutica: string;
  dominanteApelido: string;
  fraseIdentidade: string;
  pontosFortes: string[];
  pontosAtencao: string[];
  ferida: string;
  recurso: string;
  recomendacoesPraticas: string[];
  confiancaAnalise: number;
  perfilFisicoNarrado: string;
  // New deep-insight fields
  estiloComunicacao: EstiloComunicacao;
  perfilUnico: string;
  dinamicaFuncional: DinamicaFuncional;
  metadata?: {
    analysisVersion: string;
    confidenceBreakdown: {
      imageQuality: number;
      bodyDetection: number;
      photoCoverage: number;
      featureVariance: number;
    };
    featureSummary: {
      mediaSimetria: number;
      mediaDensidadeCorporal: number;
      mediaRazaoOmbroQuadril: number;
      mediaMassaSuperiorInferior: number;
      varianciaEntreFotos: number;
    };
  };
  /** Agregação estável das métricas por foto (para modelo multimodal / API). */
  metricasResumo?: MetricasResumo;
}

// ── Image loading ──────────────────────────────────────────────────────────────

export interface PixelData {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
}

async function loadFromSrc(src: string): Promise<PixelData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const MAX = 480;
      const scale = Math.min(MAX / img.naturalWidth, MAX / img.naturalHeight, 1);
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve({ pixels: ctx.getImageData(0, 0, w, h).data, width: w, height: h });
    };
    img.onerror = () => reject(new Error("Falha ao carregar imagem"));
    img.src = src;
  });
}

export async function loadImageFromFile(file: File): Promise<PixelData> {
  const url = URL.createObjectURL(file);
  try { return await loadFromSrc(url); }
  finally { URL.revokeObjectURL(url); }
}

export async function loadImageFromUrl(url: string, token: string): Promise<PixelData> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Falha ao carregar imagem do servidor");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  try { return await loadFromSrc(objectUrl); }
  finally { URL.revokeObjectURL(objectUrl); }
}

// ── Pixel utilities ────────────────────────────────────────────────────────────

function lum(px: Uint8ClampedArray, x: number, y: number, w: number): number {
  const i = (y * w + x) * 4;
  return px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114;
}

function rgb(px: Uint8ClampedArray, x: number, y: number, w: number): [number, number, number] {
  const i = (y * w + x) * 4;
  return [px[i], px[i + 1], px[i + 2]];
}

function colorDist(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

// ── Background estimation ──────────────────────────────────────────────────────

/**
 * Sample corners and edges of image to build a background color model.
 * Returns threshold above which pixels are "background".
 */
function estimateBackground(px: Uint8ClampedArray, w: number, h: number): {
  bgColor: [number, number, number];
  bgLum: number;
  isDarkBg: boolean;
  threshold: number;
} {
  const samples: [number, number, number][] = [];
  const corners = [
    [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)],
    // Extra edge samples
    [Math.floor(w / 4), 0], [Math.floor(3 * w / 4), 0],
    [Math.floor(w / 4), h - 1], [Math.floor(3 * w / 4), h - 1],
  ];
  for (const [x, y] of corners) samples.push(rgb(px, x, y, w));

  const bgR = samples.reduce((s, c) => s + c[0], 0) / samples.length;
  const bgG = samples.reduce((s, c) => s + c[1], 0) / samples.length;
  const bgB = samples.reduce((s, c) => s + c[2], 0) / samples.length;
  const bgColor: [number, number, number] = [bgR, bgG, bgB];
  const bgLum = bgR * 0.299 + bgG * 0.587 + bgB * 0.114;
  const isDarkBg = bgLum < 100;

  // Threshold: pixel is "body" if color distance from bg > threshold
  const threshold = 35;

  return { bgColor, bgLum, isDarkBg, threshold };
}

function isBodyPixel(
  px: Uint8ClampedArray,
  x: number,
  y: number,
  w: number,
  bgColor: [number, number, number],
  threshold: number
): boolean {
  const c = rgb(px, x, y, w);
  return colorDist(c, bgColor) > threshold;
}

// ── Structural metrics ─────────────────────────────────────────────────────────

interface Metrics {
  tipo: TipoFoto;
  // Width measurements at 20 vertical bands (relative to image width)
  widthBands: number[]; // 20 values, each is body width / image width at that height %
  // Derived proportions
  shoulderW: number;    // avg width in shoulder band (18–28%)
  chestW: number;       // avg width in chest band (28–40%)
  waistW: number;       // avg width in waist band (40–56%)
  hipW: number;         // avg width in hip band (54–68%)
  thighW: number;       // avg width in thigh band (68–80%)
  legW: number;         // avg width in leg band (78–92%)
  // Shape ratios
  shr: number;          // shoulder-to-hip ratio
  whr: number;          // waist-to-hip ratio
  wsr: number;          // waist-to-shoulder ratio
  ulr: number;          // upper mass to lower mass ratio
  // Body quality
  symm: number;         // bilateral symmetry 0–1
  symmQ: number;        // symmetry quality (confidence 0–1)
  bodyPct: number;      // fraction of image occupied by body
  upperMass: number;    // body pixel density top 50%
  lowerMass: number;    // body pixel density bottom 50%
  headRelW: number;     // head width relative to shoulder (face/rosto only)
  headRelH: number;     // head height relative to full image height
  edgeDensityBody: number; // edge density INSIDE body region (muscle definition)
  contrastScore: number; // overall image contrast (0–1, quality indicator)
  bodyDetected: boolean;  // was a body actually found?
  confidence: number;     // 0–1, how reliable are these measurements
  // Side-view specific
  forwardLean: number;  // for corpo-lado: how much does the peak shift forward (0=neutral)
  chestProjection: number; // chest prominence vs hip in side view
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function mean(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((s, v) => s + v, 0) / values.length;
}

function variance(values: number[]): number {
  if (values.length <= 1) return 0;
  const m = mean(values);
  return mean(values.map((v) => (v - m) ** 2));
}

/** Serializa `Metrics` para o pacote multimodal (sem pixels). */
export function buildMetricasResumoFromMetrics(metricsList: Metrics[]): MetricasResumo {
  const fotos: MetricasFotoResumo[] = metricsList.map((m) => ({
    tipo: m.tipo,
    shoulderW: m.shoulderW,
    chestW: m.chestW,
    waistW: m.waistW,
    hipW: m.hipW,
    thighW: m.thighW,
    legW: m.legW,
    shr: m.shr,
    whr: m.whr,
    wsr: m.wsr,
    ulr: m.ulr,
    symm: m.symm,
    bodyPct: m.bodyPct,
    edgeDensityBody: m.edgeDensityBody,
    forwardLean: m.forwardLean,
    chestProjection: m.chestProjection,
    confidence: m.confidence,
  }));

  const safeHip = (hip: number) => Math.max(hip, 0.01);
  const chestOverHip = metricsList.map((m) => m.chestW / safeHip(m.hipW));
  const pernasVals = metricsList.map((m) => (m.thighW + m.legW) / 2);

  const agregado = {
    shrMedio: mean(metricsList.map((m) => m.shr)),
    whrMedio: mean(metricsList.map((m) => m.whr)),
    symmMedio: mean(metricsList.map((m) => m.symm)),
    forwardLeanMedio: mean(metricsList.map((m) => m.forwardLean)),
    chestProjectionMedio: mean(metricsList.map((m) => m.chestProjection)),
    edgeDensityMedio: mean(metricsList.map((m) => m.edgeDensityBody)),
    bodyPctMedio: mean(metricsList.map((m) => m.bodyPct)),
    ulrMedio: mean(metricsList.map((m) => m.ulr)),
    chestExpansionProxy: mean(chestOverHip.length ? chestOverHip : [0.9]),
    pernasMedio: mean(pernasVals.length ? pernasVals : [0.1]),
  };

  return { versao: "metricas_resumo_v1", fotos, agregado };
}

function bandScore(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

function measurePhoto(d: PixelData, tipo: TipoFoto): Metrics {
  const { pixels: px, width: w, height: h } = d;
  const { bgColor, bgLum, isDarkBg, threshold } = estimateBackground(px, w, h);

  const isBody = (x: number, y: number) => isBodyPixel(px, x, y, w, bgColor, threshold);

  // ── Width at band ───────────────────────────────────────────────────────────
  function widthAtBand(from: number, to: number, steps = 8): number {
    let total = 0, valid = 0;
    for (let s = 0; s < steps; s++) {
      const frac = from + (to - from) * s / Math.max(steps - 1, 1);
      const y = Math.round(frac * h);
      if (y < 0 || y >= h) continue;
      let l = -1, r = -1;
      for (let x = 0; x < w; x++) { if (isBody(x, y)) { if (l < 0) l = x; r = x; } }
      if (l >= 0) { total += (r - l) / w; valid++; }
    }
    return valid > 0 ? total / valid : 0;
  }

  // 20-band width scan (every 5% of height)
  const widthBands: number[] = [];
  for (let b = 0; b < 20; b++) {
    const from = b * 0.05;
    const to = from + 0.05;
    widthBands.push(widthAtBand(from, to, 4));
  }

  // ── Mass in band ───────────────────────────────────────────────────────────
  function massInBand(from: number, to: number): number {
    let body = 0, total = 0;
    for (let y = Math.round(from * h); y < Math.round(to * h); y += 2)
      for (let x = 0; x < w; x += 2) { if (isBody(x, y)) body++; total++; }
    return total > 0 ? body / total : 0;
  }

  // ── Symmetry ───────────────────────────────────────────────────────────────
  function computeSymmetry(): { score: number; quality: number } {
    const cx = Math.floor(w / 2);
    let diffSum = 0, samples = 0;
    const bodyRows: number[] = [];

    for (let y = 0; y < h; y += 4) {
      let leftBody = 0, rightBody = 0;
      for (let x = 0; x < cx; x += 3) {
        if (isBody(x, y)) leftBody++;
        if (isBody(w - 1 - x, y)) rightBody++;
      }
      const rowBodyFraction = (leftBody + rightBody) / (2 * Math.ceil(cx / 3));
      if (rowBodyFraction > 0.05) {
        bodyRows.push(y);
        for (let x = 0; x < Math.min(cx, Math.floor(w * 0.45)); x += 3) {
          const lv = lum(px, x, y, w);
          const rv = lum(px, w - 1 - x, y, w);
          diffSum += Math.abs(lv - rv) / 255;
          samples++;
        }
      }
    }
    const quality = Math.min(1, bodyRows.length / (h / 4) * 2);
    const score = samples > 10 ? 1 - diffSum / samples : 0.5;
    return { score: Math.max(0, Math.min(1, score)), quality };
  }

  // ── Edge density inside body ───────────────────────────────────────────────
  function edgeDensityInBody(): number {
    let edgeSum = 0, bodyPixels = 0;
    for (let y = 1; y < h - 1; y += 2) {
      for (let x = 1; x < w - 1; x += 2) {
        if (!isBody(x, y)) continue;
        bodyPixels++;
        const gx = lum(px, x + 1, y, w) - lum(px, x - 1, y, w);
        const gy = lum(px, x, y + 1, w) - lum(px, x, y - 1, w);
        edgeSum += Math.sqrt(gx * gx + gy * gy);
      }
    }
    return bodyPixels > 0 ? (edgeSum / bodyPixels) / 80 : 0;
  }

  // ── Contrast score ─────────────────────────────────────────────────────────
  function contrastScore(): number {
    let min = 255, max = 0;
    for (let y = 0; y < h; y += 6) for (let x = 0; x < w; x += 6) {
      const l = lum(px, x, y, w);
      if (l < min) min = l;
      if (l > max) max = l;
    }
    return Math.min(1, (max - min) / 180);
  }

  // ── Forward lean (side view only) ─────────────────────────────────────────
  function computeForwardLean(): number {
    if (tipo !== "corpo-lado") return 0;
    // For top 1/3 and bottom 1/3, find the horizontal center of mass
    function centerOfMassX(from: number, to: number): number {
      let sumX = 0, count = 0;
      for (let y = Math.round(from * h); y < Math.round(to * h); y += 3)
        for (let x = 0; x < w; x += 3)
          if (isBody(x, y)) { sumX += x; count++; }
      return count > 0 ? sumX / count / w : 0.5;
    }
    const topCOM = centerOfMassX(0.1, 0.35);
    const botCOM = centerOfMassX(0.65, 0.9);
    return topCOM - botCOM; // positive = top is forward (chest out)
  }

  // ── Compute all ───────────────────────────────────────────────────────────
  const shoulderW = widthAtBand(0.16, 0.28);
  const chestW    = widthAtBand(0.28, 0.42);
  const waistW    = widthAtBand(0.42, 0.56);
  const hipW      = widthAtBand(0.54, 0.70);
  const thighW    = widthAtBand(0.68, 0.80);
  const legW      = widthAtBand(0.80, 0.94);

  const upperMass = massInBand(0, 0.5);
  const lowerMass = massInBand(0.5, 1);
  const bodyPct   = massInBand(0, 1);

  const { score: symm, quality: symmQ } = computeSymmetry();

  const safeHip    = Math.max(hipW, 0.01);
  const safeShould = Math.max(shoulderW, 0.01);
  const safeLow    = Math.max(lowerMass, 0.01);

  const shr = shoulderW / safeHip;
  const whr = waistW / safeHip;
  const wsr = waistW / safeShould;
  const ulr = upperMass / safeLow;

  // Head proportions (meaningful on rosto, approximate on corpo)
  const headBands = widthAtBand(0.0, 0.15);
  const headRelW  = safeShould > 0 ? headBands / safeShould : 0;
  const headRelH  = tipo === "rosto" ? 0.8 : 0.15;

  const forwardLean    = computeForwardLean();
  const chestProjection = tipo === "corpo-lado" ? Math.max(0, chestW - hipW) : 0;

  // Body detected?
  const bodyDetected = bodyPct > 0.04 && (shoulderW > 0.05 || chestW > 0.05);

  // Confidence: higher with more photos, good contrast, body detected
  const contrast = contrastScore();
  const confidence = bodyDetected
    ? Math.min(1, contrast * 0.5 + (tipo === "corpo-frente" ? 0.5 : tipo === "corpo-lado" ? 0.4 : 0.3))
    : 0.1;

  return {
    tipo,
    widthBands,
    shoulderW, chestW, waistW, hipW, thighW, legW,
    shr, whr, wsr, ulr,
    symm, symmQ, bodyPct, upperMass, lowerMass,
    headRelW, headRelH,
    edgeDensityBody: edgeDensityInBody(),
    contrastScore: contrast,
    bodyDetected,
    confidence,
    forwardLean,
    chestProjection,
  };
}

// ── Evidence-based scoring ─────────────────────────────────────────────────────

interface EvidencePiece {
  structure: keyof EstruturasPct;
  score: number;      // positive = supports, can be up to ~15
  confidence: number; // 0–1 reliability of this evidence
  reason: string;     // debugging / transparency
}

function collectEvidence(metrics: Metrics[]): EvidencePiece[] {
  const ev: EvidencePiece[] = [];
  const front = metrics.find(m => m.tipo === "corpo-frente");
  const side  = metrics.find(m => m.tipo === "corpo-lado");
  const face  = metrics.find(m => m.tipo === "rosto");

  // ── FRONT VIEW ─────────────────────────────────────────────────────────────
  if (front && front.bodyDetected) {
    const { shr, whr, wsr, ulr, symm, symmQ, bodyPct, confidence,
            shoulderW, hipW, chestW, waistW, edgeDensityBody } = front;

    // PSICOPATA — inverted triangle, upper-heavy
    if (shr > 1.45) ev.push({ structure: "psicopata", score: 14, confidence, reason: "SHR very high" });
    else if (shr > 1.30) ev.push({ structure: "psicopata", score: 10, confidence, reason: "SHR high" });
    else if (shr > 1.18) ev.push({ structure: "psicopata", score: 6, confidence, reason: "SHR moderate" });
    else if (shr > 1.08) ev.push({ structure: "psicopata", score: 3, confidence, reason: "SHR slight" });

    if (ulr > 1.35) ev.push({ structure: "psicopata", score: 8, confidence, reason: "Upper mass dominant" });
    else if (ulr > 1.18) ev.push({ structure: "psicopata", score: 5, confidence, reason: "Upper mass moderate" });
    else if (ulr > 1.08) ev.push({ structure: "psicopata", score: 2, confidence, reason: "Upper mass slight" });

    // Negative evidence for psicopata
    if (shr < 1.0) ev.push({ structure: "psicopata", score: -3, confidence, reason: "SHR refutes psicopata" });

    // MASOQUISTA — pear/barrel, wide, dense, lower-heavy
    if (shr < 0.86) ev.push({ structure: "masoquista", score: 14, confidence, reason: "SHR very low (pear)" });
    else if (shr < 0.94) ev.push({ structure: "masoquista", score: 10, confidence, reason: "SHR low" });
    else if (shr < 1.02) ev.push({ structure: "masoquista", score: 5, confidence, reason: "SHR slight low" });

    if (bodyPct > 0.55) ev.push({ structure: "masoquista", score: 12, confidence, reason: "Very dense body" });
    else if (bodyPct > 0.44) ev.push({ structure: "masoquista", score: 8, confidence, reason: "Dense body" });
    else if (bodyPct > 0.35) ev.push({ structure: "masoquista", score: 4, confidence, reason: "Moderately dense" });

    if (wsr > 0.90) ev.push({ structure: "masoquista", score: 8, confidence, reason: "Barrel waist" });
    else if (wsr > 0.82) ev.push({ structure: "masoquista", score: 4, confidence, reason: "Wide waist" });

    if (hipW > 0.38) ev.push({ structure: "masoquista", score: 6, confidence, reason: "Wide hips absolute" });

    // ESQUIZÓIDE — narrow, asymmetric, fragmented, low density
    if (symm < 0.72 && symmQ > 0.3) ev.push({ structure: "esquizoide", score: 12, confidence: confidence * symmQ, reason: "Very asymmetric" });
    else if (symm < 0.78 && symmQ > 0.3) ev.push({ structure: "esquizoide", score: 8, confidence: confidence * symmQ, reason: "Asymmetric" });
    else if (symm < 0.83) ev.push({ structure: "esquizoide", score: 4, confidence: confidence * symmQ * 0.7, reason: "Mildly asymmetric" });

    if (shoulderW < 0.18 && hipW < 0.18) ev.push({ structure: "esquizoide", score: 12, confidence, reason: "Very narrow body" });
    else if (shoulderW < 0.23 && hipW < 0.23) ev.push({ structure: "esquizoide", score: 7, confidence, reason: "Narrow body" });
    else if (shoulderW < 0.28) ev.push({ structure: "esquizoide", score: 3, confidence, reason: "Moderately narrow" });

    if (bodyPct < 0.10) ev.push({ structure: "esquizoide", score: 10, confidence, reason: "Very sparse body" });
    else if (bodyPct < 0.16) ev.push({ structure: "esquizoide", score: 6, confidence, reason: "Sparse body" });
    else if (bodyPct < 0.22) ev.push({ structure: "esquizoide", score: 2, confidence, reason: "Lean body" });

    // ORAL — collapsed, low tone, upper-low, thin but not narrow
    if (ulr < 0.72) ev.push({ structure: "oral", score: 12, confidence, reason: "Upper collapse strong" });
    else if (ulr < 0.82) ev.push({ structure: "oral", score: 8, confidence, reason: "Upper collapse moderate" });
    else if (ulr < 0.90) ev.push({ structure: "oral", score: 4, confidence, reason: "Upper collapse slight" });

    if (bodyPct < 0.20 && shr > 0.88 && shr < 1.18) ev.push({ structure: "oral", score: 6, confidence, reason: "Thin but not narrow" });

    if (chestW < shoulderW * 0.85) ev.push({ structure: "oral", score: 5, confidence, reason: "Chest narrower than shoulders (collapse)" });

    // RÍGIDO — symmetric, proportioned, defined, balanced
    if (symm > 0.93) ev.push({ structure: "rigido", score: 14, confidence: confidence * symmQ, reason: "Very symmetric" });
    else if (symm > 0.88) ev.push({ structure: "rigido", score: 9, confidence: confidence * symmQ, reason: "Symmetric" });
    else if (symm > 0.84) ev.push({ structure: "rigido", score: 4, confidence: confidence * symmQ, reason: "Moderately symmetric" });

    if (shr > 1.08 && shr < 1.30) ev.push({ structure: "rigido", score: 8, confidence, reason: "Balanced SHR" });
    else if (shr > 1.02 && shr < 1.40) ev.push({ structure: "rigido", score: 4, confidence, reason: "Near-balanced SHR" });

    if (edgeDensityBody > 0.35) ev.push({ structure: "rigido", score: 6, confidence, reason: "High muscle definition" });
    else if (edgeDensityBody > 0.25) ev.push({ structure: "rigido", score: 3, confidence, reason: "Some muscle definition" });
    // Psicopata also benefits from definition
    if (edgeDensityBody > 0.30 && shr > 1.15) ev.push({ structure: "psicopata", score: 4, confidence, reason: "Defined upper body" });

    if (bodyPct > 0.22 && bodyPct < 0.42) ev.push({ structure: "rigido", score: 4, confidence, reason: "Good body density" });

    // Negative for rígido
    if (symm < 0.78) ev.push({ structure: "rigido", score: -4, confidence: confidence * symmQ, reason: "Asymmetry refutes rigido" });
  }

  // ── SIDE VIEW ──────────────────────────────────────────────────────────────
  if (side && side.bodyDetected) {
    const { forwardLean, chestProjection, ulr, upperMass, lowerMass, symm, confidence } = side;

    // Forward lean (chest out) → psicopata
    if (forwardLean > 0.12) ev.push({ structure: "psicopata", score: 10, confidence, reason: "Strong forward lean / chest out" });
    else if (forwardLean > 0.06) ev.push({ structure: "psicopata", score: 6, confidence, reason: "Forward lean" });
    else if (forwardLean < -0.08) ev.push({ structure: "oral", score: 8, confidence, reason: "Backward collapse" });

    // Chest projection
    if (chestProjection > 0.06) ev.push({ structure: "psicopata", score: 8, confidence, reason: "Chest projects forward" });
    else if (chestProjection > 0.03) ev.push({ structure: "psicopata", score: 4, confidence, reason: "Slight chest projection" });

    // Upper collapse in side view → oral
    if (ulr < 0.78) ev.push({ structure: "oral", score: 8, confidence, reason: "Side: upper collapse" });
    else if (ulr < 0.88) ev.push({ structure: "oral", score: 4, confidence, reason: "Side: slight upper collapse" });

    // Asymmetry in side view (unusual posture) → esquizoide
    if (symm < 0.72) ev.push({ structure: "esquizoide", score: 6, confidence, reason: "Side: asymmetric posture" });

    // Compressed (wide + low) → masoquista
    if (side.bodyPct > 0.50) ev.push({ structure: "masoquista", score: 6, confidence, reason: "Side: dense/compressed" });
  }

  // ── FACE VIEW ─────────────────────────────────────────────────────────────
  if (face && face.bodyDetected) {
    const { symm, symmQ, confidence, shr, headRelW } = face;

    // High facial symmetry → rigido/psicopata
    if (symm > 0.93) {
      ev.push({ structure: "rigido",    score: 10, confidence: confidence * symmQ, reason: "Face: very symmetric" });
      ev.push({ structure: "psicopata", score: 5,  confidence: confidence * symmQ, reason: "Face: symmetric" });
    } else if (symm > 0.88) {
      ev.push({ structure: "rigido",    score: 6, confidence: confidence * symmQ, reason: "Face: symmetric" });
      ev.push({ structure: "psicopata", score: 3, confidence: confidence * symmQ, reason: "Face: symmetric" });
    }

    // Low facial symmetry → esquizoide
    if (symm < 0.74) {
      ev.push({ structure: "esquizoide", score: 10, confidence: confidence * symmQ, reason: "Face: very asymmetric" });
    } else if (symm < 0.80) {
      ev.push({ structure: "esquizoide", score: 6, confidence: confidence * symmQ, reason: "Face: asymmetric" });
    }

    // Jaw relative to head → masoquista (wide jaw), psicopata (strong jaw/broad)
    if (shr > 1.15) ev.push({ structure: "psicopata", score: 5, confidence, reason: "Face: wide forehead vs jaw" });
    if (shr < 0.90) ev.push({ structure: "masoquista", score: 5, confidence, reason: "Face: wide jaw" });

    // Narrow face → esquizoide/oral
    if (face.shoulderW < 0.3) {
      ev.push({ structure: "esquizoide", score: 4, confidence, reason: "Face: narrow features" });
      ev.push({ structure: "oral", score: 2, confidence, reason: "Face: delicate features" });
    }
  }

  return ev;
}

function scoreFromEvidence(evidence: EvidencePiece[]): EstruturasPct {
  const raw: Record<keyof EstruturasPct, number> = {
    esquizoide: 0,
    oral: 0,
    psicopata: 0,
    masoquista: 0,
    rigido: 0,
  };

  for (const e of evidence) {
    raw[e.structure] += e.score * clamp(e.confidence, 0.05, 1);
  }

  for (const k of Object.keys(raw) as (keyof EstruturasPct)[]) {
    raw[k] = Math.max(0.1, raw[k] + 8);
  }

  const total = Object.values(raw).reduce((s, v) => s + v, 0);
  const pct = {
    esquizoide: Math.round(raw.esquizoide / total * 100),
    oral:       Math.round(raw.oral       / total * 100),
    psicopata:  Math.round(raw.psicopata  / total * 100),
    masoquista: Math.round(raw.masoquista / total * 100),
    rigido:     Math.round(raw.rigido     / total * 100),
  };

  // Fix rounding
  const sum = pct.esquizoide + pct.oral + pct.psicopata + pct.masoquista + pct.rigido;
  const diff = 100 - sum;
  if (diff !== 0) {
    const top = (Object.keys(raw) as (keyof EstruturasPct)[]).reduce((a, b) => raw[a] > raw[b] ? a : b);
    pct[top] += diff;
  }

  return pct;
}

function scoreFromContinuousFeatures(metrics: Metrics[]): Record<keyof EstruturasPct, number> {
  const front = metrics.find((m) => m.tipo === "corpo-frente");
  const side = metrics.find((m) => m.tipo === "corpo-lado");
  const face = metrics.find((m) => m.tipo === "rosto");
  const scores: Record<keyof EstruturasPct, number> = {
    esquizoide: 0.15,
    oral: 0.15,
    psicopata: 0.15,
    masoquista: 0.15,
    rigido: 0.15,
  };

  if (front) {
    const shrPsicopata = bandScore(front.shr, 1.14, 1.52);
    const shrMasoquista = bandScore(1.08 - front.shr, 0.02, 0.28);
    const assimetria = bandScore(0.9 - front.symm, 0.04, 0.2) * clamp(front.symmQ, 0.3, 1);
    const oralCollapse = bandScore(0.96 - front.ulr, 0.02, 0.34);
    const densidade = bandScore(front.bodyPct, 0.2, 0.56);
    const definicao = bandScore(front.edgeDensityBody, 0.18, 0.42);
    const simetria = bandScore(front.symm, 0.82, 0.97) * clamp(front.symmQ, 0.3, 1);

    scores.psicopata += shrPsicopata * 0.42 + bandScore(front.ulr, 1.02, 1.45) * 0.2 + definicao * 0.12;
    scores.masoquista += shrMasoquista * 0.32 + densidade * 0.3 + bandScore(front.wsr, 0.76, 0.94) * 0.18;
    scores.esquizoide += assimetria * 0.34 + bandScore(0.3 - front.shoulderW, 0.02, 0.15) * 0.22 + bandScore(0.2 - front.bodyPct, 0.01, 0.15) * 0.2;
    scores.oral += oralCollapse * 0.34 + bandScore(0.28 - front.chestW, 0.02, 0.12) * 0.15 + bandScore(0.22 - front.bodyPct, 0.02, 0.18) * 0.14;
    scores.rigido += simetria * 0.4 + bandScore(front.shr, 1.04, 1.32) * 0.16 + definicao * 0.16 + bandScore(0.42 - Math.abs(front.bodyPct - 0.32), 0.08, 0.38) * 0.1;
  }

  if (side) {
    scores.psicopata += bandScore(side.forwardLean, 0.02, 0.16) * 0.16 + bandScore(side.chestProjection, 0.01, 0.09) * 0.12;
    scores.oral += bandScore(-side.forwardLean, 0.02, 0.14) * 0.14 + bandScore(0.92 - side.ulr, 0.01, 0.24) * 0.1;
    scores.masoquista += bandScore(side.bodyPct, 0.24, 0.58) * 0.08;
    scores.esquizoide += bandScore(0.88 - side.symm, 0.05, 0.22) * 0.1;
    scores.rigido += bandScore(side.symm, 0.82, 0.97) * 0.08;
  }

  if (face) {
    const faceSym = bandScore(face.symm, 0.84, 0.97) * clamp(face.symmQ, 0.35, 1);
    scores.rigido += faceSym * 0.12;
    scores.psicopata += faceSym * 0.08;
    scores.esquizoide += bandScore(0.86 - face.symm, 0.03, 0.2) * 0.11;
    scores.oral += bandScore(0.32 - face.shoulderW, 0.03, 0.15) * 0.06;
  }

  for (const key of Object.keys(scores) as (keyof EstruturasPct)[]) {
    scores[key] = Math.max(0.05, scores[key]);
  }

  return scores;
}

function mergeScores(
  evidencePct: EstruturasPct,
  continuousRaw: Record<keyof EstruturasPct, number>,
  metrics: Metrics[],
): EstruturasPct {
  const totalContinuous = Object.values(continuousRaw).reduce((s, v) => s + v, 0);
  const continuousPct: Record<keyof EstruturasPct, number> = {
    esquizoide: (continuousRaw.esquizoide / totalContinuous) * 100,
    oral: (continuousRaw.oral / totalContinuous) * 100,
    psicopata: (continuousRaw.psicopata / totalContinuous) * 100,
    masoquista: (continuousRaw.masoquista / totalContinuous) * 100,
    rigido: (continuousRaw.rigido / totalContinuous) * 100,
  };

  const coverageWeight = clamp(metrics.length / 3, 0.45, 1);
  const continuousWeight = 0.58 * coverageWeight;
  const evidenceWeight = 1 - continuousWeight;
  const merged = {
    esquizoide: evidencePct.esquizoide * evidenceWeight + continuousPct.esquizoide * continuousWeight,
    oral: evidencePct.oral * evidenceWeight + continuousPct.oral * continuousWeight,
    psicopata: evidencePct.psicopata * evidenceWeight + continuousPct.psicopata * continuousWeight,
    masoquista: evidencePct.masoquista * evidenceWeight + continuousPct.masoquista * continuousWeight,
    rigido: evidencePct.rigido * evidenceWeight + continuousPct.rigido * continuousWeight,
  };

  const total = Object.values(merged).reduce((s, v) => s + v, 0);
  const pct = {
    esquizoide: Math.round((merged.esquizoide / total) * 100),
    oral: Math.round((merged.oral / total) * 100),
    psicopata: Math.round((merged.psicopata / total) * 100),
    masoquista: Math.round((merged.masoquista / total) * 100),
    rigido: Math.round((merged.rigido / total) * 100),
  };
  const diff = 100 - (pct.esquizoide + pct.oral + pct.psicopata + pct.masoquista + pct.rigido);
  if (diff !== 0) {
    const top = (Object.keys(merged) as (keyof EstruturasPct)[]).reduce((a, b) => merged[a] > merged[b] ? a : b);
    pct[top] += diff;
  }
  return pct;
}

// ── Confidence calculation ─────────────────────────────────────────────────────

function computeOverallConfidence(metrics: Metrics[]): number {
  if (metrics.length === 0) return 0;
  const avg = metrics.reduce((s, m) => s + m.confidence, 0) / metrics.length;
  const bonus = metrics.length === 3 ? 0.15 : metrics.length === 2 ? 0.07 : 0;
  const detected = metrics.filter(m => m.bodyDetected).length / metrics.length;
  return Math.round(Math.min(100, (avg * detected + bonus) * 100));
}

function buildConfidenceBreakdown(metrics: Metrics[]) {
  if (metrics.length === 0) {
    return {
      imageQuality: 0,
      bodyDetection: 0,
      photoCoverage: 0,
      featureVariance: 0,
    };
  }
  const imageQuality = clamp(mean(metrics.map((m) => m.contrastScore)), 0, 1);
  const bodyDetection = mean(metrics.map((m) => (m.bodyDetected ? 1 : 0)));
  const photoCoverage = clamp(metrics.length / 3, 0, 1);
  const featureVariance = clamp(1 - Math.sqrt(variance(metrics.map((m) => m.shr))), 0.45, 1);
  return {
    imageQuality: Math.round(imageQuality * 100) / 100,
    bodyDetection: Math.round(bodyDetection * 100) / 100,
    photoCoverage: Math.round(photoCoverage * 100) / 100,
    featureVariance: Math.round(featureVariance * 100) / 100,
  };
}

// ── Dynamic physical profile text ──────────────────────────────────────────────

function buildPhysicalProfile(
  metrics: Metrics[],
  principal: keyof EstruturasPct,
  pct: EstruturasPct
): string {
  const front = metrics.find(m => m.tipo === "corpo-frente");
  const side  = metrics.find(m => m.tipo === "corpo-lado");
  const face  = metrics.find(m => m.tipo === "rosto");

  const parts: string[] = [];

  if (front && front.bodyDetected) {
    const { shr, ulr, bodyPct, symm, waistW, shoulderW, hipW } = front;

    // Shoulder-hip relationship
    if (shr > 1.35) parts.push("Os ombros são marcadamente mais largos que os quadris — uma silhueta de triângulo invertido, com energia concentrada na região superior do corpo.");
    else if (shr > 1.18) parts.push("Os ombros superam os quadris em largura, criando uma proporção superior dominante que comunica presença e força.");
    else if (shr > 1.06) parts.push("A proporção entre ombros e quadril é levemente favorável ao tórax — estrutura próxima ao equilíbrio com leve predominância superior.");
    else if (shr > 0.94) parts.push("Ombros e quadril apresentam largura muito semelhante, criando uma silhueta retangular ou em coluna equilibrada.");
    else if (shr < 0.86) parts.push("Os quadris superam os ombros em largura — uma silhueta em pera, com distribuição de massa predominantemente inferior.");
    else parts.push("Ombros levemente mais estreitos que os quadris, com concentração de volume na porção inferior do tronco.");

    // Upper-lower mass
    if (ulr > 1.25) parts.push("A massa corporal está concentrada na metade superior — o tórax e os membros superiores apresentam maior volume e presença visual.");
    else if (ulr < 0.78) parts.push("A metade inferior do corpo apresenta maior massa — o peso visual do corpo tende para baixo, com quadril e coxas mais expressivos.");
    else parts.push("A distribuição de massa entre a metade superior e inferior é relativamente equilibrada.");

    // Symmetry
    if (symm > 0.90) parts.push("A simetria bilateral é marcante — os dois lados do corpo espelham-se com precisão notável.");
    else if (symm > 0.83) parts.push("Há boa simetria bilateral, com pequenas diferenças naturais entre os lados.");
    else if (symm < 0.76) parts.push("A assimetria entre os lados do corpo é perceptível — uma característica que revela organização energética não-uniforme entre os hemisférios.");

    // Body density
    if (bodyPct > 0.48) parts.push("A estrutura corporal é densa e compacta, ocupando bastante espaço no campo visual.");
    else if (bodyPct < 0.15) parts.push("A estrutura corporal é esguia, com volume reduzido em relação à altura da imagem.");
  }

  if (side && side.bodyDetected) {
    const { forwardLean, chestProjection } = side;
    if (forwardLean > 0.08) parts.push("No perfil lateral, o tronco apresenta leve projeção anterior — o peito avança além do eixo vertical do corpo.");
    else if (forwardLean < -0.06) parts.push("No perfil lateral, há leve colapso anterior — o tórax recua em relação à linha de equilíbrio.");
  }

  if (face && face.bodyDetected) {
    const { symm } = face;
    if (symm > 0.90) parts.push("O rosto apresenta alta simetria — as feições são organizadas e equilibradas em ambos os lados.");
    else if (symm < 0.76) parts.push("O rosto apresenta assimetria característica — os dois lados expressam qualidades ligeiramente diferentes.");
  }

  if (parts.length === 0) {
    return "A análise das proporções corporais visíveis nas fotos fornecidas revela características que fundamentam o perfil identificado abaixo.";
  }

  return parts.join(" ");
}

// ── Content library ────────────────────────────────────────────────────────────

const NOMES: Record<keyof EstruturasPct, string> = {
  esquizoide: "Esquizóide",
  oral: "Oral",
  psicopata: "Psicopata/Narcisista",
  masoquista: "Masoquista",
  rigido: "Rígido",
};

const APELIDOSS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Visionário",
  oral: "Empático",
  psicopata: "Executor",
  masoquista: "Guardião",
  rigido: "Arquiteto",
};

const FRASES_IDENTIDADE: Record<keyof EstruturasPct, string> = {
  esquizoide: "Habita universos interiores que poucos conseguem acompanhar — criativo, profundo e à frente do tempo.",
  oral: "Sente o mundo com o coração aberto — empático, generoso e capaz de nutrir com uma profundidade rara.",
  psicopata: "Determinado, estratégico e orientado ao resultado — nasce para liderar e organizar o espaço ao redor.",
  masoquista: "Resiliente, fiel e silenciosamente forte — sua capacidade de suportar move mundos sem fazer barulho.",
  rigido: "Disciplinado, confiável e orientado à excelência — aparece, entrega e inspira com consistência.",
};

const PONTOS_FORTES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: ["Profundidade intelectual", "Criatividade singular", "Intuição aguçada", "Sensibilidade energética", "Pensamento original"],
  oral: ["Empatia profunda", "Conexão genuína", "Generosidade", "Escuta ativa", "Calor humano"],
  psicopata: ["Liderança natural", "Visão estratégica", "Poder de influência", "Determinação", "Carisma"],
  masoquista: ["Resiliência extraordinária", "Lealdade inabalável", "Força silenciosa", "Comprometimento", "Compaixão nascida da dor"],
  rigido: ["Disciplina", "Confiabilidade", "Excelência", "Organização", "Comprometimento"],
};

const PONTOS_ATENCAO: Record<keyof EstruturasPct, string[]> = {
  esquizoide: ["Isolamento excessivo", "Desconexão corporal", "Dificuldade de presença", "Abstração como fuga"],
  oral: ["Dependência afetiva", "Auto-abandono", "Dificuldade em receber", "Ansiedade relacional"],
  psicopata: ["Negação da vulnerabilidade", "Necessidade de controle", "Distância emocional", "Impaciência"],
  masoquista: ["Autocobrança severa", "Dificuldade em se expandir", "Ressentimento acumulado", "Rigidez interna"],
  rigido: ["Perfeccionismo paralisante", "Rigidez emocional", "Dificuldade em ceder", "Coração defendido"],
};

const FERIDAS: Record<keyof EstruturasPct, string> = {
  esquizoide: "O terror de existir — a sensação primordial de não ter direito de estar no mundo. O sistema aprendeu cedo que existir era perigoso.",
  oral: "O abandono — a ferida de não ter sido suficientemente sustentado, de não haver suporte consistente e incondicional disponível.",
  psicopata: "A traição da vontade — quando a vulnerabilidade foi violada e o sistema aprendeu que mostrar fraqueza custa caro.",
  masoquista: "A humilhação da vontade — quando se expressar, discordar ou expandir custou humilhação ou perda de amor.",
  rigido: "A desilusão do coração — quando amar foi punido, quando a entrega genuína não foi correspondida ou foi traída.",
};

const RECURSOS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Uma mente capaz de criar mundos que ainda não existem. Uma visão que transcende o tempo e conecta o que parece separado.",
  oral: "Um coração que sente o outro antes de ele falar. Uma empatia que transforma o ambiente e cria vínculos de profundidade real.",
  psicopata: "Uma presença que organiza e inspira o espaço ao redor. Uma força de influência que quando enraizada torna-se liderança transformadora.",
  masoquista: "Uma resistência que permanece quando tudo mais cede. Uma profundidade emocional que nasce da dor transformada em sabedoria.",
  rigido: "Uma capacidade de realizar que transforma visão em realidade. Uma confiabilidade que ancora os que estão ao redor.",
};

const RECOMENDACOES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "Prática de ancoragem somática: pés descalços na terra por 10–15 minutos diários",
    "Contato físico seguro e consistente — abraços, massagem, trabalho corporal",
    "Expressão criativa que outros possam ver e receber (não só arquivar)",
    "Terapia bioenergética, processo somático ou dança-movimento",
    "Exercícios de enraizamento: agachamentos lentos, caminhada consciente",
  ],
  oral: [
    "Pratique receber cuidado sem se sentir em dívida ou desconfortável",
    "Desenvolva estrutura própria: rotinas, limites claros, autocuidado consistente",
    "Observe onde você dá mais do que recebe — e por quê continua dando",
    "Trabalho de enraizamento em pernas e pés: squats, corrida, yoga",
    "Identifique suas necessidades reais e pratique expressá-las diretamente",
  ],
  psicopata: [
    "Cultive espaços de vulnerabilidade segura — relações onde você não precisa performar",
    "Pratique pedir ajuda e deixar que o outro contribua genuinamente",
    "Exercícios de abertura do centro do corpo: yoga, bioenergética pélvica",
    "Meditação e práticas de presença que desaceleram a atividade mental",
    "Explore o que você sente quando não está no papel de líder ou executor",
  ],
  masoquista: [
    "Pratique pequenas expansões diárias: dizer não, expressar uma opinião, ocupar mais espaço",
    "Trabalho corporal focado em liberação da região pélvica, quadril e lombar",
    "Identifique onde você engole ao invés de expressar — e pratique expressar com suavidade",
    "Celebre progressos sem minimizá-los — o prazer é permitido",
    "Psicoterapia ou bioenergética focada em desbloqueio da expressão",
  ],
  rigido: [
    "Crie espaços sem agenda — onde não há nada a entregar, provar ou realizar",
    "Pratique deixar as emoções aparecerem sem gerenciá-las imediatamente",
    "Trabalho corporal que inclua movimento espontâneo: dança livre, bioenergética",
    "Cultive relações de real intimidade — onde você é visto sem precisar ser perfeito",
    "Explore o que aparece quando você para de controlar — com curiosidade, não julgamento",
  ],
};

const OBS_ROSTO: Record<keyof EstruturasPct, string> = {
  esquizoide: "As feições apresentam uma qualidade distante e introspectiva. O olhar carrega profundidade que parece olhar além do presente — presente no espaço físico mas habitando outro lugar. A assimetria entre os lados do rosto é característica: cada lado parece guardar uma história diferente, como dois personagens coexistindo no mesmo corpo.",
  oral: "O rosto transmite uma abertura emocional palpável — os traços são delicados e os olhos expressam vulnerabilidade genuína. Há uma qualidade de receptividade na expressão, como se o mundo pudesse ser sentido antes de ser interpretado. A boca e os olhos carregam o anseio de contato que define esta estrutura.",
  psicopata: "A estrutura facial transmite presença imediata — o olhar é direto, penetrante, com uma qualidade natural de avaliação e comando. A mandíbula e o pescoço comunicam determinação. Há uma harmonia facial que serve ao magnetismo social: este rosto organiza o espaço ao redor antes de a pessoa falar.",
  masoquista: "As feições guardam uma tensão suave mas perceptível — a mandíbula e o pescoço apresentam contratura característica de quem carrega muito internamente. Os olhos expressam profundidade e uma certa resignação que coexiste com força genuína. Há peso nas expressões que revela o acúmulo de não-dito.",
  rigido: "O rosto é bem estruturado e organizado, com simetria marcante e traços equilibrados. A expressão é controlada e precisa — o coração presente mas contido por uma compostura cuidadosa. Os olhos expressam inteligência e presença, mas há uma contenção que impede a entrega total da emoção.",
};

const OBS_FRENTE: Record<keyof EstruturasPct, string> = {
  esquizoide: "A silhueta frontal revela estreiteza e fragmentação. O corpo não flui com continuidade entre os segmentos — há quebras visuais que criam a impressão de peças separadas habitando o mesmo espaço. A desconexão entre tórax e membros inferiores é visível. Os ombros podem estar contraídos e a pelve parece retraída, como se o corpo buscasse ocupar o mínimo de espaço possível.",
  oral: "O corpo apresenta colapso postural de cima para baixo: o peito cede, os ombros caem para frente, a cabeça avança além do eixo. O tônus muscular geral é baixo — não por fraqueza de caráter, mas porque o sistema nervoso aprendeu que não havia suporte suficiente disponível. A estrutura inteira parece buscar um apoio externo que ainda não chegou de forma consistente.",
  psicopata: "A silhueta frontal é dominada pela região superior: ombros largos e peito expandido criam uma presença imediata. A distribuição de massa concentra-se claramente acima da cintura. Os membros superiores são mais expressivos, os inferiores menos desenvolvidos em relação ao tronco. A postura comunica domínio e expansão antes de qualquer palavra.",
  masoquista: "O corpo frontal é comprimido e denso. A largura é expressiva — quadril, tronco e coxas ocupam bastante espaço. A compressão vertical é perceptível: o pescoço parece curto, os ombros estão rebaixados, o tronco parece pressionado de cima para baixo. É um corpo que aprendeu a resistir ao invés de expandir.",
  rigido: "O corpo apresenta organização e simetria notáveis. As proporções entre ombros e quadril são equilibradas, a coluna está ereta, e os membros são simétricos. O tônus muscular está bem distribuído. Há uma beleza na estrutura que também é couraça — o corpo funciona bem porque aprendeu a se manter unido acima de tudo.",
};

const OBS_LADO: Record<keyof EstruturasPct, string> = {
  esquizoide: "O perfil lateral revela desengajamento postural: a pelve está retraída e há descontinuidade energética entre os segmentos. Não existe uma linha de força contínua do chão à cabeça — o corpo parece habitado de forma fragmentada, como se a presença não chegasse completamente a certas partes.",
  oral: "A silhueta lateral evidencia o colapso para frente: cabeça e ombros projetam-se além do eixo corporal, o peito afunda, reduzindo o espaço respiratório. Há uma tendência ao encolhimento que reflete a busca por proteção e o baixo nível de carga energética geral. O corpo ainda aguarda ser sustentado.",
  psicopata: "O perfil lateral é marcado pelo peito projetado para frente e pela cabeça erguida com queixo levemente elevado. A postura lateral comunica domínio e expansão ascendente. A energia sobe e vai para frente — o corpo diz 'estou aqui e estou no comando' antes de qualquer palavra.",
  masoquista: "A lateral revela postura comprimida com ombros que caem para dentro e pelve encaixada, limitando a mobilidade. O centro do corpo parece bloqueado — a região do quadril e da lombar guarda tensão crônica. É um corpo que suporta peso invisível com uma consistência que revela força e limitação ao mesmo tempo.",
  rigido: "O perfil lateral evidencia alinhamento preciso: cabeça, ombros e quadril formam um eixo vertical organizado. O corpo está ereto com uma certa rigidez — a postura perfeita demais revela a armadura invisível que mantém tudo no lugar. O controle postural é real e ao mesmo tempo é símbolo do controle emocional que esta estrutura carrega.",
};

const PADROES_POSTURAIS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Corpo estreito com segmentos visualmente desconectados. Os ombros contraem-se e a pelve fica retraída. As quebras na linha postural criam fragmentação — o corpo não habita a si mesmo por inteiro. Há uma qualidade de ausência parcial, como se só parte da pessoa estivesse presente.",
  oral: "Colapso postural de cima para baixo: o peito afunda, os ombros caem para frente e a cabeça avança além do eixo. O corpo tem baixo tônus geral e pouco enraizamento nos membros inferiores — como se ainda buscasse o apoio externo que não chegou de forma suficiente.",
  psicopata: "Expansão ascendente marcante: ombros largos, peito projetado, cabeça erguida comunicando comando natural. A vitalidade concentra-se na metade superior. As pernas e a pelve são relativamente menos expressivas — a energia sobe mas não desce completamente até o chão.",
  masoquista: "Compressão descendente: o corpo parece pressionado de cima para baixo. Pescoço curto, ombros rebaixados, tronco largo e denso. A tensão crônica em quadris, lombar e coxas revela o acúmulo de energia que não encontra saída livre. Um corpo de resistência, não de fluxo.",
  rigido: "Postura ereta e alinhada, com proporções equilibradas entre tórax e pelve. A organização corporal é notável — cabeça, ombros e quadril formam um eixo preciso. A rigidez é discreta mas presente: uma contenção do movimento que é símbolo da contenção emocional desta estrutura.",
};

const CENTROS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Cabeça e região cervical superior — a energia se concentra no pensamento e se isola do restante do corpo. O centro energético ainda busca permissão para descer.",
  oral: "Tórax e garganta — onde se guarda o não-dito, o choro contido e o desejo profundo de contato e sustentação. O coração está aberto mas o peito está vazio.",
  psicopata: "Tórax superior, ombros e pescoço — região de poder, expansão e acumulação de carga. A energia é abundante mas não circula até a pelve e os pés.",
  masoquista: "Quadril, lombar e coxas — onde a energia fica represada e comprimida em tensão crônica. O centro pede libertação que ainda não encontrou saída.",
  rigido: "Tórax e coração — onde o amor está presente mas bloqueado pela armadura da compostura. O centro sente muito mais do que permite expressar.",
};

const PADROES_ENERGETICOS: Record<keyof EstruturasPct, string> = {
  esquizoide: "A energia flui preferencialmente para a cabeça e se perde na abstração antes de alcançar o corpo físico. O sistema nervoso está cronicamente em alerta, raramente alcançando descanso pleno. Há pouco fluxo entre cognição e ação, entre pensar e sentir.",
  oral: "O fluxo energético tem baixa voltagem geral. A carga se dissipa rapidamente porque o sistema não retém energia com facilidade — há necessidade constante de recarga através do contato com o outro. Quando sozinho por muito tempo, a energia cai de forma perceptível.",
  psicopata: "A energia corre em alta voltagem para a parte superior — tórax, cabeça, braços. Abaixo da cintura o fluxo diminui significativamente. A acumulação de carga na parte superior gera tensão crônica nos ombros, nuca e trapézio. O sistema precisa de descarga regular.",
  masoquista: "A energia encontra bloqueios crônicos no nível pélvico e lombar. Quando a pressão acumula suficientemente, pode emergir como explosão emocional, adoecimento ou depressão. O sistema pede libertação e expansão que a estrutura ainda não aprendeu a permitir.",
  rigido: "O fluxo energético é organizado e contido — corre por canais definidos mas raramente transborda. Disponível para ação e realização, o fluxo encontra barreiras quando precisa circular no campo emocional e relacional. O coração bombeia mas a circulação emocional tem restrições.",
};

const MENSAGENS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Você tem o direito de existir — plenamente, aqui, agora. O mundo precisa da sua visão, da sua inteligência, da sua sensibilidade única. Você não está aqui por acaso. Cada vez que se permite ser visto, que deixa alguém chegar perto, você está curando a ferida mais antiga. Isso é coragem real.",
  oral: "Você merece receber tanto quanto oferece. O universo não quer que você esvazie — quer que você transborde a partir da abundância. Cuide de si com a mesma ternura com que você cuida do outro. Você não precisa ganhar o direito de ser amado — ele já é seu, desde sempre, incondicionalmente.",
  psicopata: "Sua vulnerabilidade não é fraqueza — é o portal para o poder verdadeiro. Abrir o coração não vai destruí-lo: vai completar o que a força sozinha não consegue. Você já provou que pode conquistar o mundo. Agora é hora de conquistar a si mesmo com a mesma coragem que sempre teve.",
  masoquista: "Você já sofreu o suficiente. Você não precisa de mais provações para merecer amor, alegria ou expansão. A vida está convidando você a florescer — não apesar das dificuldades, mas além delas. Você é forte o suficiente para se permitir ser leve. Isso não é fraqueza: é a próxima fronteira.",
  rigido: "Seu coração é a sua maior riqueza — e ele quer falar. Por baixo de toda a competência e do controle existe um ser que sente profundamente e que merece ser sentido. Relaxar não é ceder: é finalmente chegar em casa. Deixe-se ser tocado pela vida com tudo que você tem.",
};

const INTERPRETACOES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "Você habita um universo interior raro. Sua mente é um cosmos particular, cheio de conexões que poucos conseguem acompanhar. Há uma inteligência que transcende o ordinário — uma capacidade de ver padrões invisíveis para os outros, de criar mundos a partir do nada. Essa é sua maior riqueza e, ao mesmo tempo, seu maior isolamento.",
    "A estrutura Esquizóide carrega a ferida mais primordial: o terror de existir. No corpo, isso se manifesta como uma desconexão entre partes — como se fragmentos de você vivessem em órbitas separadas. Os ombros tendem a retrair, a pelve a recuar, o corpo a fragmentar-se em segmentos que não conversam facilmente entre si. O trabalho é reunir esses fragmentos em uma identidade encarnada.",
    "Sua relação com a solidão é complexa: ela é tanto fortaleza quanto prisão. O isolamento criativo, a profundidade intelectual, a sensibilidade extrema às energias ao redor — são dons reais que o mundo precisa. O desafio que a vida lhe apresenta é o mesmo de sempre: confiar que é seguro estar aqui, que você tem direito de existir plenamente, de ser visto.",
    "Sua jornada de transformação passa obrigatoriamente pelo corpo. Enquanto a mente já habita mundos sofisticados, o corpo aguarda ser habitado com a mesma presença. Cada vez que você ancora sua vasta riqueza interior no aqui e agora, a experiência de ser você se torna mais inteira, mais real, mais sua.",
    "A integração da estrutura Esquizóide não é sobre 'ser normal' — é sobre trazer o universo interior para o contato com o mundo real. Quando a presença física começa a acompanhar a riqueza interna, surge uma pessoa de impacto genuíno: criativa, conectada e radicalmente autêntica.",
  ],
  oral: [
    "Há em você uma profundidade emocional que é raridade neste mundo. Você sente o outro antes mesmo de ele falar — percebe a dor escondida, a alegria genuína, a saudade que ninguém mais enxerga. Essa é sua maior dádiva: a empatia encarnada, o coração que pulsa pelo mundo.",
    "A estrutura Oral carrega a ferida do abandono — não necessariamente um abandono literal, mas a experiência de não ter havido suporte suficiente, consistente e incondicional. No corpo, isso aparece como colapso postural: o peito cede, os ombros caem, o sistema todo aprende a operar com menos energia. O trabalho interno é aprender a apoiar-se em si mesmo.",
    "Você nutre o outro com uma generosidade extraordinária. Mas existe uma pergunta silenciosa que o acompanha: 'E eu, quem me sustenta?' O caminho de cura passa por aprender a pedir, a receber, a deixar que cuidem de você com a mesma entrega com que você cuida. Você merece isso — não como recompensa, mas como direito.",
    "Sua sensibilidade é um presente que o mundo precisa. A melancolia, a saudade, o anseio de pertencer — são expressões de um coração que ama profundamente. Quanto mais você encontrar estrutura interna — limites, autocuidado, apoio próprio — mais você pode amar o mundo sem se dissolver nele.",
    "A transformação da estrutura Oral é sobre plenitude — aprender que você pode se encher por dentro ao invés de depender do outro para isso. Não é sobre fechar o coração, mas sobre ter um centro tão forte quanto a abertura que você já carrega naturalmente.",
  ],
  psicopata: [
    "Você chegou ao mundo com uma capacidade de influência que é visível no seu corpo: a parte superior se impõe, os ombros comunicam antes de você falar, a postura comanda o espaço ao redor. Essa não é uma falha de caráter — é uma resposta adaptativa de um ser que precisou controlar o ambiente para sobreviver.",
    "A estrutura Psicopata/Narcisista nasce de uma traição — de uma vontade que foi violada quando ainda era vulnerável. O corpo aprendeu a se expandir para cima como defesa: quanto maior acima da cintura, menos vulnerável. Funcionou. Você se tornou alguém difícil de controlar. O preço foi a desconexão com a própria fragilidade.",
    "Sua força é real. Seu magnetismo, sua capacidade estratégica, sua visão — são dons genuínos que o mundo reconhece. O que a vida lhe convida a descobrir é que por baixo da armadura existe um coração que também quer ser visto, que também quer descansar, que também quer ser amado sem precisar impressionar.",
    "A transformação para você passa por descer — trazer a energia do peito e dos ombros até o chão, até as pernas, até a pelve. Quando o poder vem do corpo inteiro e não apenas do tórax, ele se torna sustentável, autêntico, enraizado. É aí que o líder se torna sábio e o estrategista se torna humano.",
    "A vulnerabilidade que você evitou com tanto custo é justamente o que completa o que você tem. Líderes que conhecem sua própria fragilidade e a revelam nos momentos certos inspiram lealdade que a força sozinha nunca consegue. Essa é a próxima fronteira do seu poder.",
  ],
  masoquista: [
    "Há uma força em você que é silenciosa e contínua — uma capacidade de suportar que não é fraqueza, mas acúmulo de pressão não expressa. O corpo masoquista comprimiu-se ao longo do tempo, como uma mola que nunca pôde expandir. Essa compressão é visível nas proporções e na textura da postura.",
    "A ferida que moldou essa estrutura foi a humilhação — a vontade que foi quebrada repetidamente até que a submissão se tornou mais segura que a expressão. No corpo, isso aparece como tensão crônica nos quadris, pescoço e coxas — lugares onde se guarda o que não pode ser dito, o que foi engolido por décadas.",
    "Sua lealdade é profunda. Uma vez que você se compromete com alguém ou algo, vai até o fim — mesmo quando isso custa mais do que deveria. Você conhece o sofrimento de dentro e por isso tem uma compaixão rara. O caminho de cura passa por aprender que expansão é possível — que o mundo não vai desabar quando você diz não.",
    "A transformação para a estrutura Masoquista é a expansão gradual. Não a explosão, mas o crescimento suave e contínuo — a voz que sobe um tom de cada vez, o corpo que aprende a ocupar mais espaço. Cada vez que você se expressa ao invés de engolir, está reescrevendo a história do seu corpo.",
    "A alegria, o prazer, a leveza — não são recompensas por sofrimento. São direitos que existem independentemente do quanto você suportou. A vida está esperando que você se permita florescer, não apesar do que passou, mas além disso.",
  ],
  rigido: [
    "Você foi feito para funcionar bem no mundo. Sua postura diz isso: ereta, organizada, controlada — um ser que se mantém unido. Há uma competência visível no jeito como você habita seu corpo e seu lugar no mundo. Você realiza, entrega, aparece. Sua estrutura é reconhecida como referência.",
    "A estrutura Rígida carrega a desilusão do coração — o amor que foi punido, que não foi correspondido da forma esperada, que deixou uma ferida invisível mas profunda. O corpo aprendeu a se manter unido acima de tudo, porque se desmontar era perigoso demais. O resultado é uma armadura bela e eficiente que também bloqueia a entrada do amor profundo.",
    "Você tem tudo o que precisa externamente. O desafio é interno: deixar que o que está dentro possa mostrar-se. A emoção que fica represada não desaparece — ela espera. O coração que está por baixo do controle é sensível, profundo, capaz de um amor transformador. Mas ele precisa de espaço para respirar.",
    "A jornada da estrutura Rígida é a rendição consciente — não a fraqueza, mas a entrega intencional. Quando você consegue relaxar o controle o suficiente para sentir, para chorar, para ser tocado sem defesa, você não perde a força: você a completa. É aí que a excelência exterior e a riqueza interior se encontram.",
    "A pergunta que a vida faz para você é: 'E você, o que sente — quando ninguém está olhando, quando não há nada a realizar, quando não há papel a cumprir?' A resposta que viver essa pergunta revela é o coração desta transformação.",
  ],
};

const COMBOS: Record<string, string> = {
  "esquizoide-oral": "uma sensibilidade extrema que tanto se retira para a mente quanto anseia por conexão. Há um movimento interno constante entre o isolamento criativo e o desejo de pertencer — dois universos que pedem integração.",
  "esquizoide-psicopata": "uma combinação rara de visão estratégica e profundidade filosófica. O poder de influência existe mas opera preferencialmente de uma distância segura — o contato direto e a liderança visível são o próximo passo de crescimento.",
  "esquizoide-masoquista": "uma pressão interna dupla: o corpo pede silêncio e o mundo pede conformidade. Há riqueza interior enorme, mas o acesso a ela fica bloqueado por tensão corporal crônica e desconexão. O corpo precisa ser habitado para a riqueza circular.",
  "esquizoide-rigido": "precisão intelectual aliada à organização — mas a vivência emocional permanece distante. A couraça rígida protege o espaço esquizóide, mas também impede a chegada do calor humano necessário à integração.",
  "oral-esquizoide": "um ser que tanto precisa de amor quanto recua do contato. O anseio de pertencer coexiste com o medo de ser destruído pela proximidade. É uma polaridade que pede integração gradual, cuidadosa e paciente.",
  "oral-psicopata": "a combinação de necessidade afetiva com força de influência — podem emergir padrões onde a necessidade se disfarça de generosidade que espera retribuição. O caminho é a transparência: pedir diretamente o que se precisa.",
  "oral-masoquista": "sofrimento em dobro: abandono e humilhação criando um padrão profundo de autossacrifício. Mas também compaixão excepcional — quem conhece a dor de dentro acolhe a dor do outro com uma profundidade rara.",
  "oral-rigido": "o coração que quer amar mas aprendeu a controlar esse desejo. A estrutura rígida organiza e contém a necessidade oral — mas o amor verdadeiro emerge quando deixamos de administrá-lo e o deixamos simplesmente ser.",
  "psicopata-esquizoide": "um visionário que prefere operar nos bastidores. Há poder real, mas ele é exercido preferencialmente através de ideias e estratégias em vez de presença física direta. A liderança existe mas com distância de segurança.",
  "psicopata-oral": "força e vulnerabilidade em tensão permanente. A fachada poderosa esconde uma necessidade profunda de ser visto e amado. A cura acontece quando o poder não precisa mais funcionar como defesa contra o amor.",
  "psicopata-masoquista": "uma energia densa e intensa — poder de cima pressionando contra resistência de baixo. Pode gerar explosões ou implosões quando o sistema não encontra saída saudável. A integração cria liderança autêntica com raízes.",
  "psicopata-rigido": "performance de alto nível — um ser que tanto domina quanto organiza com excelência. O exterior brilha; o desafio é o interior. Muito realizado fora, com uma saudade crescente de si mesmo por dentro.",
  "masoquista-esquizoide": "peso e distância combinados — o corpo carrega muito enquanto a mente se afasta. A riqueza interior existe mas fica enterrada sob camadas de tensão corporal e desconexão. O caminho é a presença encarnada.",
  "masoquista-oral": "duas estruturas de sofrimento que se reforçam — o peso do mundo combinado com a necessidade do outro. A transformação vem através de autocuidado radical e de aprender a receber sem culpa.",
  "masoquista-psicopata": "força em conflito com força — uma luta interna constante entre submissão e poder. Quando integrados, podem gerar uma liderança autêntica que conhece tanto a dor quanto a força de verdade.",
  "masoquista-rigido": "resistência disciplinada — o corpo suporta enquanto a mente organiza. Um guerreiro silencioso e confiável que precisa aprender que expansão e alegria também são parte do seu direito.",
  "rigido-esquizoide": "organização externa com profundidade interna. Um ser que funciona bem no mundo mas habita universos muito mais ricos em seu interior. O desafio é trazer essa riqueza para o contato real.",
  "rigido-oral": "o coração que controla o coração que anseia. A estrutura rígida contém a necessidade oral — mas o amor verdadeiro flui quando deixamos de administrá-lo e o deixamos simplesmente acontecer.",
  "rigido-psicopata": "uma combinação de excelência e poder — alguém que tanto realiza quanto lidera. Mas o que está por baixo? Quando ninguém está olhando, o que este ser realmente sente e permite sentir?",
  "rigido-masoquista": "disciplina e resistência — um ser que entrega muito e reclama pouco. A organização rígida cobre a pressão masoquista, criando alguém confiável que internamente pede por alívio e leveza.",
};

const CARACTERISTICAS: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "Assimetria perceptível entre os lados do corpo",
    "Segmentos corporais visualmente desconectados entre si",
    "Estrutura ectomorfa com volume muscular reduzido",
    "Ombros contraídos, elevados ou assimétricos",
    "Pelve retraída e desengajada do tronco",
    "Pouca continuidade visual de cima a baixo",
  ],
  oral: [
    "Peito colapsado com esterno rebaixado",
    "Baixo tônus muscular geral",
    "Postura curvada com inclinação anterior da cabeça",
    "Pouco enraizamento nos membros inferiores",
    "Ombros caídos para frente",
    "Expressão de baixo nível de carga energética",
  ],
  psicopata: [
    "Ombros marcadamente mais largos que o quadril",
    "Peito expandido e projetado para frente",
    "Desenvolvimento muscular concentrado na parte superior",
    "Cabeça erguida com queixo levemente elevado",
    "Contração visível no trapézio e dorso superior",
    "Pernas relativamente menos expressivas que o tronco",
  ],
  masoquista: [
    "Corpo comprimido e de aparência densa",
    "Pescoço curto e tronco largo",
    "Pouca definição de cintura em relação ao tronco",
    "Quadril amplo e pesado",
    "Tensão crônica visível em lombar e coxas",
    "Ombros rebaixados e contraídos",
  ],
  rigido: [
    "Postura ereta e verticalmente precisa",
    "Simetria corporal marcante entre os dois lados",
    "Tônus muscular bem distribuído no corpo todo",
    "Proporções equilibradas entre ombros e quadril",
    "Alinhamento preciso da coluna vertebral",
    "Expressão de controle e contenção do movimento",
  ],
};

// ── Communication style library ────────────────────────────────────────────────

const ESTILOS_COMUNICACAO: Record<keyof EstruturasPct, EstiloComunicacao> = {
  esquizoide: {
    tipo: "Reservado e profundo",
    descricao: "Você é seletivo com palavras — cada uma tem peso real. A comunicação acontece quando há necessidade genuína ou quando um tema desperta interesse verdadeiro. Em silêncio, você está pensando, processando, habitando mundos interiores — não ausente.",
    emGrupos: "Em grupos, tende a observar mais do que participar. A conversa superficial esgota rapidamente; o que você busca é a troca que vai fundo. Com uma pessoa certa, em um espaço seguro, pode falar por horas com uma riqueza que surpreende quem só te conhecia calado.",
    emRelacoes: "Prefere se comunicar por escrito ou em profundidade e reflexão ao invés de impulso. Expressar o que sente verbalmente é genuinamente mais difícil do que compreender o que sente. Os outros podem interpretar seu silêncio como distância — raramente é isso.",
    emConflito: "Diante do conflito, o impulso é recuar e processar internamente. Raramente responde no calor da hora — e quando responde, é com uma clareza e precisão que pode surpreender quem esperava reação emocional imediata.",
    emTensao: "A tensão alta faz você desaparecer internamente — presente no corpo, ausente na interação. Pode levar horas ou dias para processar o que aconteceu e só então encontrar as palavras certas. Isso não é fraqueza: é como seu sistema trabalha.",
  },
  oral: {
    tipo: "Expressivo e relacional",
    descricao: "Você se comunica com o coração aberto — as emoções aparecem nas palavras, no tom, no gesto. Falar ajuda a organizar o que sente. A conversa é, para você, um espaço de conexão tanto quanto de troca de informação.",
    emGrupos: "Em grupos, busca conexão genuína e frequentemente aquece o ambiente. Tem facilidade para perceber o que o outro precisa ouvir — e generosidade para dizê-lo. Pode ser o centro emocional de um grupo sem precisar ser o mais falante.",
    emRelacoes: "Nas relações íntimas, a comunicação flui com naturalidade — você fala, compartilha, confessa. O desafio é perceber quando está falando mais para aliviar a própria ansiedade do que para genuinamente conectar. A distinção faz toda a diferença.",
    emConflito: "Em situações de conflito, a tendência é tentar harmonizar — a discórdia é fisicamente desconfortável. Às vezes cede antes de expressar o que realmente pensa ou sente. Com o tempo, o não-dito vira peso.",
    emTensao: "Sob tensão, pode tornar-se mais verborrágico — falar como forma de manejar a ansiedade. Perceber esse padrão é o primeiro passo para escolher as palavras que realmente importam ao invés de produzir volume.",
  },
  psicopata: {
    tipo: "Direto e estratégico",
    descricao: "Você é um comunicador natural — presença forte, voz que organiza o espaço, palavras que têm peso imediato. Fala com convicção e raramente perde o fio do que quer transmitir. Sabe exatamente como posicionar o que diz.",
    emGrupos: "Em grupos, tende a assumir o papel de quem articula, resume ou direciona. Percebe rapidamente a dinâmica do ambiente e sabe onde posicionar-se para ser ouvido. Não precisa falar muito — quando fala, é ouvido.",
    emRelacoes: "Nas relações, a comunicação tende a ser objetiva e funcional. O que sente está presente mas passa por filtros antes de ganhar voz. O desafio é deixar a vulnerabilidade também encontrar expressão — não porque diminui, mas porque completa.",
    emConflito: "No conflito, é direto — talvez mais do que o outro esperava. Não tem dificuldade em defender um ponto de vista e pode ser persistente. Mas persuasão duradoura exige que o outro se sinta ouvido antes de ser convencido.",
    emTensao: "Sob pressão, a comunicação pode endurecer — o tom aumenta, a paciência encurta, a escuta diminui. Perceber isso é crítico: a eficácia do que você diz depende de como é recebido, e o controle do tom é uma habilidade de liderança real.",
  },
  masoquista: {
    tipo: "Contido e reflexivo",
    descricao: "Você pensa muito antes de falar — e o que fala carrega consideração e peso. A comunicação é cuidadosa, às vezes mais do que necessária. Guardar é mais natural do que expressar. As palavras têm custo real para você.",
    emGrupos: "Em grupos, prefere uma posição de observação ou de apoio. Não sente necessidade de dominar a conversa — o que tem a dizer pode esperar o momento certo. Mas quando fala, o que diz costuma ser preciso e oportuno.",
    emRelacoes: "Nas relações, você é confiável e discreto — guarda o que é compartilhado com respeito genuíno. Mas também tende a guardar o que próprio sente por mais tempo do que seria saudável. Os outros podem não saber o quanto você carrega.",
    emConflito: "No conflito, a tendência é engolir. Raramente confronta no calor da hora — prefere silenciar, processar e às vezes nunca mencionar. O ressentimento pode se acumular exatamente nessa contenção, saindo mais tarde e de formas inesperadas.",
    emTensao: "Sob tensão, o silêncio aprofunda. A pressão interna cresce enquanto a comunicação diminui — o oposto do que seria necessário. Às vezes tudo irrompe em um momento inesperado, depois de longa e invisível contenção.",
  },
  rigido: {
    tipo: "Preciso e estruturado",
    descricao: "Você se comunica com clareza e precisão — sabe o que quer dizer e diz com organização. Há uma qualidade de competência no discurso que transmite confiabilidade. O pensamento está bem estruturado antes de virar palavra.",
    emGrupos: "Em grupos, pode tanto liderar a discussão quanto moderá-la. Tem facilidade para organizar o pensamento coletivo e trazer clareza quando a conversa se perde. Funciona bem em contextos que têm estrutura e propósito.",
    emRelacoes: "Nas relações íntimas, a comunicação pode parecer mais formal ou contida do que o outro espera. O que sente está presente, mas passa por um filtro de compostura antes de chegar à voz. Isso pode criar distância que não é intenção.",
    emConflito: "No conflito, é racional e argumentado. Pode ter dificuldade com a dimensão emocional — que muitas vezes pede validação antes de solução. Alguém que chora não quer ser convencido: quer ser visto. Essa distinção é importante.",
    emTensao: "Sob tensão, o controle aumenta — a comunicação torna-se mais formal, mais distante, mais gerenciada. É uma armadura que funciona no curto prazo mas cria isolamento exatamente quando a conexão seria mais necessária.",
  },
};

// ── Unique combination profiles ─────────────────────────────────────────────────

const PERFIS_UNICOS: Record<string, string> = {
  "esquizoide-oral": "Você combina profundidade rara com um anseio genuíno de conexão — duas forças que muitas vezes puxam em direções opostas. A mente habita universos interiores vastos enquanto o coração anseia por pertencimento e sustentação. O resultado é uma pessoa que tanto precisa de solidão quanto sofre com ela, tanto deseja o contato quanto recua diante dele. Esta tensão não é defeito — é o campo de sua integração. Quando as duas estruturas se encontram, emerge alguém capaz de unir a profundidade do pensamento à riqueza do sentimento: um criativo com empatia real e inteligência emocional genuína.",
  "esquizoide-psicopata": "Você é um estrategista que pensa de dentro para fora. A visão intelectual do Esquizóide aliada ao poder de influência do Psicopata cria alguém capaz de transformar ideias abstratas em movimentos concretos — mas que frequentemente prefere operar nos bastidores, a uma distância segura da exposição direta. Liderança existe em você, mas costuma ser exercida através de ideias, estruturas e estratégias mais do que através de presença física contínua. Quando integradas, estas estruturas produzem um visionário com capacidade executiva — difícil de encontrar, impossível de ignorar.",
  "esquizoide-masoquista": "A combinação cria uma experiência interna densa e silenciosa. O Esquizóide retira a energia para a mente; o Masoquista a pressiona para baixo. O mundo exterior pode não perceber a intensidade do que acontece internamente — você carrega muito, pensa muito, sente muito, e raramente tudo isso encontra expressão proporcional. Há uma riqueza interior real que fica enterrada sob camadas de contenção e desconexão. A integração passa por habitar o corpo com presença e gentileza, e permitir que o que está dentro ganhe voz, forma e movimento.",
  "esquizoide-rigido": "Precisão intelectual aliada a organização interna — uma combinação que produz alguém de alta capacidade e funcionalidade real. A riqueza do universo interior Esquizóide é estruturada pela Rígida, criando uma mente que tanto gera ideias profundas quanto as executa com consistência. O desafio compartilhado: ambas as estruturas tendem a manter o mundo emocional à distância — uma por fragmentação, a outra por controle. A integração convida o sentir a ocupar o mesmo espaço que o pensar e o realizar.",
  "oral-esquizoide": "Um coração que anseia por amor aliado a uma mente que precisa de distância — uma polaridade que cria tensão interior constante e rica. Você deseja profundamente mas também teme o que a proximidade pode custar. Esta tensão não precisa ser resolvida: precisa ser habitada com consciência. Quando integradas, estas estruturas produzem alguém com empatia extraordinária e visão interior rara — capaz de sentir o outro com precisão e de compreender padrões que outros simplesmente não veem.",
  "oral-psicopata": "O anseio de ser amado combinado com a força de quem lidera — uma combinação poderosa e internamente complexa. Há uma necessidade de ser visto e validado que pode se disfarçar de generosidade ou liderança. A pergunta que esta combinação convida a explorar: quando você está servindo o outro porque genuinamente quer, e quando está buscando aprovação que ainda não aprendeu a dar a si mesmo? Quando integradas, estas estruturas criam um líder profundamente humano — alguém com força real e coração aberto ao mesmo tempo.",
  "oral-masoquista": "Duas estruturas de necessidade não atendida que se reforçam mutuamente — abandono e humilhação criando um padrão profundo de autossacrifício e sofrimento silencioso. Você carrega muito, oferece muito e frequentemente recebe pouco. A compaixão que emerge dessa experiência é real e rara — quem conhece a dor de dentro acolhe o outro com uma profundidade difícil de imitar. A transformação começa com a decisão de que você merece receber tanto quanto oferece — e que pedir não é fraqueza, é integração.",
  "oral-rigido": "Um coração que quer amar profundamente, contido por uma estrutura que aprendeu a gerenciar o amor. O Oral quer entregar-se; o Rígido organiza essa entrega. O resultado pode ser alguém que cuida com consistência mas raramente se permite ser completamente vulnerável no cuidado. A integração abre o amor sem perder a estrutura — e revela que a vulnerabilidade não desorganiza, ela completa o que a consistência começou.",
  "psicopata-esquizoide": "Um visionário estratégico que prefere a profundidade do pensamento à exposição direta. Você tem poder real de influência e visão clara, mas tende a exercê-los através de ideias e estruturas em vez de presença física contínua. A liderança existe mas opera com distância de segurança. Quando integradas, estas estruturas produzem alguém com profundidade filosófica e capacidade executiva — que pensa antes de agir e age com intenção precisa.",
  "psicopata-oral": "Força exterior e vulnerabilidade interior em permanente tensão. A fachada poderosa e persuasiva esconde um coração que também quer ser visto, sustentado, amado sem precisar impressionar. Esta tensão é sua fronteira de crescimento mais fértil. A integração acontece quando o poder deixa de ser uma defesa contra a necessidade — e você descobre que mostrar o que precisa não enfraquece sua liderança: a humaniza de forma definitiva.",
  "psicopata-masoquista": "Uma energia densa e contraditória: poder de cima, resistência de baixo. O Psicopata quer expandir e avançar; o Masoquista contém e resiste. Esta tensão interna pode gerar impasses intensos — ou, quando integrada, uma liderança de força e humanidade incomuns. Esta combinação conhece tanto a ambição quanto o peso das coisas — e quando as duas se encontram, cria alguém que lidera sem esmagar e resiste sem se prender.",
  "psicopata-rigido": "Excelência e poder em uma mesma estrutura — alguém que tanto domina quanto organiza, tanto lidera quanto entrega. O exterior brilha com competência real e presença inconfundível. O desafio compartilhado está no interior: ambas as estruturas tendem a manter o coração protegido atrás da performance e da eficiência. Muito realizado fora, com uma saudade crescente de profundidade e intimidade real por dentro.",
  "masoquista-esquizoide": "Peso corporal e distância mental — duas forças que criam isolamento a partir de direções diferentes. Você carrega muito internamente e ao mesmo tempo tem dificuldade de estar completamente presente no corpo que carrega esse peso. A riqueza interior existe mas fica enterrada sob tensão e desconexão. O caminho é a presença encarnada: habitar o corpo com gentileza crescente e permitir que o peso encontre expressão e movimento.",
  "masoquista-oral": "Duas estruturas que conhecem a dor de dentro — abandono e humilhação criando um núcleo profundo de necessidade não atendida. Você oferece muito, aguenta muito e frequentemente experimenta a vida como um esforço contínuo. A compaixão que nasce dessa experiência é extraordinária. A transformação radical começa com autocuidado genuíno — não como conceito, mas como prática diária de se tratar com a mesma generosidade que você naturalmente oferece ao mundo.",
  "masoquista-psicopata": "Força em conflito com força — uma batalha interna constante entre submissão e poder, entre suportar e avançar. Esta tensão pode gerar explosões ou implosões quando o sistema não encontra saída saudável. Quando integradas, estas estruturas criam uma liderança autêntica que conhece o peso real das coisas e ainda assim escolhe avançar — uma combinação de força genuína e humanidade que poucos possuem.",
  "masoquista-rigido": "Resistência e disciplina — um guerreiro silencioso e confiável que entrega muito e reclama pouco. A organização rígida cobre a pressão masoquista, criando alguém que funciona com consistência admirável mas que internamente carrega mais do que o mundo vê. A integração pede permissão para a leveza — descobrir que a vida pode ser também prazer, expansão e alegria, e não apenas resistência e entrega contínua.",
  "rigido-esquizoide": "Organização externa com profundidade interna — um ser que funciona exemplarmente no mundo mas habita universos muito mais ricos em seu interior. A estrutura rígida garante que o mundo veja competência; a esquizóide guarda mundos que raramente são compartilhados. A integração convida essa riqueza interior para o contato real — sem perder a organização que você construiu, mas deixando a profundidade também ser vista e recebida.",
  "rigido-oral": "O coração que controla o coração que anseia — a estrutura rígida gerencia a necessidade oral, criando alguém que cuida dos outros com consistência real mas tem dificuldade genuína em receber cuidado. A integração é paradoxal: você precisa aprender a ser tão bom em receber quanto é em dar. O amor verdadeiro flui quando deixamos de administrá-lo e o deixamos simplesmente acontecer.",
  "rigido-psicopata": "Excelência e poder numa combinação de alto rendimento — alguém que tanto realiza quanto influencia, tanto organiza quanto comanda. O exterior é brilhante e a competência é real. O desafio profundo é encontrar quem você é quando não está realizando ou liderando — o ser por baixo da função. Essa descoberta não diminui o poder: ela o enraíza em algo que nenhuma realização externa pode dar.",
  "rigido-masoquista": "Disciplina e resistência — você entrega muito, mantém muito e quase nunca pede. A organização rígida cobre o peso masoquista, criando uma persona de confiabilidade que raramente revela o custo interno que carrega. A integração pede dois movimentos simultâneos: relaxar o controle o suficiente para sentir o que está acumulado, e expandir o suficiente para não carregar tudo sozinho indefinidamente.",
};

// ── Functional dynamic library ──────────────────────────────────────────────────

const DINAMICAS_FUNCIONAIS: Record<keyof EstruturasPct, DinamicaFuncional> = {
  esquizoide: {
    trabalho: "No trabalho, você funciona melhor em profundidade do que em amplitude — prefere mergulhar fundo em um problema do que transitar entre muitos ao mesmo tempo. Ambientes de alta estimulação social ou com exigência constante de interação drenam sua energia de forma desproporcional. O rendimento máximo vem em espaços de autonomia, com tempo para pensar sem interrupção e projetos que demandam originalidade real.",
    relacoes: "Relacionamentos consomem energia de uma forma que você raramente verbaliza. Não é que você não quer as pessoas — é que a presença continuada exige um gerenciamento energético real que outros não percebem. Seus vínculos mais profundos são poucos, mas extraordinariamente intensos. Você é leal de uma forma que quem está fora não vê e quem está dentro raramente esquece.",
    estresse: "Sob estresse, você se retira — para dentro da cabeça, para a solidão, para o trabalho intelectual. A tendência é processar em silêncio e só então emergir com clareza ou solução. Outros podem interpretar isso como distância ou frieza. É, na verdade, o sistema funcionando como sabe: primeiro entende, depois responde.",
    decisoes: "Suas decisões são tomadas internamente, com um processo que pode parecer lento para quem está ao redor. Você analisa a fundo, considera múltiplas variáveis e frequentemente chega a conclusões que outros não haviam considerado. A dificuldade aparece quando é necessário decidir com velocidade ou quando o fator emocional tem mais peso do que a lógica.",
    energia: "Você é introvertido no sentido mais literal — a energia se regenera na solidão e se consome na interação. Grandes grupos e ambientes muito estimulantes criam fadiga real que precisa de tempo para se recuperar. Aprenda a respeitar esses ciclos: quando o sistema pede recolhimento, atendê-lo não é isolamento — é manutenção.",
    sombra: "O lado que você menos gosta de ver em si mesmo: a tendência ao isolamento que se torna prisão, a intelectualização que evita sentir, a dificuldade de se deixar impactar pelo outro. A sombra desta estrutura é o mundo que existe apenas na cabeça — rico demais para ser compartilhado, protegido demais para ser tocado. A cura está em trazer esse universo para o contato real, um passo de cada vez.",
  },
  oral: {
    trabalho: "No trabalho, você funciona melhor em ambientes colaborativos e relacionais — onde o contato humano faz parte do processo. Tarefas que exigem isolamento prolongado drenam sua energia de forma diferente. Você rende mais quando sente que o que faz importa para alguém, que há conexão no propósito. O reconhecimento genuíno importa — não como vaidade, mas como combustível.",
    relacoes: "Relacionamentos são, para você, o centro de gravidade da existência. Você investe profundamente nas pessoas, sente suas alegrias e dores quase como se fossem suas, e tem uma capacidade de cuidado que é raridade real. O desafio estrutural é perceber quando está dando em excesso para suprir uma necessidade que seria mais bem suprida olhando para dentro.",
    estresse: "Sob estresse, você tende a buscar o outro — falar, compartilhar, pedir apoio ou oferecer cuidado. A conexão é a âncora. Quando sozinho por muito tempo sob pressão, a energia cai de forma perceptível e o sistema emocional fica menos estável. Manter vínculos saudáveis não é dependência: para você, é uma necessidade legítima que merece ser honrada.",
    decisoes: "Você decide com o coração muito presente — o impacto emocional e relacional tem peso enorme no processo. Às vezes isso é precisamente a sabedoria necessária. Outras vezes, a decisão mais saudável é aquela que vai desagradar ou decepcionar alguém, e é aí que o sistema trava. Aprender a decidir por você mesmo é uma prática de longo prazo.",
    energia: "Sua energia tem baixa voltagem basal — não é preguiça, é como o sistema está organizado. Você precisa de carga regular através de conexões genuínas, propósito claro e autocuidado consistente. Quando bem carregado, sua presença tem calor e vitalidade reais. Quando vazio, a tendência é buscar o outro para reabastecer — o que pode criar ciclos de dependência que são diferentes de conexão.",
    sombra: "O que você menos quer ver: a dependência afetiva que se disfarça de generosidade, o auto-abandono que se parece com cuidado ao outro, a dificuldade de se sustentar por dentro. A sombra é o espaço onde a necessidade não atendida opera sem ser nomeada — sabotando relações justamente pelo excesso do que você quer delas. Nomear essa necessidade diretamente é o começo da integração.",
  },
  psicopata: {
    trabalho: "No trabalho, você funciona em alta performance e orientação a resultados. Ambientes sem desafio, sem progressão ou com burocracia excessiva frustram rapidamente — você foi feito para avançar, não para manter. Tem facilidade natural para liderar, articular visões e mobilizar recursos humanos. O risco é confundir eficiência com relação: times motivados por medo entregam menos do que times inspirados.",
    relacoes: "Relacionamentos tendem a ser funcionais e estruturados — você investe onde vê retorno real, onde há estimulação e respeito. A vulnerabilidade emocional é o território mais difícil: não porque não existe, mas porque expô-la parece, no sistema interno, equivalente a dar poder ao outro. A transformação relacional começa quando você descobre que mostrar o que precisa não é fraqueza — é confiança.",
    estresse: "Sob estresse, você avança — mais ação, mais controle, mais intensidade. A tendência é dominar a situação antes que ela te domine. Isso funciona em crises objetivas. Em crises emocionais, o mesmo padrão pode amplificar o problema: forçar solução onde o que é necessário é simplesmente estar presente e sentir.",
    decisoes: "Você decide com velocidade e convicção. A análise é rápida, o comprometimento é alto e a execução começa antes de muitos ainda estarem decidindo. O ponto cego é a consulta genuína: não como performance de participação, mas como abertura real para que o pensamento do outro mude o seu. As melhores decisões frequentemente chegam quando o ego sai da sala.",
    energia: "Você tem alta voltagem energética — a carga é abundante e o sistema precisa de descarga regular para não criar tensão crônica. Exercício físico intenso, projetos com visibilidade real e momentos de liderança são fontes naturais de descarga. Sem saídas saudáveis, a energia pode se acumular em tensão nos ombros, nuca e maxilar — o corpo guarda o que não foi expresso.",
    sombra: "O que você menos quer reconhecer: a necessidade de aprovação que se esconde atrás da performance, a vulnerabilidade que foi enterrada tão cedo que mal se lembra de onde está, o coração que quer ser amado de forma simples mas ainda não sabe como permitir. A sombra do Psicopata é a fragilidade original que a força veio proteger — e que ainda está lá, esperando ser encontrada.",
  },
  masoquista: {
    trabalho: "No trabalho, você é o colaborador que realmente entrega — presente, comprometido, confiável mesmo quando ninguém está olhando. A tendência é assumir mais do que deveria e reclamar menos do que seria saudável. O risco é a invisibilidade: fazer tanto sem pedir nada pode criar a impressão de que tudo está bem quando não está. Aprender a comunicar limites é uma habilidade profissional real.",
    relacoes: "Você é leal de uma forma que poucos conseguem manter. Uma vez que se compromete com alguém, vai até o fim — mesmo que o custo seja alto demais. O desafio estrutural é perceber quando a lealdade se tornou submissão: quando você permanece não porque quer, mas porque sair parece impossível ou perigoso. A saúde relacional começa quando você pode escolher ficar — e também escolher ir.",
    estresse: "Sob estresse, você aguenta. Silencia, comprime, continua funcionando quando outros já teriam parado. Isso é força real — e também é onde o sistema se cobra com mais severidade. O estresse crônico não atendido encontra saída no corpo: adoecimento, depressão, a explosão que vem do nada depois de longa contenção. Atender o estresse antes que ele se acumule é autocuidado, não fraqueza.",
    decisoes: "Você decide devagar e com muito peso — cada opção é avaliada pelo que pode custar, pelo que pode desagradar, pelo que pode criar conflito. A tendência é adiar a decisão que vai incomodar alguém, mesmo que essa decisão seja necessária e justa. Com o tempo, aprende-se que decisões adiadas não desaparecem: elas crescem.",
    energia: "Sua energia é densa e resistente — não é alta voltagem, mas é profunda e duradoura. Você tem capacidade de sustentar esforço por longos períodos sem colapsar. O problema é que o sistema raramente recebe tanta energia quanto gasta — a descarga que pede é expansão, expressão, movimento. Sem saídas regulares, a energia se acumula como tensão crônica em quadris, lombar e ombros.",
    sombra: "O que você menos quer ver: o padrão de suportar que se tornou identidade, o ressentimento silencioso que cresce enquanto você continua dizendo que está bem, a expansão que parece perigosa porque um dia custou amor. A sombra desta estrutura é a crença de que ocupar mais espaço, expressar mais, pedir mais — vai custar algo que você não pode perder. A cura começa quando você descobre que não vai.",
  },
  rigido: {
    trabalho: "No trabalho, você é referência — comprometido, preciso, entregador. Faz o que promete e frequentemente faz mais. O ambiente de alta performance é o seu habitat natural. O risco não está na entrega: está no custo. A perfeição como padrão cria uma pressão contínua sobre si mesmo que, com o tempo, esgota — não o corpo, mas o entusiasmo. Aprender a 'bom o suficiente' pode ser a expansão mais difícil.",
    relacoes: "Você é confiável nas relações — presente, consistente, capaz de sustentar vínculos com seriedade. O que está por baixo disso: um coração que sente profundamente mas mantém as emoções em circulação controlada. O outro pode experimentar você como distante ou formal em momentos onde esperava entrega emocional. Não é distância — é a armadura que nunca foi completamente removida.",
    estresse: "Sob estresse, você aumenta o controle — da situação, das emoções, do ambiente. Funciona em crises objetivas com eficácia notável. Em crises relacionais ou emocionais, o mesmo mecanismo pode criar mais distância exatamente quando conexão seria a solução. O sistema precisa de permissão para sentir sem imediatamente gerenciar o que sente.",
    decisoes: "Você decide com método — analisa, pondera, avalia critérios. Raramente age por impulso. A decisão costuma ser boa quando os critérios são claros. O ponto cego é o fator emocional: o que você realmente sente sobre a situação pode ter ficado de fora do processo de deliberação. A intuição emocional não é menos válida que a lógica — é frequentemente a informação que completa o quadro.",
    energia: "Seu fluxo energético é organizado e disponível — corre por canais definidos e produz resultado consistente. O sistema funciona bem nas dimensões de realização e controle. Encontra barreiras quando é convidado a circular no campo emocional e relacional — onde não há estrutura prévia, onde a entrega não tem garantia de retorno. É justamente aí que a maior expansão de energia é possível.",
    sombra: "O que você menos quer reconhecer: a rigidez que se disfarça de princípios, o coração que quer ser tocado mas desvia na hora em que o contato chega, o perfeccionismo que é autocobrança mascarada de padrão. A sombra da estrutura rígida é o ser sensível e profundo que existe por baixo do controle — que sente muito mais do que permite mostrar, e que ainda está esperando permissão para existir sem armadura.",
  },
};

// ── Main export ────────────────────────────────────────────────────────────────

export async function analyzeTracoDeCarater(
  photos: Array<{ tipo: TipoFoto; source: File | string }>,
  token?: string
): Promise<ResultadoAnalise> {
  if (photos.length === 0) throw new Error("Nenhuma foto fornecida para análise.");

  // Load and measure all photos
  const metricsList: Metrics[] = [];
  const observacoesPorFoto: Partial<Record<TipoFoto, string>> = {};

  for (const { tipo, source } of photos) {
    try {
      const pd = source instanceof File
        ? await loadImageFromFile(source)
        : await loadImageFromUrl(source, token ?? "");
      metricsList.push(measurePhoto(pd, tipo));
    } catch {
      // Skip unreadable photo, continue with others
    }
  }

  if (metricsList.length === 0) {
    throw new Error("Não foi possível processar as fotos. Verifique formato e qualidade das imagens.");
  }

  // Score using hybrid accumulation (evidence + continuous feature scoring)
  const evidence = collectEvidence(metricsList);
  const evidencePct = scoreFromEvidence(evidence);
  const continuousRaw = scoreFromContinuousFeatures(metricsList);
  const estruturas = mergeScores(evidencePct, continuousRaw, metricsList);

  // Rank structures
  const sorted = (Object.entries(estruturas) as [keyof EstruturasPct, number][])
    .sort(([, a], [, b]) => b - a);
  const principal = sorted[0][0];
  const secundaria = sorted[1][0];

  // Overall confidence + explainability
  const confiancaAnalise = computeOverallConfidence(metricsList);
  const confidenceBreakdown = buildConfidenceBreakdown(metricsList);

  // Per-photo observations
  for (const m of metricsList) {
    if (m.tipo === "rosto")        observacoesPorFoto["rosto"]        = OBS_ROSTO[principal];
    if (m.tipo === "corpo-frente") observacoesPorFoto["corpo-frente"] = OBS_FRENTE[principal];
    if (m.tipo === "corpo-lado")   observacoesPorFoto["corpo-lado"]   = OBS_LADO[principal];
  }

  // Rich interpretation (5 paragraphs: principal × 3 + secundaria × 1 + combo)
  const ip  = INTERPRETACOES[principal];
  const is_ = INTERPRETACOES[secundaria];
  const comboKey = `${principal}-${secundaria}`;
  const combo = COMBOS[comboKey]
    ?? "a singularidade desta combinação cria um ser de contrastes ricos, com profundidade emocional e complexidade que demandam autoconhecimento continuado para serem plenamente integrados.";

  const interpretacao = [
    ip[0],
    ip[1],
    estruturas[secundaria] >= 18 ? is_[0] : ip[2],
    ip[3],
    `A combinação de ${NOMES[principal]} (${estruturas[principal]}%) com ${NOMES[secundaria]} (${estruturas[secundaria]}%) revela ${combo}`,
    estruturas[principal] - estruturas[secundaria] < 8
      ? "Os dois padrões centrais aparecem com intensidade próxima, indicando um funcionamento mais híbrido e sensível ao contexto. Isso tende a gerar respostas emocionais diferentes conforme ambiente, vínculo e fase de vida."
      : ip[4],
  ].filter(Boolean).join("\n\n");

  // Physical profile narrated from actual measurements
  const perfilFisicoNarrado = buildPhysicalProfile(metricsList, principal, estruturas);

  // Merged characteristics (4 primary + 2 secondary)
  const caract = [
    ...CARACTERISTICAS[principal].slice(0, 4),
    ...CARACTERISTICAS[secundaria].slice(0, 2),
  ];

  // Pontos fortes: 3 primary + 2 secondary (no duplicates)
  const pfPrimary = PONTOS_FORTES[principal].slice(0, 3);
  const pfSecondary = PONTOS_FORTES[secundaria]
    .filter(p => !pfPrimary.includes(p))
    .slice(0, 2);
  const pontosFortes = [...pfPrimary, ...pfSecondary];

  // Pontos atenção: 3 primary + 1 secondary
  const paPrimary = PONTOS_ATENCAO[principal].slice(0, 3);
  const paSecondary = PONTOS_ATENCAO[secundaria]
    .filter(p => !paPrimary.includes(p))
    .slice(0, 1);
  const pontosAtencao = [...paPrimary, ...paSecondary];

  // Recomendações: mix primary (3) + secondary (1–2)
  const recPrimary = RECOMENDACOES[principal].slice(0, 3);
  const recSecondary = RECOMENDACOES[secundaria]
    .filter(r => !recPrimary.includes(r))
    .slice(0, 2);
  const recomendacoesPraticas = [...recPrimary, ...recSecondary];

  // Communication style: primarily from principal, modulated by secondary
  const estiloComunicacao = ESTILOS_COMUNICACAO[principal];

  // Unique profile from combination
  const perfilUnico =
    PERFIS_UNICOS[comboKey] ??
    `A combinação única de ${NOMES[principal]} (${estruturas[principal]}%) com ${NOMES[secundaria]} (${estruturas[secundaria]}%) cria um ser de contrastes ricos, com profundidade e complexidade que se revelam gradualmente ao longo do autoconhecimento.`;

  // Functional dynamic from principal structure
  const dinamicaFuncional = DINAMICAS_FUNCIONAIS[principal];
  const featureSummary = {
    mediaSimetria: Math.round(mean(metricsList.map((m) => m.symm)) * 100) / 100,
    mediaDensidadeCorporal: Math.round(mean(metricsList.map((m) => m.bodyPct)) * 100) / 100,
    mediaRazaoOmbroQuadril: Math.round(mean(metricsList.map((m) => m.shr)) * 100) / 100,
    mediaMassaSuperiorInferior: Math.round(mean(metricsList.map((m) => m.ulr)) * 100) / 100,
    varianciaEntreFotos: Math.round(Math.sqrt(variance(metricsList.map((m) => m.shr))) * 100) / 100,
  };

  return {
    estruturas,
    estruturaPrincipal: principal,
    estruturaSecundaria: secundaria,
    observacoesPorFoto,
    padraoPostural: PADROES_POSTURAIS[principal],
    caracteristicasFisicasObservadas: caract,
    interpretacao,
    centroEnergetico: CENTROS[principal],
    padraoEnergetico: PADROES_ENERGETICOS[principal],
    mensagemTerapeutica: MENSAGENS[principal],
    dominanteApelido: APELIDOSS[principal],
    fraseIdentidade: FRASES_IDENTIDADE[principal],
    pontosFortes,
    pontosAtencao,
    ferida: FERIDAS[principal],
    recurso: RECURSOS[principal],
    recomendacoesPraticas,
    confiancaAnalise,
    perfilFisicoNarrado,
    estiloComunicacao,
    perfilUnico,
    dinamicaFuncional,
    metadata: {
      analysisVersion: "traco-hybrid-v3",
      confidenceBreakdown,
      featureSummary,
    },
    metricasResumo: buildMetricasResumoFromMetrics(metricsList),
  };
}
