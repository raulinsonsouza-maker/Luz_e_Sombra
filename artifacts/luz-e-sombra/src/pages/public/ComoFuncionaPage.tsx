import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { SITE_NAME } from "@/lib/seo";

export default function ComoFuncionaPage() {
  const path = "/como-funciona";
  const title = `Como funciona o Portal Iluminando | ${SITE_NAME}`;
  const description = "Do primeiro acesso ao Dossiê de Vida: um caminho claro, no seu ritmo.";
  return (
    <PublicShell
      pagePath={path}
      pageTitle={title}
      pageDescription={description}
      pageType={"WebPage"}
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Como funciona o Portal Iluminando", path },
      ]}
    >
      <article>
        <h1 className="text-3xl font-semibold md:text-4xl">Como funciona o Portal Iluminando</h1>
        <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">Do primeiro acesso ao Dossiê de Vida: um caminho claro, no seu ritmo.</p>
        
        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">1. Entre no Portal</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Cadastre-se conforme o fluxo comercial vigente e confirme o pagamento para liberar o acesso.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Você utiliza e-mail e senha para entrar na área da jornada.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">2. Percorra as análises</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Responda questionários, envie o que for solicitado em cada módulo e explore seu mapa pessoal.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Não é necessário fazer tudo de uma vez.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">3. Conecte e continue</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">No Dossiê de Vida, as peças se cruzam. Na reflexão diária, a consciência vira hábito.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Missões e registros sustentam a continuidade durante o período de acesso.</p>
        </section>
        
      </article>
    </PublicShell>
  );
}
