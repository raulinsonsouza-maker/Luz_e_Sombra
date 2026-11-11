import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { SITE_NAME } from "@/lib/seo";

export default function ContatoPage() {
  const path = "/contato";
  const title = `Contato | ${SITE_NAME}`;
  const description = "Fale com o Portal Iluminando pelo e-mail de suporte.";
  return (
    <PublicShell
      pagePath={path}
      pageTitle={title}
      pageDescription={description}
      pageType={"ContactPage"}
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Contato", path },
      ]}
    >
      <article>
        <h1 className="text-3xl font-semibold md:text-4xl">Contato</h1>
        <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">Fale com o Portal Iluminando pelo e-mail de suporte.</p>
        
        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">E-mail</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Escreva para contato@portaliluminando.com.br com dúvidas sobre acesso, pagamento ou a jornada.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Não envie dados sensíveis desnecessários. Nunca pediremos senha por e-mail.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Conteúdo público</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Para entender o produto antes de escrever, veja Sobre, Metodologia, FAQ e a Biblioteca.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Áreas logadas e resultados individuais não são discutidos em páginas públicas.</p>
        </section>
        
      </article>
    </PublicShell>
  );
}
