import { CATALOGO } from "@workspace/copy-voz";

/** Raiz da trilha de jornada (hub de módulos). */
export const JORNADA_ROOT = "/jornada";

/** Rotas e labels de voltar por módulo da jornada. */
export const JORNADA_MODULE_NAV = {
  temperamento: { hub: "/jornada/temperamento", backLabel: "Temperamento" },
  "linguagens-amor": { hub: "/jornada/linguagens-amor", backLabel: "Linguagens do amor" },
  traco: { hub: "/jornada/traco", backLabel: "Traço de Caráter" },
  roda: { hub: "/jornada/roda", backLabel: "Roda da Vida" },
  numerologia: { hub: "/jornada/numerologia", backLabel: "Numerologia" },
  dossie: { hub: "/jornada/dossie", backLabel: "Dossiê de Vida" },
} as const;

export type JornadaModuleSlug = keyof typeof JORNADA_MODULE_NAV;

/** Textos e rotas auxiliares por módulo da jornada (hub).
 * O modelo corporal do traço segue Reich e Lowen só como referência interna.
 */
export const JORNADA_HUB_COPY: Record<
  string,
  {
    introFallback: string;
    introTexto: string[];
    introBullets?: string[];
    analiseTitulo: string;
    analiseDescricaoSem: string;
    analiseDescricaoCom: string;
    novaAnaliseLabel: string;
    verResultadoLabel: string;
  }
