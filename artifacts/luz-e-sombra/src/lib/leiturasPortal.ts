import { comporLeitura, type LeituraPortal, type PecaLeitura } from "@workspace/copy-voz";
import { montarLeituraDaCombinacao, type TemperamentoCodigo } from "@workspace/temperamento-v1";

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
  arquetipo?: string;
  titulo?: string;
  essencia?: string;
  descricao?: string;
  missao?: string;
  carreira?: string;
  relacionamentos?: string;
  sombra?: string;
  afirmacao?: string;
  desafios?: string[];
  praticas?: string[];
};

function listaNatural(itens: string[]): string {
  const nomes = itens.map((item) => item.trim().replace(/^\w/, (letra) => letra.toLowerCase())).filter(Boolean);
  if (nomes.length <= 1) return nomes[0] ?? "";
  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}

/** Leitura do mês pessoal. Não usa o retrato de identidade. */
export function leituraDoMes(mes: {
  descricao?: string;
  profundidade?: string;
  reflexao?: string;
  acoes?: string[];
  evitar?: string[];
  areas?: string[];
  sombra?: string;
  clima?: string;
  carreira?: string;
  relacoes?: string;
  saude?: string;
} | null | undefined): LeituraPortal | null {
  if (!mes?.descricao && !mes?.profundidade) return null;
  const onde = listaNatural(mes.areas ?? []);
  const pergunta = (mes.reflexao ?? "").replace(/^["“]|["”]$/g, "").trim();
  return comporLeitura(
    {
      quemVoceE: lista(mes.descricao, mes.profundidade),
      noDiaADia: ou(
        lista(
          item("No trabalho e nas metas", mes.carreira),
          item("Nas relações", mes.relacoes),
          item("No corpo e na rotina", mes.saude),
          onde ? { rotulo: "Olhe primeiro para", texto: `${onde}.` } : null,
          item("Clima do mês", mes.clima),
        ),
        "Repare em qual parte deste mês esse convite aparece com mais força.",
      ),
      sombra: ou(
        lista(
          item("O excesso deste mês", mes.sombra),
          comTitulo("Evite", mes.evitar ?? []),
        ),
        "O peso deste mês é forçar um gesto quando o momento pede outro.",
      ),
      oQueFazer: ou(
        lista(
          comTitulo("Gestos do mês", mes.acoes ?? []),
          pergunta ? { rotulo: "Para pensar", texto: pergunta } : null,
        ),
        "Escolha um gesto pequeno desta leitura e faça ainda neste mês.",
      ),
    },
    {
      quemVoceE: "O mês",
      noDiaADia: "Onde olhar",
      sombra: "O que pesa",
      oQueFazer: "O que fazer",
    },
  );
}

/** Leitura do Ano Pessoal: mais densa, com áreas da vida. */
export function leituraAnoPessoal(ano: {
  titulo?: string;
  essencia?: string;
  descricao?: string;
  detalhado?: string;
  temas?: {
    carreira?: string;
    financas?: string;
    relacionamentos?: string;
    saude?: string;
    desenvolvimento?: string;
    espiritualidade?: string;
  };
  desafios?: string[];
  areasDeAtencao?: string[];
  praticasSugeridas?: string[];
  afirmacoes?: string[];
} | null | undefined): LeituraPortal | null {
  if (!ano?.essencia && !ano?.descricao) return null;
  const t = ano.temas ?? {};
  return comporLeitura(
    {
      quemVoceE: lista(
        ano.essencia,
        ano.descricao,
        item("O chamado deste ciclo", ano.detalhado),
      ),
      noDiaADia: ou(
        lista(
          item("Carreira e vocação", t.carreira),
          item("Finanças", t.financas),
          item("Relações", t.relacionamentos),
          item("Corpo e saúde", t.saude),
          item("Desenvolvimento", t.desenvolvimento),
          item("Espiritualidade", t.espiritualidade),
        ),
        "Olhe para trabalho, dinheiro, vínculos e corpo. O ano toca os quatro.",
      ),
      sombra: ou(
        lista(
          comTitulo("Desafios do ciclo", ano.desafios ?? []),
          comTitulo("Áreas de atenção", ano.areasDeAtencao ?? []),
        ),
        "A sombra deste ano é forçar o ritmo de outro número do ciclo.",
      ),
      oQueFazer: ou(
        lista(
          comTitulo("Práticas do ano", ano.praticasSugeridas ?? []),
          ...(ano.afirmacoes ?? []).map((a) => ({ rotulo: "Para lembrar", texto: a })),
        ),
        "Escolha um gesto alinhado a este ciclo e sustente por 90 dias.",
      ),
    },
    {
      quemVoceE: "O clima do seu ano",
      noDiaADia: "Como isso aparece na vida",
      sombra: "O que pesa",
      oQueFazer: "O que fazer com o ciclo",
    },
  );
}

