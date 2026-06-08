import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { MarcadoresFoto, TipoFoto } from "./types.js";

const LM = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function dist(a: NormalizedLandmark, b: NormalizedLandmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function visOk(lm: NormalizedLandmark | undefined, min = 0.35): boolean {
  return !!lm && lm.visibility >= min;
}

/** Simetria bilateral usando landmarks pareados (1 = simétrico). */
export function simetriaLandmarks(lms: NormalizedLandmark[]): number | null {
  const pairs: [number, number][] = [
    [LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER],
    [LM.LEFT_ELBOW, LM.RIGHT_ELBOW],
    [LM.LEFT_WRIST, LM.RIGHT_WRIST],
    [LM.LEFT_HIP, LM.RIGHT_HIP],
    [LM.LEFT_KNEE, LM.RIGHT_KNEE],
    [LM.LEFT_ANKLE, LM.RIGHT_ANKLE],
  ];
  let sum = 0;
  let n = 0;
  for (const [i, j] of pairs) {
    const L = lms[i];
    const R = lms[j];
    if (!visOk(L) || !visOk(R)) continue;
    const dx = Math.abs(L.y - R.y);
    sum += 1 - clamp(dx / 0.12, 0, 1);
    n++;
  }
  return n > 0 ? clamp(sum / n, 0, 1) : null;
}

/** Razão massa superior/inferior pelo bbox vertical dos landmarks visíveis + máscara opcional. */
export function ratioMassaVerticalMask(
  mask: Uint8Array | null,
  width: number,
  height: number,
  lms: NormalizedLandmark[]
): number | null {
  if (mask && mask.length === width * height) {
    let top = 0;
    let bot = 0;
    const midY = Math.floor(height / 2);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (mask[y * width + x] < 128) continue;
        if (y < midY) top++;
        else bot++;
      }
    }
    const t = top + 1e-6;
    const b = bot + 1e-6;
    return t / b;
  }

  const hipsOk = visOk(lms[LM.LEFT_HIP]) && visOk(lms[LM.RIGHT_HIP]);
  const anklesOk = visOk(lms[LM.LEFT_ANKLE]) && visOk(lms[LM.RIGHT_ANKLE]);
  const shouldersOk = visOk(lms[LM.LEFT_SHOULDER]) && visOk(lms[LM.RIGHT_SHOULDER]);
  if (!hipsOk || !shouldersOk) return null;
  const hipY = (lms[LM.LEFT_HIP]!.y + lms[LM.RIGHT_HIP]!.y) / 2;
  const shoulderY = (lms[LM.LEFT_SHOULDER]!.y + lms[LM.RIGHT_SHOULDER]!.y) / 2;
  const upperSpan = Math.abs(hipY - shoulderY) + 1e-6;
  if (anklesOk) {
    const ankleY = (lms[LM.LEFT_ANKLE]!.y + lms[LM.RIGHT_ANKLE]!.y) / 2;
    const lowerSpan = Math.abs(ankleY - hipY) + 1e-6;
    return upperSpan / lowerSpan;
  }
  const nose = lms[LM.NOSE];
  if (visOk(nose)) {
    const upperFromHead = Math.abs(hipY - nose.y) + 1e-6;
    const lowerGuess = Math.max(0.08, 1 - hipY);
    return upperFromHead / lowerGuess;
  }
  return null;
}

/** Densidade da máscara (fração de pixels de corpo). */
export function densidadeMascara(mask: Uint8Array | null, width: number, height: number): number | null {
  if (!mask || mask.length !== width * height) return null;
  let on = 0;
  for (let i = 0; i < mask.length; i++) if (mask[i] >= 128) on++;
  return on / mask.length;
}

/** Gradiente médio dentro da máscara (proxy definição muscular). */
export function definicaoMascara(mask: Uint8Array | null, width: number, height: number): number | null {
  if (!mask || mask.length !== width * height) return null;
  let sum = 0;
  let n = 0;
  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const i = y * width + x;
      if (mask[i] < 128) continue;
      const gx = mask[i + 1] - mask[i - 1];
      const gy = mask[i + width] - mask[i - width];
      sum += Math.sqrt(gx * gx + gy * gy);
      n++;
    }
  }
  return n > 0 ? clamp(sum / n / 400, 0, 1) : null;
}

