import {
  LP_ACCESS_MONTHS,
  LP_PRICE,
  LP_GUARANTEE_DAYS,
} from "@/lib/lpConfig";
import {
  CONTACT_EMAIL,
  OG_IMAGE_URL,
  PRODUCT_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  getConfiguredAuthor,
} from "./identity";

export interface FaqItem {
  q: string;
  a: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

function orgId() {
  return `${SITE_URL}/#organization`;
}

function websiteId() {
  return `${SITE_URL}/#website`;
}

function productId() {
  return `${SITE_URL}/#product`;
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": orgId(),
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/marca/logo-ouro.png"),
    email: CONTACT_EMAIL,
    description: SITE_DESCRIPTION,
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@id": orgId() },
    inLanguage: "pt-BR",
  };
}

export function productOfferJsonLd() {
  return {
    "@type": "Product",
    "@id": productId(),
    name: PRODUCT_NAME,
    description: SITE_DESCRIPTION,
    brand: { "@id": orgId() },
    image: OG_IMAGE_URL,
    offers: {
      "@type": "Offer",
      url: absoluteUrl("/planos"),
      priceCurrency: "BRL",
      price: LP_PRICE.toFixed(2),
      availability: "https://schema.org/InStock",
      seller: { "@id": orgId() },
      description: `Acesso por ${LP_ACCESS_MONTHS} meses. Garantia de ${LP_GUARANTEE_DAYS} dias conforme política vigente.`,
    },
  };
}

export function webPageJsonLd(opts: {
  path: string;
  title: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
}) {
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { "@id": websiteId() },
    about: { "@id": orgId() },
    inLanguage: "pt-BR",
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(faqs: FaqItem[]) {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function articleJsonLd(opts: {
  path: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}) {
  const author = getConfiguredAuthor();
  const node: Record<string, unknown> = {
    "@type": "Article",
    "@id": `${absoluteUrl(opts.path)}#article`,
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    mainEntityOfPage: absoluteUrl(opts.path),
    image: opts.image ?? OG_IMAGE_URL,
    publisher: { "@id": orgId() },
    isPartOf: { "@id": websiteId() },
    inLanguage: "pt-BR",
  };
  if (author) {
    node.author = {
      "@type": "Person",
      name: author.name,
      ...(author.url ? { url: author.url } : {}),
    };
  } else {
    node.author = { "@id": orgId() };
  }
  return node;
}

export function buildJsonLdGraph(nodes: Array<Record<string, unknown> | null | undefined>) {
  const graph = nodes.filter(Boolean) as Record<string, unknown>[];
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function defaultSiteGraph() {
  return buildJsonLdGraph([organizationJsonLd(), websiteJsonLd(), productOfferJsonLd()]);
}
