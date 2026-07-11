/** Raiz da trilha de jornada (hub de módulos). */
export const JORNADA_ROOT = "/jornada";

/** Rotas e labels de voltar por módulo da jornada. */
export const JORNADA_MODULE_NAV = {
  temperamento: { hub: "/jornada/temperamento", backLabel: "Temperamento" },
  "linguagens-amor": { hub: "/jornada/linguagens-amor", backLabel: "Linguagens do amor" },
  traco: { hub: "/jornada/traco", backLabel: "Traço de Caráter" },
  roda: { hub: "/jornada/roda", backLabel: "Roda da Vida" },
  numerologia: { hub: "/jornada/numerologia", backLabel: "Numerologia" },
} as const;

export type JornadaModuleSlug = keyof typeof JORNADA_MODULE_NAV;

/** Textos e rotas auxiliares por módulo da jornada (hub). */
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
    introFallback:
      "Entenda como o seu corpo revela padrões de caráter. Reich, Lowen e a leitura integrada com o questionário emocional.",
    introTexto: [
      "O Traço de Caráter combina leitura corporal com um diagnóstico emocional profundo. Inspirado nas obras de Wilhelm Reich e Alexander Lowen, a análise observa como você ocupa o espaço, sustenta tensões e expressa emoções pelo corpo — padrões que muitas vezes operam no automático.",
      "Você enviará fotos seguindo orientações simples e responderá a um questionário emocional estruturado. As duas leituras se cruzam para revelar traços de caráter, bloqueios recorrentes e caminhos de transformação com mais consciência.",
      "Reserve cerca de 20 a 30 minutos em um lugar calmo. Ao final, seu relatório fica guardado aqui e pode ser refeito quando quiser aprofundar.",
    ],
    introBullets: [
      "Padrões corporais ligados a Reich e Lowen",
      "Cruzamento entre leitura visual e questionário emocional",
      "Relatório personalizado com insights acionáveis",
    ],
    analiseTitulo: "Análise do Traço de Caráter",
    analiseDescricaoSem: "Envie suas fotos e responda ao diagnóstico emocional. Leva cerca de 20–30 minutos.",
    analiseDescricaoCom: "Sua leitura corporal e emocional já estão na conta.",
    novaAnaliseLabel: "Nova análise",
    verResultadoLabel: "Ver meu resultado",
  },
  temperamento: {
    introFallback:
      "Descubra como você pensa, age e se relaciona. Colérico, Sanguíneo, Melancólico e Fleumático em um mapa claro sobre quem você é.",
    introTexto: [
      "O temperamento é a base de como você reage ao mundo: velocidade de decisão, intensidade emocional, necessidade de rotina ou de novidade. Colérico, Sanguíneo, Melancólico e Fleumático não são rótulos — são lentes para entender seus padrões naturais.",
      "O questionário apresenta 24 pares de afirmações. Em cada um, escolha a opção que mais combina com você, sem pensar demais. O resultado mostra seu perfil dominante e secundário, com orientações práticas para relações, trabalho e autoconhecimento.",
      "Leva cerca de 5 minutos. Seja honesto consigo: não existe temperamento melhor, existe o seu mapa real.",
    ],
    introBullets: [
      "Perfil dominante e secundário entre os 4 temperamentos",
      "Como você decide, se comunica e lida com pressão",
      "Aplicação prática em relações e no dia a dia",
    ],
    analiseTitulo: "Questionário de Temperamento",
    analiseDescricaoSem: "24 escolhas entre duas opções, cerca de 5 minutos. Em cada par, escolha o que mais combina com você.",
    analiseDescricaoCom: "Seu mapa temperamental já foi gerado.",
    novaAnaliseLabel: "Refazer questionário",
    verResultadoLabel: "Ver meu perfil",
  },
  "linguagens-amor": {
    introFallback:
      "As cinco linguagens do amor, descubra como você pede afeto, como você o demonstra e o que isso muda nas suas relações.",
    introTexto: [
      "Cada pessoa dá e recebe afeto de um jeito diferente. As cinco linguagens do amor — palavras de afirmação, tempo de qualidade, presentes, atos de serviço e toque físico — ajudam a entender por que certas relações fluem e outras parecem sempre em descompasso.",
      "O questionário tem 30 escolhas rápidas: metade sobre como você prefere receber carinho, metade sobre como você naturalmente o expressa. Muitas vezes essas duas dimensões são diferentes — e saber disso muda tudo nas suas relações.",
      "Reserve alguns minutos e responda com o que você realmente sente, não com o que acha que deveria sentir. O resultado mostra suas linguagens principais e secundárias em cada dimensão.",
    ],
    introBullets: [
      "Como você prefere receber afeto e carinho",
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
      "Seus números de vida, expressão, alma e ciclos anuais revelam padrões que cruzam com o resto da sua jornada.",
    introTexto: [
      "A numerologia traduz sua data de nascimento em um mapa de padrões: número de vida (missão central), expressão (talentos naturais), alma (desejos profundos) e ciclos anuais que marcam fases de crescimento e desafio.",
      "Para gerar seu relatório, confirme a data de nascimento no seu perfil. O sistema calcula automaticamente os números e cruza com as outras análises da jornada — traço, temperamento e roda da vida — para uma visão mais integrada de quem você é.",
      "Leva poucos minutos após confirmar a data. Seu mapa fica disponível aqui e se atualiza se você ajustar a data no perfil.",
    ],
    introBullets: [
      "Números de vida, expressão, alma e ciclos pessoais",
      "Relatório baseado na sua data de nascimento",
      "Conexão com as demais análises da jornada",
    ],
    analiseTitulo: "Mapa Numerológico",
    analiseDescricaoSem:
      "Confirme a data de nascimento no perfil e gere seu relatório. Leva poucos minutos.",
    analiseDescricaoCom: "Seu mapa numerológico já está disponível com base no perfil.",
    novaAnaliseLabel: "Atualizar data no perfil",
    verResultadoLabel: "Ver meu mapa",
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
  if (slug === "roda" || slug === "numerologia") return base.split("?")[0] ?? hrefAnalise;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}ver=resultado`;
}

export function hrefNovaAnalise(
  slug: string,
  hrefAnalise: string,
  pessoaId?: number | null,
): string {
  if (slug === "numerologia") return "/perfil";
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
