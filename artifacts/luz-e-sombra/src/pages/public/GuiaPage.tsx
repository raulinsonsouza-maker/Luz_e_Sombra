import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { SITE_NAME } from "@/lib/seo";

export default function GuiaPage() {
  const path = "/guia";
  const title = `Guia do Portal Iluminando | ${SITE_NAME}`;
  const description = "Mapa rápido para navegar conteúdo público e a jornada autenticada.";
  return (
    <PublicShell
      pagePath={path}
      pageTitle={title}
      pageDescription={description}
      pageType={"WebPage"}
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Guia do Portal Iluminando", path },
      ]}
    >
      <article>
        <h1 className="text-3xl font-semibold md:text-4xl">Guia do Portal Iluminando</h1>
        <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">Mapa rápido para navegar conteúdo público e a jornada autenticada.</p>
        
        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Conteúdo aberto</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Use Sobre, Metodologia, Análises, Biblioteca, Glossário e FAQ para compreender conceitos sem login.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Essas páginas existem para humanos, buscadores e assistentes de IA.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Área logada</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Após o acesso, /jornada reúne a trilha. Resultados, dossiês e comunidade permanecem privados e fora do sitemap.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Não compartilhe senhas nem prints sensíveis publicamente.</p>
        </section>
        
      </article>
    </PublicShell>
  );
}
