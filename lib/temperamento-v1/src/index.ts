export {
  VERSAO_TEMPERAMENTO_V1,
  VERSAO_TEMPERAMENTO_V2,
  VERSAO_TEMPERAMENTO_ATUAL,
} from "./constants";
export * from "./types";
export { PERGUNTAS, CODIGOS_PERGUNTA, CODIGOS_SET, perguntasPorDimensao, type ItemPergunta } from "./perguntas";
export {
  PARES_FORCADOS,
  CODIGOS_PAR,
  TOTAL_PARES,
  parPorId,
  type ParForcadoTemperamento,
  type LadoEscolha,
  type CodigoPar,
} from "./pares";
export { entradaTemperamentoSchema, metadataTemperamentoSchema, type EntradaTemperamento } from "./schemas";
export { computarTemperamento, type ResultadoTemperamentoComputado } from "./compute";
export { gerarOrdemPares } from "./shufflePares";
export { gerarOrdemBlocosPerguntas } from "./shuffle";
export { desvioPadrao, proporcaoRespostas3, calcularConfiabilidade, calcularAlertas } from "./qualidade";
export type { AlertaQualidade } from "./qualidade";
export type { RelatorioInterno, RelatorioSecao, NarrativaTemperamentoV2, NarrativaTemperamentoV3 } from "./interpretacao";
export {
  NOME_TEMPERAMENTO,
  tituloPerfilTemperamento,
  sanitizarTituloTemperamentoLegado,
  montarNarrativaV2,
  montarNarrativaV3,
  montarSinteseHumana,
  montarDimensoesLegiveis,
  extrairPerguntaCrescimento,
} from "./interpretacao";
