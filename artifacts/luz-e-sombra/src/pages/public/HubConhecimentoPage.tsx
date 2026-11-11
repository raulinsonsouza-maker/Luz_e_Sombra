import { Link, useLocation } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { ARTICLES, articlesByCluster } from "@/content/artigos";
import type { ArticleContent } from "../../../content/types";
import { SITE_NAME } from "@/lib/seo";

const HUBS: Record<
  string,
  {
    title: string;
    description: string;
    cluster: ArticleContent["cluster"];
    intro: string[];
  }
> = {
  "/autoconhecimento": {
    title: "Autoconhecimento",
    description: "O que é autoconhecimento e como começar na prática — guias do Portal Iluminando.",
    cluster: "autoconhecimento",
    intro: [
      "Autoconhecimento é observar com honestidade o que você sente, pensa e repete.",
      "Nesta hub reunimos artigos introdutórios e caminhos para as análises do Portal.",
    ],
  },
  "/padroes-de-comportamento": {
    title: "Padrões de comportamento",
    description: "Por que repetimos padrões e como identificá-los com as ferramentas do Portal.",
    cluster: "personalidade",
    intro: [
      "Padrões são soluções antigas que ainda disparam no presente.",
      "Identificá-los é o primeiro passo para escolher diferente.",
    ],
  },
  "/desenvolvimento-pessoal": {
    title: "Desenvolvimento pessoal",
    description: "Desenvolvimento pessoal com reflexão, hábitos e a Jornada Da Sombra à Luz.",
    cluster: "desenvolvimento",
    intro: [
      "Desenvolvimento sustentável começa em se conhecer.",
      "Use a Roda da Vida e a reflexão diária para transformar insight em gesto.",
    ],
  },
  "/inteligencia-emocional": {
    title: "Inteligência emocional",
    description: "Reconhecer emoções, padrões e ciclos — artigos e práticas no Portal Iluminando.",
    cluster: "autoconhecimento",
    intro: [
      "Nomear emoções reduz confusão e impulsividade.",
      "Diário, temperamento e missões ajudam a treinar presença.",
    ],
  },
  "/autoconhecimento-e-relacionamentos": {
    title: "Autoconhecimento e relacionamentos",
    description: "Linguagens do amor, necessidades afetivas e padrões relacionais.",
    cluster: "relacionamentos",
    intro: [
      "Relacionamentos melhoram quando necessidades ficam explícitas.",
      "As linguagens do amor oferecem vocabulário — não regras rígidas.",
    ],
  },
};

export default function HubConhecimentoPage() {
  const [location] = useLocation();
  const path = location.replace(/\/$/, "") || "/";
  const hub = HUBS[path] ?? HUBS["/autoconhecimento"];
  const items =
    path === "/inteligencia-emocional"
      ? ARTICLES.filter((a) =>
          ["como-identificar-padroes-emocionais", "como-desenvolver-o-autoconhecimento-na-pratica", "como-transformar-reflexao-em-habitos-cotidianos"].includes(
            a.slug,
          ),
        )
      : articlesByCluster(hub.cluster);

  return (
    <PublicShell
      pagePath={path}
      pageTitle={`${hub.title} | ${SITE_NAME}`}
      pageDescription={hub.description}
      pageType="CollectionPage"
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: hub.title, path },
      ]}
    >
      <h1 className="text-3xl font-semibold md:text-4xl">{hub.title}</h1>
      {hub.intro.map((p) => (
        <p key={p.slice(0, 32)} className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">
          {p}
        </p>
      ))}
      <ul className="mt-10 space-y-3">
        {items.map((a) => (
          <li key={a.slug}>
            <Link href={a.path} className="text-[#c8a56b] hover:underline">
              {a.title}
            </Link>
            <p className="text-sm text-[rgba(247,242,236,0.65)]">{a.directAnswer}</p>
          </li>
        ))}
      </ul>
      <p className="mt-10">
        <Link href="/blog" className="text-[#c8a56b] hover:underline">
          Ver toda a Biblioteca
        </Link>
      </p>
    </PublicShell>
  );
}