export function leituraNumerologia(perfil: PerfilNumero | null | undefined): LeituraPortal | null {
  if (!perfil?.essencia && !perfil?.descricao) return null;

  const abertura = perfil.arquetipo
    ? `Você carrega a vibração de ${perfil.arquetipo}.`
    : perfil.titulo
      ? `${perfil.titulo}.`
      : null;

  return comporLeitura(
    {
      quemVoceE: lista(
        abertura,
        perfil.essencia,
        item("O chamado desta vibração", perfil.missao),
      ),
      noDiaADia: ou(
        lista(
          item("Como essa energia se mostra", perfil.descricao),
          item("No trabalho e na vocação", perfil.carreira),
          item("Nas relações", perfil.relacionamentos),
        ),
        "Olhe para o trabalho e para as relações desta semana e veja onde esse número aparece.",
      ),
      sombra: ou(
        lista(
          item("Quando passa do ponto", perfil.sombra),
          comTitulo("Sinais de atenção", (perfil.desafios ?? []).slice(0, 4)),
        ),
        "A sombra deste número é o excesso do próprio talento, quando ele vira hábito sem consciência.",
      ),
      oQueFazer: ou(
        lista(
          item("Para lembrar", perfil.afirmacao),
          ...(perfil.praticas ?? []),
        ),
        "Escolha uma situação de hoje e aja um pouco mais perto do que este número pede, em um gesto só.",
      ),
    },
    {
      quemVoceE: "Quem você é",
      noDiaADia: "Como isso aparece na vida",
      sombra: "Quando passa do ponto",
      oQueFazer: "O que fazer com isso",
    },
  );
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
  analiseAprofundada?: Array<{ id?: string; titulo?: string; paragrafos?: string[] }>;
  perfil?: { primario?: TemperamentoCodigo; secundario?: TemperamentoCodigo };
  scores?: { temperamentos_percentuais?: Partial<Record<TemperamentoCodigo, number>> };
};

function textosDaAnalise(r: TemperamentoUi, ids: string[]): string[] {
  return (r.analiseAprofundada ?? [])
    .filter((sec) => sec.id && ids.includes(sec.id))
    .flatMap((sec) => sec.paragrafos ?? [])
    .map((texto) => texto.trim())
    .filter(Boolean);
}

