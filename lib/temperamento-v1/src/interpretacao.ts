import type { Dimensao, TemperamentoCodigo, TipoPerfil } from "./types";
import { normalizarObjetoTextos } from "@workspace/copy-voz";

export interface RelatorioSecao {
  id: string;
  titulo: string;
  paragrafos: string[];
}

export interface RelatorioInterno {
  titulo: string;
  secoes: RelatorioSecao[];
}

interface CamadasTemperamento {
  arquetipoTitulo: string;
  fraseSintese: string;
  motorInterno: string;
  padraoPensamento: string;
  padraoAcao: string;
  pontoForte: string;
  falhaEstrutural: string;
  caminhoCrescimento: string;
}

const DADOS: Record<TemperamentoCodigo, CamadasTemperamento> = {
  COLERICO: {
    arquetipoTitulo: "O Executor",
    fraseSintese: "Enquanto outros pensam, eu já terminei.",
    motorInterno:
      "Você precisa sentir que está avançando. Quando fica parado por muito tempo, algo dentro de você protesta, não por birra, mas porque sua natureza é construir, resolver e liderar. Com um objetivo claro na frente, você é imparável.",
    padraoPensamento:
      "Você pensa para agir, não para ficar analisando eternamente. Vê o problema, escolhe um caminho e parte. Prefere corrigir no caminho a esperar a solução perfeita. Na sua cabeça a pergunta é sempre: o que precisa ser feito agora?",
    padraoAcao:
      "Em crise ou caos, você naturalmente assume a frente. Corta o que não importa, foca no essencial e empurra as coisas para frente. Fala direto, decide rápido e funciona muito bem sob pressão, mas sofre com burocracia, lentidão e reuniões que não levam a lugar nenhum.",
    pontoForte:
      "Você transforma intenção em resultado. Onde outros travam, você destrava. Essa capacidade de fazer acontecer, especialmente quando tudo parece difícil, é um dos seus maiores dons.",
    falhaEstrutural:
      "Sua velocidade pode atropelar pessoas e processos que precisam de tempo. Quando tudo vira urgência, você pode ganhar a batalha e perder a relação. Ter razão nem sempre é o mesmo que conseguir o que realmente importa.",
    caminhoCrescimento:
      "Seu próximo passo não é fazer mais, é fazer melhor. Aprenda a distinguir o que é urgente de verdade do que só parece urgente. Pergunta prática: \"O que eu perco quando ajo rápido demais?\"",
  },
  SANGUINEO: {
    arquetipoTitulo: "O Catalisador",
    fraseSintese: "Onde eu estou, as coisas acontecem.",
    motorInterno:
      "Você ganha vida com pessoas, movimento e novidade. Sozinho por muito tempo ou preso na mesma rotina, você murcha. Quando o ambiente pulsa, sua energia sobe, e você levanta quem está ao redor junto.",
    padraoPensamento:
      "Você conecta ideias de um jeito criativo e vê oportunidades que quem só olha números perde. Pensa rápido, lê bem o clima das pessoas e encontra caminhos por intuição. O desafio é ir fundo quando o assunto exige paciência e detalhe.",
    padraoAcao:
      "Você contagia entusiasmo, começa com força total e se adapta fácil a gente nova e situações novas. Influencia pelo carisma, não pelo cargo. A parte difícil é sustentar o interesse quando a empolgação inicial passa e começa o trabalho repetido.",
    pontoForte:
      "Você cria movimento. Onde há desânimo ou estagnação, você traz ânimo e faz as pessoas quererem participar. Esse dom de mobilizar pelo afeto e pela energia é raro e valioso.",
    falhaEstrutural:
      "Quando a fase emocionante acaba, você pode abandonar antes de terminar, trocando por algo mais estimulante. Muitas vezes nem percebe o quanto isso frustra quem depende de você para fechar o que começou.",
    caminhoCrescimento:
      "Escolha menos projetos e termine o que importa. Crie rotinas simples para a fase chata, ela faz parte de qualquer conquista real. Pergunta prática: \"O que eu deixei incompleto que ainda me pesa?\"",
  },
  MELANCOLICO: {
    arquetipoTitulo: "O Analista",
    fraseSintese: "Eu vejo o que ninguém vê, e isso é um fardo tanto quanto um dom.",
    motorInterno:
      "Você busca fazer as coisas direito, não por perfeccionismo vazio, mas porque sente que o mundo merece mais cuidado. Quando algo está mal feito ou superficial, incomoda de verdade. Essa exigência te torna excelente; também pode te paralisar.",
    padraoPensamento:
      "Você não aceita resposta rasa. Explora o assunto por camadas antes de fechar qualquer conclusão. Vê riscos, padrões e detalhes que passam batido. O lado difícil é quando a análise vira desculpa para não agir.",
    padraoAcao:
      "Quando tem tempo e espaço, entrega trabalho de altíssima qualidade. Prefere poucas pessoas de confiança a grandes grupos. Critica e se autocritica com intensidade, às vezes demais. Brilha em diagnóstico, planejamento e problemas complexos.",
    pontoForte:
      "Você enxerga o que outros não veem. Em situações difíceis ou cheias de nuance, sua profundidade vira vantagem decisiva, ninguém analisa como você.",
    falhaEstrutural:
      "Esperar certeza demais pode fazer você perder janelas que só abrem uma vez. E quando erra, pode remoer por muito tempo, mais do que o tamanho real do erro pediria.",
    caminhoCrescimento:
      "Defina o que é \"bom o suficiente\" antes de começar. Pratique agir com informação incompleta em coisas de baixo risco. Pergunta prática: \"O que eu deixei de tentar por medo de errar?\"",
  },
  FLEUMATICO: {
    arquetipoTitulo: "O Sustentador",
    fraseSintese: "Eu sou a razão pela qual as coisas continuam funcionando quando ninguém está olhando.",
    motorInterno:
      "Você precisa de paz, previsibilidade e relações em ordem. Conflito desgasta, não porque seja fraco, mas porque seu sistema interno funciona melhor com harmonia. Sua força está em sustentar; o desafio é não confundir calma com ficar parado quando precisa mudar.",
    padraoPensamento:
      "Você pensa nas pessoas envolvidas antes de decidir. Vê vários lados ao mesmo tempo, o que te torna um bom mediador, mas às vezes dificulta fechar uma escolha.",
    padraoAcao:
      "Você é constante. Não explode de energia, mas não desiste no meio. Mantém equipes unidas, reduz atrito e cumpre o que promete. Pode adiar conversas difíceis até que o problema fique grande demais para ignorar.",
    pontoForte:
      "Você segura o que importa quando todo mundo está exausto. Sua presença estável e sua inteligência emocional silenciosa são pilares que muita gente só percebe quando você não está.",
    falhaEstrutural:
      "Evitar desconforto pode virar evitar crescimento. Guardar mágoas para \"não criar clima\" costuma terminar em explosão ou distanciamento, e surpreende quem achava que estava tudo bem.",
    caminhoCrescimento:
      "Aprenda a dizer o que precisa ser dito antes que vire ressentimento. Conflito pontual às vezes é o preço de uma relação mais honesta. Pergunta prática: \"O que eu nunca disse e ainda me pesa?\"",
  },
};

