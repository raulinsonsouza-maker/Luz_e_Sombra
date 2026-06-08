import type { TipoFoto } from "./types.js";
import type { ResultadoImagemEngine } from "./types.js";
import { extrairMarcadoresFoto, agregarMarcadores } from "./marcadores.js";
import { detectarPoseNaImagem } from "./mediapipeRunner.js";
import { calcularEixosReich, calcularSegmentosReich, VERSAO_EIXOS_REICH } from "./eixosReich.js";
import { rankingPrincipalSecundaria, scoreEstruturas } from "./scoreEstruturas.js";

const ANALYSIS_VERSION = "traco-mediapipe-v3";

function variance(vals: number[]): number {
  if (vals.length <= 1) return 0;
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return vals.reduce((s, v) => s + (v - m) ** 2, 0) / vals.length;
}

async function carregarImagem(source: File | string, token?: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  if (source instanceof File) {
    const url = URL.createObjectURL(source);
    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Falha ao carregar imagem"));
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  } else {
    const r = await fetch(source, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!r.ok) throw new Error("Falha ao carregar imagem do servidor");
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Falha ao decodificar imagem"));
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  return img;
}

function media(vals: number[]): number {
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export async function analisarFotos(
  photos: Array<{ tipo: TipoFoto; source: File | string }>,
  token?: string
): Promise<ResultadoImagemEngine> {
  if (photos.length === 0) throw new Error("Nenhuma foto fornecida para análise.");

  const marcadoresPorFoto: import("./types.js").MarcadoresFoto[] = [];

  for (const { tipo, source } of photos) {
    try {
      const img = await carregarImagem(source, token);
      const det = await detectarPoseNaImagem(img);
      const mf = extrairMarcadoresFoto({
        tipo,
        landmarks: det.landmarks,
        segmentationMask: det.mask,
        maskWidth: det.maskWidth || img.naturalWidth,
        maskHeight: det.maskHeight || img.naturalHeight,
      });
      marcadoresPorFoto.push(mf);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha ao processar foto";
      marcadoresPorFoto.push({
        tipo,
        poseDetectada: false,
        qualidadeFoto: 0,
        shr: null,
        wsr: null,
        ulr: null,
        simetria: null,
        densidadeCorpo: null,
        definicaoBorda: null,
        inclinacaoAnterior: null,
        projecaoPeito: null,
        projecaoCraniana: null,
        ombrosAdiantados: null,
        colapsoToracico: null,
        simetriaFacial: null,
        tensaoMandibula: null,
        rigidezCervical: null,
        erroProcessamento: msg,
      });
    }
  }

  const ag = agregarMarcadores(marcadoresPorFoto);
  const fotoRosto = marcadoresPorFoto.find((f) => f.tipo === "rosto") ?? null;
  const eixosReich = calcularEixosReich(ag, fotoRosto);
  const segmentosReich = calcularSegmentosReich(ag, eixosReich, fotoRosto);
  ag.eixosReich = eixosReich;
  ag.segmentosReich = segmentosReich;

  const scored = scoreEstruturas({ ag, numFotos: marcadoresPorFoto.length, fotoRosto });
  const { principal, secundaria } = rankingPrincipalSecundaria(scored.estruturas);

  const shrVals = marcadoresPorFoto.map((f) => f.shr).filter((v): v is number => v !== null);
  const varianciaShr = variance(shrVals.length ? shrVals : [0.5]);

  const temMetrica =
    ag.shrMedio !== null ||
    ag.ulrMedio !== null ||
    ag.simetriaMedia !== null ||
    ag.densidadeMedia !== null;

  const bodyOk = ag.fotosComPoseCorpo > 0;
  const qualMed = media(marcadoresPorFoto.map((f) => f.qualidadeFoto));

  let confiancaAnalise = 0;
  if (temMetrica) {
    const coverage = Math.min(1, marcadoresPorFoto.length / 3);
    const bodyRatio = bodyOk ? 1 : qualMed > 0.35 ? 0.45 : 0;
    const featVar = clamp01(1 - Math.sqrt(varianciaShr) * 2);
    confiancaAnalise = Math.round(
      clamp01(qualMed * 0.45 + coverage * 0.25 + bodyRatio * 0.2 + featVar * 0.1) * 100
    );
    if (!bodyOk && marcadoresPorFoto.every((f) => f.tipo === "rosto")) {
      confiancaAnalise = Math.round(confiancaAnalise * 0.65);
    }
  }

  /** Sem ombros+quadril em pelo menos uma foto de corpo, não há base postural auditável. */
  if (ag.fotosComPoseCorpo === 0) {
    confiancaAnalise = 0;
  }

  return {
    estruturas: scored.estruturas,
    estruturaPrincipal: principal,
    estruturaSecundaria: secundaria,
    evidencias: scored.evidencias,
    marcadoresPorFoto,
    marcadoresAgregados: ag,
    confiancaAnalise,
    metadata: {
      analysisVersion: ANALYSIS_VERSION,
      confidenceBreakdown: {
        imageQuality: Math.round(qualMed * 100) / 100,
        bodyDetection: ag.fotosComPoseCorpo > 0 ? 1 : 0,
        photoCoverage: Math.min(1, marcadoresPorFoto.length / 3),
        featureVariance: Math.round(clamp01(1 - Math.sqrt(varianciaShr)) * 100) / 100,
      },
      featureSummary: {
        mediaSimetria: Math.round((ag.simetriaMedia ?? 0) * 100) / 100,
        mediaDensidadeCorporal: Math.round((ag.densidadeMedia ?? 0) * 100) / 100,
        mediaRazaoOmbroQuadril: Math.round((ag.shrMedio ?? 0) * 100) / 100,
        mediaMassaSuperiorInferior: Math.round((ag.ulrMedio ?? 0) * 100) / 100,
        varianciaEntreFotos: Math.round(Math.sqrt(varianciaShr) * 100) / 100,
      },
      eixosReich,
      segmentosReich,
      versaoEixos: VERSAO_EIXOS_REICH,
    },
  };
}
