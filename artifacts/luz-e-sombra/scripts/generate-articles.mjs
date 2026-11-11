import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dir = path.join(root, "content/artigos");
fs.mkdirSync(dir, { recursive: true });

const PUB = "2026-03-26";

const specs = [
  ["o-que-e-autoconhecimento-e-como-comecar", "autoconhecimento", "O que é autoconhecimento e como começar?", "Autoconhecimento é o hábito de observar pensamentos, emoções e padrões com honestidade. Comece com perguntas simples, registro breve e uma ferramenta guiada."],
  ["como-desenvolver-o-autoconhecimento-na-pratica", "autoconhecimento", "Como desenvolver o autoconhecimento na prática?", "Pratique observação diária, nomeie emoções, peça feedback cuidadoso e use análises como mapas — não como verdades absolutas."],
  ["por-que-repetimos-padroes-de-comportamento", "autoconhecimento", "Por que repetimos padrões de comportamento?", "Repetimos o que já foi solução emocional no passado. Trazer o padrão à consciência abre escolha; não apaga história de um dia para o outro."],
  ["como-identificar-padroes-emocionais", "autoconhecimento", "Como identificar padrões emocionais?", "Observe gatilhos, reações corporais e histórias que você conta sobre si. Diário e leituras integradas ajudam a ver recorrência."],
  ["como-compreender-melhor-suas-escolhas", "autoconhecimento", "Como compreender melhor suas escolhas?", "Toda escolha carrega valor, medo e contexto. Mapear temperamento, necessidades afetivas e áreas da vida esclarece por que você decide como decide."],
  ["autoconhecimento-e-desenvolvimento-pessoal", "autoconhecimento", "Autoconhecimento e desenvolvimento pessoal", "Desenvolvimento pessoal sustentável começa em se conhecer. Sem isso, metas viram cobrança desalinhada com quem você é."],
  ["o-que-sao-os-cinco-tracos-de-carater", "personalidade", "O que são os cinco traços de caráter?", "No Portal, os cinco traços descrevem padrões emocionais e corporais observados por fotos e questionário — leitura interpretativa, não diagnóstico."],
  ["quais-sao-os-cinco-tracos-segundo-a-metodologia-corporal", "personalidade", "Quais são os cinco traços segundo a metodologia corporal?", "A metodologia corporal do Portal organiza padrões em traços com intensidades relativas, cruzando corpo e relato — sempre com limites claros."],
  ["como-a-linguagem-corporal-e-utilizada-no-autoconhecimento", "personalidade", "Como a linguagem corporal é utilizada no autoconhecimento?", "O corpo guarda tensão e história. Usamos imagens orientadas como pistas complementares às suas respostas, nunca como exame clínico."],
  ["o-que-e-temperamento", "personalidade", "O que é temperamento?", "Temperamento é tendência de energia e reação. No Portal, quatro tipos clássicos ajudam a nomear estilos sem reduzir a pessoa a um rótulo."],
  ["quais-sao-os-quatro-temperamentos", "personalidade", "Quais são os quatro temperamentos?", "Colérico, Sanguíneo, Melancólico e Fleumático. Cada um descreve um conjunto de tendências; misturas são comuns e esperadas."],
  ["diferenca-entre-personalidade-e-temperamento", "personalidade", "Diferença entre personalidade e temperamento", "Temperamento é recorte de tendência; personalidade inclui história, valores e aprendizado. Use os dois sem confundir."],
  ["como-identificar-padroes-de-comportamento", "personalidade", "Como identificar padrões de comportamento?", "Liste situações recorrentes, o que você sente, faz e evita. Cruze com análises do Portal para validar hipóteses."],
  ["quais-sao-as-cinco-linguagens-do-amor", "relacionamentos", "Quais são as cinco linguagens do amor?", "Palavras, tempo de qualidade, presentes, atos de serviço e toque físico — formas frequentes de expressar e perceber afeto."],
  ["como-descobrir-sua-linguagem-do-amor", "relacionamentos", "Como descobrir sua linguagem do amor?", "Faça a análise do Portal e observe o que realmente te nutre no cotidiano. Receber e expressar podem divergir."],
  ["por-que-as-pessoas-demonstram-afeto-de-maneiras-diferentes", "relacionamentos", "Por que as pessoas demonstram afeto de maneiras diferentes?", "História familiar, temperamento e aprendizado moldam o jeito de cuidar. Diferença não é falta de amor automaticamente."],
  ["como-compreender-suas-necessidades-nos-relacionamentos", "relacionamentos", "Como compreender suas necessidades nos relacionamentos?", "Nomeie o que falta e o que sobra. Linguagens do amor e padrões emocionais ajudam a pedir com clareza e respeito."],
  ["o-que-e-a-roda-da-vida", "desenvolvimento", "O que é a Roda da Vida?", "Ferramenta visual que avalia satisfação em várias áreas da vida, mostrando equilíbrio e pontos de atenção no momento atual."],
  ["como-avaliar-as-diferentes-areas-da-vida", "desenvolvimento", "Como avaliar as diferentes áreas da vida?", "Use notas honestas de 1 a 10 por área, sem se comparar. O Portal organiza 12 dimensões nessa leitura."],
  ["como-identificar-areas-que-precisam-de-atencao", "desenvolvimento", "Como identificar áreas que precisam de atenção?", "Olhe notas baixas e também o contraste com o que você diz valorizar. Escolha uma área para gesto concreto."],
  ["como-desenvolver-uma-rotina-de-reflexao-pessoal", "desenvolvimento", "Como desenvolver uma rotina de reflexão pessoal?", "Reserve minutos fixos, uma pergunta simples e registro breve. Consistência leve vence sessões longas irregulares."],
  ["o-que-e-numerologia", "numerologia", "O que é numerologia?", "Sistema simbólico que atribui significados a números do nome e da data. No Portal é autoconhecimento interpretativo, não ciência comprovada."],
  ["o-que-e-caminho-de-vida", "numerologia", "O que é caminho de vida?", "Número simbólico associado à trajetória e aprendizados. Use como pergunta sobre direção, não como destino fixo."],
  ["o-que-e-numero-de-expressao", "numerologia", "O que é número de expressão?", "Símbolo ligado ao nome e à forma de se mostrar no mundo — talento e estilo, em chave interpretativa."],
  ["o-que-e-numero-da-alma", "numerologia", "O que é número da alma?", "Leitura simbólica associada a desejos e motivações internas. Sirva-se do que ressoar; questione o resto."],
  ["o-que-e-ano-pessoal", "numerologia", "O que é ano pessoal?", "Ciclo simbólico anual derivado da data de nascimento, pensado no Portal a partir do aniversário."],
  ["como-funcionam-os-ciclos-numerologicos", "numerologia", "Como funcionam os ciclos numerológicos?", "Organizam fases simbólicas (ano, movimentos). São âncoras de reflexão temporal, não previsões garantidas."],
  ["o-que-significa-numerologia-diaria", "numerologia", "O que significa numerologia diária?", "Tema simbólico do dia para orientar atenção e reflexão. Opcional, não prescritivo."],
  ["o-que-e-um-dossie-de-vida", "experiencia", "O que é um Dossiê de Vida?", "Síntese integrada das suas análises no Portal — panorama de padrões e possibilidades a partir do que você já percorreu."],
  ["como-reunir-diferentes-ferramentas-de-autoconhecimento", "experiencia", "Como reunir diferentes ferramentas de autoconhecimento?", "Use várias lentes (corpo, temperamento, afeto, roda, símbolos) e procure temas repetidos. Integração reduz distorção."],
  ["como-acompanhar-sua-evolucao-pessoal", "experiencia", "Como acompanhar sua evolução pessoal?", "Repita rodas, releia registros e compare dossiês ao longo do tempo. Evolução aparece em séries, não em um dia."],
  ["como-transformar-reflexao-em-habitos-cotidianos", "experiencia", "Como transformar reflexão em hábitos cotidianos?", "Escolha um insight, um gesto pequeno e um horário. Missões do Portal existem para isso."],
  ["o-que-e-uma-jornada-gamificada-de-autoconhecimento", "experiencia", "O que é uma jornada gamificada de autoconhecimento?", "Percurso com etapas, missões e continuidade que torna o processo mais claro e sustentável — sem trivializar o conteúdo."],
  ["como-manter-um-diario-de-autoconhecimento", "experiencia", "Como manter um diário de autoconhecimento?", "Escreva pouco, com honestidade, em ritmo sustentável. Guarde o que importa e revise semanalmente."],
];

