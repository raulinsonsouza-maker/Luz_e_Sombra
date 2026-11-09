import { diaDoCalendario } from "@/lib/frasesAno";

/** Quantidade atual do banco em docs/imagens_atualizadas. */
export const TOTAL_IMAGENS_DIA = 100;

const FUNDO_RESERVA = "/images/peao.jpeg";

/** Uma imagem do banco por dia. Com menos fotos do que dias, o ciclo recomeça. */
export function imagemDoDia(data: Date = new Date()): string {
  if (TOTAL_IMAGENS_DIA < 1) return FUNDO_RESERVA;
  const indice = ((diaDoCalendario(data) - 1) % TOTAL_IMAGENS_DIA) + 1;
  return `/imagens-dia/${indice}.png`;
}