/** Nariz adiantado em relação à pelve no perfil (normalizado pela largura do quadril). */
export function projecaoCranianaLandmarks(lms: NormalizedLandmark[], hipW: number | null): number | null {
  const nose = lms[LM.NOSE];
  const lh = lms[LM.LEFT_HIP];
  const rh = lms[LM.RIGHT_HIP];
  if (!visOk(nose, 0.25) || !visOk(lh, 0.3) || !visOk(rh, 0.3)) return null;
  const midHx = (lh!.x + rh!.x) / 2;
  const scale = Math.max(hipW ?? dist(lh!, rh!), 0.04);
  return (nose!.x - midHx) / scale;
}

/** Ombros adiantados vs pelve no eixo sagital (normalizado). */
export function ombrosAdiantadosLandmarks(
  lms: NormalizedLandmark[],
  hipW: number | null
): number | null {
  const ls = lms[LM.LEFT_SHOULDER];
  const rs = lms[LM.RIGHT_SHOULDER];
  const lh = lms[LM.LEFT_HIP];
  const rh = lms[LM.RIGHT_HIP];
  if (!visOk(ls, 0.3) || !visOk(rs, 0.3) || !visOk(lh, 0.3) || !visOk(rh, 0.3)) return null;
  const midSx = (ls!.x + rs!.x) / 2;
  const midHx = (lh!.x + rh!.x) / 2;
  const scale = Math.max(hipW ?? dist(lh!, rh!), 0.04);
  return (midSx - midHx) / scale;
}

/** Colapso torácico: tórax superior curto em relação ao inferior (frente). */
export function colapsoToracicoLandmarks(lms: NormalizedLandmark[]): number | null {
  const ls = lms[LM.LEFT_SHOULDER];
  const rs = lms[LM.RIGHT_SHOULDER];
  const lh = lms[LM.LEFT_HIP];
  const rh = lms[LM.RIGHT_HIP];
  const la = lms[LM.LEFT_ANKLE];
  const ra = lms[LM.RIGHT_ANKLE];
  if (!visOk(ls, 0.3) || !visOk(rs, 0.3) || !visOk(lh, 0.3) || !visOk(rh, 0.3)) return null;
  const shoulderY = (ls!.y + rs!.y) / 2;
  const hipY = (lh!.y + rh!.y) / 2;
  const upper = Math.abs(hipY - shoulderY) + 1e-6;
  if (visOk(la, 0.25) && visOk(ra, 0.25)) {
    const ankleY = (la!.y + ra!.y) / 2;
    const lower = Math.abs(ankleY - hipY) + 1e-6;
    const ratio = upper / (upper + lower);
    return clamp(1 - ratio * 2.2, 0, 1);
  }
  const nose = lms[LM.NOSE];
  if (visOk(nose, 0.2)) {
    const headToShoulder = Math.abs(shoulderY - nose!.y) + 1e-6;
    return clamp(1 - headToShoulder / (upper * 3), 0, 1);
  }
  return null;
}

function weightedMean(items: { val: number | null; weight: number }[]): number | null {
  const valid = items.filter((i) => i.val !== null && Number.isFinite(i.val!) && i.weight > 0);
  if (valid.length === 0) return null;
  const wSum = valid.reduce((s, i) => s + i.weight, 0);
  return valid.reduce((s, i) => s + i.val! * i.weight, 0) / wSum;
}

export interface ExtrairMarcadoresInput {
  tipo: TipoFoto;
  landmarks: NormalizedLandmark[] | null;
  segmentationMask: Uint8Array | null;
  maskWidth: number;
  maskHeight: number;
}

