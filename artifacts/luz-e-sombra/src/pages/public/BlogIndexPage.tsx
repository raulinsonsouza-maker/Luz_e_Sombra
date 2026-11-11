import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { ARTICLES } from "@/content/artigos";
import { SITE_NAME } from "@/lib/seo";

const LABELS: Record<string, string> = {
  autoconhecimento: "Autoconhecimento",
  personalidade: "Personalidade e comportamento",
  relacionamentos: "Relacionamentos",
  desenvolvimento: "Desenvolvimento pessoal",
  numerologia: "Numerologia",
  experiencia: "Experiência integrada",
};

export default function BlogIndexPage() {
  const clusters = Object.keys(LABELS);
  return (
    <PublicShell
      pagePath="/blog"
      pageTitle={`Biblioteca do Autoconhecimento | ${SITE_NAME}`}
      pageDescription="Artigos e guias sobre autoconhecimento, padrões, temperamento, linguagens do amor, roda da vida e numerologia."
      pageType="CollectionPage"
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Biblioteca", path: "/blog" },
      ]}
    >
      <h1 className="text-3xl font-semibold md:text-4xl">Biblioteca do Autoconhecimento</h1>
      <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">
        Conteúdo educativo para humanos, buscadores e assistentes de IA — com limites claros e links para as análises do Portal.
      </p>
      {clusters.map((c) => {
        const items = ARTICLES.filter((a) => a.cluster === c);
        if (!items.length) return null;
        return (
          <section key={c} className="mt-10">
            <h2 className="text-2xl text-[#c8a56b]">{LABELS[c]}</h2>
            <ul className="mt-4 space-y-3">
              {items.map((a) => (
                <li key={a.slug}>
                  <Link href={a.path} className="text-[rgba(247,242,236,0.9)] hover:text-[#c8a56b]">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </PublicShell>
  );
}
