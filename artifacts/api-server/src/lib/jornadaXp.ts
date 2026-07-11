import { awardXp } from "./awardXp";

/** XP concedido na primeira conclusão de análise de cada módulo da jornada. */
export const JORNADA_MODULO_XP = 200;

export async function tryAwardJornadaModuloXp(
  usuarioId: number,
  jaExistiaAnalise: boolean,
): Promise<void> {
  if (jaExistiaAnalise) return;
  try {
    await awardXp(usuarioId, JORNADA_MODULO_XP);
  } catch {
    /* não bloqueia fluxo principal */
  }
}
