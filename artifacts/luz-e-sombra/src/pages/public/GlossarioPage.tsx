import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { SITE_NAME } from "@/lib/seo";

const TERMS = [
  {
    term: "Portal Iluminando",
    def: "Plataforma digital de autoconhecimento e desenvolvimento pessoal.",
    href: "/sobre-o-portal",
  },
  {
    term: "Jornada Da Sombra à Luz",
    def: "Percurso guiado que integra análises, reflexão e o Dossiê de Vida.",
    href: "/jornada-da-sombra-a-luz",
  },
  {
    term: "Traços de caráter",
    def: "Padrões emocionais e comportamentais observados com fotos orientadas e questionário — leitura interpretativa.",
    href: "/analises/tracos-de-carater",
  },
  {
    term: "Temperamento",
    def: "Tendências clássicas (Colérico, Sanguíneo, Melancólico, Fleumático) usadas como mapa de estilo de reação.",
    href: "/analises/temperamento",
  },
  {
    term: "Linguagens do amor",
    def: "Formas de expressar e perceber afeto; no Portal, receber e expressar são analisados em separado.",
    href: "/analises/linguagens-do-amor",
  },
  {
    term: "Roda da Vida",
    def: "Autoavaliação visual de satisfação em múltiplas áreas da vida.",
    href: "/analises/roda-da-vida",
  },
  {
    term: "Numerologia",
    def: "Leitura simbólica a partir de nome e data; não é ciência comprovada no sentido clínico-experimental.",
    href: "/analises/numerologia",
  },
  {
    term: "Ano pessoal",
    def: "Ciclo simbólico anual pensado a partir do aniversário na abordagem do Portal.",
    href: "/analises/ciclos-numerologicos",
  },
  {
    term: "Dossiê de Vida",
    def: "Síntese integrada das análises realizadas na conta.",
    href: "/analises/dossie-de-vida",
  },
  {
    term: "Reflexão diária",
    def: "Espaço para registrar emoções e insights, sustentando hábito de presença.",
    href: "/analises/reflexao-diaria",
  },
];

export default function GlossarioPage() {
  return (
    <PublicShell
      pagePath="/glossario"
      pageTitle={`Glossário de autoconhecimento | ${SITE_NAME}`}
      pageDescription="Definições claras dos termos usados no Portal Iluminando."
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Glossário", path: "/glossario" },
      ]}
    >
      <h1 className="text-3xl font-semibold md:text-4xl">Glossário</h1>
      <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">
        Termos usados nas páginas públicas e na Jornada Da Sombra à Luz.
      </p>
      <dl className="mt-10 space-y-6">
        {TERMS.map((t) => (
          <div key={t.term}>
            <dt className="text-xl text-[#c8a56b]">
              <Link href={t.href} className="hover:underline">
                {t.term}
              </Link>
            </dt>
            <dd className="mt-1 text-[rgba(247,242,236,0.8)]">{t.def}</dd>
          </div>
        ))}
      </dl>
    </PublicShell>
  );
}
