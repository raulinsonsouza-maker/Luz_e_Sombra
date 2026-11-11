import { Link } from "wouter";
import type { ReactNode } from "react";
import LogoPortal from "@/components/LogoPortal";
import { PRODUCT_NAME, SITE_NAME, CONTACT_EMAIL } from "@/lib/seo";
import type { BreadcrumbItem } from "@/lib/seo/jsonld";
import {
  breadcrumbJsonLd,
  buildJsonLdGraph,
  faqPageJsonLd,
  organizationJsonLd,
  webPageJsonLd,
  websiteJsonLd,
  type FaqItem,
} from "@/lib/seo/jsonld";
import { useEffect } from "react";

const NAV = [
  { href: "/sobre-o-portal", label: "Sobre" },
  { href: "/jornada-da-sombra-a-luz", label: "Jornada" },
  { href: "/analises", label: "Análises" },
  { href: "/blog", label: "Biblioteca" },
  { href: "/planos", label: "Planos" },
  { href: "/perguntas-frequentes", label: "FAQ" },
];

interface PublicShellProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  faq?: FaqItem[];
  pagePath: string;
  pageTitle: string;
  pageDescription: string;
  pageType?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
  chromeless?: boolean;
}

export default function PublicShell({
  children,
  breadcrumbs = [],
  faq = [],
  pagePath,
  pageTitle,
  pageDescription,
  pageType = "WebPage",
  chromeless = false,
}: PublicShellProps) {
  useEffect(() => {
    const graph = buildJsonLdGraph([
      organizationJsonLd(),
      websiteJsonLd(),
      webPageJsonLd({
        path: pagePath,
        title: pageTitle,
        description: pageDescription,
        type: pageType,
      }),
      breadcrumbs.length ? breadcrumbJsonLd(breadcrumbs) : null,
      faq.length ? faqPageJsonLd(faq) : null,
    ]);
    let el = document.getElementById("geo-jsonld") as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = "geo-jsonld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(graph);
  }, [breadcrumbs, faq, pagePath, pageTitle, pageDescription, pageType]);

  if (chromeless) return <>{children}</>;

  return (
    <div className="min-h-screen text-[#f7f2ec]" style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}>
      <header className="border-b border-[rgba(200,165,107,0.15)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <LogoPortal className="h-8 w-auto" />
            <span className="sr-only">{SITE_NAME}</span>
          </Link>
          <nav aria-label="Principal" className="hidden flex-wrap items-center gap-4 text-sm md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-[rgba(247,242,236,0.75)] hover:text-[#c8a56b]">
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="rounded-md border border-[rgba(200,165,107,0.35)] px-3 py-1.5 text-[#c8a56b]">
              Entrar
            </Link>
          </nav>
          <Link href="/planos" className="md:hidden rounded-md bg-[#c8a56b] px-3 py-1.5 text-sm font-medium text-[#1e1812]">
            Planos
          </Link>
        </div>
      </header>

      {breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-4 pt-6 text-sm text-[rgba(247,242,236,0.55)]">
          <ol className="flex flex-wrap gap-2">
            {breadcrumbs.map((b, i) => (
              <li key={b.path} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden>/</span> : null}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-[rgba(247,242,236,0.85)]">{b.name}</span>
                ) : (
                  <Link href={b.path} className="hover:text-[#c8a56b]">
                    {b.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

      <footer className="border-t border-[rgba(200,165,107,0.12)]">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 text-sm text-[rgba(247,242,236,0.55)] md:grid-cols-3">
          <div>
            <p className="font-medium text-[#c8a56b]">{SITE_NAME}</p>
            <p className="mt-2">{PRODUCT_NAME}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/metodologia">Metodologia</Link>
            <Link href="/como-funciona">Como funciona</Link>
            <Link href="/glossario">Glossário</Link>
            <Link href="/contato">Contato</Link>
          </div>
          <div>
            <p>
              Contato:{" "}
              <a className="text-[#c8a56b]" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="mt-2">
              <a href="/llms.txt" className="hover:text-[#c8a56b]">
                llms.txt
              </a>
              {" · "}
              <a href="/sitemap.xml" className="hover:text-[#c8a56b]">
                sitemap
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
