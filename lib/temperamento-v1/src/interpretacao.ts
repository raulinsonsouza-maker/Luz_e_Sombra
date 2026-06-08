import type { Dimensao, TemperamentoCodigo, TipoPerfil } from "./types";

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
      "O Colérico é movido por uma necessidade profunda de impacto e controle. Não é ambição superficial — é uma aversão visceral à impotência. Quando não está construindo, liderando ou resolvendo, sente que está desperdiçando existência. O tempo parado é fisicamente insuportável.",
    padraoPensamento:
      "Orientado a solução, não a análise. Identifica o problema, escolhe uma direção (nem sempre a melhor, mas sempre uma direção) e avança. Prefere errar em movimento a acertar parado. O raciocínio é sequencial e prático: «O que precisa ser feito? Quem vai fazer? Quando acaba?». Armadilha cognitiva: confunde velocidade de decisão com qualidade de decisão.",
    padraoAcao:
      "Assume comando em situações de crise automaticamente. Define prioridades com brutalidade — descarta o não essencial sem cerimónia. Trabalha bem sob pressão extrema; deteriora sob burocracia e morosidade. Comunica-se de forma direta, às vezes percebida como agressiva. Tolera mal explicações longas — quer o resumo e a ação.",
    pontoForte:
      "A capacidade de transformar intenção em resultado em contextos onde outros paralisam. Em situações de crise, ambiguidade ou paralisia organizacional, o Colérico funciona como catalisador de execução. Esta habilidade é rara e extremamente valiosa.",
    falhaEstrutural:
      "Atropela processos e pessoas não por crueldade, mas por impaciência estrutural. A velocidade que é a sua maior força torna-se sabotagem quando o contexto exige cuidado, construção gradual ou consenso. Pode destruir relações importantes por não reconhecer que «ter razão» e «conseguir o que quer» são problemas diferentes.",
    caminhoCrescimento:
      "O próximo nível não é fazer mais — é fazer com mais precisão. Desenvolver tolerância a processos lentos como ferramenta estratégica (não como fraqueza), e aprender a distinguir urgência real de urgência percebida. Pergunta prática: «O que eu deixo de conquistar por agir rápido demais?»",
  },
  SANGUINEO: {
    arquetipoTitulo: "O Catalisador",
    fraseSintese: "Onde eu estou, as coisas acontecem.",
    motorInterno:
      "O Sanguíneo é movido por estimulação e conexão. A solidão não é apenas desconfortável — é desorientadora. Precisa do reflexo das pessoas para se sentir real. A energia sobe exponencialmente em ambientes dinâmicos e cai dramaticamente em isolamento ou rotina.",
    padraoPensamento:
      "Intuitivo, associativo e contextual. Conecta ideias de forma não linear e encontra oportunidades que analistas perdem porque olham demais para os dados e de menos para as pessoas. O pensamento é rápido, criativo e socialmente inteligente — mas tende à superficialidade quando o tema exige profundidade.",
    padraoAcao:
      "Cria engajamento e entusiasmo com facilidade excepcional. Começa muitos projetos com energia intensa; perde interesse na fase de execução. Influencia pelo carisma e pela narrativa, não pela autoridade formal. Adapta-se rapidamente a novas situações e pessoas. Sensível à atmosfera emocional do grupo — absorve e amplifica humores.",
    pontoForte:
      "Capacidade de criar movimento, engajamento e momentum social em contextos onde outros não conseguem gerar tração. Excelente em vendas, liderança de cultura, comunicação de marca e qualquer contexto onde energia humana é o ativo principal.",
    falhaEstrutural:
      "Baixa tolerância à fase árida de qualquer projeto. Quando o entusiasmo inicial evapora e começa o trabalho repetitivo de execução, o Sanguíneo desengaja — às vezes abandonando projetos 80% concluídos por algo «mais interessante». Este padrão é invisível para ele mesmo e devastador para as suas equipas.",
    caminhoCrescimento:
      "Desenvolver sistemas externos de comprometimento (não depender de motivação interna para fases de execução). Identificar os projetos onde a fase árida vale a pena e ser brutal com os demais. Pergunta prática: «Quantas coisas eu abandonei a 80% e o que isso me custou?»",
  },
  MELANCOLICO: {
    arquetipoTitulo: "O Analista",
    fraseSintese: "Eu vejo o que ninguém vê — e isso é um fardo tanto quanto um dom.",
    motorInterno:
      "O Melancólico é movido por um padrão profundo de busca de sentido e precisão. A imperfeição não é apenas incómoda — é moralmente perturbadora. Existe uma exigência interna de que as coisas sejam feitas do jeito certo, mesmo quando o contexto não exige. Este padrão gera excelência e, simultaneamente, paralisia.",
    padraoPensamento:
      "Profundo, estruturado e crítico. Não aceita respostas superficiais — explora problemas em múltiplas camadas antes de concluir. Esta profundidade é a maior vantagem e também a fonte do maior obstáculo: o overthinking que paralisa a ação.",
    padraoAcao:
      "Produz trabalho de qualidade excepcionalmente alta quando o contexto permite tempo adequado. Prefere trabalhar sozinho ou em pequenos grupos de alta confiança. Sensível a críticas — processa-as profundamente, às vezes em excesso. Tende a rever e refinar indefinidamente sem critério claro de conclusão. Excelente em diagnóstico de problemas, planos de longo prazo e trabalho técnico complexo.",
    pontoForte:
      "Capacidade de ver padrões, riscos e oportunidades que outros não enxergam por falta de profundidade analítica. Em contextos de alta complexidade, estratégia ou qualidade crítica, o Melancólico entrega o que nenhum outro perfil consegue.",
    falhaEstrutural:
      "Paralisa por excesso de análise em momentos que exigem ação imperfeita e rápida. A busca por certeza — que nunca chegará completamente — pode custar oportunidades que existem apenas por janelas temporais curtas. Tende também a ruminar fracassos com uma intensidade desproporcional ao tamanho real do erro.",
    caminhoCrescimento:
      "Desenvolver critérios explícitos de suficiência: «este trabalho está bom o suficiente quando X». Praticar ação deliberada com informação incompleta em contextos de baixo risco como treinamento. Pergunta prática: «Quantas oportunidades eu perdi esperando ter certeza suficiente?»",
  },
  FLEUMATICO: {
    arquetipoTitulo: "O Sustentador",
    fraseSintese: "Eu sou a razão pela qual as coisas continuam funcionando quando ninguém está a olhar.",
    motorInterno:
      "O Fleumático é movido por uma necessidade profunda de estabilidade e harmonia. O conflito não é apenas desconfortável — é percebido como uma falha do sistema que precisa ser resolvida. A força é a consistência; a limitação é que essa consistência pode tornar-se resistência ao crescimento quando este exige desconforto.",
    padraoPensamento:
      "Pragmático, cauteloso e orientado à harmonia sistémica. Considera o impacto humano de decisões com uma profundidade que outros perfis ignoram. Bom mediador natural. Tende a ver múltiplas perspectivas simultaneamente — o que gera empatia e, às vezes, dificuldade de decidir.",
    padraoAcao:
      "Executa com consistência notável ao longo do tempo — não em explosões de energia. Funciona como cola social em equipas — reduz atrito e mantém coesão. Resiste à mudança mesmo quando necessária — especialmente se houver conflito associado. Tende a postergar decisões que gerarão desconforto ou conflito. Altamente confiável e previsível.",
    pontoForte:
      "Consistência de longo prazo e capacidade de manter sistemas funcionando sob pressão sem desgaste aparente. Em contextos onde outros perfis se esgotam ou criam conflito, o Fleumático sustém. Também possui inteligência interpessoal sofisticada que frequentemente passa despercebida.",
    falhaEstrutural:
      "Evita o crescimento quando este exige conflito, confronto ou saída da zona de conforto. A busca por harmonia pode tornar-se passividade disfarçada de diplomacia. Tende a acumular insatisfações sem expressá-las até ao ponto de ruptura — o que surpreende pessoas à volta que assumiam que estava «tudo bem».",
    caminhoCrescimento:
      "Diferenciar harmonia genuína de evitação de conflito. Desenvolver tolerância ao desconforto temporário como preço do crescimento permanente. Pergunta prática: «O que eu nunca disse mas precisava ter dito, e o que isso me custou?»",
  },
};

