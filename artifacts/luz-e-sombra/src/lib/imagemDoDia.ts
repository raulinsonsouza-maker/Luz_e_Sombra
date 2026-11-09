import { diaDoCalendario } from "@/lib/frasesAno";

/** Quantidade atual do banco em docs/imagens_atualizadas. */
export const TOTAL_IMAGENS_DIA = 100;

const FUNDO_RESERVA = "/images/peao.jpeg";

function indiceDoDia(data: Date = new Date()): number {
  return ((diaDoCalendario(data) - 1) % TOTAL_IMAGENS_DIA) + 1;
}

/** Imagem otimizada (JPEG web) por dia. Com menos fotos do que dias, o ciclo recomeça. */
export function imagemDoDia(data: Date = new Date()): string {
  if (TOTAL_IMAGENS_DIA < 1) return FUNDO_RESERVA;
  return `/imagens-dia/${indiceDoDia(data)}.jpg`;
}

/** Miniatura para calendário/galeria admin. */
export function thumbImagemDoDia(data: Date = new Date()): string {
  if (TOTAL_IMAGENS_DIA < 1) return FUNDO_RESERVA;
  return `/imagens-dia/thumbs/${indiceDoDia(data)}.jpg`;
}

export function pathImagemDia(indice: number): string {
  return `/imagens-dia/${indice}.jpg`;
}

export function pathThumbImagemDia(indice: number): string {
  return `/imagens-dia/thumbs/${indice}.jpg`;
}

/** Preferência JPEG web quando o path legado ainda aponta para PNG. */
export function webDeImagemDia(src: string | null | undefined): string | null {
  if (!src) return null;
  return src.replace(/\/imagens-dia\/(\d+)\.png$/i, "/imagens-dia/$1.jpg");
}

/** Converte path/url do banco de imagens para a miniatura correspondente. */
export function thumbDeImagemDia(src: string | null | undefined): string | null {
  if (!src) return null;
  const m = src.match(/\/imagens-dia\/(?:thumbs\/)?(\d+)\.(?:png|jpe?g|webp)$/i);
  if (m) return pathThumbImagemDia(Number(m[1]));
  return src;
}
