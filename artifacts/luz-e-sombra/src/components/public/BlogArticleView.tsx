import { Link } from "wouter";
import { useEffect } from "react";
import type { ArticleContent } from "../../../content/types";
import PublicShell from "./PublicShell";
import { PRODUCT_NAME, SITE_NAME, getConfiguredAuthor } from "@/lib/seo";
import {
  articleJsonLd,
  buildJsonLdGraph,
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo/jsonld";

export default function BlogArticleView({ content }: { content: ArticleContent }) {
  const crumbs = [
    { name: "Início", path: "/" },
    { name: "Biblioteca", path: "/blog" },
    { name: content.h1, path: content.path },
  ];
  const author = getConfiguredAuthor();

  useEffect(() => {
    const graph = buildJsonLdGraph([
      organizationJsonLd(),
      websiteJsonLd(),
      articleJsonLd({
        path: content.path,
        title: content.title,
        description: content.description,
        datePublished: content.publishedAt,
        dateModified: content.updatedAt,
      }),
      breadcrumbJsonLd(crumbs),
      faqPageJsonLd(content.faq),
    ]);
    let el = document.getElementById("geo-jsonld") as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = "geo-jsonld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(graph);
  }, [content]);

  return (
    <PublicShell
      pagePath={content.path}
      pageTitle={`${content.title} | ${SITE_NAME}`}
      pageDescription={content.description}
      breadcrumbs={crumbs}
      faq={content.faq}
    >
      <article>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8a56b]">Biblioteca do Autoconhecimento</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">{content.h1}</h1>
        <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">{content.directAnswer}</p>
        <p className="mt-2 text-sm text-[rgba(247,242,236,0.45)]">
          Publicado em {content.publishedAt}
          {content.updatedAt !== content.publishedAt ? ` · Atualizado em ${content.updatedAt}` : ""}
          {author ? ` · ${author.name}` : ""}
        </p>

        <figure className="mt-8 overflow-hidden rounded-lg border border-[rgba(200,165,107,0.2)]">
          <img
            src="/marca/logo-ouro.png"
            alt={content.imageAlt}
            width={1200}
            height={630}
            className="mx-auto max-h-56 w-full object-contain bg-[rgba(0,0,0,0.25)] p-10"
            loading="lazy"
          />
        </figure>

        {content.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-2xl text-[#c8a56b]">{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p.slice(0, 48)} className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">
                {p}
              </p>
            ))}
          </section>
        ))}

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Exemplos</h2>
          {content.examples.map((ex) => (
            <p key={ex.slice(0, 48)} className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">
              {ex}
            </p>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Perguntas frequentes</h2>
          <div className="mt-4 space-y-4">
            {content.faq.map((f) => (
              <div key={f.q}>
                <h3 className="text-lg font-medium">{f.q}</h3>
                <p className="mt-1 text-[rgba(247,242,236,0.75)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {content.externalSources && content.externalSources.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-2xl text-[#c8a56b]">Fontes e referências</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {content.externalSources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} className="text-[#c8a56b] hover:underline" rel="noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Continue lendo</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {content.relatedPaths.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="text-[#c8a56b] hover:underline">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <aside className="mt-12 rounded-lg border border-[rgba(200,165,107,0.3)] p-6 text-center">
          <p className="text-lg">Leve este tema para a {PRODUCT_NAME}.</p>
          <Link
            href="/jornada-da-sombra-a-luz"
            className="mt-4 inline-block rounded-md bg-[#c8a56b] px-5 py-2.5 font-medium text-[#1e1812]"
          >
            Conhecer a jornada
          </Link>
        </aside>
      </article>
    </PublicShell>
  );
}