const COMBO: Record<string, { forca: string; tensao: string; contexto: string }> = {
  COLERICO_SANGUINEO: {
    forca: "Execução com carisma. Liderança magnética.",
    tensao: "Impulsividade amplificada. Pouca reflexão.",
    contexto: "Vendas, startups, liderança de equipas.",
  },
  COLERICO_MELANCOLICO: {
    forca: "Estratégia + execução. Combinação rara e poderosa.",
    tensao: "Guerra interna entre agir e analisar.",
    contexto: "Fundadores técnicos, consultores sénior.",
  },
  COLERICO_FLEUMATICO: {
    forca: "Decisão + estabilidade. Liderança consistente.",
    tensao: "Conflito entre urgência e paciência.",
    contexto: "Gestão operacional, liderança em crise.",
  },
  MELANCOLICO_SANGUINEO: {
    forca: "Criatividade com profundidade. Comunicação rica.",
    tensao: "Oscilação entre extroversão e recolhimento.",
    contexto: "Marketing, ensino, criação de conteúdo.",
  },
  FLEUMATICO_SANGUINEO: {
    forca: "Conexão humana profunda. Alta empatia.",
    tensao: "Dificuldade de confronto e baixa proatividade.",
    contexto: "RH, suporte, facilitação.",
  },
  FLEUMATICO_MELANCOLICO: {
    forca: "Análise + estabilidade. Qualidade consistente.",
    tensao: "Paralisia por análise amplificada. Evitação.",
    contexto: "Pesquisa, gestão de qualidade, auditoria.",
  },
};

