/** Só paths relativos internos — bloqueia open redirect. */
export function safeInternalPath(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (!raw) return fallback;
  const value = raw.trim();
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.includes("://")) return fallback;
  if (/[\r\n\\]/.test(value)) return fallback;
  return value;
}
