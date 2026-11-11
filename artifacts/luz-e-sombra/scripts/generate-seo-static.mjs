/**
 * Gera robots.txt, sitemap.xml, llms.txt, llms-full.txt e humans.txt em public/
 * a partir do registry de rotas + artigos. lastmod usa mtime real do arquivo-fonte.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const SITE = "https://portaliluminando.com.br";

const INDEXABLE = [
  ["/", "src/pages/LandingPage.tsx", "1.0", "weekly"],
  ["/vsl", "src/pages/VslLandingPage.tsx", "0.9", "weekly"],
  ["/sobre-o-portal", "src/pages/public/SobrePortalPage.tsx", "0.8", "monthly"],
  ["/metodologia", "src/pages/public/MetodologiaPage.tsx", "0.8", "monthly"],
  ["/jornada-da-sombra-a-luz", "src/pages/public/JornadaPublicPage.tsx", "0.95", "weekly"],
  ["/como-funciona", "src/pages/public/ComoFuncionaPage.tsx", "0.85", "monthly"],
  ["/contato", "src/pages/public/ContatoPage.tsx", "0.5", "yearly"],
  ["/planos", "src/pages/public/PlanosPage.tsx", "0.9", "weekly"],
  ["/analises", "src/pages/public/AnalisesIndexPage.tsx", "0.9", "weekly"],
  ["/analises/tracos-de-carater", "content/analises/tracos-de-carater.ts", "0.85", "monthly"],
  ["/analises/temperamento", "content/analises/temperamento.ts", "0.85", "monthly"],
  ["/analises/linguagens-do-amor", "content/analises/linguagens-do-amor.ts", "0.85", "monthly"],
  ["/analises/roda-da-vida", "content/analises/roda-da-vida.ts", "0.85", "monthly"],
  ["/analises/numerologia", "content/analises/numerologia.ts", "0.85", "monthly"],
  ["/analises/ciclos-numerologicos", "content/analises/ciclos-numerologicos.ts", "0.8", "monthly"],
  ["/analises/numerologia-diaria", "content/analises/numerologia-diaria.ts", "0.8", "monthly"],
  ["/analises/reflexao-diaria", "content/analises/reflexao-diaria.ts", "0.8", "monthly"],
  ["/analises/dossie-de-vida", "content/analises/dossie-de-vida.ts", "0.85", "monthly"],
  ["/autoconhecimento", "src/pages/public/HubConhecimentoPage.tsx", "0.8", "weekly"],
  ["/padroes-de-comportamento", "src/pages/public/HubConhecimentoPage.tsx", "0.75", "weekly"],
  ["/desenvolvimento-pessoal", "src/pages/public/HubConhecimentoPage.tsx", "0.75", "weekly"],
  ["/inteligencia-emocional", "src/pages/public/HubConhecimentoPage.tsx", "0.75", "weekly"],
  ["/autoconhecimento-e-relacionamentos", "src/pages/public/HubConhecimentoPage.tsx", "0.75", "weekly"],
  ["/guia", "src/pages/public/GuiaPage.tsx", "0.7", "monthly"],
  ["/glossario", "src/pages/public/GlossarioPage.tsx", "0.7", "monthly"],
  ["/perguntas-frequentes", "src/pages/public/FaqPage.tsx", "0.8", "monthly"],
  ["/blog", "src/pages/public/BlogIndexPage.tsx", "0.85", "weekly"],
];

function lastmod(rel) {
  const full = path.join(root, rel);
  try {
    return fs.statSync(full).mtime.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

// Blog slugs from data.ts via regex (avoid TS import)
const articlesData = fs.readFileSync(path.join(root, "content/artigos/data.ts"), "utf8");
const blogPaths = [...articlesData.matchAll(/"path":\s*"(\/blog\/[^"]+)"/g)].map((m) => m[1]);
const uniqueBlog = [...new Set(blogPaths)];

const robots = `# Portal Iluminando — https://portaliluminando.com.br
# Política: permitir busca e treinamento em conteúdo público.
# Bloquear apenas área logada, APIs e funil sensível.

User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /jornada
Disallow: /jornada/
Disallow: /reflexao
Disallow: /frases-guardadas
Disallow: /acompanhamento
Disallow: /linguagens-amor
Disallow: /missoes
Disallow: /avaliacao
Disallow: /resultado
Disallow: /historico
Disallow: /numerologia
Disallow: /perfil
Disallow: /quem-sou-eu
Disallow: /diagnostico-emocional
Disallow: /traco-de-carater
Disallow: /temperamento
Disallow: /comunidade
Disallow: /cursos
Disallow: /notificacoes
Disallow: /admin
Disallow: /api
Disallow: /checkout
Disallow: /acesso-pos-compra
Disallow: /login
Disallow: /esqueci-senha
Disallow: /redefinir-senha
Disallow: /dev

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const [p, file, priority, freq] of INDEXABLE) {
  sitemap += `  <url>\n    <loc>${SITE}${p === "/" ? "/" : p}</loc>\n    <lastmod>${lastmod(file)}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}
for (const p of uniqueBlog) {
  sitemap += `  <url>\n    <loc>${SITE}${p}</loc>\n    <lastmod>${lastmod("content/artigos/data.ts")}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
}
sitemap += `</urlset>\n`;

const llms = `# Portal Iluminando

> Plataforma digital de autoconhecimento e desenvolvimento pessoal. Produto principal: Jornada Da Sombra à Luz — análises integradas, reflexão diária e Dossiê de Vida.

O Portal Iluminando ajuda pessoas a compreender características pessoais, reconhecer padrões de comportamento, refletir sobre ciclos e desenvolver uma relação mais consciente consigo mesmas. Análises são ferramentas interpretativas — não diagnósticos clínicos. Numerologia é abordada como leitura simbólica, não ciência comprovada.

## Principais páginas

- [Início](${SITE}/): landing da jornada
- [Sobre o Portal](${SITE}/sobre-o-portal): identidade institucional
- [Metodologia](${SITE}/metodologia): lentes e limites
- [Jornada Da Sombra à Luz](${SITE}/jornada-da-sombra-a-luz): produto
- [Como funciona](${SITE}/como-funciona): passos do acesso ao dossiê
- [Planos](${SITE}/planos): condições comerciais vigentes
- [Análises](${SITE}/analises): índice das nove análises
- [Biblioteca](${SITE}/blog): artigos educativos
- [Glossário](${SITE}/glossario): termos
- [FAQ](${SITE}/perguntas-frequentes): perguntas frequentes
- [Contato](${SITE}/contato): contato@portaliluminando.com.br

## Documentação completa para LLMs

- [llms-full.txt](${SITE}/llms-full.txt): definições expandidas das análises e guias
- [sitemap.xml](${SITE}/sitemap.xml): URLs públicas canônicas
`;

const titles = [...articlesData.matchAll(/"title":\s*"([^"]+)"/g)].map((m) => m[1]);
const llmsFull = `${llms}

## Nove análises (resumo)

1. Traços de caráter / linguagem corporal — fotos + questionário; não clínico.
2. Temperamento — quatro temperamentos clássicos via questionário.
3. Linguagens do amor — receber e expressar afeto.
4. Roda da Vida — 12 áreas, notas 1–10.
5. Mapa numerológico — simbólico a partir de nome e data.
6. Ciclos numerológicos — ano pessoal e movimentos.
7. Numerologia diária — tema simbólico do dia.
8. Reflexão / experiência diária — registro e presença.
9. Dossiê de Vida — síntese integrada.

## Biblioteca (títulos)

${titles.map((t) => `- ${t}`).join("\n")}

## Limitações gerais

- Sem AggregateRating fictício.
- Sem dados pessoais, resultados individuais ou área logada nestes arquivos.
- Preço e oferta: consultar /planos (fonte comercial vigente).
`;

const humans = `/* TEAM */
Contact: contato@portaliluminando.com.br

/* SITE */
Standards: HTML5, JSON-LD, llms.txt
Language: pt-BR
Doctype: HTML5
Purpose: Autoconhecimento e desenvolvimento pessoal — Jornada Da Sombra à Luz
`;

fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms);
fs.writeFileSync(path.join(publicDir, "llms-full.txt"), llmsFull);
fs.writeFileSync(path.join(publicDir, "humans.txt"), humans);

// web manifest
fs.writeFileSync(
  path.join(publicDir, "site.webmanifest"),
  JSON.stringify(
    {
      name: "Portal Iluminando",
      short_name: "Iluminando",
      lang: "pt-BR",
      start_url: "/",
      display: "standalone",
      background_color: "#1e1812",
      theme_color: "#1e1812",
      icons: [
        { src: "/marca/arco.png", sizes: "533x615", type: "image/png", purpose: "any" },
        { src: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        { src: "/favicon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      ],
    },
    null,
    2,
  ),
);

console.log("SEO static files written. URLs:", INDEXABLE.length + uniqueBlog.length);
