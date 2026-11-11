import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { SITE_NAME } from "@/lib/seo";

export default function JornadaPublicPage() {
  const path = "/jornada-da-sombra-a-luz";
  const title = `Jornada Da Sombra à Luz | ${SITE_NAME}`;
  const description = "Um percurso guiado de autoconhecimento: nove análises que se conectam, reflexão diária e uma síntese chamada Dossiê de Vida.";
  return (
    <PublicShell
      pagePath={path}
      pageTitle={title}
      pageDescription={description}
      pageType={"WebPage"}
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Jornada Da Sombra à Luz", path },
      ]}
    >
      <article>
        <h1 className="text-3xl font-semibold md:text-4xl">Jornada Da Sombra à Luz</h1>
        <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">Um percurso guiado de autoconhecimento: nove análises que se conectam, reflexão diária e uma síntese chamada Dossiê de Vida.</p>
        
        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">As nove análises</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Linguagem corporal (traços), temperamento, linguagens do amor, roda da vida, mapa numerológico, ciclos, numerologia diária, experiência diária e dossiê.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">No aplicativo autenticado, a trilha organiza esses passos para você avançar no seu ritmo.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Para quem é</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Para quem quer clareza sobre padrões, ciclos e características pessoais sem precisar dominar cada modelo de antemão.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">As experiências são guiadas; você responde, registra e recebe leituras organizadas.</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">Começar</h2>
          <p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Conheça os planos vigentes e, após o acesso, entre com seu e-mail e senha.</p>
<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">Enquanto explora, use a Biblioteca do Autoconhecimento para se aprofundar nos conceitos.</p>
        </section>
        <Link href="/planos" className="mt-10 inline-block rounded-md bg-[#c8a56b] px-5 py-2.5 font-medium text-[#1e1812]">Ver planos e acesso</Link>
      </article>
    </PublicShell>
  );
}
