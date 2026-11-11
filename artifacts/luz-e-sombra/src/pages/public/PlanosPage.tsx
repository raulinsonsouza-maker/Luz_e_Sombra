import { Link } from "wouter";
import { useEffect } from "react";
import PublicShell from "@/components/public/PublicShell";
import {
  LP_ACCESS_MONTHS,
  LP_GUARANTEE_DAYS,
  LP_INCLUDED_ITEMS,
  LP_PRICE,
  LP_PRICE_INSTALLMENT_VALUE,
  LP_PRICE_INSTALLMENTS,
  formatLpPrice,
} from "@/lib/lpConfig";
import {
  SITE_NAME,
  buildJsonLdGraph,
  organizationJsonLd,
  productOfferJsonLd,
  websiteJsonLd,
  webPageJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export default function PlanosPage() {
  const path = "/planos";
  const title = `Planos e acesso | ${SITE_NAME}`;
  const description = `Acesso à Jornada Da Sombra à Luz: ${formatLpPrice(LP_PRICE)} ou ${LP_PRICE_INSTALLMENTS}x de ${formatLpPrice(LP_PRICE_INSTALLMENT_VALUE)} · ${LP_ACCESS_MONTHS} meses.`;

  useEffect(() => {
    const graph = buildJsonLdGraph([
      organizationJsonLd(),
      websiteJsonLd(),
      productOfferJsonLd(),
      webPageJsonLd({ path, title, description }),
      breadcrumbJsonLd([
        { name: "Início", path: "/" },
        { name: "Planos", path },
      ]),
    ]);
    let el = document.getElementById("geo-jsonld") as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = "geo-jsonld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(graph);
  }, [description, title]);

  return (
    <PublicShell
      pagePath={path}
      pageTitle={title}
      pageDescription={description}
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Planos e acesso", path },
      ]}
    >
      <article>
        <h1 className="text-3xl font-semibold md:text-4xl">Planos e acesso</h1>
        <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">
          Edição Membros Fundadores — condições vigentes no Portal Iluminando.
        </p>

        <section className="mt-10 rounded-lg border border-[rgba(200,165,107,0.3)] p-6">
          <h2 className="text-2xl text-[#c8a56b]">Investimento</h2>
          <p className="mt-3 text-3xl font-semibold">{formatLpPrice(LP_PRICE)}</p>
          <p className="mt-2 text-[rgba(247,242,236,0.75)]">
            ou até {LP_PRICE_INSTALLMENTS}x de {formatLpPrice(LP_PRICE_INSTALLMENT_VALUE)} no cartão
          </p>
          <p className="mt-2 text-[rgba(247,242,236,0.75)]">
            {LP_ACCESS_MONTHS} meses de acesso · garantia de {LP_GUARANTEE_DAYS} dias conforme política do fluxo de compra
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">O que está incluso</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[rgba(247,242,236,0.8)]">
            {LP_INCLUDED_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Como contratar</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">
            Inicie pela página inicial ou pela VSL, conclua o cadastro e o pagamento. Depois, entre com e-mail e senha.
          </p>
        </section>

        <Link href="/" className="mt-10 inline-block rounded-md bg-[#c8a56b] px-5 py-2.5 font-medium text-[#1e1812]">
          Ir para a página inicial
        </Link>
      </article>
    </PublicShell>
  );
}
