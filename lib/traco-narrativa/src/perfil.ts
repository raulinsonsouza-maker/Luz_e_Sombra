import type { EstruturaTraco } from "./types.js";

export type RecursoLinha = {
  nome: string;
  equilibrio: string;
  excesso: string;
  expansao: string;
};

export type CenaVida = {
  oQue: string;
  reacao: string;
  protege: string;
  consequencia: string;
};

export type ExercicioIntegracao = {
  titulo: string;
  descricao: string;
};

export type PerfilTraco = {
  id: EstruturaTraco;
  nome: string;
  identidade: {
    titulo: string;
    apresentacao: string;
    essencia: string;
  };
  formacao: {
    faseDesenvolvimento: string;
    experienciasPossiveis: string;
    interpretacoesDaCrianca: string[];
    necessidadeEmocional: string;
    estrategiaDeProtecao: string;
  };
  dorEmocional: {
    experienciaEmocional: string;
    interpretacaoInterna: string;
    crencaProtetora: string;
    oQueTentaEvitar: string;
    necessidadePorTrasDoPadrao: string;
    manifestacaoNaVidaAdulta: string;
  };
  inteligenciaProtecao: {
    talentoNatural: string;
    recursoDesenvolvido: string;
    potencialDeExpansao: string;
    recursos: RecursoLinha[];
  };
  manifestacoes: {
    trabalho: CenaVida;
    amor: CenaVida;
    familia: CenaVida;
    comunicacao: CenaVida;
    decisoesEmocoes: CenaVida;
    relacaoConsigo: CenaVida;
  };
  sombra: {
    pares: Array<[string, string]>;
    fraseCentral: string;
    desafio: string;
  };
  integracao: {
    reconhecer: string;
    flexibilizar: string;
    desenvolver: string;
    deixarAprender: Array<[string, string]>;
    exercicios: ExercicioIntegracao[];
  };
  reflexaoFinal: {
    mensagem: string;
    pergunta: string;
  };
  /** Chips do mapa (capacidades / pontos de cuidado). */
  pontosFortes: string[];
  pontosAtencao: string[];
};

export type CombinacaoTrio = {
  /** Ids ordenados alfabeticamente para lookup. */
  ids: [EstruturaTraco, EstruturaTraco, EstruturaTraco];
  titulo: string;
  abertura: string;
  oQueCadaAcrescenta: string;
  emComum: string;
  tensoes: string;
  comoAparecemJuntos: string;
  comoApareceNaVida: string;
  recursosDaCombinacao: string[];
  pontoDeAtencao: string;
  caminhoIntegracao: string;
  pergunta: string;
};
