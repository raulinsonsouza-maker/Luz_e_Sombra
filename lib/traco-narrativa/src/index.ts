export type {
  EstruturaTraco,
  EstruturasPct,
  TipoFoto,
  EstiloComunicacao,
  DinamicaFuncional,
  ResultadoAnalise,
} from "./types.js";

export { VERSAO_NARRATIVA } from "./constants.js";
export { gerarNarrativa, type GerarNarrativaInput } from "./gerarNarrativa.js";
export { adaptarVozNarrativa } from "./voz.js";
export { sanitizarResultadoLegado, isResultadoLegado } from "./legado.js";
