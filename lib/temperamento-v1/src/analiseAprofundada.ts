import type { TemperamentoCodigo, TipoPerfil } from "./types";
import { NOME_TEMPERAMENTO } from "./interpretacao";
import type { RelatorioSecao } from "./interpretacao";

export interface EntradaAnaliseAprofundada {
  tipo: TipoPerfil;
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
  scoreE: number;
  scoreN: number;
  empateProximo: boolean;
}

type Faixa = "alto" | "medio" | "baixo";

function faixa(score: number): Faixa {
  if (score >= 65) return "alto";
  if (score <= 35) return "baixo";
  return "medio";
}

const RELACOES: Record<TemperamentoCodigo, string> = {
  COLERICO:
    "Em vínculos, você tende a ser direto e orientado a solução. As pessoas sabem onde você está, mas podem sentir falta de pausas emocionais quando precisam só ser ouvidas. Pedir tempo para escutar antes de aconselhar muda a qualidade das relações.",
  SANGUINEO:
    "Você cria conexão com leveza e presença. Facilita aproximação e desarma ambientes tensos. O desafio é sustentar profundidade quando a novidade passa: combinar calor humano com constância evita que parceiros sintam que o interesse oscila.",
  MELANCOLICO:
    "Você se relaciona com profundidade e lealdade. Prefere poucas pessoas de confiança a muitos vínculos rasos. Pode guardar incômodos para não magoar, mas isso acumula distância. Nomear o que sente cedo protege a intimidade.",
  FLEUMATICO:
    "Você oferece estabilidade e escuta. As pessoas se acalmam perto de você. Pode evitar confrontos necessários para manter a paz, e aí o outro interpreta indiferença. Aprender a discordar com calma é um dom relacional poderoso.",
};

const TRABALHO: Record<TemperamentoCodigo, string> = {
  COLERICO:
    "No trabalho, você performa melhor com metas claras e autonomia para decidir. Lidera bem em crise e em projetos com prazo. Evite microgerenciar ou assumir tudo: delegar libera sua energia para o que só você resolve.",
  SANGUINEO:
    "Você brilha em papéis com pessoas, vendas, comunicação e início de projetos. Precisa de variedade e feedback frequente. Estruture rotinas simples para a fase de execução repetitiva, senão a motivação cai antes da entrega.",
  MELANCOLICO:
    "Você entrega qualidade, análise e cuidado com detalhes. Funciona bem em planejamento, diagnóstico e trabalhos que exigem precisão. Defina critérios de 'bom o suficiente' para não travar entregas por buscar perfeição.",
  FLEUMATICO:
    "Você sustenta processos, equipes e rotinas. É a pessoa que mantém o sistema funcionando quando outros já cansaram. Precisa de clareza sobre prioridades para não absorver tarefas de todos só para evitar conflito.",
};

const ESTRESSE: Record<Faixa, string> = {
  alto:
    "Sob pressão, sua sensibilidade emocional sobe rápido. Pequenos atritos podem parecer maiores do que são. Respirar, adiar respostas impulsivas e nomear o que sente antes de agir reduz reações que você depois lamenta.",
  medio:
    "Sob pressão, você oscila entre reagir e conter. Às vezes processa bem, às vezes acumula. Ter um ritual curto de pausa (caminhar, água, silêncio de dois minutos) ajuda a não decidir no pico da emoção.",
  baixo:
    "Sob pressão, você tende a manter a cabeça fria. Isso é vantagem em crises, mas pode fazer o outro sentir que você minimiza o que ele sente. Validar a emoção alheia antes de resolver o problema equilibra sua estabilidade.",
};

const AFINACAO_E: Record<Faixa, string> = {
  alto: "Sua energia social é alta: você recarrega com movimento, gente e estímulo. Rotinas longas sem interação drenam.",
  medio: "Você equilibra convívio e solitude. Consegue estar em grupo, mas precisa de pausas para reorganizar por dentro.",
  baixo: "Você processa melhor com espaço interno. Interações intensas sem intervalo esgotam, não por falta de interesse, mas por ritmo.",
};

const AFINACAO_N: Record<Faixa, string> = {
  alto: "Você sente as coisas com intensidade. Isso dá profundidade, mas pede cuidado com autocrítica e ruminação.",
  medio: "Sua estabilidade emocional é moderada: reage, processa e segue. Em semanas difíceis, priorize sono e limites.",
  baixo: "Você regula emoções com facilidade relativa. Cuidado para não parecer distante quando o outro precisa de acolhimento.",
};