> = {
  traco: {
    introFallback: CATALOGO.jornada.traco.introFallback,
    introTexto: [...CATALOGO.jornada.traco.introTexto],
    introBullets: [...CATALOGO.jornada.traco.introBullets],
    analiseTitulo: "Análise do Traço de Caráter",
    analiseDescricaoSem: CATALOGO.jornada.traco.analiseDescricaoSem,
    analiseDescricaoCom: "Sua leitura corporal e emocional já estão na conta.",
    novaAnaliseLabel: "Nova análise",
    verResultadoLabel: "Ver meu resultado",
  },
  temperamento: {
    introFallback:
      "Descubra como você pensa, age e se relaciona. Colérico, Sanguíneo, Melancólico e Fleumático em um mapa claro sobre quem você é.",
    introTexto: [
      "Os temperamentos são uma forma de compreender diferentes tendências do nosso comportamento. Eles ajudam a observar como costumamos reagir às situações, expressar emoções, tomar decisões, lidar com mudanças e nos relacionar com outras pessoas.",
      "Existem quatro temperamentos clássicos: Colérico, Sanguíneo, Melancólico e Fleumático. Cada um representa um conjunto de características e maneiras de funcionar. Uma pessoa pode apresentar características de mais de um temperamento, em diferentes intensidades.",
      "Nesta análise, você responderá a um questionário com 16 afirmações, escolhendo Sim ou Não de acordo com o que melhor representa seu comportamento na maior parte do tempo, e não apenas o que sente no momento.",
      "A partir das suas respostas, você conhecerá seu temperamento predominante, as características secundárias e como essas tendências podem aparecer em diferentes áreas da sua vida.",
      "Reserve cerca de 3 minutos para responder com sinceridade. Não existem respostas certas ou erradas: o objetivo é ampliar sua compreensão sobre si mesmo.",
    ],
    introBullets: [
      "Seu perfil predominante e secundário: conheça quais dos quatro temperamentos aparecem com maior intensidade nas suas respostas.",
      "Suas tendências comportamentais: compreenda aspectos relacionados à sua energia social, expressão emocional, estabilidade e maneira de reagir às situações.",
      "Uma análise para o dia a dia: explore como essas características podem se manifestar nos seus relacionamentos, no trabalho e no seu processo de autoconhecimento.",
    ],
    analiseTitulo: "Questionário de Temperamento",
    analiseDescricaoSem: "16 afirmações Sim/Não, cerca de 3 minutos. Responda com sinceridade.",
    analiseDescricaoCom: "Seu mapa temperamental já foi gerado.",
    novaAnaliseLabel: "Refazer questionário",
    verResultadoLabel: "Ver meu perfil",
  },
  "linguagens-amor": {
    introFallback:
      "As cinco linguagens do amor, descubra como você pede afeto, como você o demonstra e o que isso muda nas suas relações.",
    introTexto: [
      "Cada pessoa dá e recebe afeto de um jeito diferente. As cinco linguagens do amor — palavras de afirmação, tempo de qualidade, presentes, atos de serviço e toque físico — ajudam a entender por que certas relações fluem e outras parecem sempre em descompasso.",
      "O questionário tem 30 escolhas rápidas: metade sobre como você prefere receber afeto, metade sobre como você naturalmente o expressa. Muitas vezes essas duas dimensões são diferentes — e saber disso muda tudo nas suas relações.",
      "Reserve alguns minutos e responda com o que você realmente sente, não com o que acha que deveria sentir. O resultado mostra suas linguagens principais e secundárias em cada dimensão.",
    ],
    introBullets: [
      "Como você prefere receber afeto",
      "Como você naturalmente demonstra amor aos outros",
      "Insights para melhorar relações pessoais e familiares",
    ],
    analiseTitulo: "5 Linguagens do Amor",
    analiseDescricaoSem:
      "30 escolhas rápidas entre pares de preferências, metade sobre como você recebe, metade sobre como você expressa.",
    analiseDescricaoCom: "Seu perfil de receber e expressar amor já está guardado.",
    novaAnaliseLabel: "Nova análise",
    verResultadoLabel: "Ver meu perfil",
  },
  roda: {
    introFallback:
      "Avalie as 12 áreas da sua vida e veja onde você floresce, e onde merece atenção agora.",
    introTexto: [
      "A Roda da Vida é um raio-x honesto das 12 dimensões que compõem sua existência: saúde, carreira, finanças, relacionamentos, família, lazer, crescimento pessoal e mais. Cada área recebe uma nota de 1 a 10, criando um mapa visual do seu momento atual.",
      "O valor está na sinceridade: não existe nota certa ou errada. O objetivo é enxergar desequilíbrios — áreas que drenam energia enquanto outras prosperam — e decidir onde focar sua atenção agora.",
      "A avaliação leva poucos minutos e pode ser refeita ao longo do tempo para acompanhar sua evolução na jornada.",
    ],
    introBullets: [
      "Nota de 1 a 10 em cada uma das 12 áreas da vida",
      "Mapa visual dos seus pontos fortes e gaps",
      "Base para priorizar ações com clareza",
    ],
    analiseTitulo: "Roda da Vida",
    analiseDescricaoSem: "Nota cada dimensão de 1 a 10. Seja honesto consigo, é só para você.",
    analiseDescricaoCom: "Sua última avaliação está guardada.",
    novaAnaliseLabel: "Nova avaliação",
    verResultadoLabel: "Ver minha roda",
  },
  numerologia: {
    introFallback:
      "A numerologia usa sua data de nascimento e seu nome para interpretar os números da sua trajetória.",
    introTexto: [
      "A numerologia é uma ferramenta de autoconhecimento que utiliza sua data de nascimento e seu nome para interpretar os significados simbólicos dos números presentes na sua trajetória.",
      "A análise utiliza os dados de nascimento cadastrados no seu perfil (__DATA__). Seu Ano Pessoal começa a partir do seu aniversário, e não em 1º de janeiro.",
      "Por meio desta análise, você vai conhecer aspectos relacionados à sua personalidade, seus talentos, seus desejos e os ciclos que marcam diferentes momentos da sua vida.",
      "Seu mapa reúne diferentes números, cada um trazendo uma perspectiva sobre quem você é e sobre as experiências que podem fazer parte do seu caminho.",
      "Após confirmar seus dados, seu mapa estará disponível nesta página para você consultar sempre que quiser.",
    ],
    introBullets: [
      "Seu Caminho de Vida: compreenda os significados associados à sua trajetória e aos aprendizados que ela representa.",
      "Seu Número de Expressão: conheça os talentos, as características e as formas de expressão associadas ao seu nome.",
      "Seu Número da Alma: explore os desejos, as motivações e os aspectos mais profundos da sua essência.",
      "Seus ciclos pessoais: descubra os significados dos períodos e das fases que fazem parte da sua trajetória.",
      "Seu Ano Pessoal: conheça a energia simbólica associada ao momento que você está vivendo.",
    ],
    analiseTitulo: "Mapa Numerológico",
    analiseDescricaoSem:
      "Confirme a data de nascimento no perfil e gere seu relatório. Leva poucos minutos.",
    analiseDescricaoCom: "Seu mapa numerológico já está disponível com base no perfil.",
    novaAnaliseLabel: "Atualizar data no perfil",
    verResultadoLabel: "Sua análise está pronta",
  },
  dossie: {
    introFallback:
      "Síntese final da fase Iniciante: todas as análises cruzadas num retrato claro de como você funciona, onde trava e o que priorizar.",
    introTexto: [
      "O Dossiê de Vida é o resultado integrado da sua jornada Iniciante. Ele cruza Traço de Caráter, Temperamento, Linguagens do Amor, Roda da Vida, Numerologia e Diagnóstico Emocional em um único mapa.",
      "Não é mais uma análise isolada: é a leitura de como esses padrões se reforçam, onde divergem e o que você precisa entender sobre si para agir com clareza.",
      "Quanto mais análises você completou, mais preciso fica o cruzamento. Ao abrir seu dossiê, você vê panorama funcional, pontos-chave e ações prioritárias para este momento.",
    ],
    introBullets: [
      "Cruzamento de todas as análises da jornada",
      "Linguagem funcional: como você opera, não metáforas vagas",
      "Mapa claro do que entender e o que fazer agora",
    ],
    analiseTitulo: "Seu Dossiê Integrado",
    analiseDescricaoSem:
      "Complete pelo menos 4 análises da jornada para gerar o cruzamento. Quanto mais fontes, mais preciso o retrato.",
    analiseDescricaoCom: "Seu dossiê integrado está pronto com base nas análises concluídas.",
    novaAnaliseLabel: "Atualizar dossiê",
    verResultadoLabel: "Abrir meu dossiê",
  },
};