export function extrairMarcadoresFoto(input: ExtrairMarcadoresInput): MarcadoresFoto {
  const { tipo, landmarks, segmentationMask, maskWidth, maskHeight } = input;
  const lms = landmarks;

  if (!lms || lms.length < 29) {
    const defBorda = definicaoMascara(segmentationMask, maskWidth, maskHeight);
    return {
      tipo,
      poseDetectada: false,
      qualidadeFoto: 0,
      shr: null,
      wsr: null,
      ulr: null,
      simetria: null,
      densidadeCorpo: densidadeMascara(segmentationMask, maskWidth, maskHeight),
      definicaoBorda: defBorda,
      inclinacaoAnterior: null,
      projecaoPeito: null,
      projecaoCraniana: null,
      ombrosAdiantados: null,
      colapsoToracico: null,
      simetriaFacial: tipo === "rosto" ? simetriaLandmarks(lms ?? []) : null,
      tensaoMandibula: tipo === "rosto" ? defBorda : null,
      rigidezCervical: null,
    };
  }

  const ls = lms[LM.LEFT_SHOULDER];
  const rs = lms[LM.RIGHT_SHOULDER];
  const lh = lms[LM.LEFT_HIP];
  const rh = lms[LM.RIGHT_HIP];
  const le = lms[LM.LEFT_ELBOW];
  const re = lms[LM.RIGHT_ELBOW];

  const shouldersOk = visOk(ls, 0.3) && visOk(rs, 0.3);
  const hipsOk = visOk(lh, 0.3) && visOk(rh, 0.3);

  let shoulderW = shouldersOk ? dist(ls!, rs!) : null;
  let hipW = hipsOk ? dist(lh!, rh!) : null;
  let shr = shoulderW !== null && hipW !== null && hipW > 1e-6 ? shoulderW / hipW : null;

  let wsr: number | null = null;
  if (shouldersOk && hipsOk && visOk(le, 0.25) && visOk(re, 0.25)) {
    const elbowW = dist(le!, re!);
    wsr = elbowW / Math.max(hipW!, 1e-6);
  }

  const ulr = ratioMassaVerticalMask(segmentationMask, maskWidth, maskHeight, lms);
  const simetria = simetriaLandmarks(lms);
  const densidadeCorpo = densidadeMascara(segmentationMask, maskWidth, maskHeight);
  const definicaoBorda = definicaoMascara(segmentationMask, maskWidth, maskHeight);

  let inclinacaoAnterior: number | null = null;
  let projecaoPeito: number | null = null;

  if (tipo === "corpo-lado" && shouldersOk && hipsOk) {
    const midSx = (ls!.x + rs!.x) / 2;
    const midHx = (lh!.x + rh!.x) / 2;
    inclinacaoAnterior = midSx - midHx;
    if (shoulderW !== null && hipW !== null) {
      projecaoPeito = Math.max(0, shoulderW - hipW);
    }
  }

  if (tipo === "corpo-frente" && shouldersOk && hipsOk && shoulderW !== null && hipW !== null) {
    projecaoPeito = Math.max(0, shoulderW - hipW);
  }

  let projecaoCraniana: number | null = null;
  let ombrosAdiantados: number | null = null;
  let colapsoToracico: number | null = null;

  if (tipo === "corpo-lado" && shouldersOk && hipsOk) {
    projecaoCraniana = projecaoCranianaLandmarks(lms, hipW);
    ombrosAdiantados = ombrosAdiantadosLandmarks(lms, hipW);
  }
  if (tipo === "corpo-frente" && shouldersOk && hipsOk) {
    colapsoToracico = colapsoToracicoLandmarks(lms);
    if (ombrosAdiantados === null) {
      ombrosAdiantados = ombrosAdiantadosLandmarks(lms, hipW);
    }
  }

  let qualidadeFoto = 0;
  if (shouldersOk && hipsOk) qualidadeFoto += 0.55;
  else if (shouldersOk || hipsOk) qualidadeFoto += 0.25;
  if (simetria !== null) qualidadeFoto += 0.15;
  if (densidadeCorpo !== null && densidadeCorpo > 0.02) qualidadeFoto += 0.15;
  qualidadeFoto = clamp(qualidadeFoto, 0, 1);

  const poseDetectada =
    tipo === "rosto"
      ? visOk(lms[LM.NOSE], 0.2) && (shouldersOk || simetria !== null)
      : shouldersOk && hipsOk;

  let simetriaFacial: number | null = null;
  let tensaoMandibula: number | null = null;
  let rigidezCervical: number | null = null;

  if (tipo === "rosto") {
    simetriaFacial = simetria;
    tensaoMandibula = definicaoBorda;
    const nose = lms[LM.NOSE];
    if (visOk(nose, 0.25) && shouldersOk) {
      const shoulderY = (ls!.y + rs!.y) / 2;
      const noseY = nose!.y;
      rigidezCervical = clamp(Math.abs(shoulderY - noseY) / 0.25, 0, 1);
    }
  }

  return {
    tipo,
    poseDetectada,
    qualidadeFoto,
    shr,
    wsr,
    ulr,
    simetria,
    densidadeCorpo,
    definicaoBorda,
    inclinacaoAnterior,
    projecaoPeito,
    projecaoCraniana,
    ombrosAdiantados,
    colapsoToracico,
    simetriaFacial,
    tensaoMandibula,
    rigidezCervical,
  };
}

