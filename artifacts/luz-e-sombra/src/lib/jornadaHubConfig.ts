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
    analiseTitulo: "Análise do Traço de Caráter",
    analiseDescricaoSem: "Envie suas fotos e responda ao diagnóstico emocional. Leva cerca de 20–30 minutos.",
    analiseDescricaoCom: "Sua leitura corporal e emocional já estão na conta.",
    novaAnaliseLabel: "Nova análise",
    verResultadoLabel: "Ver meu resultado",
  },
  temperamento: {
    introFallback:
      "Descubra como você pensa, age e se relaciona. Colérico, Sanguíneo, Melancólico e Fleumático em um mapa claro sobre quem você é.",
    analiseTitulo: "Questionário de Temperamento",
    analiseDescricaoSem: "24 escolhas entre duas opções, cerca de 5 minutos. Em cada par, escolha o que mais combina com você.",
    analiseDescricaoCom: "Seu mapa temperamental já foi gerado.",
    novaAnaliseLabel: "Refazer questionário",
    verResultadoLabel: "Ver meu perfil",
  },
  "linguagens-amor": {
    introFallback:
      "As cinco linguagens do amor, descubra como você pede afeto, como você o demonstra e o que isso muda nas suas relações.",
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
    analiseTitulo: "Roda da Vida",
    analiseDescricaoSem: "Nota cada dimensão de 1 a 10. Seja honesto consigo, é só para você.",
    analiseDescricaoCom: "Sua última avaliação está guardada.",
    novaAnaliseLabel: "Nova avaliação",
    verResultadoLabel: "Ver minha roda",
  },
  numerologia: {
    introFallback:
      "Seus números de vida, expressão, alma e ciclos anuais revelam padrões que cruzam com o resto da sua jornada.",
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
