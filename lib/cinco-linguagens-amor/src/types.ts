/** As cinco linguagens (Chapman), identificadores estáveis em PT curto. */
export type LinguagemAmor =
  | "palavras"
  | "tempo"
  | "presentes"
  | "servicos"
  | "toque";

export type LadoEscolha = "a" | "b";

export type BlocoQuestionario = "receber" | "expressar";

export interface ParForcado {
  id: string;
  textoA: string;
  textoB: string;
  linguagemA: LinguagemAmor;
  linguagemB: LinguagemAmor;
  bloco: BlocoQuestionario;
}

export interface PontuacaoPorLinguagem {
  palavras: number;
  tempo: number;
  presentes: number;
  servicos: number;
  toque: number;
}

export interface RankingItem {
  linguagem: LinguagemAmor;
  pontos: number;
  pct: number;
  posicao: number;
}

export interface DimensaoPerfil {
  pontuacoes: PontuacaoPorLinguagem;
  ranking: RankingItem[];
  principal: LinguagemAmor;
  secundaria: LinguagemAmor;
  terciaria: LinguagemAmor;
  anti: LinguagemAmor;
}

export type AlertaQualidade =
  | "FAST_COMPLETION"
  | "SIDE_BIAS_RECEBER"
  | "SIDE_BIAS_EXPRESSAR"
  | "FLAT_PROFILE_RECEBER"
  | "FLAT_PROFILE_EXPRESSAR";

export interface MetricasQualidade {
  confianca: number;
  alertas: AlertaQualidade[];
  perfilEquilibradoReceber: boolean;
  perfilEquilibradoExpressar: boolean;
  gapReceber: number;
  gapExpressar: number;
}

export interface Desalinhamento {
  ativo: boolean;
  texto: string;
}

export interface PerfilLinguagemDetalhe {
  linguagem: LinguagemAmor;
  label: string;
  essencia: string;
  comoSeSenteAmado: string;
  comoExpressa: string;
  dialetos: string[];
  oQueMagoa: string;
  acoesPraticas: string[];
  dicaParaParceiro: string;
}

export interface ResultadoLinguagensAmorComputado {
  versao: "linguagens_amor_v2";
  receber: DimensaoPerfil;
  expressar: DimensaoPerfil;
  desalinhamento: Desalinhamento;
  metricas: MetricasQualidade;
  sinteseHumana: string;
  tanqueEmocional: string;
  perfilPrincipal: PerfilLinguagemDetalhe;
  perfilSecundario: PerfilLinguagemDetalhe;
  perfilExpressar: PerfilLinguagemDetalhe;
  combinacao: string;
  paraQuemTeAma: string;
  evitar: string[];
  recomendacoes: string[];
  reflexaoAmor: string;
  perfilEquilibrado: boolean;
  /** Campos legacy derivados de receber */
  principal: LinguagemAmor;
  secundaria: LinguagemAmor;
  pontuacoes: PontuacaoPorLinguagem;
  ranking: RankingItem[];
  interpretacaoPrincipal: string;
  interpretacaoPar: string;
}

export interface EntradaLinguagensAmor {
  answers: Record<string, LadoEscolha>;
  metadata?: {
    tempo_total_segundos?: number;
    idioma?: string;
    versao_questionario?: string;
  };
}

export interface EntradaCompatibilidadeManual {
  nome: string;
  relacao?: string;
  principalExpressar: LinguagemAmor;
  principalReceber?: LinguagemAmor;
}

export interface ResultadoCompatibilidade {
  pontuacaoCompatibilidade: number;
  resumoHumano: string;
  pontesParaA: string[];
  pontesParaB: string[];
  matchARecebeBExpressa: boolean;
  matchBRecebeAExpressa: boolean;
}
