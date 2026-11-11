import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "src/pages/public");
fs.mkdirSync(dir, { recursive: true });

const pages = {
  SobrePortalPage: {
    path: "/sobre-o-portal",
    type: "AboutPage",
    h1: "Sobre o Portal Iluminando",
    lead:
      "O Portal Iluminando é uma plataforma digital de autoconhecimento e desenvolvimento pessoal. Sua Jornada Da Sombra à Luz combina análises, reflexão diária, registros, missões e o Dossiê de Vida.",
    sections: [
      [
        "O que oferecemos",
        "Reunimos ferramentas de reflexão em uma experiência integrada: traços de caráter, temperamento, linguagens do amor, roda da vida e numerologia simbólica, além de práticas diárias.",
        "O propósito é ajudar pessoas a compreender características pessoais, reconhecer padrões de comportamento, refletir sobre ciclos e desenvolver uma relação mais consciente consigo mesmas.",
      ],
      [
        "Produto principal",
        "A Jornada Da Sombra à Luz é o percurso guiado dentro do Portal. Você avança por etapas, conecta descobertas e encontra no Dossiê de Vida uma síntese pessoal.",
        "Não se trata de diagnóstico clínico. Trata-se de mapas interpretativos e hábitos de presença, com limites claros em cada análise.",
      ],
      [
        "Transparência",
        "Publicamos metodologia, glossário, FAQ e conteúdos educativos para que mecanismos de busca e inteligências artificiais compreendam o que o Portal é — e o que ele não é.",
        "Áreas privadas (resultados individuais, dossiês pessoais, comunidade autenticada) não são indexadas.",
      ],
    ],
  },
  MetodologiaPage: {
    path: "/metodologia",
    h1: "Metodologia do Portal Iluminando",
    lead:
      "Combinamos modelos interpretativos de autoconhecimento com práticas de reflexão. Distinguimos claramente abordagem simbólica, modelos clássicos e o que não constitui evidência científica clínica.",
    sections: [
      [
        "Lentes que usamos",
        "Traço de caráter com leitura corporal orientada e questionário; temperamentos clássicos; linguagens do amor; Roda da Vida; numerologia simbólica a partir de nome e data.",
        "Cada lente tem página própria em /analises com limitações explícitas.",
      ],
      [
        "O que não fazemos",
        "Não emitimos diagnóstico clínico, não substituímos psicoterapia e não apresentamos numerologia como ciência comprovada.",
        "Não inventamos avaliações agregadas nem certificações inexistentes.",
      ],
      [
        "Integração",
        "O Dossiê de Vida sintetiza o que você já percorreu. A reflexão diária transforma insight em hábito.",
        "A jornada gamificada organiza etapas e missões para continuidade, sem trivializar o conteúdo.",
      ],
    ],
  },
  JornadaPublicPage: {
    path: "/jornada-da-sombra-a-luz",
    h1: "Jornada Da Sombra à Luz",
    lead:
      "Um percurso guiado de autoconhecimento: nove análises que se conectam, reflexão diária e uma síntese chamada Dossiê de Vida.",
    sections: [
      [
        "As nove análises",
        "Linguagem corporal (traços), temperamento, linguagens do amor, roda da vida, mapa numerológico, ciclos, numerologia diária, experiência diária e dossiê.",
        "No aplicativo autenticado, a trilha organiza esses passos para você avançar no seu ritmo.",
      ],
      [
        "Para quem é",
        "Para quem quer clareza sobre padrões, ciclos e características pessoais sem precisar dominar cada modelo de antemão.",
        "As experiências são guiadas; você responde, registra e recebe leituras organizadas.",
      ],
      [
        "Começar",
        "Conheça os planos vigentes e, após o acesso, entre com seu e-mail e senha.",
        "Enquanto explora, use a Biblioteca do Autoconhecimento para se aprofundar nos conceitos.",
      ],
    ],
    cta: { href: "/planos", label: "Ver planos e acesso" },
  },
  ComoFuncionaPage: {
    path: "/como-funciona",
    h1: "Como funciona o Portal Iluminando",
    lead: "Do primeiro acesso ao Dossiê de Vida: um caminho claro, no seu ritmo.",
    sections: [
      [
        "1. Entre no Portal",
        "Cadastre-se conforme o fluxo comercial vigente e confirme o pagamento para liberar o acesso.",
        "Você utiliza e-mail e senha para entrar na área da jornada.",
      ],
      [
        "2. Percorra as análises",
        "Responda questionários, envie o que for solicitado em cada módulo e explore seu mapa pessoal.",
        "Não é necessário fazer tudo de uma vez.",
      ],
      [
        "3. Conecte e continue",
        "No Dossiê de Vida, as peças se cruzam. Na reflexão diária, a consciência vira hábito.",
        "Missões e registros sustentam a continuidade durante o período de acesso.",
      ],
    ],
  },
  ContatoPage: {
    path: "/contato",
    type: "ContactPage",
    h1: "Contato",
    lead: "Fale com o Portal Iluminando pelo e-mail de suporte.",
    sections: [
      [
        "E-mail",
        "Escreva para contato@portaliluminando.com.br com dúvidas sobre acesso, pagamento ou a jornada.",
        "Não envie dados sensíveis desnecessários. Nunca pediremos senha por e-mail.",
      ],
      [
        "Conteúdo público",
        "Para entender o produto antes de escrever, veja Sobre, Metodologia, FAQ e a Biblioteca.",
        "Áreas logadas e resultados individuais não são discutidos em páginas públicas.",
      ],
    ],
  },
  PlanosPage: {
    path: "/planos",
    h1: "Planos e acesso",
    lead:
      "Condições comerciais vigentes da edição Membros Fundadores: acesso à Jornada Da Sombra à Luz com as análises e experiências do Portal.",
    sections: [
      [
        "O que está incluso",
        "Acesso à Jornada Da Sombra à Luz, análises de autoconhecimento, reflexão diária e síntese no Dossiê de Vida, conforme oferta vigente.",
        "Detalhes de preço e parcelamento acompanham a landing e o checkout oficiais do Portal.",
      ],
      [
        "Duração e garantia",
        "A oferta de fundadores contempla meses de acesso definidos na oferta vigente, com política de garantia conforme regras comerciais publicadas no fluxo de compra.",
        "Valores exatos e formas de pagamento são os exibidos no momento da contratação — sincronizados com a configuração do produto.",
      ],
      [
        "Próximo passo",
        "Comece pela página inicial ou pela VSL, conclua o cadastro e o pagamento. Depois, entre com seu e-mail e senha.",
        "Dúvidas: contato@portaliluminando.com.br.",
      ],
    ],
    cta: { href: "/", label: "Ir para a página inicial" },
  },
  GuiaPage: {
    path: "/guia",
    h1: "Guia do Portal Iluminando",
    lead: "Mapa rápido para navegar conteúdo público e a jornada autenticada.",
    sections: [
      [
        "Conteúdo aberto",
        "Use Sobre, Metodologia, Análises, Biblioteca, Glossário e FAQ para compreender conceitos sem login.",
        "Essas páginas existem para humanos, buscadores e assistentes de IA.",
      ],
      [
        "Área logada",
        "Após o acesso, /jornada reúne a trilha. Resultados, dossiês e comunidade permanecem privados e fora do sitemap.",
        "Não compartilhe senhas nem prints sensíveis publicamente.",
      ],
    ],
  },
};

