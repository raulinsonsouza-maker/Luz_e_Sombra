/** Textos e rotas auxiliares por módulo da jornada (hub). */
export const JORNADA_HUB_COPY: Record<
  string,
  {
    introFallback: string;
    analiseTitulo: string;
    analiseDescricaoSem: string;
    analiseDescricaoCom: string;
    novaAnaliseLabel: string;
    verResultadoLabel: string;
  }
> = {
  traco: {
    introFallback:
      "Entenda como o seu corpo revela padrões de caráter — Reich, Lowen e a leitura integrada com o questionário emocional.",
    analiseTitulo: "Análise do Traço de Caráter",
    analiseDescricaoSem: "Envie suas fotos e responda ao diagnóstico emocional. Leva cerca de 20–30 minutos.",
    analiseDescricaoCom: "Sua leitura corporal e emocional já estão na conta.",
    novaAnaliseLabel: "Nova análise",
    verResultadoLabel: "Ver meu resultado",
  },
  temperamento: {
    introFallback:
      "Descubra como você pensa, age e se relaciona — Colérico, Sanguíneo, Melancólico e Fleumático em um mapa claro sobre quem você é.",
    analiseTitulo: "Questionário de Temperamento",
    analiseDescricaoSem: "40 perguntas, cerca de 10 minutos. Responda com calma — não há resposta certa ou errada.",
    analiseDescricaoCom: "Seu mapa temperamental já foi gerado.",
    novaAnaliseLabel: "Refazer questionário",
    verResultadoLabel: "Ver meu perfil",
  },
  "linguagens-amor": {
    introFallback:
      "As cinco linguagens do amor — descubra como você pede afeto, como você o demonstra e o que isso muda nas suas relações.",
    analiseTitulo: "5 Linguagens do Amor",
    analiseDescricaoSem:
      "30 escolhas rápidas entre pares de preferências — metade sobre como você recebe, metade sobre como você expressa.",
    analiseDescricaoCom: "Seu perfil de receber e expressar amor já está guardado.",
    novaAnaliseLabel: "Nova análise",
    verResultadoLabel: "Ver meu perfil",
  },
  roda: {
    introFallback:
      "Avalie as 12 áreas da sua vida e veja onde você floresce — e onde merece atenção agora.",
    analiseTitulo: "Roda da Vida",
    analiseDescricaoSem: "Nota cada dimensão de 1 a 10. Seja honesto consigo — é só para você.",
    analiseDescricaoCom: "Sua última avaliação está guardada.",
    novaAnaliseLabel: "Nova avaliação",
    verResultadoLabel: "Ver minha roda",
  },
};

export function hrefVerResultado(slug: string, hrefAnalise: string): string {
  if (slug === "roda") return hrefAnalise;
  return `${hrefAnalise}?ver=resultado`;
}

export function hrefNovaAnalise(slug: string, hrefAnalise: string): string {
  if (slug === "roda") return `${hrefAnalise}?nova=1`;
  return `${hrefAnalise}?nova=1`;
}