const COMBO: Record<string, { forca: string; tensao: string; contexto: string }> = {
  COLERICO_SANGUINEO: {
    forca: "Você faz acontecer e leva as pessoas junto, liderança com energia e calor humano.",
    tensao: "Pode decidir rápido demais e falar antes de ouvir quando está empolgado ou pressionado.",
    contexto: "Liderança de equipes, vendas, empreendedorismo, qualquer lugar que precise de ação e entusiasmo.",
  },
  COLERICO_MELANCOLICO: {
    forca: "Você une visão profunda com capacidade de executar, raro e poderoso.",
    tensao: "Uma parte sua quer agir agora; outra quer analisar até ter certeza. Isso cansa por dentro.",
    contexto: "Projetos complexos, consultoria, fundação de negócios, papéis que exigem estratégia e entrega.",
  },
  COLERICO_FLEUMATICO: {
    forca: "Você decide com firmeza e sustenta no longo prazo, líder confiável em tempos difíceis.",
    tensao: "A urgência de agir pode bater de frente com a vontade de manter tudo calmo e estável.",
    contexto: "Gestão, operações, liderança em crise, papéis que pedem constância e direção.",
  },
  MELANCOLICO_SANGUINEO: {
    forca: "Você comunica com profundidade e charme, ideias ricas que chegam nas pessoas.",
    tensao: "Alterna entre querer estar com todos e precisar se recolher, e nem sempre avisa.",
    contexto: "Criação, ensino, marketing, qualquer trabalho que misture conteúdo e conexão humana.",
  },
  FLEUMATICO_SANGUINEO: {
    forca: "Você acolhe, escuta e cria vínculo, as pessoas se sentem seguras com você.",
    tensao: "Evita conflito e pode deixar problemas crescerem para não magoar ninguém.",
    contexto: "Cuidado, facilitação, suporte, relações que pedem paciência e empatia.",
  },
  FLEUMATICO_MELANCOLICO: {
    forca: "Você entrega qualidade com calma, trabalho bem feito, sem pressa desnecessária.",
    tensao: "Pode pensar demais e adiar decisões ou mudanças que já são necessárias.",
    contexto: "Pesquisa, planejamento, qualidade, trabalhos que exigem precisão e consistência.",
  },
};

