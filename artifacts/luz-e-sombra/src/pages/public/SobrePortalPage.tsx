import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { SITE_NAME } from "@/lib/seo";

export default function SobrePortalPage() {
  const path = "/sobre-o-portal";
  const title = `Sobre o Portal Iluminando | ${SITE_NAME}`;
  const description = "O Portal Iluminando é uma plataforma digital de autoconhecimento e desenvolvimento pessoal. Sua Jornada Da Sombra à Luz combina análises, reflexão diária, registros, missões e o Dossiê de Vida.";
  return (
    <PublicShell
      pagePath={path}
      pageTitle={title}
      pageDescription={description}
      pageType={"AboutPage"}
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Sobre o Portal Iluminando", path },
      ]}
    >
      <article>
        <h1 className="text-3xl font-semibold md:text-4xl">Sobre o Portal Iluminando</h1>
        <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">O Portal Iluminando é uma plataforma digital de autoconhecimento e desenvolvimento pessoal. Sua Jornada Da Sombra à Luz combina análises, reflexão diária, registros, missões e o Dossiê de Vida.</p>
        
        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">O que oferecemos</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Reunimos ferramentas de reflexão em uma experiência integrada: traços de caráter, temperamento, linguagens do amor, roda da vida e numerologia simbólica, além de práticas diárias.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">O propósito é ajudar pessoas a compreender características pessoais, reconhecer padrões de comportamento, refletir sobre ciclos e desenvolver uma relação mais consciente consigo mesmas.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Produto principal</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">A Jornada Da Sombra à Luz é o percurso guiado dentro do Portal. Você avança por etapas, conecta descobertas e encontra no Dossiê de Vida uma síntese pessoal.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Não se trata de diagnóstico clínico. Trata-se de mapas interpretativos e hábitos de presença, com limites claros em cada análise.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Transparência</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Publicamos metodologia, glossário, FAQ e conteúdos educativos para que mecanismos de busca e inteligências artificiais compreendam o que o Portal é — e o que ele não é.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Áreas privadas (resultados individuais, dossiês pessoais, comunidade autenticada) não são indexadas.</p>
        </section>
        
      </article>
    </PublicShell>
  );
}