const PROTOCOLO: Record<TemperamentoCodigo, string[]> = {
  COLERICO: [
    "Antes de decidir, pergunte: 'Isso é urgente ou só parece urgente?'",
    "Reserve 10 minutos por dia para ouvir alguém sem propor solução.",
    "Ao fim da semana, revise uma decisão rápida e o que ela custou em relação.",
  ],
  SANGUINEO: [
    "Escolha um projeto prioritário e bloqueie tempo fixo para terminá-lo.",
    "Crie uma lista curta de tarefas chatas e faça uma por dia, sem negociar.",
    "Peça feedback de alguém de confiança sobre o que você deixou incompleto.",
  ],
  MELANCOLICO: [
    "Defina 'pronto' antes de começar: o que precisa estar bom, não perfeito.",
    "Pratique uma ação de baixo risco por semana com informação incompleta.",
    "Escreva três coisas que deram certo no fim do dia, para equilibrar a autocrítica.",
  ],
  FLEUMATICO: [
    "Marque uma conversa difícil que você está adiando e escolha a data.",
    "Diga 'não' ou 'não agora' uma vez por semana sem justificar demais.",
    "Identifique uma mudança pequena que você evita por conforto e execute em 7 dias.",
  ],
};

function mapaTemperamental(opts: EntradaAnaliseAprofundada): string[] {
  const { scoreE, scoreN, primario } = opts;
  const np = NOME_TEMPERAMENTO[primario];
  return [
    `O temperamento descreve padrões estáveis de reação, não um rótulo fixo. Seu resultado combina dois eixos: energia social (${Math.round(scoreE)}%) e sensibilidade emocional (${Math.round(scoreN)}%).`,
    `No modelo clássico ligado a Eysenck, isso posiciona você principalmente como ${np}. Quanto mais longe do centro do mapa, mais marcante é o estilo; perto do centro, você mistura traços com flexibilidade.`,
    `${AFINACAO_E[faixa(scoreE)]} ${AFINACAO_N[faixa(scoreN)]}`,
  ];
}

function paragrafoUnicoMotor(primario: TemperamentoCodigo, scoreE: number, scoreN: number): string {
  const base: Record<TemperamentoCodigo, string> = {
    COLERICO:
      "Seu motor interno busca progresso visível. Você funciona melhor quando há desafio, meta e espaço para agir. A frustração aparece quando sente bloqueio ou lentitude alheia.",
    SANGUINEO:
      "Seu motor interno busca estímulo e conexão. Novidade e interação renovam sua energia. A frustração aparece em rotinas longas sem variedade ou reconhecimento.",
    MELANCOLICO:
      "Seu motor interno busca sentido e qualidade. Você precisa entender o porquê antes de se entregar. A frustração aparece em superficialidade ou pressa sem critério.",
    FLEUMATICO:
      "Seu motor interno busca harmonia e previsibilidade. Você funciona melhor com ritmo estável e relações em ordem. A frustração aparece em conflito prolongado ou caos.",
  };
  let extra = "";
  if (faixa(scoreE) === "alto" && primario !== "SANGUINEO") {
    extra = " Sua energia social alta amplifica esse movimento para fora.";
  }
  if (faixa(scoreN) === "alto" && primario !== "MELANCOLICO") {
    extra = " Sua sensibilidade emocional faz o motor reagir mais às nuances do ambiente.";
  }
  return base[primario] + extra;
}

function paragrafoDecisao(primario: TemperamentoCodigo, scoreE: number): string {
  const bases: Record<TemperamentoCodigo, string> = {
    COLERICO: "Você decide para agir. Prefere escolher um caminho e corrigir depois a esperar o cenário perfeito.",
    SANGUINEO: "Você decide pela intuição social e oportunidade. Lê o contexto rápido, mas pode mudar de rota quando surge algo mais estimulante.",
    MELANCOLICO: "Você decide após analisar riscos e detalhes. Quanto mais importante, mais camadas você explora antes de fechar.",
    FLEUMATICO: "Você decide buscando o menor dano relacional e o caminho mais sustentável. Pode demorar quando sente que alguém será incomodado.",
  };
  const vel =
    faixa(scoreE) === "alto"
      ? "Sua velocidade de decisão tende a ser alta."
      : faixa(scoreE) === "baixo"
        ? "Sua velocidade de decisão tende a ser moderada, com pausa para processar."
        : "Sua velocidade de decisão varia conforme o impacto nas pessoas envolvidas.";
  return `${bases[primario]} ${vel}`;
}

function paragrafoReacao(primario: TemperamentoCodigo, scoreN: number): string {
  const bases: Record<TemperamentoCodigo, string> = {
    COLERICO: "No dia a dia, você empurra tarefas e pessoas para frente. Em rotina, funciona; em sobrecarga, pode tornar-se impaciente.",
    SANGUINEO: "No dia a dia, você anima, conecta e improvisa. Em rotina, precisa de estímulo; sem ele, a energia dispersa.",
    MELANCOLICO: "No dia a dia, você observa, planeja e refina. Em rotina, entrega qualidade; em pressão, pode travar por excesso de critério.",
    FLEUMATICO: "No dia a dia, você mantém, medeia e sustenta. Em rotina, é confiável; em pressão, pode congelar para evitar atrito.",
  };
  return `${bases[primario]} ${ESTRESSE[faixa(scoreN)]}`;
}

