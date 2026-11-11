/** Identidade institucional canônica — metas, schemas e páginas públicas. */

export const SITE_URL = "https://portaliluminando.com.br";
export const SITE_NAME = "Portal Iluminando";
export const PRODUCT_NAME = "Jornada Da Sombra à Luz";
export const CONTACT_EMAIL = "contato@portaliluminando.com.br";
export const OG_IMAGE_PATH = "/opengraph.jpg";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const SITE_CATEGORY =
  "Plataforma digital de autoconhecimento e desenvolvimento pessoal";

export const SITE_DESCRIPTION =
  "O Portal Iluminando reúne ferramentas de reflexão e autoconhecimento em uma experiência integrada. Sua Jornada Da Sombra à Luz combina análises de traços de caráter, temperamento, linguagens do amor, roda da vida e numerologia com experiências de reflexão diária, registros pessoais, missões e uma síntese individual chamada Dossiê de Vida.";

export const SITE_PURPOSE =
  "Ajudar pessoas a compreender características pessoais, reconhecer padrões de comportamento, refletir sobre seus ciclos e desenvolver uma relação mais consciente consigo mesmas.";

export const DEFAULT_TITLE = `${SITE_NAME} — ${PRODUCT_NAME}`;

export const DEFAULT_DESCRIPTION =
  "Autoconhecimento integrado: nove análises, reflexão diária e o Dossiê de Vida. Compreenda padrões, ciclos e quem você é — com clareza e no seu ritmo.";

/** Autor editorial opcional (não inventar). Vazio = omitir Person/byline. */
export function getConfiguredAuthor(): { name: string; url?: string } | null {
  const name = (import.meta.env.VITE_CONTENT_AUTHOR_NAME as string | undefined)?.trim();
  if (!name) return null;
  const url = (import.meta.env.VITE_CONTENT_AUTHOR_URL as string | undefined)?.trim();
  return { name, url: url || undefined };
}

export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return SITE_URL;
  return `${SITE_URL}${clean.replace(/\/$/, "")}`;
}

/** Canonical sem query/UTM/hash. */
export function canonicalUrl(pathname: string): string {
  const path = (pathname.split("?")[0].split("#")[0] || "/").replace(/\/$/, "") || "/";
  return absoluteUrl(path);
}

export const OG_IMAGE_URL = absoluteUrl(OG_IMAGE_PATH);
