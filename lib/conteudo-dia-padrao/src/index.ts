export type { FraseDiaPadrao } from "./frases";
export { FRASES_ANO_PADRAO } from "./frases";
import { FRASES_ANO_PADRAO, type FraseDiaPadrao } from "./frases";

export const TOTAL_IMAGENS_DIA = 100;
const FUNDO_RESERVA = "/images/peao.jpeg";

/** Dia do calendário (1 = 1º de janeiro). O dia 366 reutiliza o 365. */
export function diaDoCalendario(data: Date): number {
  const inicio = Date.UTC(data.getFullYear(), 0, 1);
  const atual = Date.UTC(data.getFullYear(), data.getMonth(), data.getDate());
  const n = Math.floor((atual - inicio) / 86400000) + 1;
  return Math.min(Math.max(n, 1), 365);
}

export function frasePadrao(data: Date): FraseDiaPadrao {
  const n = diaDoCalendario(data);
  return FRASES_ANO_PADRAO[n - 1]!;
}

export function imagemPadrao(data: Date): string {
  if (TOTAL_IMAGENS_DIA < 1) return FUNDO_RESERVA;
  const indice = ((diaDoCalendario(data) - 1) % TOTAL_IMAGENS_DIA) + 1;
  return `/imagens-dia/${indice}.png`;
}

/** YYYY-MM-DD a partir de Date (UTC calendar parts). */
export function formatarDataISO(data: Date): string {
  const y = data.getUTCFullYear();
  const m = String(data.getUTCMonth() + 1).padStart(2, "0");
  const d = String(data.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Interpreta YYYY-MM-DD como data civil UTC. */
export function parseDataISO(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d!));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m! - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

/** Hoje em America/Sao_Paulo como YYYY-MM-DD. */
export function hojeSaoPauloISO(agora: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(agora);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

const MESES_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** Rótulo padrão da data no app (ex: "9 de novembro"). */
export function rotuloDataPadrao(dataISO: string): string {
  const dt = parseDataISO(dataISO);
  if (!dt) return dataISO;
  const dia = dt.getUTCDate();
  const mes = MESES_PT[dt.getUTCMonth()] ?? "";
  return `${dia} de ${mes}`;
}

/** Formato curto com zero (09/11). */
export function rotuloDataCurta(dataISO: string): string {
  const dt = parseDataISO(dataISO);
  if (!dt) return dataISO;
  const d = String(dt.getUTCDate()).padStart(2, "0");
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  return `${d}/${m}`;
}

/** Formato portal sem zero à esquerda no dia (11/11, 9/11). */
export function rotuloDataPortal(dataISO: string): string {
  const dt = parseDataISO(dataISO);
  if (!dt) return dataISO;
  return `${dt.getUTCDate()}/${dt.getUTCMonth() + 1}`;
}

export type ConteudoDiaResolvido = {
  data: string;
  diaCalendario: number;
  frase: string;
  reflexao: string;
  convite: string;
  imagemUrl: string;
  /** Override salvo (null = usar padrão). */
  dataExibicao: string | null;
  /** Texto final para a UI. */
  dataRotulo: string;
  editado: boolean;
  overrideId: number | null;
};

export function conteudoPadraoParaData(dataISO: string): ConteudoDiaResolvido | null {
  const dt = parseDataISO(dataISO);
  if (!dt) return null;
  const padrao = frasePadrao(dt);
  return {
    data: dataISO,
    diaCalendario: padrao.dia,
    frase: padrao.frase,
    reflexao: padrao.reflexao,
    convite: padrao.convite,
    imagemUrl: imagemPadrao(dt),
    dataExibicao: null,
    dataRotulo: rotuloDataPadrao(dataISO),
    editado: false,
    overrideId: null,
  };
}

export function mesclarOverride(
  padrao: ConteudoDiaResolvido,
  override: {
    id: number;
    frase: string | null;
    reflexao: string | null;
    convite: string | null;
    imagemUrl: string | null;
    dataExibicao?: string | null;
  } | null | undefined,
): ConteudoDiaResolvido {
  if (!override) return padrao;
  const dataExibicao = override.dataExibicao?.trim() ? override.dataExibicao.trim() : null;
  return {
    ...padrao,
    frase: override.frase?.trim() ? override.frase : padrao.frase,
    reflexao: override.reflexao?.trim() ? override.reflexao : padrao.reflexao,
    convite: override.convite?.trim() ? override.convite : padrao.convite,
    imagemUrl: override.imagemUrl?.trim() ? override.imagemUrl : padrao.imagemUrl,
    dataExibicao,
    dataRotulo: dataExibicao || padrao.dataRotulo,
    editado: true,
    overrideId: override.id,
  };
}

/** Converte path de objeto em URL pública da API. */
export function urlImagemPublica(imagemUrl: string, overrideId: number | null): string {
  if (imagemUrl.startsWith("/objects/")) {
    if (overrideId != null) return `/api/conteudo-dia/imagem/${overrideId}`;
    return imagemUrl;
  }
  return imagemUrl;
}
