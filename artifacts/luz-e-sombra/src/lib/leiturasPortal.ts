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

function primeiraFrase(texto: string): string {
  const corte = texto.match(/^(.+?[.!?])(?:\s|$)/);
  return (corte?.[1] ?? texto).trim();
}

function ligarFrase(texto: string): string {
  const t = texto.trim();
  if (!t) return t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}

function nomeAreaBaixa(titulo: string): string {
  return titulo.trim().replace(/^\w/, (letra) => letra.toLowerCase());
}

function juntaTitulos(itens: Array<{ titulo: string }>): string {
  return listaNatural(itens.map((a) => nomeAreaBaixa(a.titulo)));
}

function textoAreas(chave: string): boolean {
  return /plenitude|criatividade|diversão|hobby|alegria/.test(chave);
}

function vinculoAreas(chave: string): boolean {
  return /social|amoroso|família|familia/.test(chave);
}

function menteAreas(chave: string): boolean {
  return /intelectual|emocional|espiritualidade/.test(chave);
}

/** Nomeia o padrão da roda sem repetir a lista de notas. */
function padraoDaRoda(
  foco: Array<{ titulo: string; valor: number }>,
  apoios: Array<{ titulo: string; valor: number }>,
  amplitude: number,
): string {
  const chaveFoco = foco.map((a) => a.titulo.toLowerCase()).join(" ");
  const chaveApoio = apoios.map((a) => a.titulo.toLowerCase()).join(" ");
  const alegriaFina = textoAreas(chaveFoco);
  const vinculoForte = vinculoAreas(chaveApoio);
  const menteForte = menteAreas(chaveApoio);

  if (alegriaFina && vinculoForte && menteForte) {
    return "Há um contraste claro: vínculo, mente e sentido estão cheios, mas a alegria simples e o jogo ainda pedem lugar. Não é falta de conquista. É falta de leveza.";
  }
  if (alegriaFina && vinculoForte) {
    return "Você tem gente perto, e mesmo assim a plenitude ainda parece distante. Relação forte não substitui alegria própria.";
  }
  if (alegriaFina && menteForte) {
    return "Sua mente e sua busca interior avançam, mas o prazer de viver ainda fica em segundo plano. Entender a vida não é o mesmo que senti-la.";
  }
  if (vinculoAreas(chaveFoco) && menteForte) {
    return "Há força interior e direção, mas os vínculos pedem cuidado agora. Sozinho, o crescimento fica incompleto.";
  }
  if (amplitude >= 5) {
    return `A amplitude de ${amplitude} pontos mostra uma roda que não gira redonda: uma parte puxa a vida para frente enquanto outra segura o freio.`;
  }
  if (amplitude <= 2) {
    return "Sua roda está relativamente nivelada. O trabalho agora não é apagar um incêndio, é escolher com intenção onde aprofundar.";
  }
  return "Sua roda pede olhar no contraste, não só na média. O que está alto sustenta. O que está baixo orienta o próximo passo.";
}

function sombraDaRoda(
  foco: Array<{ titulo: string }>,
  apoios: Array<{ titulo: string }>,
): string {
  const chaveFoco = foco.map((a) => a.titulo.toLowerCase()).join(" ");
  const chaveApoio = apoios.map((a) => a.titulo.toLowerCase()).join(" ");
  const nomesFoco = juntaTitulos(foco);
  const nomesApoio = juntaTitulos(apoios);

  if (textoAreas(chaveFoco) && (vinculoAreas(chaveApoio) || menteAreas(chaveApoio))) {
    return `A sombra desta roda é deixar ${nomesApoio} carregar o dia inteiro enquanto ${nomesFoco} espera a vida melhorar sozinha. Quando o resto parece bem, a falta de leveza vira detalhe. Não é. Sem ela, o que está forte começa a virar desempenho.`;
  }
  return `A sombra desta roda é medir a vida por ${nomesApoio} e adiar o cuidado com ${nomesFoco}. Tratar a média como resposta é a forma mais elegante de não mudar nada.`;
}

/** Une frases de áreas num parágrafo contínuo, sem rótulos. */
function paragrafoAreas(
  itens: Array<{ titulo: string; interpretacao: string }>,
  trecho: (interpretacao: string) => string = (t) => t,
): string {
  return itens
    .map((a) => {
      const corpo = trecho(a.interpretacao).trim();
      if (!corpo) return "";
      return `Em ${nomeAreaBaixa(a.titulo)}, ${ligarFrase(corpo)}`;
    })
    .filter(Boolean)
    .join(" ");
}

export function leituraRoda(
  areas: Array<{ titulo: string; interpretacao: string; acao: string; valor: number }>,
): LeituraPortal | null {
  if (areas.length === 0) return null;
  const ordenadas = [...areas].sort((a, b) => a.valor - b.valor);
  const fracas = ordenadas.filter((a) => a.valor <= 5);
  const fortes = [...ordenadas].filter((a) => a.valor >= 8).reverse();
  const foco = (fracas.length ? fracas : ordenadas).slice(0, 2);
  const apoios = (fortes.length ? fortes : [...ordenadas].reverse()).slice(0, 3);
  const meio = ordenadas.filter((a) => a.valor >= 6 && a.valor <= 7);
  const maisAlta = ordenadas[ordenadas.length - 1];
  const maisBaixa = ordenadas[0];
  const amplitude = maisAlta.valor - maisBaixa.valor;
  const media = areas.reduce((soma, a) => soma + a.valor, 0) / areas.length;

  const mapaFoco = listaNatural(foco.map((a) => `${nomeAreaBaixa(a.titulo)} (${a.valor}/10)`));
  const mapaApoio = listaNatural(apoios.map((a) => `${nomeAreaBaixa(a.titulo)} (${a.valor}/10)`));

  return comporLeitura(
    {
      quemVoceE: lista(
        padraoDaRoda(foco, apoios, amplitude),
        `A média marca ${media.toFixed(1)}, com ${amplitude} pontos entre ${nomeAreaBaixa(maisAlta.titulo)} e ${nomeAreaBaixa(maisBaixa.titulo)}. O cuidado começa em ${mapaFoco}. O chão está em ${mapaApoio}.`,
      ),
      noDiaADia: ou(
        lista(
          ...foco.map((a) => a.interpretacao),
          apoios.length
            ? `Do outro lado, ${paragrafoAreas(apoios, primeiraFrase)} Isso é recurso real. Serve para sustentar o cuidado do que ainda está fino, sem virar desculpa para adiar.`
            : null,
          meio.length >= 3
            ? `Entre o vazio e a força, ${juntaTitulos(meio.slice(0, 4))} estão estáveis o bastante para não pedir alarme, e ainda abertas o bastante para crescer com continuidade.`
            : null,
        ),
        "Repare em qual área desta semana a roda apertou de verdade.",
      ),
      sombra: ou(
        lista(sombraDaRoda(foco, apoios)),
        "A sombra da roda é tratar a média como resposta e deixar a área mais frágil no piloto automático.",
      ),
      oQueFazer: ou(
        lista(
          ...foco.map((a) => a.acao),
          `Se ${nomeAreaBaixa(foco[0].titulo)} subisse um ponto neste mês, o que mudaria na sua semana?`,
        ),
        "Escolha uma área desta leitura e faça um gesto concreto ainda hoje.",
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