function chaveCombo(a: TemperamentoCodigo, b: TemperamentoCodigo): string {
  return [a, b].sort().join("_");
}

export function arquetipoFrasePorTemperamento(t: TemperamentoCodigo): {
  arquetipo: string;
  frase_sintese: string;
} {
  const d = DADOS[t];
  return { arquetipo: d.arquetipoTitulo, frase_sintese: d.fraseSintese };
}

function afinacoesDimensao(norm: Record<Dimensao, number>, prim: TemperamentoCodigo): string[] {
  const extra: string[] = [];
  if (norm.DOM > 0.75) {
    extra.push(
      "O teu score elevado em Dominância/Controle sugere forte orientação para liderança e necessidade de influenciar o rumo das coisas — integra isso no retrato das tuas decisões quotidianas.",
    );
  }
  if (norm.EST < 0.35) {
    extra.push(
      "Estabilidade emocional mais baixa no perfil medido: há tensão interna entre impulso e regulação — útil antecipar isto em momentos de pressão.",
    );
  }
  if (norm.PRO > 0.8) {
    extra.push(
      "Profundidade/análise muito alta: o teu padrão cognitivo tende a multiplicar camadas de revisão antes de fechar qualquer conclusão.",
    );
  }

  if (prim === "COLERICO") {
    if (norm.DOM > 0.7)
      extra.push("Ênfase adicional em controle e liderança no teu padrão Colérico medido.");
    if (norm.ENG > 0.8)
      extra.push("Urgência física e intolerância à inatividade marcam fortemente o perfil.");
    if (norm.EST < 0.3)
      extra.push("Combinação de força de ação com regulação emocional mais frágil: cuidado com impulsividade sob pressão.");
  }
  if (prim === "SANGUINEO") {
    if (norm.SOC > 0.8)
      extra.push("Alta sociabilidade medida: atenção à dependência de validação social e medo de rejeição.");
    if (norm.PRO < 0.3)
      extra.push("Profundidade analítica mais baixa: possível dificuldade com compromissos de longo prazo que exijam fase árida.");
    if (norm.ENG > 0.7)
      extra.push("Energia de grupo elevada: capacidade real de criar entusiasmo em contextos colectivos.");
  }
  if (prim === "MELANCOLICO") {
    if (norm.PRO > 0.85)
      extra.push("Perfeccionismo e análise muito intensos: risco de paralisia e isolamento intelectual.");
    if (norm.EST > 0.6)
      extra.push("Combinação rara de profundidade com estabilidade emocional medida.");
    if (norm.ENG < 0.3)
      extra.push("Energia/ritmo mais baixos: tensão entre capacidade analítica e arranque de execução.");
  }
  if (prim === "FLEUMATICO") {
    if (norm.EST > 0.85)
      extra.push("Estabilidade muito alta: atenção ao risco de confundir calma com evitação de mudança necessária.");
    if (norm.DOM < 0.2)
      extra.push("Dominância baixa: pode custar afirmar limites e necessidades próprias.");
    if (norm.PRO > 0.6)
      extra.push("Estabilidade aliada à análise: força de planeamento e consistência.");
  }
  return extra;
}

