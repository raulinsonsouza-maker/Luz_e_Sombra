/**
 * Extrai URL de iframe para YouTube / Vimeo.
 */
export function getVideoEmbedUrl(url: string): string | null {
  const trimmed = (url || "").trim();
  if (!trimmed) return null;

  if (/youtube\.com\/embed\//i.test(trimmed) || /youtube-nocookie\.com\/embed\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed.startsWith("http") ? trimmed : `https:${trimmed}`);
      const base = `${u.origin}${u.pathname}`;
      return `${base}${u.search || "?rel=0"}`;
    } catch {
      return null;
    }
  }

  try {
    const u = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0]?.split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
    }

    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtube-nocookie.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}?rel=0`;
      const shorts = u.pathname.match(/\/shorts\/([^/?]+)/);
      if (shorts?.[1]) return `https://www.youtube.com/embed/${shorts[1]}?rel=0`;
      const live = u.pathname.match(/\/live\/([^/?]+)/);
      if (live?.[1]) return `https://www.youtube.com/embed/${live[1]}?rel=0`;
    }

    if (u.hostname.includes("vimeo.com")) {
      const m = u.pathname.match(/\/(?:video\/)?(\d+)/);
      if (m?.[1]) return `https://player.vimeo.com/video/${m[1]}`;
    }
  } catch {
    return null;
  }

  return null;
}
