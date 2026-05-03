import type { Eixo, ModeloMultimodalScores } from "./types";

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

const EIXOS_LIST = ["controle", "retracao", "dependencia", "expansao", "rigidez"] as const;

function vecFromScores(s: ModeloMultimodalScores): number[] {
  return EIXOS_LIST.map((k) => s[k] / 100);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na <= 0 || nb <= 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export interface FusaoEixosInput {
  imagem: ModeloMultimodalScores;
  questionario: ModeloMultimodalScores;
  pesoImagem?: number;
  pesoQuestionario?: number;
}

export interface FusaoEixosResult {
  scores: ModeloMultimodalScores;
  deltasPorEixo: Record<Eixo, number>;
  confianca: number;
  pesoImagem: number;
  pesoQuestionario: number;
}

/**
 * Fusão linear por eixo. A confiança **não** multiplica os scores (evita colapso quando há divergência).
 */
export function fusaoEixosMultimodal(input: FusaoEixosInput): FusaoEixosResult {
  const wi = input.pesoImagem ?? 0.6;
  const wq = input.pesoQuestionario ?? 0.4;
  const sum = wi + wq;
  const pi = sum > 0 ? wi / sum : 0.6;
  const pq = sum > 0 ? wq / sum : 0.4;

  const deltasPorEixo = {} as Record<Eixo, number>;
  const scores = {} as ModeloMultimodalScores;

  for (const k of EIXOS_LIST) {
    const vi = input.imagem[k] / 100;
    const vq = input.questionario[k] / 100;
    const blended = pi * vi + pq * vq;
    scores[k] = Math.round(100 * clamp01(blended));
    deltasPorEixo[k] = Math.abs(vi - vq);
  }

  const meanDelta = EIXOS_LIST.reduce((a, k) => a + deltasPorEixo[k], 0) / EIXOS_LIST.length;
  const confiancaMean = clamp01(1 - meanDelta);

  const cos = cosineSimilarity(vecFromScores(input.imagem), vecFromScores(input.questionario));
  const confianca = clamp01(0.45 * confiancaMean + 0.55 * cos);

  return { scores, deltasPorEixo, confianca, pesoImagem: pi, pesoQuestionario: pq };
}

export function dominanteSecundario(scores: ModeloMultimodalScores): { dominante: Eixo; secundario: Eixo } {
  const sorted = [...EIXOS_LIST].sort((a, b) => scores[b] - scores[a]);
  return { dominante: sorted[0], secundario: sorted[1] };
}

export function consistenciaLabel(confianca: number): "alta" | "media" | "baixa" {
  if (confianca >= 0.72) return "alta";
  if (confianca >= 0.48) return "media";
  return "baixa";
}
