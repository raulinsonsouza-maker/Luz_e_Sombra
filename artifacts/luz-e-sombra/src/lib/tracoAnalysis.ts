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

export type TipoFoto = "rosto" | "corpo-frente" | "corpo-lado";

export interface EstruturasPct {
  esquizoide: number;
  oral: number;
  psicopata: number;
  masoquista: number;
  rigido: number;
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
  // Enhanced fields
  dominanteApelido: string;
  fraseIdentidade: string;
  pontosFortes: string[];
  pontosAtencao: string[];
  ferida: string;
  recurso: string;
  recomendacoesPraticas: string[];
  confiancaAnalise: number;       // 0–100
  perfilFisicoNarrado: string;    // dynamic text from actual measurements
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
  // Weighted accumulation
  const raw: Record<keyof EstruturasPct, number> = {
    esquizoide: 4, oral: 4, psicopata: 4, masoquista: 4, rigido: 4
  };

  for (const e of evidence) {
    raw[e.structure] += e.score * Math.max(0.05, Math.min(1, e.confidence));
  }

  // Clamp to non-negative
  for (const k of Object.keys(raw) as (keyof EstruturasPct)[]) {
    raw[k] = Math.max(0.5, raw[k]);
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

// ── Confidence calculation ─────────────────────────────────────────────────────

function computeOverallConfidence(metrics: Metrics[]): number {
  if (metrics.length === 0) return 0;
  const avg = metrics.reduce((s, m) => s + m.confidence, 0) / metrics.length;
  const bonus = metrics.length === 3 ? 0.15 : metrics.length === 2 ? 0.07 : 0;
  const detected = metrics.filter(m => m.bodyDetected).length / metrics.length;
  return Math.round(Math.min(100, (avg * detected + bonus) * 100));
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

  // Score using evidence accumulation
  const evidence = collectEvidence(metricsList);
  const estruturas = scoreFromEvidence(evidence);

  // Rank structures
  const sorted = (Object.entries(estruturas) as [keyof EstruturasPct, number][])
    .sort(([, a], [, b]) => b - a);
  const principal = sorted[0][0];
  const secundaria = sorted[1][0];

  // Overall confidence
  const confiancaAnalise = computeOverallConfidence(metricsList);

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
    ip[4],
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
  };
}
