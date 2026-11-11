import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  PRODUCT_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "./identity";

export type RobotsDirective = "index, follow" | "noindex, nofollow";

export interface SeoRouteMeta {
  path: string;
  title: string;
  description: string;
  /** Incluir no sitemap e pré-render indexável */
  indexable: boolean;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
  /** Caminho do arquivo-fonte para lastmod real (relativo ao app) */
  sourceFile?: string;
}

/** Prefixos privados — Disallow + noindex. */
export const PRIVATE_PATH_PREFIXES = [
  "/dashboard",
  "/jornada",
  "/reflexao",
  "/frases-guardadas",
  "/acompanhamento",
  "/linguagens-amor",
  "/missoes",
  "/avaliacao",
  "/resultado",
  "/historico",
  "/numerologia",
  "/perfil",
  "/quem-sou-eu",
  "/diagnostico-emocional",
  "/traco-de-carater",
  "/temperamento",
  "/comunidade",
  "/cursos",
  "/notificacoes",
  "/admin",
  "/api",
  "/checkout",
  "/acesso-pos-compra",
  "/esqueci-senha",
  "/redefinir-senha",
  "/dev",
] as const;

export const NOINDEX_EXACT = new Set([
  "/login",
  "/admin/login",
  "/checkout",
  "/acesso-pos-compra",
  "/esqueci-senha",
  "/redefinir-senha",
]);