/** Narrativa longa por combinação: foco em quem a pessoa é. */
const COMBO_NARRATIVA: Record<string, string> = {
  COLERICO_SANGUINEO:
    "Você é uma pessoa de ação com calor humano. Não só resolve, você mobiliza. Enquanto outros ainda estão alinhando o plano, você já está fazendo e contagia confiança de que vai dar certo. As pessoas te seguem porque sentem energia, clareza e vontade de vencer. Na prática, você lidera pelo exemplo: fala direto, decide rápido e anima o ambiente. Seu temperamento mistura a força de quem executa com o dom de quem conecta, por isso você brilha quando precisa tomar a frente e trazer gente junto.",
  COLERICO_MELANCOLICO:
    "Você tem mente estratégica e mãos que executam. Pensa profundo, mas não fica só no pensamento, quando acredita no caminho, vai com tudo. Essa combinação é rara: muita gente analisa ou age; você consegue os dois, ainda que por dentro às vezes sinta um puxão entre \"já vai\" e \"espera, deixa eu ver direito\".",
  COLERICO_FLEUMATICO:
    "Você é firme e confiável. Decide, sustenta e não abandona no meio. As pessoas contam com você quando a situação exige alguém estável na liderança. Por dentro, pode haver tensão entre a pressa de resolver e a vontade de não quebrar a harmonia, mas quando equilibrado, você é uma referência.",
  MELANCOLICO_SANGUINEO:
    "Você é profundo e expressivo ao mesmo tempo. Tem ideias ricas e sabe comunicá-las de um jeito que envolve. Pode oscilar entre querer estar no centro e precisar de silêncio, mas quando está bem, sua presença educa, inspira e humaniza.",
  FLEUMATICO_SANGUINEO:
    "Você é acolhedor, empático e presente. As pessoas se abrem com você porque sentem que você ouve de verdade. Seu desafio é não absorver tudo dos outros nem evitar conversas difíceis só para manter a paz.",
  FLEUMATICO_MELANCOLICO:
    "Você é cuidadoso, consistente e profundo. Prefere fazer bem feito a fazer rápido. Sua calma esconde uma mente analítica que enxerga detalhes, e às vezes precisa de um empurrão gentil para agir antes da hora perfeita.",
};

function chaveCombo(a: TemperamentoCodigo, b: TemperamentoCodigo): string {
  return [a, b].sort().join("_");
}

export function arquetipoFrasePorTemperamento(t: TemperamentoCodigo): {
  arquetipo: string;
  frase_sintese: string;
} {
  const d = DADOS[t];
  return { arquetipo: NOME_TEMPERAMENTO[t], frase_sintese: d.fraseSintese };
}

