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
export { leituraDoTraco } from "./leitura.js";
export {
  comporJornadaTraco,
  estruturaTerciariaDe,
  idsEtapas,
  textosDaJornada,
  type BlocoJornada,
  type EtapaJornada,
  type EtapaJornadaId,
  type JornadaTraco,
  type MapaJornada,
} from "./jornada/index.js";
export type { PerfilTraco, CombinacaoTrio, CenaVida, RecursoLinha } from "./perfil.js";
export { PERFIS_TRACO, perfilDe } from "./perfis/index.js";
export { combinacaoTrioDe, COMBINACOES_TRIO } from "./combinacoes-trio.js";
export { adaptarVozNarrativa } from "./voz.js";
export { sanitizarResultadoLegado, isResultadoLegado } from "./legado.js";