/** Rotas públicas indexáveis (registry canônico). */
export const INDEXABLE_ROUTES: SeoRouteMeta[] = [
  {
    path: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    indexable: true,
    changefreq: "weekly",
    priority: 1,
    sourceFile: "src/pages/LandingPage.tsx",
  },
  {
    path: "/vsl",
    title: `${PRODUCT_NAME} — vídeo | ${SITE_NAME}`,
    description:
      "Assista e conheça como a Jornada Da Sombra à Luz conecta análises de autoconhecimento em um percurso guiado no Portal Iluminando.",
    indexable: true,
    changefreq: "weekly",
    priority: 0.9,
    sourceFile: "src/pages/VslLandingPage.tsx",
  },
  {
    path: "/sobre-o-portal",
    title: `Sobre o Portal Iluminando | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    indexable: true,
    changefreq: "monthly",
    priority: 0.8,
    sourceFile: "src/pages/public/SobrePortalPage.tsx",
  },
  {
    path: "/metodologia",
    title: `Metodologia | ${SITE_NAME}`,
    description:
      "Como o Portal Iluminando combina modelos interpretativos de autoconhecimento — com limites claros entre abordagem simbólica e evidência científica.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.8,
    sourceFile: "src/pages/public/MetodologiaPage.tsx",
  },
  {
    path: "/jornada-da-sombra-a-luz",
    title: `${PRODUCT_NAME} | ${SITE_NAME}`,
    description:
      "Conheça a Jornada Da Sombra à Luz: nove análises integradas, reflexão diária e o Dossiê de Vida no Portal Iluminando.",
    indexable: true,
    changefreq: "weekly",
    priority: 0.95,
    sourceFile: "src/pages/public/JornadaPublicPage.tsx",
  },
  {
    path: "/como-funciona",
    title: `Como funciona | ${SITE_NAME}`,
    description:
      "Do cadastro ao Dossiê de Vida: como percorrer a Jornada Da Sombra à Luz no Portal Iluminando, no seu ritmo.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.85,
    sourceFile: "src/pages/public/ComoFuncionaPage.tsx",
  },
  {
    path: "/contato",
    title: `Contato | ${SITE_NAME}`,
    description: `Fale com o Portal Iluminando. E-mail de suporte e informações de contato.`,
    indexable: true,
    changefreq: "yearly",
    priority: 0.5,
    sourceFile: "src/pages/public/ContatoPage.tsx",
  },
  {
    path: "/planos",
    title: `Planos e acesso | ${SITE_NAME}`,
    description:
      "Condições comerciais vigentes da Jornada Da Sombra à Luz: acesso, formas de pagamento e o que está incluso.",
    indexable: true,
    changefreq: "weekly",
    priority: 0.9,
    sourceFile: "src/pages/public/PlanosPage.tsx",
  },
  {
    path: "/analises",
    title: `As nove análises | ${SITE_NAME}`,
    description:
      "Conheça as nove análises da Jornada Da Sombra à Luz: traço, temperamento, linguagens do amor, roda, numerologia, ciclos, reflexão e dossiê.",
    indexable: true,
    changefreq: "weekly",
    priority: 0.9,
    sourceFile: "src/pages/public/AnalisesIndexPage.tsx",
  },
  {
    path: "/analises/tracos-de-carater",
    title: `Traços de caráter e linguagem corporal | ${SITE_NAME}`,
    description:
      "O que são os cinco traços de caráter na abordagem corporal do Portal Iluminando, como funciona a análise e quais são seus limites.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.85,
    sourceFile: "content/analises/tracos-de-carater.ts",
  },
  {
    path: "/analises/temperamento",
    title: `Temperamento | ${SITE_NAME}`,
    description:
      "Os quatro temperamentos clássicos no Portal Iluminando: o que a análise revela, como funciona e o que ela não pretende ser.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.85,
    sourceFile: "content/analises/temperamento.ts",
  },
  {
    path: "/analises/linguagens-do-amor",
    title: `Linguagens do amor | ${SITE_NAME}`,
    description:
      "As cinco linguagens do amor como ferramenta de autoconhecimento relacional no Portal Iluminando.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.85,
    sourceFile: "content/analises/linguagens-do-amor.ts",
  },
  {
    path: "/analises/roda-da-vida",
    title: `Roda da Vida | ${SITE_NAME}`,
    description:
      "O que é a Roda da Vida, como avaliar 12 áreas da vida e como o Portal Iluminando usa essa ferramenta.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.85,
    sourceFile: "content/analises/roda-da-vida.ts",
  },
  {
    path: "/analises/numerologia",
    title: `Numerologia e mapa numerológico | ${SITE_NAME}`,
    description:
      "O que é numerologia no Portal Iluminando: mapa simbólico a partir do nome e da data de nascimento, com limites claros.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.85,
    sourceFile: "content/analises/numerologia.ts",
  },
  {
    path: "/analises/ciclos-numerologicos",
    title: `Ciclos numerológicos | ${SITE_NAME}`,
    description:
      "Ano pessoal e ciclos mensais na leitura numerológica do Portal Iluminando — abordagem simbólica, não científica.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.8,
    sourceFile: "content/analises/ciclos-numerologicos.ts",
  },
  {
    path: "/analises/numerologia-diaria",
    title: `Numerologia diária | ${SITE_NAME}`,
    description:
      "Como funciona a numerologia diária no Portal Iluminando: significados simbólicos do dia e reflexões práticas.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.8,
    sourceFile: "content/analises/numerologia-diaria.ts",
  },
  {
    path: "/analises/reflexao-diaria",
    title: `Reflexão diária e experiência do dia | ${SITE_NAME}`,
    description:
      "Espaço de reflexão diária no Portal Iluminando: desacelerar, registrar emoções e transformar insight em hábito.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.8,
    sourceFile: "content/analises/reflexao-diaria.ts",
  },
  {
    path: "/analises/dossie-de-vida",
    title: `Dossiê de Vida | ${SITE_NAME}`,
    description:
      "O Dossiê de Vida integra as análises do Portal Iluminando em uma síntese pessoal de características e padrões.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.85,
    sourceFile: "content/analises/dossie-de-vida.ts",
  },
  {
    path: "/autoconhecimento",
    title: `Autoconhecimento | ${SITE_NAME}`,
    description:
      "O que é autoconhecimento e como começar na prática — guias e artigos do Portal Iluminando.",
    indexable: true,
    changefreq: "weekly",
    priority: 0.8,
    sourceFile: "src/pages/public/HubConhecimentoPage.tsx",
  },
  {
    path: "/padroes-de-comportamento",
    title: `Padrões de comportamento | ${SITE_NAME}`,
    description:
      "Por que repetimos padrões e como identificá-los com as ferramentas do Portal Iluminando.",
    indexable: true,
    changefreq: "weekly",
    priority: 0.75,
    sourceFile: "src/pages/public/HubConhecimentoPage.tsx",
  },
  {
    path: "/desenvolvimento-pessoal",
    title: `Desenvolvimento pessoal | ${SITE_NAME}`,
    description:
      "Desenvolvimento pessoal com reflexão, hábitos e a Jornada Da Sombra à Luz.",
    indexable: true,
    changefreq: "weekly",
    priority: 0.75,
    sourceFile: "src/pages/public/HubConhecimentoPage.tsx",
  },
  {
    path: "/inteligencia-emocional",
    title: `Inteligência emocional | ${SITE_NAME}`,
    description:
      "Reconhecer emoções, padrões e ciclos — artigos e práticas no Portal Iluminando.",
    indexable: true,
    changefreq: "weekly",
    priority: 0.75,
    sourceFile: "src/pages/public/HubConhecimentoPage.tsx",
  },
  {
    path: "/autoconhecimento-e-relacionamentos",
    title: `Autoconhecimento e relacionamentos | ${SITE_NAME}`,
    description:
      "Linguagens do amor, necessidades afetivas e padrões relacionais no Portal Iluminando.",
    indexable: true,
    changefreq: "weekly",
    priority: 0.75,
    sourceFile: "src/pages/public/HubConhecimentoPage.tsx",
  },
  {
    path: "/guia",
    title: `Guia do Portal | ${SITE_NAME}`,
    description: `Como navegar o ${SITE_NAME} e a ${PRODUCT_NAME}: análises, reflexão e dossiê.`,
    indexable: true,
    changefreq: "monthly",
    priority: 0.7,
    sourceFile: "src/pages/public/GuiaPage.tsx",
  },
  {
    path: "/glossario",
    title: `Glossário de autoconhecimento | ${SITE_NAME}`,
    description:
      "Definições claras dos termos usados no Portal Iluminando: traços, temperamento, linguagens, roda, numerologia e dossiê.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.7,
    sourceFile: "src/pages/public/GlossarioPage.tsx",
  },
  {
    path: "/perguntas-frequentes",
    title: `Perguntas frequentes | ${SITE_NAME}`,
    description:
      "Respostas diretas sobre o Portal Iluminando, a Jornada Da Sombra à Luz, acesso, privacidade e análises.",
    indexable: true,
    changefreq: "monthly",
    priority: 0.8,
    sourceFile: "src/pages/public/FaqPage.tsx",
  },
  {
    path: "/blog",
    title: `Biblioteca do Autoconhecimento | ${SITE_NAME}`,
    description:
      "Artigos e guias sobre autoconhecimento, padrões, temperamento, linguagens do amor, roda da vida e numerologia.",
    indexable: true,
    changefreq: "weekly",
    priority: 0.85,
    sourceFile: "src/pages/public/BlogIndexPage.tsx",
  },
];

export function normalizePath(pathname: string): string {
  const path = (pathname.split("?")[0].split("#")[0] || "/").replace(/\/$/, "") || "/";
  return path;
}

export function isPrivatePath(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (NOINDEX_EXACT.has(path)) return true;
  return PRIVATE_PATH_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function resolveSeoMeta(
  pathname: string,
  blogMeta?: { title: string; description: string },
): { title: string; description: string; robots: RobotsDirective; indexable: boolean } {
  const path = normalizePath(pathname);

  if (blogMeta && path.startsWith("/blog/") && path !== "/blog") {
    return {
      title: blogMeta.title,
      description: blogMeta.description,
      robots: "index, follow",
      indexable: true,
    };
  }

  const found = INDEXABLE_ROUTES.find((r) => r.path === path);
  if (found) {
    return {
      title: found.title,
      description: found.description,
      robots: "index, follow",
      indexable: true,
    };
  }

  if (path === "/login" || isPrivatePath(path)) {
    return {
      title: path === "/login" ? `Entrar | ${SITE_NAME}` : `${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
      robots: "noindex, nofollow",
      indexable: false,
    };
  }

  return {
    title: `Página não encontrada | ${SITE_NAME}`,
    description: "Esta página não existe ou foi movida.",
    robots: "noindex, nofollow",
    indexable: false,
  };
}
