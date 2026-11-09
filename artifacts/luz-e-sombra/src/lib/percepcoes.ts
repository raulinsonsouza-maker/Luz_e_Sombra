export const MOODS_PAUSA = [
  "Em paz",
  "Com esperança",
  "Sem energia",
  "Sensível",
  "Ainda não sei",
] as const;

export type MoodPausa = (typeof MOODS_PAUSA)[number];

export type Percepcao = {
  date: string;
  text: string;
  mood: string | null;
};

const PREFIX = "portal-iluminando-reflection-";
const LEGACY_PREFIX = "iluminando-reflection-";

/** YYYY-MM-DD no fuso America/Sao_Paulo. */
export function dateKeyPercepcao(data: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(data);
}

function parseEntry(raw: string | null): { text: string; mood: string | null } | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as { text?: unknown; mood?: unknown };
    if (!data || typeof data !== "object") return null;
    const text = typeof data.text === "string" ? data.text : "";
    const mood = typeof data.mood === "string" ? data.mood : null;
    if (!text && !mood) return null;
    return { text, mood };
  } catch {
    return null;
  }
}

function readKey(date: string): { text: string; mood: string | null } | null {
  if (typeof localStorage === "undefined") return null;
  const novo = parseEntry(localStorage.getItem(PREFIX + date));
  if (novo) return novo;
  return parseEntry(localStorage.getItem(LEGACY_PREFIX + date));
}

export function lerPercepcao(date: string = dateKeyPercepcao()): Percepcao | null {
  const entry = readKey(date);
  if (!entry) return null;
  return { date, ...entry };
}

export function temPercepcaoHoje(data: Date = new Date()): boolean {
  return !!lerPercepcao(dateKeyPercepcao(data));
}

export function salvarPercepcao(input: {
  text?: string;
  mood?: string | null;
  date?: string;
}): Percepcao {
  const date = input.date ?? dateKeyPercepcao();
  const text = (input.text ?? "").trim();
  const mood = input.mood?.trim() || null;
  if (!text && !mood) {
    throw new Error("Escolha um sentimento ou escreva algumas palavras.");
  }
  const payload = { text, mood };
  localStorage.setItem(PREFIX + date, JSON.stringify(payload));
  return { date, ...payload };
}

export function listarPercepcoes(): Percepcao[] {
  if (typeof localStorage === "undefined") return [];
  const byDate = new Map<string, Percepcao>();

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const isNovo = key.startsWith(PREFIX);
      const isLegado = key.startsWith(LEGACY_PREFIX);
      if (!isNovo && !isLegado) continue;
      const date = isNovo ? key.slice(PREFIX.length) : key.slice(LEGACY_PREFIX.length);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      if (isLegado && byDate.has(date)) continue;
      const entry = parseEntry(localStorage.getItem(key));
      if (!entry) continue;
      if (isNovo || !byDate.has(date)) {
        byDate.set(date, { date, ...entry });
      }
    }
  } catch {
    return [];
  }

  return [...byDate.values()].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function formatarDataPercepcao(date: string): string {
  try {
    const [y, m, d] = date.split("-").map(Number);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(y, m - 1, d, 12));
  } catch {
    return date;
  }
}
