import type {
  EstruturaTraco,
  EstruturasPct,
  EvidenciaItem,
  MarcadoresAgregados,
  MarcadoresFoto,
  TipoFoto,
} from "@workspace/traco-imagem-engine";

export type { EstruturaTraco, EstruturasPct, TipoFoto };

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

/** Resultado completo da análise Traço (texto + dados para persistência). */
export interface ResultadoAnalise {
  estruturas: EstruturasPct;
  estruturaPrincipal: EstruturaTraco;
  estruturaSecundaria: EstruturaTraco;
  observacoesPorFoto: Partial<Record<TipoFoto, string>>;
  /** Versão técnica (OMR, landmarks) — só persistência/auditoria, não UI produção. */
  observacoesPorFotoTecnico?: Partial<Record<TipoFoto, string>>;
  /** Uma frase amigável sobre fotos + questionário (sem % nem jargão). */
  sinteseHumana?: string;
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
    eixosReich?: import("@workspace/traco-imagem-engine").EixosReich;
    segmentosReich?: import("@workspace/traco-imagem-engine").SegmentosReich;
    versaoEixos?: string;
  };
  eixosReich?: import("@workspace/traco-imagem-engine").EixosReich;
  segmentosReich?: import("@workspace/traco-imagem-engine").SegmentosReich;
  /** Para auditoria no servidor */
  marcadoresPorFoto?: MarcadoresFoto[];
  marcadoresAgregados?: MarcadoresAgregados;
  evidenciasMotor?: EvidenciaItem[];
  estruturasSomenteFotos?: EstruturasPct;
  sinteseIntegradaFotosQuestionario?: string;
  fusaoDiagnosticoEmocional?: Record<string, unknown>;
  pessoaId?: number | null;
  pessoaNome?: string | null;
  versaoNarrativa?: string;
  perguntaTransformacao?: string;
  dorLivro?: string;
  leituraEmocionalDeclarada?: string;
  contrasteFotosFormulario?: string;
  couracaCorporal?: string;
  pontosCuidadoPrioritarios?: string[];
}
