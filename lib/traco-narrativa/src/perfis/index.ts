import type { EstruturaTraco } from "../types.js";
import type { PerfilTraco } from "../perfil.js";
import { PERFIL_ESQUIZOIDE } from "./esquizoide.js";
import { PERFIL_ORAL } from "./oral.js";
import { PERFIL_PSICOPATA } from "./psicopata.js";
import { PERFIL_MASOQUISTA } from "./masoquista.js";
import { PERFIL_RIGIDO } from "./rigido.js";

export const PERFIS_TRACO: Record<EstruturaTraco, PerfilTraco> = {
  esquizoide: PERFIL_ESQUIZOIDE,
  oral: PERFIL_ORAL,
  psicopata: PERFIL_PSICOPATA,
  masoquista: PERFIL_MASOQUISTA,
  rigido: PERFIL_RIGIDO,
};

export function perfilDe(traco: EstruturaTraco): PerfilTraco {
  return PERFIS_TRACO[traco];
}

export {
  PERFIL_ESQUIZOIDE,
  PERFIL_ORAL,
  PERFIL_PSICOPATA,
  PERFIL_MASOQUISTA,
  PERFIL_RIGIDO,
};
