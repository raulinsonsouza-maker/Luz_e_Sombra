export type {
  TipoFoto,
  EstruturaTraco,
  EstruturasPct,
  EvidenciaItem,
  MarcadoresFoto,
  MarcadoresAgregados,
  ResultadoImagemEngine,
} from "./types.js";

export { analisarFotos } from "./analisarFotos.js";
export { extrairMarcadoresFoto, agregarMarcadores } from "./marcadores.js";
export { scoreEstruturas, rankingPrincipalSecundaria } from "./scoreEstruturas.js";
export { detectarPoseNaImagem } from "./mediapipeRunner.js";
