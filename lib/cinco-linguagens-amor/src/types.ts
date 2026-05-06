/** As cinco linguagens (Chapman), identificadores estáveis em PT curto. */
export type LinguagemAmor =
  | "palavras"
  | "tempo"
  | "presentes"
  | "servicos"
  | "toque";

export type LadoEscolha = "a" | "b";

export interface ParForcado {
  id: string;
  textoA: string;
  textoB: string;
  linguagemA: LinguagemAmor;
  linguagemB: LinguagemAmor;
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
}

export interface ResultadoLinguagensAmorComputado {
  pontuacoes: PontuacaoPorLinguagem;
  ranking: RankingItem[];
  principal: LinguagemAmor;
  secundaria: LinguagemAmor;
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
