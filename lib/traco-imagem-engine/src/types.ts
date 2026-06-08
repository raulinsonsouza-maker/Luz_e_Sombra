/** Tipos de foto do fluxo Traço de Caráter. */
export type TipoFoto = "rosto" | "corpo-frente" | "corpo-lado";

/** Cinco estruturas biomecânicas Reich/Lowen (percentagens inteiras 0–100, soma 100). */
export type EstruturaTraco =
  | "esquizoide"
  | "oral"
  | "psicopata"
  | "masoquista"
  | "rigido";

export type EstruturasPct = Record<EstruturaTraco, number>;

/** Uma evidência audível para UI / auditoria. */
export interface EvidenciaItem {
  estrutura: EstruturaTraco;
  peso: number;
  descricao: string;
}

/** Métricas derivadas de landmarks / máscara para uma foto. */
export interface MarcadoresFoto {
  tipo: TipoFoto;
  poseDetectada: boolean;
  /** Confiança local 0–1 nesta foto (pose + visibilidade). */
  qualidadeFoto: number;
  shr: number | null;
  /** waist proxy: distância cotovelos / quadril */
  wsr: number | null;
  ulr: number | null;
  /** Simetria 0–1 (maior = mais simétrico). */
  simetria: number | null;
  densidadeCorpo: number | null;
  definicaoBorda: number | null;
  inclinacaoAnterior: number | null;
  projecaoPeito: number | null;
  /** Nariz adiantado vs. pelve no perfil (normalizado, >0 = craniana). */
  projecaoCraniana: number | null;
  /** Ombros adiantados vs. pelve no eixo sagital (normalizado). */
  ombrosAdiantados: number | null;
  /** Colapso torácico: razão tórax superior/inferior na frente (maior = mais colapso). */
  colapsoToracico: number | null;
  /** Simetria facial (rosto). */
  simetriaFacial: number | null;
  /** Proxy tensão mandíbula (rosto). */
  tensaoMandibula: number | null;
  /** Rigidez cervical nariz–ombro (rosto/perfil). */
  rigidezCervical: number | null;
  /** Mensagem quando o processamento desta foto falhou. */
  erroProcessamento?: string;
}

/** Índices Reich/Lowen (0–1) derivados dos marcadores. */
export interface EixosReich {
  indiceExpansao: number;
  indiceRetracao: number;
  indiceContencao: number;
  indiceCompressao: number;
  indiceFragmentacao: number;
}

export interface SegmentosReich {
  ocular: number;
  oral: number;
  cervical: number;
  toracico: number;
  diafragmatico: number;
  abdominal: number;
  pelvico: number;
}

/** Agregado sobre todas as fotos válidas. */
export interface MarcadoresAgregados {
  shrMedio: number | null;
  wsrMedio: number | null;
  ulrMedio: number | null;
  simetriaMedia: number | null;
  densidadeMedia: number | null;
  definicaoMedia: number | null;
  inclinacaoMedia: number | null;
  projecaoPeitoMedia: number | null;
  projecaoCranianaMedia: number | null;
  ombrosAdiantadosMedio: number | null;
  colapsoToracicoMedio: number | null;
  simetriaFacialMedia: number | null;
  tensaoMandibulaMedia: number | null;
  rigidezCervicalMedia: number | null;
  fotosComPoseCorpo: number;
  eixosReich?: EixosReich;
  segmentosReich?: SegmentosReich;
}

/** Resultado completo da análise por imagem (antes da narrativa textual). */
export interface ResultadoImagemEngine {
  estruturas: EstruturasPct;
  estruturaPrincipal: EstruturaTraco;
  estruturaSecundaria: EstruturaTraco;
  evidencias: EvidenciaItem[];
  marcadoresPorFoto: MarcadoresFoto[];
  marcadoresAgregados: MarcadoresAgregados;
  /** 0–100: cobertura das fotos + qualidade da pose. */
  confiancaAnalise: number;
  metadata: {
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
    eixosReich?: EixosReich;
    segmentosReich?: SegmentosReich;
    versaoEixos?: string;
  };
}
