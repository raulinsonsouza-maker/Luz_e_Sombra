import PublicShell from "@/components/public/PublicShell";
import { LP_FAQ } from "@/lib/lpConfig";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

const EXTRA = [
  {
    q: "As análises são diagnósticos clínicos?",
    a: "Não. São ferramentas de autoconhecimento e reflexão. Não substituem avaliação médica ou psicoterapia.",
  },
  {
    q: "A numerologia é ciência comprovada?",
    a: "Não. No Portal, a numerologia é apresentada como leitura simbólica e interpretativa, útil para reflexão, sem pretensão de previsão científica.",
  },
  {
    q: "Conteúdo público e área logada são a mesma coisa?",
    a: "Não. Páginas educativas e institucionais são públicas. Resultados individuais, dossiês e a trilha autenticada permanecem privados e fora do sitemap.",
  },
];

export default function FaqPage() {
  const faq = [...LP_FAQ, ...EXTRA];
  return (
    <PublicShell
      pagePath="/perguntas-frequentes"
      pageTitle={`Perguntas frequentes | ${SITE_NAME}`}
      pageDescription="Respostas diretas sobre o Portal Iluminando, a Jornada Da Sombra à Luz, acesso, privacidade e análises."
      pageType="FAQPage"
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Perguntas frequentes", path: "/perguntas-frequentes" },
      ]}
      faq={faq}
    >
      <h1 className="text-3xl font-semibold md:text-4xl">Perguntas frequentes</h1>
      <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">{SITE_DESCRIPTION}</p>
      <div className="mt-10 space-y-6">
        {faq.map((f) => (
          <section key={f.q}>
            <h2 className="text-xl text-[#c8a56b]">{f.q}</h2>
            <p className="mt-2 text-[rgba(247,242,236,0.8)]">{f.a}</p>
          </section>
        ))}
      </div>
    </PublicShell>
  );
}
