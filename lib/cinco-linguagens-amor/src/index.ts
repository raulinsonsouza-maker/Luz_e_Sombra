export { VERSAO_LINGUAGENS_AMOR_V1, VERSAO_LINGUAGENS_AMOR_V2 } from "./constants.js";
export type {
  LinguagemAmor,
  LadoEscolha,
  BlocoQuestionario,
  ParForcado,
  PontuacaoPorLinguagem,
  RankingItem,
  DimensaoPerfil,
  AlertaQualidade,
  MetricasQualidade,
  Desalinhamento,
  PerfilLinguagemDetalhe,
  ResultadoLinguagensAmorComputado,
  EntradaLinguagensAmor,
  EntradaCompatibilidadeManual,
  ResultadoCompatibilidade,
} from "./types.js";
export {
  CODIGOS_PAR,
  CODIGOS_RECEBER,
  CODIGOS_EXPRESSAR,
  PARES_FORCADOS,
  PARES_RECEBER,
  PARES_EXPRESSAR,
  LABEL_LINGUAGEM,
  parPorId,
  tituloBloco,
  type CodigoPar,
  type CodigoReceber,
  type CodigoExpressar,
} from "./perguntas/index.js";
export {
  entradaLinguagensAmorSchema,
  entradaCompatibilidadeSchema,
  metadataLinguagensSchema,
  linguagemAmorSchema,
  type EntradaLinguagensAmorParsed,
} from "./schemas.js";
export { computarLinguagensAmor } from "./compute.js";
export { computarCompatibilidade } from "./narrativa/compatibilidade.js";
export { textoDominante, textoParPrincipalSecundaria, ORDEM_DESEMPATE } from "./interpretacao.js";
export { montarNarrativaV2, montarNarrativa, perfilDetalhe } from "./narrativa/gerar.js";
export { CONTEUDO_LINGUAGEM, COMBINACAO_PAR, PONTE_COMPATIBILIDADE } from "./narrativa/tabelas.js";