function sombraComExemplo(primario: TemperamentoCodigo): string[] {
  const map: Record<TemperamentoCodigo, string[]> = {
    COLERICO: [
      "Sua sombra aparece quando tudo vira urgência. Você ganha a tarefa e perde a relação, ou decide por todos sem consultar.",
      "Exemplo: em uma reunião tensa, você fecha o assunto rápido. O problema 'some', mas o ressentimento fica.",
    ],
    SANGUINEO: [
      "Sua sombra aparece quando a empolgação inicial some. Projetos, conversas ou compromissos podem ficar pela metade.",
      "Exemplo: você se entusiasma com uma ideia, começa com força e, semanas depois, já está em outra frente.",
    ],
    MELANCOLICO: [
      "Sua sombra aparece quando o medo de errar vira paralisia. A análise substitui a ação.",
      "Exemplo: você adia enviar um trabalho porque ainda não está 'como deveria', mesmo já sendo suficiente.",
    ],
    FLEUMATICO: [
      "Sua sombra aparece quando a paz vira silêncio sobre o que importa. Você engole incômodos até não dar mais.",
      "Exemplo: você concorda por fora, acumula por dentro e explode ou se afasta sem avisar.",
    ],
  };
  return map[primario];
}

function leituraEixosPedagogica(scoreE: number, scoreN: number): string[] {
  return [
    `Seu eixo de energia social está em ${Math.round(scoreE)}%. Valores altos indicam tendência a buscar estímulo, movimento e interação; valores baixos, preferência por profundidade, silêncio e ritmo mais lento.`,
    `Seu eixo de sensibilidade emocional está em ${Math.round(scoreN)}%. Valores altos indicam maior reatividade a críticas, incertezas e mudanças; valores baixos, maior estabilidade sob pressão.`,
    "Esses eixos não são 'bom' ou 'ruim'. São o termômetro de como você gasta energia e processa emoção. O temperamento é o padrão que emerge dessa combinação.",
  ];
}

export function montarAnaliseAprofundada(opts: EntradaAnaliseAprofundada): RelatorioSecao[] {
  const { primario, secundario, tipo, empateProximo } = opts;
  const secoes: RelatorioSecao[] = [
    { id: "mapa", titulo: "Seu mapa temperamental", paragrafos: mapaTemperamental(opts) },
    { id: "motor", titulo: "Motor interno e necessidades", paragrafos: [paragrafoUnicoMotor(primario, opts.scoreE, opts.scoreN)] },
    { id: "decisao", titulo: "Como você decide", paragrafos: [paragrafoDecisao(primario, opts.scoreE)] },
    { id: "reacao", titulo: "Como você reage no dia a dia", paragrafos: [paragrafoReacao(primario, opts.scoreN)] },
    { id: "relacoes", titulo: "Relações e comunicação", paragrafos: [RELACOES[primario]] },
    { id: "trabalho", titulo: "Trabalho e liderança", paragrafos: [TRABALHO[primario]] },
    { id: "sombra", titulo: "Sombra e autossabotagem", paragrafos: sombraComExemplo(primario) },
    {
      id: "crescimento",
      titulo: "Protocolo de crescimento (30 dias)",
      paragrafos: [
        "Três hábitos concretos para os próximos 30 dias. Escolha executar todos, na ordem, sem esperar motivação perfeita:",
        ...PROTOCOLO[primario].map((p, i) => `${i + 1}. ${p}`),
      ],
    },
    { id: "eixos", titulo: "Como ler seus eixos", paragrafos: leituraEixosPedagogica(opts.scoreE, opts.scoreN) },
  ];

  if ((tipo === "DUPLO" || tipo === "MISTO" || empateProximo) && primario !== secundario) {
    secoes.splice(1, 0, {
      id: "dinamica",
      titulo: "A dinâmica interna do seu perfil",
      paragrafos: [
        `Seu temperamento dominante é ${NOME_TEMPERAMENTO[primario]}, com traço marcante de ${NOME_TEMPERAMENTO[secundario]}. Isso cria uma tensão produtiva: uma parte de você puxa para um estilo, outra modula o resultado final.`,
        empateProximo
          ? "Os dois temperamentos estão próximos no seu mapa. Isso explica por que, em contextos diferentes, você pode parecer uma pessoa distinta."
          : "O traço secundário não substitui o principal, mas colore decisões, relações e reações sob pressão.",
      ],
    });
  }

  return secoes;
}

export function semParagrafosDuplicados(textos: string[]): void {
  const vistos = new Set<string>();
  for (const t of textos) {
    const norm = t.trim();
    if (!norm) continue;
    if (vistos.has(norm)) {
      throw new Error(`Parágrafo duplicado na análise: ${norm.slice(0, 60)}...`);
    }
    vistos.add(norm);
  }
}

export function extrairTodosParagrafosAnalise(secoes: RelatorioSecao[]): string[] {
  return secoes.flatMap((s) => s.paragrafos);
}
