import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { SITE_NAME } from "@/lib/seo";

export default function MetodologiaPage() {
  const path = "/metodologia";
  const title = `Metodologia do Portal Iluminando | ${SITE_NAME}`;
  const description = "Combinamos modelos interpretativos de autoconhecimento com práticas de reflexão. Distinguimos claramente abordagem simbólica, modelos clássicos e o que não constitui evidência científica clínica.";
  return (
    <PublicShell
      pagePath={path}
      pageTitle={title}
      pageDescription={description}
      pageType={"WebPage"}
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Metodologia do Portal Iluminando", path },
      ]}
    >
      <article>
        <h1 className="text-3xl font-semibold md:text-4xl">Metodologia do Portal Iluminando</h1>
        <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">Combinamos modelos interpretativos de autoconhecimento com práticas de reflexão. Distinguimos claramente abordagem simbólica, modelos clássicos e o que não constitui evidência científica clínica.</p>
        
        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Lentes que usamos</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Traço de caráter com leitura corporal orientada e questionário; temperamentos clássicos; linguagens do amor; Roda da Vida; numerologia simbólica a partir de nome e data.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Cada lente tem página própria em /analises com limitações explícitas.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">O que não fazemos</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Não emitimos diagnóstico clínico, não substituímos psicoterapia e não apresentamos numerologia como ciência comprovada.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Não inventamos avaliações agregadas nem certificações inexistentes.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Integração</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">O Dossiê de Vida sintetiza o que você já percorreu. A reflexão diária transforma insight em hábito.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">A jornada gamificada organiza etapas e missões para continuidade, sem trivializar o conteúdo.</p>
        </section>
        
      </article>
    </PublicShell>
  );
}
