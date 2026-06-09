export type LpVariant = "control" | "vsl";

export type LpEventName =
  | "lp_view"
  | "vsl_video_start"
  | "vsl_unlock"
  | "checkout_start"
  | "checkout_complete";

export interface LpEvent {
  name: LpEventName;
  variant: LpVariant;
  ts: number;
  meta?: Record<string, string | number | boolean>;
}

const STORAGE_KEY = "lp_analytics_events";

function readEvents(): LpEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LpEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(events: LpEvent[]) {
  try {
    const trimmed = events.slice(-200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* quota or private mode */
  }
}

export function trackLpEvent(
  name: LpEventName,
  variant: LpVariant,
  meta?: Record<string, string | number | boolean>,
) {
  const event: LpEvent = { name, variant, ts: Date.now(), meta };
  const events = readEvents();
  events.push(event);
  writeEvents(events);

  if (import.meta.env.DEV) {
    console.debug("[lp-analytics]", event);
  }

  if (typeof window !== "undefined" && "dataLayer" in window) {
    const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
    dataLayer?.push({ event: name, lpVariant: variant, ...meta });
  }
}

export function getLpEvents(): LpEvent[] {
  return readEvents();
}