function slugToTitle(s) {
  return s;
}

const articles = specs.map(([slug, cluster, title, directAnswer]) => {
  const pathSlug = `/blog/${slug}`;
  return {
    slug,
    path: pathSlug,
    title,
    description: `${directAnswer} Conteúdo da Biblioteca do Autoconhecimento do Portal Iluminando.`,
    h1: title,
    cluster,
    directAnswer,
    sections: [
      {
        heading: "Definição e contexto",
        body: [
          directAnswer,
          "No Portal Iluminando, este tema aparece dentro da Jornada Da Sombra à Luz, junto de análises e da reflexão diária, sempre com limites claros: ferramentas de autoconhecimento não substituem cuidado clínico quando ele é necessário.",
        ],
      },
      {
        heading: "Como aprofundar com responsabilidade",
        body: [
          "Combine observação pessoal com uma ferramenta guiada. Anote o que ressoa e o que não ressoa.",
          "Evite transformar qualquer modelo (traços, temperamentos, numerologia ou linguagens) em identidade rígida ou desculpa para não agir.",
          "Quando o sofrimento for intenso ou persistente, procure profissionais de saúde qualificados.",
        ],
      },
      {
        heading: "Passos práticos",
        body: [
          "1) Escolha uma pergunta do dia e escreva três linhas honestas.",
          "2) Relacione a pergunta a uma análise do Portal (por exemplo roda, temperamento ou linguagens).",
          "3) Defina um gesto concreto de 10 minutos alinhado ao insight.",
          "4) Revise em sete dias o que mudou na prática — não só na intenção.",
        ],
      },
      {
        heading: "Como o Portal Iluminando aborda o tema",
        body: [
          "A plataforma integra leituras de traço de caráter, temperamento, linguagens do amor, roda da vida e numerologia simbólica com experiência diária e o Dossiê de Vida.",
          "O propósito é ajudar você a compreender características, reconhecer padrões e desenvolver relação mais consciente consigo — no seu ritmo, durante o período de acesso.",
        ],
      },
    ],
    examples: [
      `Exemplo 1: alguém lê sobre «${title.toLowerCase()}» e usa o diário do Portal por cinco dias, notando o mesmo gatilho emocional à noite.`,
      "Exemplo 2: outra pessoa cruza o insight com a Roda da Vida e escolhe uma área para um hábito mínimo sustentável.",
      "Exemplo 3: um casal usa a conversa sobre linguagens do amor para pedir com mais clareza, sem acusação.",
    ],
    faq: [
      {
        q: `Isso resolve sozinho a questão «${title}»?`,
        a: "Não. Leitura e reflexão abrem caminho; mudança sustentável pede prática, contexto e, quando preciso, apoio profissional.",
      },
      {
        q: "Preciso acreditar em numerologia ou modelos clássicos?",
        a: "Não. Use o que for útil como metáfora ou mapa e deixe o resto. O critério é a sua experiência ética e consciente.",
      },
      {
        q: "Onde continuo no Portal?",
        a: "Explore as páginas de análises, a Biblioteca e, se fizer sentido, a Jornada Da Sombra à Luz em /jornada-da-sombra-a-luz.",
      },
    ],
    relatedPaths: [
      { href: "/jornada-da-sombra-a-luz", label: "Jornada Da Sombra à Luz" },
      { href: "/analises", label: "Nove análises" },
      { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
      { href: "/blog", label: "Biblioteca" },
    ],
    externalSources:
      cluster === "relacionamentos"
        ? [{ label: "APA — Relationships and well-being (visão geral)", url: "https://www.apa.org/topics/healthy-relationships" }]
        : cluster === "numerologia"
          ? []
          : [{ label: "OMS — Saúde mental (visão geral)", url: "https://www.who.int/health-topics/mental-health" }],
    publishedAt: PUB,
    updatedAt: PUB,
    imageAlt: `Ilustração editorial sobre ${title} — Portal Iluminando`,
  };
});

fs.writeFileSync(
  path.join(dir, "data.ts"),
  `import type { ArticleContent } from "../types";\n\nexport const ARTICLES: ArticleContent[] = ${JSON.stringify(articles, null, 2)};\n`,
  "utf8",
);

fs.writeFileSync(
  path.join(dir, "index.ts"),
  `import { ARTICLES } from "./data";
import type { ArticleContent } from "../types";
import { INDEXABLE_ROUTES, type SeoRouteMeta } from "../../src/lib/seo/routes";

export { ARTICLES };

export function getArticleBySlug(slug: string): ArticleContent | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticleByPath(p: string): ArticleContent | undefined {
  const path = p.replace(/\\/$/, "") || "/";
  return ARTICLES.find((a) => a.path === path);
}

export function articlesByCluster(cluster: ArticleContent["cluster"]) {
  return ARTICLES.filter((a) => a.cluster === cluster);
}

/** Rotas de blog para sitemap (lastmod = updatedAt do artigo). */
export function blogSeoRoutes(): SeoRouteMeta[] {
  return ARTICLES.map((a) => ({
    path: a.path,
    title: a.title,
    description: a.description,
    indexable: true,
    changefreq: "monthly" as const,
    priority: 0.7,
    sourceFile: "content/artigos/data.ts",
  }));
}

export function allIndexableSeoRoutes(): SeoRouteMeta[] {
  return [...INDEXABLE_ROUTES, ...blogSeoRoutes()];
}
`,
  "utf8",
);

console.log("articles", articles.length);