export function hrefComPessoa(hrefAnalise: string, pessoaId: number | null | undefined): string {
  if (pessoaId == null) return hrefAnalise;
  const sep = hrefAnalise.includes("?") ? "&" : "?";
  return `${hrefAnalise}${sep}pessoaId=${pessoaId}`;
}

export function hrefVerResultado(
  slug: string,
  hrefAnalise: string,
  pessoaId?: number | null,
): string {
  const base =
    slug === "traco" || slug === "linguagens-amor"
      ? hrefComPessoa(hrefAnalise, pessoaId ?? null)
      : hrefAnalise;
  if (slug === "roda" || slug === "numerologia" || slug === "dossie") return base.split("?")[0] ?? hrefAnalise;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}ver=resultado`;
}

export function hrefNovaAnalise(
  slug: string,
  hrefAnalise: string,
  pessoaId?: number | null,
): string {
  if (slug === "numerologia") return "/perfil";
  if (slug === "dossie") return "/quem-sou-eu?atualizar=1";
  const base =
    slug === "traco" || slug === "linguagens-amor"
      ? hrefComPessoa(hrefAnalise, pessoaId ?? null)
      : hrefAnalise;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}nova=1`;
}

export function hrefIniciarAnalise(
  slug: string,
  hrefAnalise: string,
  pessoaId?: number | null,
): string {
  if (slug === "traco" || slug === "linguagens-amor") {
    return hrefComPessoa(hrefAnalise, pessoaId ?? null);
  }
  return hrefAnalise;
}