/** Título público do perfil: sempre o temperamento dominante (primário). */
export function tituloPerfilTemperamento(
  primario: TemperamentoCodigo,
  _secundario?: TemperamentoCodigo,
  _tipo?: TipoPerfil,
): string {
  return NOME_TEMPERAMENTO[primario];
}

const APelidosLegado = new Set(["O Executor", "O Catalisador", "O Analista", "O Sustentador"]);

/** Corrige resultados antigos que guardavam apelidos em vez dos nomes dos temperamentos. */
export function sanitizarTituloTemperamentoLegado(
  titulo: string | undefined,
  primario: TemperamentoCodigo,
  secundario: TemperamentoCodigo,
  tipo: TipoPerfil,
): string {
  const correto = tituloPerfilTemperamento(primario, secundario, tipo);
  if (!titulo || APelidosLegado.has(titulo) || titulo.includes("+")) return correto;
  return titulo;
}

function afinacoesDimensao(norm: Record<Dimensao, number>, prim: TemperamentoCodigo): string[] {
  const tracos: string[] = [];

  if (norm.ENG >= 0.65) tracos.push("Você funciona melhor quando há movimento, ficar parado demais te incomoda.");
  else if (norm.ENG <= 0.35) tracos.push("Seu ritmo é mais calmo e constante, você prefere profundidade a correria.");

  if (norm.SOC >= 0.65) tracos.push("Pessoas te energizam; você lê bem o clima e se move melhor em grupo.");
  else if (norm.SOC <= 0.35) tracos.push("Você precisa de tempo sozinho para recarregar, não é antisocial, é seu jeito de se organizar.");

  if (norm.DOM >= 0.65) tracos.push("Você naturalmente assume a liderança, mesmo quando ninguém pediu formalmente.");
  else if (norm.DOM <= 0.35) tracos.push("Você prefere influenciar com presença e exemplo a impor controle.");

  if (norm.EST <= 0.35) tracos.push("Sob pressão, você pode reagir antes de processar, vale respirar antes de responder.");
  else if (norm.EST >= 0.65) tracos.push("Você mantém a calma quando outros entram em pânico, isso é um trunfo real.");

  if (norm.PRO >= 0.65) tracos.push("Você pensa profundo e não se contenta com respostas rasas.");
  else if (norm.PRO <= 0.35) tracos.push("Você prefere agir e ajustar no caminho a ficar analisando por horas.");

  if (prim === "COLERICO" && norm.EST <= 0.35) {
    tracos.push("Sua força de ação é grande, o cuidado emocional é o ponto a cultivar com intenção.");
  }
  if (prim === "SANGUINEO" && norm.PRO <= 0.35) {
    tracos.push("Seu entusiasmo abre portas; fechar o que começou é o hábito que mais te transforma.");
  }

  const vistos = new Set<string>();
  return tracos.filter((t) => {
    if (vistos.has(t)) return false;
    vistos.add(t);
    return true;
  }).slice(0, 4);
}

export const NOME_TEMPERAMENTO: Record<TemperamentoCodigo, string> = {
  COLERICO: "Colérico",
  SANGUINEO: "Sanguíneo",
  MELANCOLICO: "Melancólico",
  FLEUMATICO: "Fleumático",
};

const LABEL_DIMENSAO: Record<Dimensao, string> = {
  ENG: "Energia no dia a dia",
  SOC: "Vontade de estar com pessoas",
  DOM: "Vontade de liderar",
  EST: "Calma sob pressão",
  PRO: "Profundidade de pensamento",
};

export function extrairPerguntaCrescimento(texto: string): string {
  const m = texto.match(/Pergunta prática:\s*«([^»]+)»/);
  return m?.[1] ?? "";
}

