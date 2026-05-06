/**
 * Traço de Caráter — camada fina: motor de imagem + narrativa.
 */

import type { TipoFoto } from "@workspace/traco-imagem-engine";
import type { ResultadoAnalise } from "@workspace/traco-narrativa";
import { analisarFotos } from "@workspace/traco-imagem-engine";
import { gerarNarrativa } from "@workspace/traco-narrativa";

export type { TipoFoto } from "@workspace/traco-imagem-engine";
export type {
  ResultadoAnalise,
  EstiloComunicacao,
  DinamicaFuncional,
} from "@workspace/traco-narrativa";

export { gerarNarrativa } from "@workspace/traco-narrativa";

export async function analyzeTracoDeCarater(
  photos: Array<{ tipo: TipoFoto; source: File | string }>,
  token?: string
): Promise<ResultadoAnalise> {
  if (photos.length === 0) throw new Error("Nenhuma foto fornecida para análise.");

  const engine = await analisarFotos(photos, token);
  return gerarNarrativa({ engine });
}
