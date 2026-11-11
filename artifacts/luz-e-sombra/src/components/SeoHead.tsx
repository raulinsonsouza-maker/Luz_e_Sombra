import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  absoluteUrl,
  canonicalUrl,
  normalizePath,
  resolveSeoMeta,
} from "@/lib/seo";
import { getArticleByPath } from "@/content/artigos";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    const path = normalizePath(location);
    const article = path.startsWith("/blog/") ? getArticleByPath(path) : undefined;
    const meta = resolveSeoMeta(
      path,
      article
        ? { title: `${article.title} | ${SITE_NAME}`, description: article.description }
        : undefined,
    );

    document.title = meta.title;
    document.documentElement.lang = "pt-BR";

    upsertMeta("name", "description", meta.description);
    upsertMeta("name", "robots", meta.robots);
    upsertMeta("name", "theme-color", "#1e1812");

    const canon = canonicalUrl(path);
    upsertLink("canonical", canon);

    upsertMeta("property", "og:type", article ? "article" : "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:locale", "pt_BR");
    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    upsertMeta("property", "og:url", canon);
    upsertMeta("property", "og:image", OG_IMAGE_URL);
    upsertMeta("property", "og:image:width", String(OG_IMAGE_WIDTH));
    upsertMeta("property", "og:image:height", String(OG_IMAGE_HEIGHT));
    upsertMeta("property", "og:image:alt", `${SITE_NAME} — ${meta.title}`);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
    upsertMeta("name", "twitter:image", OG_IMAGE_URL);
    upsertMeta("name", "twitter:image:alt", `${SITE_NAME} — ${meta.title}`);

    const gsc = (import.meta.env.VITE_GSC_VERIFICATION as string | undefined)?.trim();
    if (gsc) upsertMeta("name", "google-site-verification", gsc);
    const bing = (import.meta.env.VITE_BING_VERIFICATION as string | undefined)?.trim();
    if (bing) upsertMeta("name", "msvalidate.01", bing);

    // JSON-LD de página é injetado pelos componentes de conteúdo público.
    // Mantém graph base no shell HTML.
    upsertLink("alternate", absoluteUrl("/llms.txt"));
  }, [location]);

  return null;
}
