import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { ANALISES } from "@/content/analises";
import { SITE_NAME } from "@/lib/seo";

export default function AnalisesIndexPage() {
  return (
    <PublicShell
      pagePath="/analises"
      pageTitle={`As nove análises | ${SITE_NAME}`}
      pageDescription="Conheça as nove análises da Jornada Da Sombra à Luz no Portal Iluminando."
      pageType="CollectionPage"
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Análises", path: "/analises" },
      ]}
    >
      <h1 className="text-3xl font-semibold md:text-4xl">As nove análises</h1>
      <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">
        Cada análise ilumina uma dimensão. Juntas, formam o percurso da Jornada Da Sombra à Luz.
      </p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {ANALISES.map((a) => (
          <li key={a.slug} className="rounded-lg border border-[rgba(200,165,107,0.2)] p-4">
            <Link href={a.path} className="text-lg text-[#c8a56b] hover:underline">
              {a.h1}
            </Link>
            <p className="mt-2 text-sm text-[rgba(247,242,236,0.7)]">{a.directAnswer}</p>
          </li>
        ))}
      </ul>
    </PublicShell>
  );
}