export function agregarMarcadores(fotos: MarcadoresFoto[]): import("./types.js").MarcadoresAgregados {
  const bodyShots = fotos.filter((f) => f.tipo !== "rosto");
  const rostoShots = fotos.filter((f) => f.tipo === "rosto");
  const used = bodyShots.length > 0 ? bodyShots : fotos;
  const ladoShots = bodyShots.filter((f) => f.tipo === "corpo-lado");
  const frenteShots = bodyShots.filter((f) => f.tipo === "corpo-frente");

  const meanOrNull = (vals: (number | null)[]): number | null => {
    const xs = vals.filter((v): v is number => v !== null && Number.isFinite(v));
    if (xs.length === 0) return null;
    return xs.reduce((a, b) => a + b, 0) / xs.length;
  };

  const fotosComPoseCorpo = bodyShots.filter((f) => f.poseDetectada).length;

  const pesoTipo = (tipo: TipoFoto, alvo: "oral" | "geral"): number => {
    if (alvo === "oral") {
      if (tipo === "corpo-lado") return 2;
      if (tipo === "corpo-frente") return 1;
      return 0;
    }
    return 1;
  };

  return {
    shrMedio: meanOrNull(used.map((f) => f.shr)),
    wsrMedio: meanOrNull(used.map((f) => f.wsr)),
    ulrMedio: meanOrNull(used.map((f) => f.ulr)),
    simetriaMedia: meanOrNull(used.map((f) => f.simetria)),
    densidadeMedia: meanOrNull(used.map((f) => f.densidadeCorpo)),
    definicaoMedia: meanOrNull(used.map((f) => f.definicaoBorda)),
    inclinacaoMedia: meanOrNull(
      (ladoShots.length > 0 ? ladoShots : used).map((f) => f.inclinacaoAnterior)
    ),
    projecaoPeitoMedia: meanOrNull(used.map((f) => f.projecaoPeito)),
    projecaoCranianaMedia: weightedMean(
      bodyShots.map((f) => ({ val: f.projecaoCraniana, weight: pesoTipo(f.tipo, "oral") }))
    ),
    ombrosAdiantadosMedio: weightedMean(
      bodyShots.map((f) => ({ val: f.ombrosAdiantados, weight: pesoTipo(f.tipo, "oral") }))
    ),
    colapsoToracicoMedio: weightedMean([
      ...frenteShots.map((f) => ({ val: f.colapsoToracico, weight: 2 })),
      ...ladoShots.map((f) => ({ val: f.colapsoToracico, weight: 0.5 })),
    ]),
    simetriaFacialMedia: weightedMean(
      rostoShots.map((f) => ({ val: f.simetriaFacial ?? f.simetria, weight: f.qualidadeFoto || 1 }))
    ),
    tensaoMandibulaMedia: weightedMean(
      rostoShots.map((f) => ({ val: f.tensaoMandibula, weight: f.qualidadeFoto || 1 }))
    ),
    rigidezCervicalMedia: weightedMean(
      rostoShots.map((f) => ({ val: f.rigidezCervical, weight: f.qualidadeFoto || 1 }))
    ),
    fotosComPoseCorpo,
  };
}