export const NOME_TEMPERAMENTO: Record<TemperamentoCodigo, string> = {
  COLERICO: "Colérico",
  SANGUINEO: "Sanguíneo",
  MELANCOLICO: "Melancólico",
  FLEUMATICO: "Fleumático",
};

const LABEL_DIMENSAO: Record<Dimensao, string> = {
  ENG: "Energia e ritmo",
  SOC: "Sociabilidade",
  DOM: "Liderança e controlo",
  EST: "Estabilidade emocional",
  PRO: "Profundidade analítica",
};

export function extrairPerguntaCrescimento(texto: string): string {
  const m = texto.match(/Pergunta prática:\s*«([^»]+)»/);
  return m?.[1] ?? "";
}

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
  const pp = temperamentos_percentuais[primario];
  const ps = temperamentos_percentuais[secundario];

  if (empateProximo) {
    return `${frase_sintese} O teu perfil está numa zona de transição entre ${np} e ${ns} — usa o resultado como bússola, não como rótulo fechado.`;
  }
  if (tipo === "DUPLO") {
    return `${frase_sintese} Combinações ${np} + ${ns} (${pp}% / ${ps}%) criam uma personalidade com duas forças visíveis: execução e relação, ação e expressão.`;
  }
  if (tipo === "DOMINANTE" || tipo === "ATIPICO") {
    return `${frase_sintese} O ${np} lidera o teu mapa (${pp}%) — os outros temperamentos aparecem como matiz, não como concorrência.`;
  }
  return `${frase_sintese} És principalmente ${np} (${pp}%), com ${ns} (${ps}%) a colorir o dia a dia.`;
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
  return {
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
  };
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
    { id: "pensa", titulo: "Como pensas", paragrafos: [d.padraoPensamento] },
    { id: "acao", titulo: "Como ages", paragrafos: [d.padraoAcao] },
    { id: "forca", titulo: "A tua força real", paragrafos: [d.pontoForte] },
    { id: "sabotagem", titulo: "Padrão de sabotagem", paragrafos: [d.falhaEstrutural] },
    { id: "passo", titulo: "Próximo passo", paragrafos: [d.caminhoCrescimento] },
  ];

  if (tipo === "DUPLO") {
    const k = chaveCombo(primario, secundario);
    const c = COMBO[k];
    if (c) {
      secoes.splice(7, 0, {
        id: "combinacao",
        titulo: "Combinação primário + secundário",
        paragrafos: [
          `Força central: ${c.forca}`,
          `Tensão interna: ${c.tensao}`,
          `Contextos ideais: ${c.contexto}`,
        ],
      });
    }
  }

  return {
    titulo: arquetipo,
    secoes,
  };
}
