export { VERSAO_LINGUAGENS_AMOR_V1 } from "./constants.js";
export type {
  LinguagemAmor,
  LadoEscolha,
  ParForcado,
  PontuacaoPorLinguagem,
  RankingItem,
  ResultadoLinguagensAmorComputado,
  EntradaLinguagensAmor,
} from "./types.js";
export {
  CODIGOS_PAR,
  PARES_FORCADOS,
  LABEL_LINGUAGEM,
  parPorId,
  type CodigoPar,
} from "./perguntas.js";
export { entradaLinguagensAmorSchema, metadataLinguagensSchema, type EntradaLinguagensAmorParsed } from "./schemas.js";
export { computarLinguagensAmor } from "./compute.js";
export { textoDominante, textoParPrincipalSecundaria, ORDEM_DESEMPATE } from "./interpretacao.js";
