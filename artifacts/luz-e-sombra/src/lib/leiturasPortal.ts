import { comporLeitura, type LeituraPortal, type PecaLeitura } from "@workspace/copy-voz";

function item(rotulo: string, texto?: string | null): PecaLeitura | null {
  const t = (texto ?? "").trim();
  return t ? { rotulo, texto: t } : null;
}

function lista(...partes: Array<PecaLeitura | readonly PecaLeitura[] | null | undefined>): PecaLeitura[] {
  const out: PecaLeitura[] = [];
  for (const parte of partes) {
    if (!parte) continue;
    const itens = Array.isArray(parte) ? parte : [parte];
    for (const peca of itens) {
      if (typeof peca === "string") {
        if (peca.trim()) out.push(peca.trim());
      } else if (peca.texto?.trim()) {
        out.push({ rotulo: peca.rotulo, texto: peca.texto.trim() });
      }
    }
  }
  return out;
}

function ou(partes: PecaLeitura[], fallback: string): PecaLeitura | PecaLeitura[] {
  return partes.length ? partes : fallback;
}

function comTitulo(rotulo: string, textos: Array<string | null | undefined>): PecaLeitura[] {
  const limpos = textos.map((t) => (t ?? "").trim()).filter(Boolean);
  return limpos.map((texto, i) => (i === 0 ? { rotulo, texto } : texto));
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
    quemVoceE: lista(
      item("Essência", perfil.essencia),
      item("O retrato", perfil.descricao),
      item("A missão", perfil.missao),
    ),
    noDiaADia: ou(
      lista(item("No trabalho", perfil.carreira), item("Nas relações", perfil.relacionamentos)),
      "Olhe para o trabalho e para as relações desta semana e veja onde esse número aparece.",
    ),
    sombra: ou(
      lista(item("O excesso", perfil.sombra), comTitulo("O que pede cuidado", perfil.desafios ?? [])),
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
    comTitulo(sec.titulo?.trim() || "A leitura", sec.paragrafos ?? []),
  );
  return comporLeitura({
    quemVoceE: lista(item("O retrato", r.portraitIdentidade), item("Em uma frase", r.sinteseHumana), analise),
    noDiaADia: ou(
      lista(
        item("O que marca você", r.tracosMarcantes?.length ? r.tracosMarcantes.join(" · ") : ""),
        item("Os dois juntos", r.comboNarrativa),
        item("A força da combinação", r.combo?.forca),
        item("Onde isso aparece", r.combo?.contexto),
      ),
      "Repare no ritmo com que você entra nas conversas e nas tarefas de hoje.",
    ),
    sombra: ou(
      lista(item("O ponto cego", r.pontoCego), item("A tensão", r.combo?.tensao)),
      "O ponto cego é o talento usado no automático, quando você não percebe o efeito nos outros.",
    ),
    oQueFazer: ou(
      lista(item("O passo", r.passoPratico), r.perguntaCrescimento),
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
    quemVoceE: lista(
      narr.veredito,
      item("Por onde isso começa", narr.abertura),
      item("Como funciona", narr.mecanismo),
      item("Vocês dois", narr.dinamicaPar),
    ),
    noDiaADia: ou(
      lista(comTitulo("Uma cena", cenas), item("Como você expressa", narr.espelhoExpressar), item("Como pedir", narr.ponteComunicacao)),
      "Pense na última vez em que você se sentiu amada ou invisível. A forma importa tanto quanto a intenção.",
    ),
    sombra: ou(
      lista(item("A ferida", narr.feridaPadrao), item("O que não alcança", narr.linguagemAnti)),
      "A sombra é esperar que o outro adivinhe a linguagem que te alcança.",
    ),
    oQueFazer: ou(
      lista(narr.planoSeteDias, item("A carta", narr.cartaParceiro)),
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
    noDiaADia: ordenadas.map((a) => ({
      rotulo: `${a.titulo} · ${a.valor}/10`,
      texto: primeiraFrase(a.interpretacao),
    })),
    sombra: foco.map((a) => {
      const frase = primeiraFrase(a.interpretacao);
      const resto = a.interpretacao.slice(frase.length).trim();
      return { rotulo: a.titulo, texto: resto || `${a.titulo} pede atenção.` };
    }),
    oQueFazer: foco.map((a) => ({ rotulo: a.titulo, texto: a.acao })),
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
  const quem = lista(item("A síntese", dossie.sinteseIdentidade), item("A assinatura", dossie.assinaturaIntegrada));
  return comporLeitura({
    quemVoceE: quem.length ? quem : (dossie.panoramaFuncional || "Este retrato junta o que os seus testes mostram."),
    noDiaADia: ou(
      lista(item("O panorama", dossie.panoramaFuncional), comTitulo("O que se destaca", dossie.pontosChave ?? [])),
      "Olhe para esta semana e veja em qual área da vida esse retrato apareceu de verdade.",
    ),
    sombra: dossie.perguntaCentral
      || "A sombra do dossiê é usar o mapa para se cobrar, em vez de se entender.",
    oQueFazer: ou(
      lista(dossie.acoesPrioritarias),
      "Escolha uma ação desta leitura e coloque na agenda de amanhã.",
    ),
  });
}
