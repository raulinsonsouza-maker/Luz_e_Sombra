export type {
  TipoFoto,
  EstruturaTraco,
  EstruturasPct,
  EvidenciaItem,
  MarcadoresFoto,
  MarcadoresAgregados,
  ResultadoImagemEngine,
  EixosReich,
  SegmentosReich,
} from "./types.js";

export { analisarFotos } from "./analisarFotos.js";
export { extrairMarcadoresFoto, agregarMarcadores } from "./marcadores.js";
export {
  scoreEstruturas,
  rankingPrincipalSecundaria,
  VERSAO_EIXOS_REICH,
} from "./scoreEstruturas.js";
export {
  calcularEixosReich,
  calcularSegmentosReich,
  eixosParaLogitsBase,
  aplicarAjustesReich,
} from "./eixosReich.js";
export { detectarPoseNaImagem } from "./mediapipeRunner.js";
