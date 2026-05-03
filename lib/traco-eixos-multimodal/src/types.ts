export const EIXOS = ["controle", "retracao", "dependencia", "expansao", "rigidez"] as const;
export type Eixo = (typeof EIXOS)[number];

export type ConsistenciaLabel = "alta" | "media" | "baixa";

/** Uma foto já medida (subset estável de `Metrics` do tracoAnalysis). */
export interface MetricasFotoResumo {
  tipo: "rosto" | "corpo-frente" | "corpo-lado";
  shoulderW: number;
  chestW: number;
  waistW: number;
  hipW: number;
  thighW: number;
  legW: number;
  shr: number;
  whr: number;
  wsr: number;
  ulr: number;
  symm: number;
  bodyPct: number;
  edgeDensityBody: number;
  forwardLean: number;
  chestProjection: number;
  confidence: number;
}

export interface MetricasResumoAgregado {
  shrMedio: number;
  whrMedio: number;
  symmMedio: number;
  forwardLeanMedio: number;
  chestProjectionMedio: number;
  edgeDensityMedio: number;
  bodyPctMedio: number;
  ulrMedio: number;
  /** Proxy expansão torácica frente (média chestW/max(hipW,0.01)). */
  chestExpansionProxy: number;
  /** Largura de base inferida (média (thighW+legW)/2). */
  pernasMedio: number;
}

export interface MetricasResumo {
  versao: "metricas_resumo_v1";
  fotos: MetricasFotoResumo[];
  agregado: MetricasResumoAgregado;
}

export interface ModeloMultimodalScores {
  controle: number;
  retracao: number;
  dependencia: number;
  expansao: number;
  rigidez: number;
}

export interface ModeloMultimodalAnalise {
  emocional: string;
  comportamental: string;
  relacional: string;
}

export interface ModeloMultimodalOutput {
  versaoModelo: string;
  scores: ModeloMultimodalScores;
  scoresImagem: ModeloMultimodalScores;
  scoresQuestionario: ModeloMultimodalScores;
  dominante: Eixo;
  secundario: Eixo;
  /** 0–1: coerência global entre vetores imagem vs questionário (não multiplica scores). */
  confianca: number;
  consistencia: ConsistenciaLabel;
  deltasPorEixo: Record<Eixo, number>;
  analise: ModeloMultimodalAnalise;
  pesoImagem: number;
  pesoQuestionario: number;
}