for (const [name, cfg] of Object.entries(pages)) {
  const sectionsJsx = cfg.sections
    .map(
      ([h, ...paras]) => `
        <section className="mt-10">
          <h2 className="text-2xl text-[#c8a56b]">${h.replace(/`/g, "\\`")}</h2>
          ${paras.map((p) => `<p className="mt-3 leading-relaxed text-[rgba(247,242,236,0.8)]">${p.replace(/`/g, "\\`").replace(/\$/g, "\\$")}</p>`).join("\n")}
        </section>`,
    )
    .join("\n");

  const cta = cfg.cta
    ? `<Link href="${cfg.cta.href}" className="mt-10 inline-block rounded-md bg-[#c8a56b] px-5 py-2.5 font-medium text-[#1e1812]">${cfg.cta.label}</Link>`
    : "";

  const code = `import { Link } from "wouter";
import PublicShell from "@/components/public/PublicShell";
import { SITE_NAME } from "@/lib/seo";

export default function ${name}() {
  const path = "${cfg.path}";
  const title = \`${cfg.h1} | \${SITE_NAME}\`;
  const description = ${JSON.stringify(cfg.lead)};
  return (
    <PublicShell
      pagePath={path}
      pageTitle={title}
      pageDescription={description}
      pageType={"${cfg.type || "WebPage}"}
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: ${JSON.stringify(cfg.h1)}, path },
      ]}
    >
      <article>
        <h1 className="text-3xl font-semibold md:text-4xl">${cfg.h1}</h1>
        <p className="mt-4 text-lg text-[rgba(247,242,236,0.85)]">${cfg.lead}</p>
        ${sectionsJsx}
        ${cta}
      </article>
    </PublicShell>
  );
}
`;
  // fix pageType typo risk
  const fixed = code.replace('pageType={"WebPage}', 'pageType={"WebPage"}').replace(
    `pageType={"${cfg.type || "WebPage}"}`,
    `pageType={"${cfg.type || "WebPage"}"}`,
  );
  fs.writeFileSync(path.join(dir, `${name}.tsx`), fixed, "utf8");
}

console.log("public pages", Object.keys(pages).length);
