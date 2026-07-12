export {
  VERSAO_LINGUAGENS_AMOR_V1,
  VERSAO_LINGUAGENS_AMOR_V2,
  VERSAO_LINGUAGENS_AMOR_V3,
} from "./constants.js";
export type {
  LinguagemAmor,
  LadoEscolha,
  BlocoQuestionario,
  IntensidadePerfil,
  ConfiancaLabel,
  ParForcado,
  PontuacaoPorLinguagem,
  RankingItem,
  DimensaoPerfil,
  AlertaQualidade,
  MetricasQualidade,
  Desalinhamento,
  PerfilLinguagemDetalhe,
  NarrativaV3,
  ResultadoLinguagensAmorComputado,
  ResultadoLinguagensAmorV2,
  EntradaLinguagensAmor,
  EntradaCompatibilidadeManual,
  ResultadoCompatibilidade,
  AvaliacaoDesempate,
} from "./types.js";
export {
  CODIGOS_PAR,
  CODIGOS_CORE,
  CODIGOS_RECEBER,
  CODIGOS_DESEMPATE,
  CODIGOS_EXPRESSAR,
  PARES_FORCADOS,
  PARES_RECEBER,
  PARES_EXPRESSAR,
  PARES_DESEMPATE_TODOS,
  paresDesempatePara,
  LABEL_LINGUAGEM,
  parPorId,
  tituloBloco,
  TOTAL_CORE,
  TOTAL_DESEMPATE_MAX,
  TOTAL_EXPRESSAR,
  type CodigoPar,
  type CodigoCore,
  type CodigoReceber,
  type CodigoDesempate,
  type CodigoExpressar,
} from "./perguntas/index.js";
export {
  entradaLinguagensAmorSchema,
  entradaCompatibilidadeSchema,
  metadataLinguagensSchema,
  linguagemAmorSchema,
  type EntradaLinguagensAmorParsed,
} from "./schemas.js";
export {
  computarLinguagensAmor,
  avaliarNecessidadeDesempate,
  paresDesempateParaPerfil,
} from "./compute.js";
export { computarCompatibilidade } from "./narrativa/compatibilidade.js";
export { textoDominante, textoParPrincipalSecundaria } from "./interpretacao.js";
export { montarNarrativaV3, montarBlocosNarrativa } from "./narrativa/blocos.js";
export { validarBlocosUnicos, overlapRatio } from "./narrativa/anti-repeticao.js";
export { CONTEUDO_LINGUAGEM, COMBINACAO_PAR, PONTE_COMPATIBILIDADE } from "./narrativa/tabelas.js";
export { CONTEUDO_V3, DINAMICA_PAR, TOM_VEREDITO } from "./narrativa/conteudo-v3.js";

/** Retrocompat: perfilDetalhe para resultados v2. */
export { perfilDetalhe } from "./perfilDetalhe.js";

/** @deprecated Use montarNarrativaV3 */
export { montarBlocosNarrativa as montarNarrativaV2, montarBlocosNarrativa as montarNarrativa } from "./narrativa/blocos.js";