const SINTESE_DUPLO: Partial<Record<string, string>> = {
  COLERICO_SANGUINEO:
    "Você é o tipo de pessoa que faz acontecer e contagia confiança ao redor. Colérico e Sanguíneo juntos formam alguém que lidera com ação e calor humano, não espera o momento perfeito, cria o movimento.",
  COLERICO_MELANCOLICO:
    "Você une profundidade com execução. Pensa bem e age forte, uma combinação poderosa quando aprende a equilibrar análise e movimento.",
  COLERICO_FLEUMATICO:
    "Você é firme na decisão e estável na entrega. Lidera com consistência, as pessoas sabem que podem contar com você.",
  MELANCOLICO_SANGUINEO:
    "Você é profundo e expressivo. Tem conteúdo de sobra e sabe comunicar de um jeito que envolve.",
  FLEUMATICO_SANGUINEO:
    "Você acolhe e conecta. As pessoas se sentem vistas com você, seu dom está nas relações.",
  FLEUMATICO_MELANCOLICO:
    "Você é cuidadoso e profundo. Prefere qualidade e calma a barulho e pressa.",
};

export function montarSinteseHumana(opts: {
  tipo: TipoPerfil;
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
  temperamentos_percentuais: Record<TemperamentoCodigo, number>;
  empateProximo: boolean;
  frase_sintese: string;
}): string {
  const { tipo, primario, secundario, temperamentos_percentuais, empateProximo, frase_sintese } = opts;
  const np = NOME_TEMPERAMENTO[primario];
  const ns = NOME_TEMPERAMENTO[secundario];

  if (empateProximo) {
    return `${frase_sintese} Seu perfil equilibra ${np} e ${ns} quase na mesma medida. Mesmo assim, ${np} é o temperamento dominante para entender quem você é.`;
  }
  if (tipo === "DUPLO") {
    return `${frase_sintese} Seu temperamento dominante é ${np}. É por essa lente que você pensa, age e se relaciona no dia a dia.`;
  }
  if (tipo === "DOMINANTE" || tipo === "ATIPICO") {
    return `${frase_sintese} Seu jeito de ser é claramente ${np}. Os outros temperamentos aparecem como matiz, não como concorrência.`;
  }
  return `${frase_sintese} Você é principalmente ${np}, com traços de ${ns} colorindo seu dia a dia.`;
}

function montarPortraitIdentidade(opts: {
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
  tipo: TipoPerfil;
}): string {
  const d = DADOS[opts.primario];
  const np = NOME_TEMPERAMENTO[opts.primario];

  return `${d.motorInterno} Como ${np}, isso define bastante como você se move no mundo: o que te energiza, o que te frustra e o que as pessoas mais sentem em você.`;
}

function extrairPassoPratico(texto: string): string {
  return texto.replace(/Pergunta prática:\s*«[^»]+»\.?\s*/g, "").trim();
}

export function montarDimensoesLegiveis(
  norm: Record<Dimensao, number>,
  primario: TemperamentoCodigo,
): { dimensao: Dimensao; label: string; pct: number; insight?: string }[] {
  const insights = afinacoesDimensao(norm, primario);
  return (["ENG", "SOC", "DOM", "EST", "PRO"] as const).map((d) => ({
    dimensao: d,
    label: LABEL_DIMENSAO[d],
    pct: Math.round(norm[d] * 100),
    insight: insights.find((i) => i.toLowerCase().includes(LABEL_DIMENSAO[d].split(" ")[0]!.toLowerCase())),
  }));
}

export interface NarrativaTemperamentoV2 {
  versaoNarrativa: "temperamento_v2";
  sinteseHumana: string;
  dimensoesLegiveis: ReturnType<typeof montarDimensoesLegiveis>;
  perguntaCrescimento: string;
  insightsDimensao: string[];
  combo?: { forca: string; tensao: string; contexto: string };
}

export interface NarrativaTemperamentoV3 {
  versaoNarrativa: "temperamento_v3";
  sinteseHumana: string;
  portraitIdentidade: string;
  noDiaADia: string;
  seuDom: string;
  pontoCego: string;
  comboNarrativa?: string;
  tracosMarcantes: string[];
  perguntaCrescimento: string;
  passoPratico: string;
  /** Mantido para compatibilidade; não exibir como foco principal na UI v3. */
  dimensoesLegiveis: ReturnType<typeof montarDimensoesLegiveis>;
  insightsDimensao: string[];
  combo?: { forca: string; tensao: string; contexto: string };
}