export function leituraTemperamento(r: TemperamentoUi | null | undefined): LeituraPortal | null {
  const primaria = r?.perfil?.primario;
  const secundaria = r?.perfil?.secundario;
  const percentuais = r?.scores?.temperamentos_percentuais;
  if (primaria && secundaria && percentuais && primaria !== secundaria) {
    const cheios = {
      COLERICO: percentuais.COLERICO ?? 0,
      SANGUINEO: percentuais.SANGUINEO ?? 0,
      MELANCOLICO: percentuais.MELANCOLICO ?? 0,
      FLEUMATICO: percentuais.FLEUMATICO ?? 0,
    };
    const profunda = montarLeituraDaCombinacao({
      primario: primaria,
      secundario: secundaria,
      percentuais: cheios,
    });
    return comporLeitura(
      {
        quemVoceE: lista(item("No começo", profunda.chega), item("O que você precisa", profunda.precisa)),
        noDiaADia: lista(item("Na sequência", profunda.depois), item("Em alguns dias", profunda.disputa)),
        sombra: lista(item("Na prática", profunda.atrapalha), item("Se continuar", profunda.pressao)),
        oQueFazer: lista(...profunda.passos, profunda.pergunta),
      },
      {
        quemVoceE: "O que você faz primeiro",
        noDiaADia: "O que acontece depois",
        sombra: "Onde isso atrapalha",
        oQueFazer: "Exercícios para a vida",
      },
    );
  }
  if (!r?.sinteseHumana && !r?.portraitIdentidade && !r?.analiseAprofundada?.length) return null;
  const passos = textosDaAnalise(r, ["crescimento"])
    .filter((texto) => /^\d+\./.test(texto))
    .map((texto) => texto.replace(/^\d+\.\s*/, ""));
  const pergunta =
    (r.perguntaCrescimento?.includes("?") ? r.perguntaCrescimento : "") ||
    r.passoPratico?.match(/Pergunta prática:\s*[«"]([^»"]+)[»"]/)?.[1] ||
    "";
  return comporLeitura(
    {
      quemVoceE: lista(r.portraitIdentidade, r.sinteseHumana, r.comboNarrativa),
      noDiaADia: ou(
        lista(...textosDaAnalise(r, ["reacao", "relacoes", "trabalho", "decisao"])),
        "Repare como você entra numa conversa e como você começa uma tarefa.",
      ),
      sombra: ou(
        lista(...textosDaAnalise(r, ["sombra"]), r.pontoCego),
        "O exagero é o seu talento no automático, quando você não percebe o efeito nos outros.",
      ),
      oQueFazer: ou(
        lista(...passos, pergunta),
        "Escolha um passo pequeno desta semana e faça até o fim.",
      ),
    },
    {
      quemVoceE: "Seu temperamento",
      noDiaADia: "No dia a dia",
      sombra: "Quando essas tendências atrapalham",
      oQueFazer: "O que observar",
    },
  );
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
  return comporLeitura(
    {
      quemVoceE: lista(
        narr.veredito,
        item("Como você gosta de receber", narr.abertura),
        item("O que isso significa", narr.mecanismo),
        item("Nas relações", narr.dinamicaPar),
      ),
      noDiaADia: ou(
        lista(
          comTitulo("No cotidiano", cenas),
          item("Como você demonstra amor", narr.espelhoExpressar),
          item("Para conversar", narr.ponteComunicacao),
        ),
        "Pense na última vez em que você se sentiu amado ou distante. A forma do gesto importa tanto quanto a intenção.",
      ),
      sombra: ou(
        lista(
          item("Quando falta o que você precisa", narr.feridaPadrao),
          item("O que alcança menos hoje", narr.linguagemAnti),
        ),
        "Um ponto de atenção é esperar que a outra pessoa adivinhe a maneira que mais te alcança.",
      ),
      oQueFazer: ou(
        lista(narr.planoSeteDias, item("Para quem te ama", narr.cartaParceiro)),
        "Diga a uma pessoa próxima, em uma frase, o que faz você se sentir amado.",
      ),
    },
    {
      quemVoceE: "Como você gosta de receber amor",
      noDiaADia: "Como isso aparece no dia a dia",
      sombra: "Quando as diferenças aparecem",
      oQueFazer: "Exercícios para a vida",
    },
  );
}

type AreaRoda = { titulo: string; interpretacao: string; acao: string; valor: number };

function prosa(titulo: string): string {
  return titulo.trim().toLowerCase();
}

function juntaTitulos(itens: Array<{ titulo: string }>): string {
  return listaNatural(itens.map((a) => prosa(a.titulo)));
}

function chaveDe(itens: Array<{ titulo: string }>): string {
  return itens.map((a) => a.titulo.toLowerCase()).join(" ");
}

function ehAlegria(chave: string): boolean {
  return /plenitude|criatividade|diversão|hobby|alegria/.test(chave);
}

function ehVinculo(chave: string): boolean {
  return /social|amoroso|família|familia/.test(chave);
}

function ehMente(chave: string): boolean {
  return /intelectual|emocional|espiritualidade/.test(chave);
}

/** Abertura humana: o que a roda está dizendo, sem relatório de notas. */
function aberturaDaRoda(foco: AreaRoda[], apoios: AreaRoda[], amplitude: number): string {
  const focoChave = chaveDe(foco);
  const apoioChave = chaveDe(apoios);

  if (ehAlegria(focoChave) && ehVinculo(apoioChave) && ehMente(apoioChave)) {
    return "Você tem gente, amor e uma mente viva. O que ainda falta não é conquista. É alegria simples: o tipo que não espera a vida ficar pronta para aparecer.";
  }
  if (ehAlegria(focoChave) && ehVinculo(apoioChave)) {
    return "Tem gente perto, e mesmo assim a leveza ainda parece distante. Relação boa não substitui o prazer de estar vivo no próprio dia.";
  }
  if (ehAlegria(focoChave) && ehMente(apoioChave)) {
    return "Sua cabeça anda longe, e o prazer de viver ainda fica para depois. Entender a vida não é o mesmo que senti-la.";
  }
  if (ehVinculo(focoChave) && ehMente(apoioChave)) {
    return "Por dentro você se segura, mas os vínculos pedem presença agora. Crescer sozinho deixa um buraco que nenhuma conquista fecha.";
  }
  if (amplitude >= 5) {
    return "Uma parte da sua vida puxa para frente. Outra ainda segura o freio. O número do meio não conta essa história.";
  }
  if (amplitude <= 2) {
    return "Sua roda está mais parecida consigo mesma. Agora o trabalho não é apagar fogo. É escolher, com carinho, onde aprofundar.";
  }
  return "O que está alto te sustenta. O que está baixo mostra o próximo cuidado. Olhe os dois sem apagar nenhum.";
}

function cenaDaArea(area: AreaRoda): string {
  const t = area.titulo.toLowerCase();
  const baixa = area.valor <= 5;

  if (/plenitude|felicidade/.test(t)) {
    return baixa
      ? "A alegria ainda chega aos poucos. Tem dia em que a vida parece leve, e tem dia em que a satisfação só aparece se algo lá fora mudar primeiro. Esperar a vida ficar pronta para então ser feliz é uma espera que se alonga."
      : "A plenitude já visita a sua casa. O convite agora é deixá-la ficar sem exigir motivo grande.";
  }
  if (/criatividade|hobby|diversão/.test(t)) {
    return baixa
      ? "Brincar, criar e descansar ainda entram como prêmio depois da obrigação. A parte sua que gosta de jogar e inventar fica esperando sobrar tempo, e tempo quase nunca sobra sozinho."
      : "Você ainda guarda espaço para criar e se divertir. Isso alimenta o resto da vida de um jeito que trabalho sozinho não alcança.";
  }
  if (/social/.test(t)) {
    return "Nas amizades e no pertencimento, você cultiva gente de verdade. Isso segura o coração nos dias difíceis.";
  }
  if (/amoroso/.test(t)) {
    return "No amor, há parceria e crescimento. Esse vínculo é chão, não enfeite.";
  }
  if (/intelectual/.test(t)) {
    return "Sua mente está viva, curiosa, em movimento. Aprender ainda te anima.";
  }
  if (/emocional/.test(t)) {
    return "Você sente com profundidade e ainda consegue voltar ao centro. Isso é maturidade rara.";
  }
  if (/espiritualidade/.test(t)) {
    return "Há uma âncora interior que te liga a algo maior. Nos dias apertados, isso importa.";
  }
  if (/saúde|disposição/.test(t)) {
    return baixa
      ? "O corpo pede mais cuidado do que tem recebido. Energia, sono e movimento não são detalhe."
      : "O corpo anda razoável. Ainda dá para tratá-lo com mais carinho, sem drama.";
  }
  if (/família/.test(t)) {
    return baixa
      ? "A família pesa. Há distância ou ferida pedindo conversa honesta, no seu tempo."
      : "A família segura, mesmo quando pede mais proximidade e verdade.";
  }
  if (/propósito|realização/.test(t)) {
    return baixa
      ? "A direção da vida ainda parece nublada. Falta um fio que una o que você faz com o que importa de verdade."
      : "Há sentido na maior parte dos dias. Ainda existe uma expressão mais sua esperando coragem.";
  }
  if (/financeiros|financeiro/.test(t)) {
    return baixa
      ? "O dinheiro ainda gera ruído. Clareza e um plano simples já aliviam mais do que parecer forte."
      : "Financeiramente você se segura. O próximo passo é construir com mais intenção, não só administrar.";
  }
  if (/contribuição/.test(t)) {
    return baixa
      ? "O mundo lá fora ainda espera um gesto seu com mais constância."
      : "Você já contribui. Dá para alinhar melhor o que sabe fazer com o que o mundo precisa.";
  }
  return area.interpretacao;
}

function passoDaArea(area: AreaRoda): string {
  const t = area.titulo.toLowerCase();
  if (/plenitude|felicidade/.test(t)) {
    return "Antes de dormir, diga em voz alta uma coisa boa do dia que não dependeu de conquista. Só presença.";
  }
  if (/criatividade|hobby|diversão/.test(t)) {
    return "Marque na agenda, como se fosse reunião, uma hora nesta semana só para brincar ou criar. Sem meta.";
  }
  if (/saúde|disposição/.test(t)) {
    return "Escolha uma coisa só: dormir meia hora mais cedo ou caminhar vinte minutos. Repita por sete dias.";
  }
  if (/emocional/.test(t)) {
    return "Quando sentir o corpo apertar, pare e nomeie: estou sentindo isto. Dê nome antes de reagir.";
  }
  if (/amoroso|família|social/.test(t)) {
    return "Escolha uma pessoa importante e ofereça trinta minutos de presença real nesta semana. Sem celular.";
  }
  if (/financeiro/.test(t)) {
    return "Anote hoje, num papel, o que entra e o que sai. Clareza já é o primeiro alívio.";
  }
  if (/propósito|realização/.test(t)) {
    return "Reserve uma hora quieta e escreva: o que eu faria se soubesse que não posso fracassar?";
  }
  if (/intelectual/.test(t)) {
    return "Troque vinte minutos de tela vazia por dez páginas de um livro que te desafie.";
  }
  if (/espiritualidade/.test(t)) {
    return "Dez minutos de silêncio por dia, sem agenda. Só respirar e estar.";
  }
  if (/contribuição/.test(t)) {
    return "Escolha uma causa que importa para você e dê um passo concreto nesta semana.";
  }
  return area.acao;
}

function chaoDaRoda(apoios: AreaRoda[]): string {
  const chave = chaveDe(apoios);
  if (ehVinculo(chave) && ehMente(chave)) {
    return "Ao mesmo tempo, relações e mente te sustentam. Isso é chão de verdade. Serve para cuidar da alegria com mais coragem, não para adiá-la.";
  }
  if (ehVinculo(chave)) {
    return `Ao mesmo tempo, ${juntaTitulos(apoios)} te seguram. Gente boa ao redor é chão. Use esse chão para cuidar do que ainda dói, sem fingir que está tudo resolvido.`;
  }
  if (ehMente(chave)) {
    return `Ao mesmo tempo, ${juntaTitulos(apoios)} estão vivos em você. Isso ajuda. Só não deixe a cabeça resolver sozinha o que o coração e o corpo ainda pedem.`;
  }
  return `Ao mesmo tempo, ${juntaTitulos(apoios)} já trabalham a seu favor. Apoie-se nisso para cuidar do que ainda está fino.`;
}

function sombraDaRoda(foco: AreaRoda[], apoios: AreaRoda[]): string {
  const focoChave = chaveDe(foco);
  const apoioChave = chaveDe(apoios);

  if (ehAlegria(focoChave) && (ehVinculo(apoioChave) || ehMente(apoioChave))) {
    return "O risco é viver bem por fora e por dentro da cabeça, e ir adiando a pergunta: eu estou aproveitando a vida que construí? Sem espaço para prazer, até o que está forte começa a parecer obrigação.";
  }
  if (foco.length > 1) {
    return `O risco é olhar só para ${juntaTitulos(apoios)} e deixar ${juntaTitulos(foco)} esperando a vida melhorar sozinha. O que você evita cuidar hoje vira peso amanhã.`;
  }
  return `O risco é se orgulhar do que está bem e adiar o cuidado com ${prosa(foco[0]?.titulo ?? "o que pede atenção")}. A média alta não cura a área esquecida.`;
}

export function leituraRoda(areas: AreaRoda[]): LeituraPortal | null {
  if (areas.length === 0) return null;
  const ordenadas = [...areas].sort((a, b) => a.valor - b.valor);
  const fracas = ordenadas.filter((a) => a.valor <= 5);
  const fortes = [...ordenadas].filter((a) => a.valor >= 8).reverse();
  const foco = (fracas.length ? fracas : ordenadas).slice(0, 2);
  const apoios = (fortes.length ? fortes : [...ordenadas].reverse()).slice(0, 3);
  const meio = ordenadas.filter((a) => a.valor >= 6 && a.valor <= 7);
  const amplitude = ordenadas[ordenadas.length - 1].valor - ordenadas[0].valor;

  return comporLeitura(
    {
      quemVoceE: lista(
        aberturaDaRoda(foco, apoios, amplitude),
        `O pedido mais claro agora está em ${juntaTitulos(foco)}. O que já te segura bem está em ${juntaTitulos(apoios)}.`,
      ),
      noDiaADia: ou(
        lista(
          ...foco.map((a) => cenaDaArea(a)),
          apoios.length ? chaoDaRoda(apoios) : null,
          meio.length >= 4
            ? "O restante da roda não pede alarme. Pede continuidade: saúde, família, dinheiro e direção andam razoáveis, e isso já ajuda a cuidar do que falta."
            : null,
        ),
        "Repare em qual parte da sua semana esta roda apertou de verdade.",
      ),
      sombra: sombraDaRoda(foco, apoios),
      oQueFazer: ou(
        lista(
          ...foco.map((a) => passoDaArea(a)),
          `Se ${prosa(foco[0].titulo)} ganhasse um pouco mais de espaço neste mês, o que mudaria na sua semana?`,
        ),
        "Escolha um gesto pequeno desta leitura e faça ainda hoje.",
      ),
    },
    {
      quemVoceE: "Sua roda agora",
      noDiaADia: "No dia a dia",
      sombra: "O que pede cuidado",
      oQueFazer: "O que fazer com isso",
    },
  );
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
  const quem = lista(item("A síntese", dossie.sinteseIdentidade));
  const destaques = (dossie.pontosChave ?? []).filter((p) => {
    const t = p.toLowerCase();
    return !t.startsWith("ponto cego") && !t.startsWith("pergunta de integração");
  });
  const acoes = (dossie.acoesPrioritarias ?? []).filter((a) => !a.trim().endsWith("?"));
  return comporLeitura({
    quemVoceE: quem.length ? quem : (dossie.panoramaFuncional || "Este retrato junta o que os seus testes mostram."),
    noDiaADia: ou(
      lista(item("O panorama", dossie.panoramaFuncional), comTitulo("O que se destaca", destaques)),
      "Olhe para esta semana e veja em qual área da vida esse retrato apareceu de verdade.",
    ),
    sombra: dossie.perguntaCentral
      || "A sombra do dossiê é usar o mapa para se cobrar, em vez de se entender.",
    oQueFazer: ou(
      lista(acoes),
      "Escolha uma ação desta leitura e coloque na agenda de amanhã.",
    ),
  });
}
