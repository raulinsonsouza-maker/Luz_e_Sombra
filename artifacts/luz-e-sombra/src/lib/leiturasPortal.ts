import { comporLeitura, type LeituraPortal } from "@workspace/copy-voz";

function pedacos(...partes: Array<string | readonly string[] | null | undefined>): string[] {
  const out: string[] = [];
  for (const parte of partes) {
    if (!parte) continue;
    const lista = Array.isArray(parte) ? parte : [parte];
    for (const item of lista) {
      const texto = item?.trim();
      if (texto) out.push(texto);
    }
  }
  return out;
}

function ou(partes: string[], fallback: string): string | string[] {
  return partes.length ? partes : fallback;
}

type PerfilNumero = {
  essencia?: string;
  descricao?: string;
  missao?: string;
  carreira?: string;
  relacionamentos?: string;
  sombra?: string;
  afirmacao?: string;
  desafios?: string[];
};

export function leituraNumerologia(perfil: PerfilNumero | null | undefined): LeituraPortal | null {
  if (!perfil?.essencia && !perfil?.descricao) return null;
  return comporLeitura({
    quemVoceE: pedacos(perfil.essencia, perfil.descricao, perfil.missao),
    noDiaADia: ou(
      pedacos(perfil.carreira, perfil.relacionamentos),
      "Olhe para o trabalho e para as relações desta semana e veja onde esse número aparece.",
    ),
    sombra: ou(
      pedacos(perfil.sombra, perfil.desafios),
      "A sombra deste número é o excesso do próprio talento, quando ele vira hábito sem consciência.",
    ),
    oQueFazer: perfil.afirmacao
      || "Escolha uma situação de hoje e aja um pouco mais perto do que este número pede, em um gesto só.",
  });
}


type TemperamentoUi = {
  sinteseHumana?: string;
  portraitIdentidade?: string;
  tracosMarcantes?: string[];
  pontoCego?: string;
  passoPratico?: string;
  perguntaCrescimento?: string;
  comboNarrativa?: string;
  combo?: { forca?: string; tensao?: string; contexto?: string };
  analiseAprofundada?: Array<{ titulo?: string; paragrafos?: string[] }>;
};

export function leituraTemperamento(r: TemperamentoUi | null | undefined): LeituraPortal | null {
  if (!r?.sinteseHumana && !r?.portraitIdentidade && !r?.analiseAprofundada?.length) return null;
  const analise = (r.analiseAprofundada ?? []).flatMap((sec) =>
    [sec.titulo, ...(sec.paragrafos ?? [])].filter((p): p is string => Boolean(p?.trim())),
  );
  return comporLeitura({
    quemVoceE: pedacos(r.portraitIdentidade, r.sinteseHumana, analise),
    noDiaADia: ou(
      pedacos(
        r.tracosMarcantes?.length ? r.tracosMarcantes.join(" · ") : "",
        r.comboNarrativa,
        r.combo?.forca,
        r.combo?.contexto,
      ),
      "Repare no ritmo com que você entra nas conversas e nas tarefas de hoje.",
    ),
    sombra: ou(
      pedacos(r.pontoCego, r.combo?.tensao),
      "O ponto cego é o talento usado no automático, quando você não percebe o efeito nos outros.",
    ),
    oQueFazer: ou(
      pedacos(r.passoPratico, r.perguntaCrescimento),
      "Faça uma pausa de um minuto antes da próxima decisão apressada.",
    ),
  });
}

type NarrativaAmor = {
  veredito?: string;
  abertura?: string;
  cenas?: string | string[];
  mecanismo?: string;
  feridaPadrao?: string;
  planoSeteDias?: string[];
  dinamicaPar?: string;
  cartaParceiro?: string;
  linguagemAnti?: string;
  espelhoExpressar?: string;
  ponteComunicacao?: string;
};

export function leituraLinguagens(narr: NarrativaAmor | null | undefined): LeituraPortal | null {
  if (!narr?.veredito && !narr?.abertura) return null;
  const cenas = Array.isArray(narr.cenas) ? narr.cenas : narr.cenas ? [narr.cenas] : [];
  return comporLeitura({
    quemVoceE: pedacos(narr.veredito, narr.abertura, narr.mecanismo, narr.dinamicaPar),
    noDiaADia: ou(
      pedacos(cenas, narr.espelhoExpressar, narr.ponteComunicacao),
      "Pense na última vez em que você se sentiu amada ou invisível. A forma importa tanto quanto a intenção.",
    ),
    sombra: ou(
      pedacos(narr.feridaPadrao, narr.linguagemAnti),
      "A sombra é esperar que o outro adivinhe a linguagem que te alcança.",
    ),
    oQueFazer: ou(
      pedacos(narr.planoSeteDias, narr.cartaParceiro),
      "Diga a uma pessoa próxima, em uma frase, o que faz você se sentir amada.",
    ),
  });
}

export function leituraRoda(
  areas: Array<{ titulo: string; interpretacao: string; acao: string; valor: number }>,
): LeituraPortal | null {
  if (areas.length === 0) return null;
  const ordenadas = [...areas].sort((a, b) => a.valor - b.valor);
  const fracas = ordenadas.filter((a) => a.valor <= 5);
  const foco = (fracas.length ? fracas : ordenadas).slice(0, 4);
  const primeiraFrase = (texto: string) => {
    const corte = texto.match(/^(.+?[.!?])(?:\s|$)/);
    return (corte?.[1] ?? texto).trim();
  };
  return comporLeitura({
    quemVoceE: "Sua roda mostra onde a vida está mais cheia e onde pede cuidado. A média não conta a história inteira. As áreas falam.",
    noDiaADia: ordenadas.map((a) => `${a.titulo} (${a.valor}/10): ${primeiraFrase(a.interpretacao)}`),
    sombra: foco.map((a) => {
      const frase = primeiraFrase(a.interpretacao);
      const resto = a.interpretacao.slice(frase.length).trim();
      return resto ? `${a.titulo} pede atenção. ${resto}` : `${a.titulo} pede atenção.`;
    }),
    oQueFazer: foco.map((a) => `${a.titulo}: ${a.acao}`),
  });
}

export function leituraDossie(dossie: {
  sinteseIdentidade?: string | null;
  panoramaFuncional?: string | null;
  assinaturaIntegrada?: string | null;
  pontosChave?: string[];
  acoesPrioritarias?: string[];
  perguntaCentral?: string | null;
} | null): LeituraPortal | null {
  if (!dossie?.sinteseIdentidade && !dossie?.panoramaFuncional) return null;
  return comporLeitura({
    quemVoceE: pedacos(dossie.sinteseIdentidade, dossie.assinaturaIntegrada),
    noDiaADia: ou(
      pedacos(dossie.panoramaFuncional, dossie.pontosChave),
      "Olhe para esta semana e veja em qual área da vida esse retrato apareceu de verdade.",
    ),
    sombra: dossie.perguntaCentral
      || "A sombra do dossiê é usar o mapa para se cobrar, em vez de se entender.",
    oQueFazer: ou(
      pedacos(dossie.acoesPrioritarias),
      "Escolha uma ação desta leitura e coloque na agenda de amanhã.",
    ),
  });
}