export function montarNarrativaV3(opts: {
  tipo: TipoPerfil;
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
  temperamentos_percentuais: Record<TemperamentoCodigo, number>;
  norm: Record<Dimensao, number>;
  empateProximo: boolean;
  frase_sintese: string;
}): NarrativaTemperamentoV3 {
  const { tipo, primario, secundario, norm, empateProximo, frase_sintese, temperamentos_percentuais } = opts;
  const d = DADOS[primario];
  const tracos = afinacoesDimensao(norm, primario);

  const sinteseHumana = montarSinteseHumana({
    tipo,
    primario,
    secundario,
    temperamentos_percentuais,
    empateProximo,
    frase_sintese,
  });

  return normalizarObjetoTextos({
    versaoNarrativa: "temperamento_v3",
    sinteseHumana,
    portraitIdentidade: montarPortraitIdentidade({ primario, secundario, tipo }),
    noDiaADia: `${d.padraoPensamento} ${d.padraoAcao}`.trim(),
    seuDom: d.pontoForte,
    pontoCego: d.falhaEstrutural,
    tracosMarcantes: tracos,
    perguntaCrescimento: extrairPerguntaCrescimento(d.caminhoCrescimento),
    passoPratico: extrairPassoPratico(d.caminhoCrescimento),
    dimensoesLegiveis: montarDimensoesLegiveis(norm, primario),
    insightsDimensao: tracos,
  });
}

export function montarNarrativaV2(opts: {
  tipo: TipoPerfil;
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
  temperamentos_percentuais: Record<TemperamentoCodigo, number>;
  norm: Record<Dimensao, number>;
  empateProximo: boolean;
  frase_sintese: string;
}): NarrativaTemperamentoV2 {
  const { tipo, primario, secundario, norm, empateProximo, frase_sintese, temperamentos_percentuais } = opts;
  const d = DADOS[primario];
  const insights = afinacoesDimensao(norm, primario);
  let combo: NarrativaTemperamentoV2["combo"];
  if (tipo === "DUPLO") {
    const c = COMBO[chaveCombo(primario, secundario)];
    if (c) combo = { forca: c.forca, tensao: c.tensao, contexto: c.contexto };
  }
  return normalizarObjetoTextos({
    versaoNarrativa: "temperamento_v2",
    sinteseHumana: montarSinteseHumana({
      tipo,
      primario,
      secundario,
      temperamentos_percentuais,
      empateProximo,
      frase_sintese,
    }),
    dimensoesLegiveis: montarDimensoesLegiveis(norm, primario),
    perguntaCrescimento: extrairPerguntaCrescimento(d.caminhoCrescimento),
    insightsDimensao: insights,
    combo,
  });
}

export function montarRelatorioInterno(opts: {
  tipo: TipoPerfil;
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
  temperamentos_percentuais: Record<TemperamentoCodigo, number>;
  norm: Record<Dimensao, number>;
  empateProximo: boolean;
  arquetipo: string;
  frase_sintese: string;
}): RelatorioInterno {
  const { tipo, primario, secundario, temperamentos_percentuais, norm, empateProximo, arquetipo, frase_sintese } =
    opts;
  const d = DADOS[primario];
  void temperamentos_percentuais;
  void norm;
  void empateProximo;
  void frase_sintese;

  const secoes: RelatorioSecao[] = [
    { id: "motor", titulo: "Motor interno", paragrafos: [d.motorInterno] },
    { id: "pensa", titulo: "Como você pensa", paragrafos: [d.padraoPensamento] },
    { id: "acao", titulo: "Como você age", paragrafos: [d.padraoAcao] },
    { id: "forca", titulo: "A sua força real", paragrafos: [d.pontoForte] },
    { id: "sabotagem", titulo: "Padrão de autossabotagem", paragrafos: [d.falhaEstrutural] },
    { id: "passo", titulo: "Próximo passo", paragrafos: [d.caminhoCrescimento] },
  ];

  return normalizarObjetoTextos({
    titulo: tituloPerfilTemperamento(primario, secundario, tipo),
    secoes,
  });
}
