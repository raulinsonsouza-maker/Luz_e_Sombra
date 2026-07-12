/**
 * Motor de síntese do Dossiê «Quem sou eu»: cruza numerologia, Traço, temperamento,
 * linguagens do amor, roda da vida e diagnóstico emocional.
 */

import { NUMEROS_DE_VIDA, ANOS_PESSOAIS } from "@/lib/numerologia-data";
import { normalizarObjetoTextos } from "@workspace/copy-voz";
import {
  tituloPerfilTemperamento,
  type TemperamentoCodigo,
  type TipoPerfil,
} from "@workspace/temperamento-v1";

// ── Tipos de entrada ───────────────────────────────────────────────────────────

export interface AvaliacaoDossie {
  plenitudeFelicidade: number;
  espiritualidade: number;
  saudeDisposicao: number;
  desenvolvimentoIntelectual: number;
  equilibrioEmocional: number;
  familia: number;
  desenvolvimentoAmoroso: number;
  vidaSocial: number;
  realizacaoProposito: number;
  recursosFinanceiros: number;
  contribuicaoSocial: number;
  criatividadeHobbyDiversao: number;
}

export type AreaVida = keyof AvaliacaoDossie;

export const AREAS_LABELS: Record<AreaVida, string> = {
  plenitudeFelicidade: "Felicidade e Plenitude",
  espiritualidade: "Espiritualidade",
  saudeDisposicao: "Saúde e Disposição",
  desenvolvimentoIntelectual: "Intelecto e Mente",
  equilibrioEmocional: "Equilíbrio Emocional",
  familia: "Família",
  desenvolvimentoAmoroso: "Vida Amorosa",
  vidaSocial: "Vida Social",
  realizacaoProposito: "Realização e Propósito",
  recursosFinanceiros: "Recursos Financeiros",
  contribuicaoSocial: "Contribuição Social",
  criatividadeHobbyDiversao: "Criatividade e Prazer",
};

export interface TracoDossie {
  estruturaPrincipal: string;
  estruturaSecundaria?: string;
  estruturas: Record<string, number>;
  mensagemTerapeutica?: string;
  fraseIdentidade?: string;
  pontosFortes?: string[];
  sinteseHumana?: string;
  perguntaTransformacao?: string;
  leituraEmocionalDeclarada?: string;
  couracaCorporal?: string;
  fusaoDiagnosticoEmocional?: {
    alinhamentoFotosFormulario?: number;
    sinaisConvergentes?: string[];
    sinteseIntegrada?: string;
    padroesEmocionaisNormalizados?: Record<string, number>;
    entradaDiagnostico?: DiagnosticoEmocionalDb;
  };
}

export interface TemperamentoDossie {
  primario: string;
  secundario?: string;
  arquetipo?: string;
  sinteseHumana?: string;
  perguntaCrescimento?: string;
  pontoCego?: string;
  trechoRelacoes?: string;
  trechoTrabalho?: string;
  scoreE?: number;
  estabilidadeEmocional?: number;
  dimensoesLegiveis?: { label: string; pct: number; insight?: string }[];
}

export interface LinguagensDossie {
  receberPrincipal: string;
  receberSecundaria?: string;
  expressarPrincipal: string;
  expressarSecundaria?: string;
  desalinhamento?: { ativo: boolean; texto: string };
  sinteseHumana?: string;
  combinacao?: string;
}

export interface DiagnosticoEmocionalDb {
  padroesPct?: {
    vinculo: number;
    controle: number;
    estrategia: number;
    retencao: number;
    desconexao: number;
  };
  mediaConsciencia?: number;
  tagEvolucao?: "inconsciente" | "em_processo" | "integrado";
}

export interface DossieInput {
  primeiroNome: string;
  vidaNum: number | null;
  expressaoNum: number | null;
  almaNum: number | null;
  personalidadeNum: number | null;
  anoPessoalNum: number | null;
  traco: TracoDossie | null;
  temperamento: TemperamentoDossie | null;
  linguagens: LinguagensDossie | null;
  avaliacao: AvaliacaoDossie | null;
  diagnosticoEmocional: DiagnosticoEmocionalDb | null;
  idade: number | null;
}

export interface CruzamentoDossie {
  titulo: string;
  corpo: string;
  icone: "brain" | "target" | "eye" | "spark" | "flame" | "heart" | "shield" | "zap";
  relevancia: number;
}

export interface DiagnosticoEmocionalFase1 {
  faixaEtaria: "4-7" | "8-11" | "12-14" | "15+";
  modoColeta: string;
  passado: number;
  presente: number;
  consciencia: number;
  nivelAtual: "baixo" | "medio" | "alto";
  evolucao: "baixo" | "medio" | "alto";
  tag: "inconsciente" | "em_processo" | "integrado" | "em_desenvolvimento";
  resumo: string;
  proximosPassos: string[];
  fonte: "fusao" | "formulario" | "heuristica";
}

export interface MatrizFonte {
  id: string;
  label: string;
  disponivel: boolean;
  resumo?: string;
}

export interface DossieIntegrado {
  sinteseIdentidade: string | null;
  assinaturaIntegrada: string | null;
  perguntaCentral: string | null;
  panoramaFuncional: string | null;
  pontosChave: string[];
  mapaEntendimento: { titulo: string; texto: string }[];
  cruzamentos: CruzamentoDossie[];
  acoesPrioritarias: string[];
  diagnosticoEmocional: DiagnosticoEmocionalFase1 | null;
  matrizFontes: MatrizFonte[];
}

/** Mínimo de fontes para concluir o dossiê na jornada. */
export const FONTES_MINIMAS_DOSSIE = 4;

// ── Constantes de cruzamento ─────────────────────────────────────────────────

const NOME_ESTRUTURA: Record<string, string> = {
  esquizoide: "Esquizóide",
  oral: "Oral",
  psicopata: "Psicopata",
  masoquista: "Masoquista",
  rigido: "Rígido",
};

export { NOME_ESTRUTURA };

const NOME_TEMPERAMENTO: Record<string, string> = {
  COLERICO: "Colérico",
  SANGUINEO: "Sanguíneo",
  MELANCOLICO: "Melancólico",
  FLEUMATICO: "Fleumático",
};

const LINGUAGEM_LABEL: Record<string, string> = {
  palavras: "Palavras de Afirmação",
  tempo: "Tempo de Qualidade",
  presentes: "Presentes",
  servicos: "Atos de Serviço",
  toque: "Toque Físico",
};

const ANO_AREAS_CONEXAO: Record<number, Partial<Record<AreaVida, string>>> = {
  8: {
    recursosFinanceiros:
      "Seu Ano 8 e sua área financeira estão em confronto direto. Este é literalmente o ano do poder material, agir sobre finanças agora é aproveitar uma janela que não se repete tão cedo.",
    realizacaoProposito:
      "Ano 8 e propósito em nível baixo criam uma tensão produtiva. O universo está pressionando você a se posicionar, o que você quer construir que tenha impacto real?",
    vidaSocial:
      "Conexões com pessoas de influência são especialmente poderosas no Ano 8. Quem você precisa conhecer para o próximo capítulo?",
    saudeDisposicao:
      "No Ano 8, saúde comprometida é um dreno direto de poder. Cuide do corpo como você cuidaria do seu negócio mais importante.",
    equilibrioEmocional:
      "O Ano 8 amplifica ambição e pressão. Se o equilíbrio emocional está no meio-termo, a tensão entre conquistar e sentir pode ser o tema central deste ciclo.",
    desenvolvimentoAmoroso:
      "Relações são testadas pelo poder e pela ambição no Ano 8. Parceiros precisam de segurança para não se sentir ofuscados, equilíbrio entre metas e presença afetiva é essencial.",
  },
  2: {
    desenvolvimentoAmoroso:
      "Seu Ano 2 e sua vida amorosa estão em ressonância direta. Este é literalmente o ano das relações, o que você trabalhar aqui terá efeito multiplicado.",
    equilibrioEmocional:
      "O Ano 2 amplifica a sensibilidade emocional. Se o equilíbrio está no meio-termo, este ano convida a aprofundar a cura emocional com mais intencionalidade.",
    familia:
      "Dinâmicas familiares pedem atenção no Ano 2. Conversas que foram adiadas têm um convite especial de acontecerem agora.",
  },
  7: {
    espiritualidade:
      "Seu Ano 7 está pedindo aprofundamento espiritual. Se espiritualidade está no meio-termo, a dissonância convida a mais presença interior, não mais ritual, mas mais escuta.",
    equilibrioEmocional:
      "Introspecção necessária do Ano 7 pode revelar emoções subterrâneas. Isso não é colapso, é virada quando há prática consistente.",
  },
};

const VIDA_TRACO: Record<string, Record<string, string>> = {
  psicopata: {
    "8": "Dois sistemas de poder convergem: Caminho 8 com estrutura Psicopata. Quando alinhados, sua capacidade de impacto e realização é alta. Quando desalinhados, o comando pode virar escudo contra vulnerabilidade e vínculo. A pergunta operacional: o que você constrói serve a quem além de você?",
    "1": "Caminho 1 com estrutura Psicopata: liderança, magnetismo e visão no mesmo pacote. O que separa potencial de resultado sustentável é integrar fragilidade ao comando — liderar com presença, não só com força.",
    default:
      "Caminho de Vida com estrutura Psicopata: você move cenários com competência e presença. O desafio é integrar emoção e necessidade ao comando, porque resultados duradouros pedem confiança, não só performance.",
  },
  oral: {
    "2": "Caminho 2 com estrutura Oral: dois padrões de vínculo sobrepostos. Você lê relações com precisão, mas pode confundir cuidar do outro com sustentar a si.",
    "6": "Caminho 6 com estrutura Oral: responsabilidade relacional em dobro. A pergunta central: quem sustenta você enquanto você sustenta o ambiente?",
    default:
      "Conexão é sua linguagem primária corporal e numérica. O desafio é garantir reciprocidade — vínculo que também te nutre, não só canal de entrega.",
  },
  rigido: {
    "8": "Caminho 8 com estrutura Rígida: poder e integridade juntos. Poucos combinam realização e padrão assim. O ponto de expansão é flexibilidade emocional sem perder competência.",
    default:
      "Você entrega com qualidade e confiabilidade. O convite é permitir imperfeição e emoção sem sentir que perde valor ou controle.",
  },
  esquizoide: {
    "7": "Dois sistemas de profundidade: Caminho do Sábio e estrutura Esquizóide. O risco é a mente ficar tão rica que o contato real e o corpo presente ficam em segundo plano.",
    default:
      "Processa o mundo com profundidade incomum. A inteligência precisa de pontes para o tangível para gerar impacto fora da cabeça.",
  },
  masoquista: {
    "4": "Caminho 4 com estrutura Masoquista: persistência acima da média. O perigo é suportar o que deveria ser nomeado, limitado ou recusado.",
    default:
      "Força silenciosa construída como resposta a um ambiente que nem sempre honrou sua voz. O próximo passo é testar o que muda quando você expressa antes de acumular.",
  },
};

const TRACO_TEMPERAMENTO: Record<string, Record<string, string>> = {
  psicopata: {
    COLERICO:
      "O corpo Psicopata e o temperamento Colérico falam a mesma língua: comando, velocidade e resultado. A força é extraordinária, o risco é confundir eficiência com conexão. Quando a ação não espera o outro, o poder vira isolamento.",
    SANGUINEO:
      "Psicopata no corpo, Sanguíneo no temperamento: magnetismo social com leitura fria de cenários. Você encanta e posiciona ao mesmo tempo, mas pode usar o charme para evitar a entrega emocional que o corpo ainda resiste.",
    MELANCOLICO:
      "Por fora, presença de comando; por dentro, profundidade melancólica. A tensão entre performar força e sentir com precisão pode gerar exaustão se não houver espaço seguro para vulnerabilidade.",
    FLEUMATICO:
      "Psicopata com base fleumática: aparenta controle externo, mas por dentro há um ritmo mais lento e cauteloso. O desafio é não usar o comando como couraça permanente contra o descanso e a entrega.",
  },
  oral: {
    SANGUINEO:
      "Oral no corpo e Sanguíneo no temperamento amplificam o vínculo: você precisa de pertencimento e expressa isso com calor. O risco é dar demais para garantir que ninguém vá embora.",
    COLERICO:
      "Cuidado profundo com motor colérico: você quer nutrir, mas também quer resolver e avançar. Relações podem parecer projetos, o outro precisa de presença, não apenas de solução.",
    default:
      "A estrutura Oral pede vínculo; o temperamento modula como você busca esse vínculo. Observe se você cuida do outro para não sentir abandono.",
  },
  rigido: {
    MELANCOLICO:
      "Rígido no corpo com Melancólico no temperamento: responsabilidade e profundidade se somam. Você carrega muito; a perfeição pode virar prisão se não houver espaço para erro e descanso.",
    COLERICO:
      "Corpo Rígido com temperamento que acelera: alta capacidade de entrega, risco de burnout. A disciplina precisa incluir pausas sem culpa.",
    default:
      "Estrutura Rígida com temperamento que define o ritmo interno. O corpo segura; o sistema pede o que o corpo ainda não autoriza sentir ou expressar.",
  },
  esquizoide: {
    MELANCOLICO:
      "Dupla interioridade: mente profunda no corpo e no temperamento. Riqueza analítica rara, desde que não vire fuga do contato e do corpo presente.",
    default:
      "Processamento interior intenso. O temperamento indica como essa profundidade se manifesta no mundo, observe se você compartilha ou apenas acumula.",
  },
  masoquista: {
    FLEUMATICO:
      "Masoquista no corpo, Fleumático no temperamento: sustentação silenciosa. O padrão de engolir necessidades pode estar mais ativo do que você percebe.",
    default:
      "Força de suportar com temperamento que define se você expressa ou retém. A evolução passa por nomear limites antes do corpo cobrar a conta.",
  },
};

const TRACO_LINGUAGEM: Record<string, Partial<Record<string, string>>> = {
  psicopata: {
    servicos:
      "Corpo Psicopata com linguagem de Atos de Serviço: você demonstra vínculo fazendo, resolvendo, entregando. O outro pode precisar de palavras ou tempo, não apenas de resultados.",
    palavras:
      "Psicopata no corpo, Palavras de Afirmação na relação: há tensão entre controlar a narrativa e receber validação genuína. Receber feedback sem desconfiar pode ser trabalho de integração.",
    tempo:
      "Presença corporal de comando com necessidade de Tempo de Qualidade: você pode estar fisicamente perto e emocionalmente em modo de gestão. Presença sem agenda é o antídoto.",
    toque:
      "Couraça estratégica com Toque como linguagem: o corpo pode resistir ao contato enquanto o sistema pede proximidade. A integração começa com toque seguro e consentido, sem performance.",
  },
  oral: {
    tempo:
      "Estrutura Oral com Tempo de Qualidade: presença atenta é oxigênio emocional. Ausência ou distração do outro ativa feridas de abandono mais rápido do que conflito.",
    presentes:
      "Oral com Presentes: símbolos de cuidado importam tanto quanto a consistência. Um gesto tangível comunica \"fui visto(a)\" de forma que palavras vazias não conseguem.",
    default:
      "O corpo Oral busca pertencimento; a linguagem revela o canal exato. Alinhar como você pede e como o outro oferece reduz a sensação de vínculo insuficiente.",
  },
  rigido: {
    servicos:
      "Rígido no corpo com Atos de Serviço: cuidar é fazer e cumprir. O convite é receber apoio sem sentir que deve retribuir imediatamente com desempenho.",
    default:
      "Corpo que sustenta encontra linguagem relacional — observe se você expressa afeto por dever e não por escolha consciente.",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function nivelScore(n: number): "baixo" | "medio" | "alto" {
  if (n < 34) return "baixo";
  if (n < 67) return "medio";
  return "alto";
}

function areasOrdenadas(av: AvaliacaoDossie): { key: AreaVida; val: number }[] {
  return (Object.keys(AREAS_LABELS) as AreaVida[])
    .map((key) => ({ key, val: av[key] }))
    .sort((a, b) => a.val - b.val);
}

function rodaPlana(av: AvaliacaoDossie): boolean {
  const vals = Object.values(av);
  return vals.every((v) => v >= 4 && v <= 6);
}

function pushCruzamento(
  lista: CruzamentoDossie[],
  item: Omit<CruzamentoDossie, "relevancia"> & { relevancia: number },
) {
  lista.push(item);
}

// ── Diagnóstico emocional ──────────────────────────────────────────────────────

function montarDiagnostico(input: DossieInput): DiagnosticoEmocionalFase1 | null {
  const { idade, traco, avaliacao, diagnosticoEmocional, temperamento, linguagens } = input;
  if (!idade) return null;

  const faixaEtaria: DiagnosticoEmocionalFase1["faixaEtaria"] =
    idade <= 7 ? "4-7" : idade <= 11 ? "8-11" : idade <= 14 ? "12-14" : "15+";

  const modoColeta =
    faixaEtaria === "4-7"
      ? "observacao_dos_pais"
      : faixaEtaria === "8-11"
        ? "hibrido_crianca_responsavel"
        : "autoavaliacao";

  const diag = diagnosticoEmocional;
  const fusao = traco?.fusaoDiagnosticoEmocional;
  const padroes = diag?.padroesPct ?? null;

  if (padroes && diag) {
    const passado = Math.round(
      Math.min(100, padroes.vinculo * 0.35 + padroes.controle * 0.4 + padroes.estrategia * 0.25),
    );
    const presente = Math.round(
      Math.min(100, padroes.retencao * 0.3 + padroes.desconexao * 0.35 + padroes.controle * 0.35),
    );
    const consciencia = Math.round(Math.min(100, (diag.mediaConsciencia ?? 3) * 20));
    const nivelAtual = nivelScore(presente);
    const evolucao = nivelScore(consciencia);
    const tag = diag.tagEvolucao ?? "em_processo";

    const padraoDominante = Object.entries(padroes).sort((a, b) => b[1] - a[1])[0];
    const nomePadrao =
      padraoDominante?.[0] === "vinculo"
        ? "vínculo e pertencimento"
        : padraoDominante?.[0] === "controle"
          ? "controle emocional"
          : padraoDominante?.[0] === "estrategia"
            ? "estratégia e defesa"
            : padraoDominante?.[0] === "retencao"
              ? "retenção e acúmulo"
              : "desconexão e proteção";

    let resumo =
      `Seu eixo passado-presente indica ativação ${nivelAtual} neste momento, com consciência ${evolucao}. ` +
      `A leitura integrada aponta maior sensibilidade em ${nomePadrao}`;

    if (fusao?.alinhamentoFotosFormulario != null) {
      const alinh = fusao.alinhamentoFotosFormulario;
      if (alinh >= 70) {
        resumo += ", corpo e relato emocional convergem, o que aumenta a confiança da leitura.";
      } else if (alinh < 45) {
        resumo +=
          ", há divergência entre o que o corpo mostra e o que você declara sentir; vale explorar essa diferença com curiosidade, não com julgamento.";
      } else {
        resumo += ", com nuances entre a leitura corporal e o que você declara emocionalmente.";
      }
    } else {
      resumo += ", com potencial real de evolução quando há prática consistente.";
    }

    const passos: string[] = [];
    if (traco?.perguntaTransformacao) passos.push(traco.perguntaTransformacao.replace(/\?$/, "") + "?");
    if (temperamento?.perguntaCrescimento) passos.push(temperamento.perguntaCrescimento);
    if (linguagens?.desalinhamento?.ativo) passos.push("Alinhar como você pede apoio com como você o expressa — converse sobre isso com quem importa.");
    if (passos.length < 3) {
      passos.push(
        "Registrar gatilhos emocionais por 7 dias e observar repetição de padrão",
        "Praticar expressão emocional segura em 1 conversa importante por semana",
        "Reavaliar após 30 dias para medir deslocamento de presente e consciência",
      );
    }

    return {
      faixaEtaria,
      modoColeta,
      passado,
      presente,
      consciencia,
      nivelAtual,
      evolucao,
      tag: tag === "integrado" ? "integrado" : tag === "inconsciente" ? "inconsciente" : "em_processo",
      resumo,
      proximosPassos: passos.slice(0, 3),
      fonte: fusao ? "fusao" : "formulario",
    };
  }

  if (!traco || !avaliacao) return null;

  const dominante = Math.max(...Object.values(traco.estruturas || { a: 0 }));
  const passado = Math.round(Math.min(100, dominante * 1.15));
  const estresseAtual = (10 - avaliacao.equilibrioEmocional) * 10;
  const relacionalAtual = (10 - avaliacao.desenvolvimentoAmoroso) * 7;
  const presente = Math.round(Math.min(100, Math.max(0, estresseAtual * 0.65 + relacionalAtual * 0.35)));
  const conscienciaBase =
    (avaliacao.equilibrioEmocional + avaliacao.desenvolvimentoIntelectual + avaliacao.espiritualidade) / 30;
  const consciencia = Math.round(Math.min(100, conscienciaBase * 100));

  return {
    faixaEtaria,
    modoColeta,
    passado,
    presente,
    consciencia,
    nivelAtual: nivelScore(presente),
    evolucao: nivelScore(consciencia),
    tag: consciencia >= 70 && presente < 45 ? "integrado" : consciencia < 40 ? "inconsciente" : "em_processo",
    resumo:
      `Leitura estimada (complete o Diagnóstico Emocional para precisão total): ativação ${nivelScore(presente)} com consciência ${nivelScore(consciencia)}. ` +
      `Maior sensibilidade em situações relacionais e de controle emocional.`,
    proximosPassos: [
      "Completar o Diagnóstico Emocional de 30 perguntas no Traço de Caráter",
      "Praticar expressão emocional segura em 1 conversa importante por semana",
      "Reavaliar após 30 dias",
    ],
    fonte: "heuristica",
  };
}

// ── Cruzamentos ────────────────────────────────────────────────────────────────

function gerarCruzamentos(input: DossieInput): CruzamentoDossie[] {
  const {
    primeiroNome,
    vidaNum,
    almaNum,
    anoPessoalNum,
    traco,
    temperamento,
    linguagens,
    avaliacao,
  } = input;
  const lista: CruzamentoDossie[] = [];
  const estrutura = traco?.estruturaPrincipal ?? null;
  const bottomAreas = avaliacao ? areasOrdenadas(avaliacao).slice(0, 3) : [];

  // 1. Assinatura tripla (vida + traco + temperamento)
  if (vidaNum && estrutura && temperamento?.primario) {
    const vidaInfo = NUMEROS_DE_VIDA[vidaNum];
    const nomeEst = NOME_ESTRUTURA[estrutura] ?? estrutura;
    const nomeTemp = NOME_TEMPERAMENTO[temperamento.primario] ?? temperamento.primario;
    const arquetipoTemp = temperamento.arquetipo ?? nomeTemp;
    pushCruzamento(lista, {
      titulo: "Assinatura Integrada: Número, Corpo e Temperamento",
      corpo:
        `${primeiroNome} reúne três camadas que se reforçam: ${vidaInfo?.arquetipo ?? `Caminho ${vidaNum}`} na numerologia, ` +
        `estrutura ${nomeEst} na leitura corporal e temperamento ${arquetipoTemp}. ` +
        (temperamento.sinteseHumana
          ? `${temperamento.sinteseHumana.split(".")[0]}. `
          : "") +
        `Quando essas três leituras apontam na mesma direção, sua capacidade de impacto é rara — o trabalho é alinhar velocidade de ação com regulação emocional e vínculo.`,
      icone: "spark",
      relevancia: 100,
    });
  }

  // 2. Vida × Traço
  if (vidaNum && estrutura) {
    const combos = VIDA_TRACO[estrutura];
    const texto =
      combos?.[String(vidaNum)] ??
      combos?.default ??
      `Caminho ${vidaNum} com estrutura ${NOME_ESTRUTURA[estrutura] ?? estrutura}: duas leituras profundas que pedem integração consciente.`;
    pushCruzamento(lista, {
      titulo: "Seu Padrão Mais Profundo",
      corpo: texto.replace(/\bVocê\b/g, primeiroNome),
      icone: "brain",
      relevancia: 95,
    });
  }

  // 3. Traço × Temperamento
  if (estrutura && temperamento?.primario) {
    const mapa = TRACO_TEMPERAMENTO[estrutura];
    const texto =
      mapa?.[temperamento.primario] ??
      mapa?.default ??
      `A estrutura ${NOME_ESTRUTURA[estrutura]} no corpo e o temperamento ${NOME_TEMPERAMENTO[temperamento.primario]} no comportamento criam uma combinação única. Observe onde o corpo sustenta o que o temperamento acelera (ou freia).`;
    pushCruzamento(lista, {
      titulo: `${NOME_ESTRUTURA[estrutura] ?? estrutura} × ${NOME_TEMPERAMENTO[temperamento.primario]}`,
      corpo: texto,
      icone: "shield",
      relevancia: 88,
    });
  }

  // 4. Traço × Linguagens do amor
  if (estrutura && linguagens?.receberPrincipal) {
    const mapa = TRACO_LINGUAGEM[estrutura];
    const texto =
      mapa?.[linguagens.receberPrincipal] ??
      mapa?.default ??
      `O corpo revela ${NOME_ESTRUTURA[estrutura]}; para se sentir sustentado(a), você pede ${LINGUAGEM_LABEL[linguagens.receberPrincipal] ?? linguagens.receberPrincipal}. ` +
        `A integração passa por alinhar couraça corporal com o canal relacional que realmente recarrega seu sistema.`;
    pushCruzamento(lista, {
      titulo: `Corpo ${NOME_ESTRUTURA[estrutura]} × Canal relacional ${LINGUAGEM_LABEL[linguagens.receberPrincipal] ?? linguagens.receberPrincipal}`,
      corpo: texto,
      icone: "heart",
      relevancia: 85,
    });
  }

  // 5. Desalinhamento linguagens × relações
  if (linguagens?.desalinhamento?.ativo && avaliacao) {
    pushCruzamento(lista, {
      titulo: "Como Você Pede × Como Você Expressa Vínculo",
      corpo:
        linguagens.desalinhamento.texto +
        (avaliacao.desenvolvimentoAmoroso <= 6
          ? ` Com vida amorosa em ${avaliacao.desenvolvimentoAmoroso}/10, esse desalinhamento pode estar ativo nas relações — não por falta de intenção, mas por canais diferentes sem tradução consciente.`
          : ""),
      icone: "zap",
      relevancia: 82,
    });
  }

  // 6. Temperamento × Linguagens
  if (temperamento?.primario && linguagens?.expressarPrincipal) {
    const nomeTemp = NOME_TEMPERAMENTO[temperamento.primario];
    const nomeLing = LINGUAGEM_LABEL[linguagens.expressarPrincipal] ?? linguagens.expressarPrincipal;
    let corpo = `${nomeTemp} tende a expressar afeto de um jeito; sua linguagem principal de expressão é ${nomeLing}. `;
    if (temperamento.primario === "COLERICO" && linguagens.expressarPrincipal === "servicos") {
      corpo +=
        "Demonstrar vínculo é fazer e entregar — coerente com quem resolve. O outro pode precisar ouvir ou receber tempo, não apenas resultados.";
    } else if (temperamento.primario === "SANGUINEO" && linguagens.expressarPrincipal === "tempo") {
      corpo +=
        "Você expressa vínculo com presença viva e energia social; quando o tempo de qualidade é genuíno, seu temperamento amplifica a conexão.";
    } else {
      corpo +=
        "Quando expressão e temperamento estão alinhados, o outro sente autenticidade; quando não, pode parecer que você se importa de um jeito e age de outro.";
    }
    pushCruzamento(lista, {
      titulo: `${nomeTemp} × Expressão por ${nomeLing}`,
      corpo,
      icone: "zap",
      relevancia: 78,
    });
  }

  // 7. Ano pessoal × áreas (até 2)
  if (anoPessoalNum && bottomAreas.length > 0) {
    const conexoes = ANO_AREAS_CONEXAO[anoPessoalNum] ?? {};
    for (const area of bottomAreas.slice(0, 2)) {
      const conexao = conexoes[area.key];
      if (conexao) {
        pushCruzamento(lista, {
          titulo: `Ano ${anoPessoalNum} × ${AREAS_LABELS[area.key]}`,
          corpo: conexao,
          icone: "target",
          relevancia: 75 - area.val,
        });
      }
    }
  }

  // 8. Ressonância ano = vida
  if (anoPessoalNum && vidaNum && anoPessoalNum === vidaNum) {
    pushCruzamento(lista, {
      titulo: `Ano de Ressonância: Caminho ${vidaNum} encontra Ano ${anoPessoalNum}`,
      corpo:
        "Quando o Ano Pessoal ressoa com o seu Caminho de Vida, a energia se amplifica. Você está num momento em que sua essência mais profunda e a energia do ciclo estão alinhadas. Use isso, é mais raro do que parece.",
      icone: "spark",
      relevancia: 90,
    });
  }

  // 9. Alma × Traço
  if (almaNum && estrutura) {
    const almaMaster = almaNum === 11 || almaNum === 22 || almaNum === 33;
    if (almaMaster || almaNum === 7 || almaNum === 9) {
      pushCruzamento(lista, {
        titulo: `Alma ${almaNum} × Estrutura ${NOME_ESTRUTURA[estrutura]}`,
        corpo:
          almaNum === 11
            ? `Alma 11 pede inspiração e impacto coletivo; o corpo ${NOME_ESTRUTURA[estrutura]} define como essa missão se corporifica. A pergunta é se seu poder serve à visão maior ou apenas à autoproteção.`
            : almaNum === 7
              ? `Alma 7 busca verdade interior; a estrutura ${NOME_ESTRUTURA[estrutura]} mostra como você defende ou abre esse território no cotidiano.`
              : `Número de Alma ${almaNum} revela o desejo profundo da alma. Cruze com ${NOME_ESTRUTURA[estrutura]} para ver se o corpo autoriza o que a alma pede.`,
        icone: "eye",
        relevancia: 72,
      });
    }
  }

  // 10. Fusão emocional × traco
  const fusao = traco?.fusaoDiagnosticoEmocional;
  if (fusao?.sinaisConvergentes?.length) {
    pushCruzamento(lista, {
      titulo: "Corpo e Emoção Declarada. Convergências",
      corpo:
        fusao.sinaisConvergentes.slice(0, 2).join(" ") +
        (fusao.alinhamentoFotosFormulario != null
          ? ` Alinhamento fotos/formulário: ${fusao.alinhamentoFotosFormulario}%. Quanto maior, mais confiável a leitura integrada.`
          : ""),
      icone: "eye",
      relevancia: 80,
    });
  } else if (traco?.leituraEmocionalDeclarada) {
    pushCruzamento(lista, {
      titulo: "Emoção Declarada × Leitura Corporal",
      corpo: traco.leituraEmocionalDeclarada,
      icone: "eye",
      relevancia: 76,
    });
  }

  // 11. Couraça × equilíbrio emocional
  if (traco?.couracaCorporal && avaliacao && avaliacao.equilibrioEmocional <= 6) {
    pushCruzamento(lista, {
      titulo: "Couraça Corporal × Equilíbrio Emocional",
      corpo:
        `${traco.couracaCorporal} Com equilíbrio emocional em ${avaliacao.equilibrioEmocional}/10, essa proteção pode estar custando mais do que protegendo. O corpo segura o que a vida pede para sentir.`,
      icone: "shield",
      relevancia: 74,
    });
  }

  // 12. Roda plana (plateau)
  if (avaliacao && rodaPlana(avaliacao)) {
    pushCruzamento(lista, {
      titulo: "Mapa em Platô. Potencial Distribuído",
      corpo:
        "Todas as áreas da sua vida estão num patamar intermediário semelhante. Isso não é estagnação, é um sinal de que o próximo salto exige escolha deliberada de prioridade, não mais equilíbrio passivo." +
        (anoPessoalNum && ANOS_PESSOAIS[anoPessoalNum]
          ? `No Ano Pessoal ${anoPessoalNum}, focar uma área por trimestre pode destravar o conjunto.`
          : "Escolha uma área por trimestre e observe o efeito dominó."),
      icone: "zap",
      relevancia: 70,
    });
  }

  // 13. Ponto cego do temperamento dominante
  if (temperamento?.pontoCego) {
    pushCruzamento(lista, {
      titulo: "Ponto cego do temperamento dominante",
      corpo: temperamento.pontoCego,
      icone: "flame",
      relevancia: 68,
    });
  }

  if (temperamento?.trechoRelacoes) {
    pushCruzamento(lista, {
      titulo: "Temperamento nas relações",
      corpo: temperamento.trechoRelacoes,
      icone: "heart",
      relevancia: 66,
    });
  }

  if (temperamento?.trechoTrabalho) {
    pushCruzamento(lista, {
      titulo: "Temperamento no trabalho",
      corpo: temperamento.trechoTrabalho,
      icone: "zap",
      relevancia: 64,
    });
  }

  // 14. Síntese linguagens
  if (linguagens?.combinacao) {
    pushCruzamento(lista, {
      titulo: "Seu Perfil Relacional Integrado",
      corpo: linguagens.combinacao,
      icone: "zap",
      relevancia: 65,
    });
  }

  lista.sort((a, b) => b.relevancia - a.relevancia);

  const vistos = new Set<string>();
  return lista.filter((c) => {
    if (vistos.has(c.titulo)) return false;
    vistos.add(c.titulo);
    return true;
  }).slice(0, 8);
}

// ── Síntese e ações ────────────────────────────────────────────────────────────

function montarSinteseIdentidade(input: DossieInput): string | null {
  const { primeiroNome, vidaNum, traco, temperamento, linguagens } = input;
  if (!vidaNum && !traco) return null;

  if (traco?.sinteseHumana) {
    return traco.sinteseHumana.replace(/\bVocê\b/g, primeiroNome).replace(/\bvocê\b/g, primeiroNome.toLowerCase());
  }

  const partes: string[] = [];
  if (vidaNum && NUMEROS_DE_VIDA[vidaNum]) {
    const v = NUMEROS_DE_VIDA[vidaNum];
    partes.push(
      `${primeiroNome} é ${v.arquetipo} (Caminho ${vidaNum}), ${v.essencia?.toLowerCase().replace(/^você /, "alguém que ") ?? ""}`,
    );
  }
  if (traco?.estruturaPrincipal) {
    partes.push(
      `na leitura corporal, opera como ${NOME_ESTRUTURA[traco.estruturaPrincipal] ?? traco.estruturaPrincipal}`,
    );
  }
  if (temperamento?.arquetipo) {
    partes.push(`com temperamento ${temperamento.arquetipo}`);
  }
  if (linguagens?.receberPrincipal) {
    partes.push(
      `e pede vínculo principalmente por ${LINGUAGEM_LABEL[linguagens.receberPrincipal] ?? linguagens.receberPrincipal}`,
    );
  }
  return partes.length ? partes.join(", ").replace(/, ([^,]*)$/, " e $1") + "." : null;
}

function montarAssinatura(input: DossieInput): string | null {
  const chips: string[] = [];
  if (input.vidaNum) chips.push(`Caminho ${input.vidaNum}`);
  if (input.traco?.estruturaPrincipal)
    chips.push(NOME_ESTRUTURA[input.traco.estruturaPrincipal] ?? input.traco.estruturaPrincipal);
  if (input.temperamento?.arquetipo) chips.push(input.temperamento.arquetipo);
  if (input.anoPessoalNum) chips.push(`Ano ${input.anoPessoalNum}`);
  if (chips.length < 2) return input.traco?.fraseIdentidade ?? null;
  return chips.join(" · ");
}

function gerarAcoes(input: DossieInput, cruzamentos: CruzamentoDossie[]): string[] {
  const { anoPessoalNum, traco, temperamento, linguagens, avaliacao } = input;
  const acoes: string[] = [];

  if (anoPessoalNum && ANOS_PESSOAIS[anoPessoalNum]?.praticasSugeridas?.[0]) {
    acoes.push(ANOS_PESSOAIS[anoPessoalNum].praticasSugeridas[0]);
  }

  if (avaliacao) {
    const menor = areasOrdenadas(avaliacao)[0];
    if (menor && menor.val < 7) {
      acoes.push(
        `Priorizar ${AREAS_LABELS[menor.key]} (${menor.val}/10) com uma ação concreta esta semana, não apenas intenção.`,
      );
    }
  }

  if (temperamento?.perguntaCrescimento) {
    acoes.push(temperamento.perguntaCrescimento);
  } else if (traco?.estruturaPrincipal) {
    const sombras: Record<string, string> = {
      psicopata: "Observar onde contenção e vigilância substituem vulnerabilidade.",
      oral: "Praticar receber cuidado sem precisar merecer com utilidade.",
      rigido: "Incluir prazer e soltar o corpo sem culpa de produtividade.",
      masoquista: "Nomear um limite esta semana antes de absorver mais carga.",
      esquizoide: "Uma conversa de presença plena por semana, corpo na sala, mente no agora.",
    };
    const s = sombras[traco.estruturaPrincipal];
    if (s) acoes.push(`Sombra da estrutura ${NOME_ESTRUTURA[traco.estruturaPrincipal]}: ${s}`);
  }

  if (linguagens?.desalinhamento?.ativo) {
    acoes.push("Conversar com alguém próximo sobre como você pede apoio versus como você o demonstra.");
  }

  if (traco?.perguntaTransformacao) {
    acoes.push(traco.perguntaTransformacao.endsWith("?") ? traco.perguntaTransformacao : `${traco.perguntaTransformacao}?`);
  }

  if (input.vidaNum && NUMEROS_DE_VIDA[input.vidaNum]?.desafios?.[0]) {
    acoes.push(`Desafio do Caminho ${input.vidaNum}: ${NUMEROS_DE_VIDA[input.vidaNum].desafios[0].toLowerCase()}.`);
  }

  if (acoes.length < 2 && cruzamentos[0]) {
    acoes.push(`Refletir sobre: ${cruzamentos[0].corpo.split(".")[0]}.`);
  }

  const vistos = new Set<string>();
  return acoes.filter((a) => {
    if (vistos.has(a)) return false;
    vistos.add(a);
    return true;
  }).slice(0, 5);
}

function montarMatriz(input: DossieInput): MatrizFonte[] {
  const { vidaNum, traco, temperamento, linguagens, avaliacao, diagnosticoEmocional } = input;
  return [
    {
      id: "numerologia",
      label: "Numerologia",
      disponivel: !!vidaNum,
      resumo: vidaNum ? `Caminho ${vidaNum}` : undefined,
    },
    {
      id: "traco",
      label: "Traço de Caráter",
      disponivel: !!traco,
      resumo: traco ? `${NOME_ESTRUTURA[traco.estruturaPrincipal] ?? traco.estruturaPrincipal} ${traco.estruturas[traco.estruturaPrincipal] ?? ""}%` : undefined,
    },
    {
      id: "temperamento",
      label: "Temperamento",
      disponivel: !!temperamento,
      resumo: temperamento?.arquetipo ?? (temperamento ? NOME_TEMPERAMENTO[temperamento.primario] : undefined),
    },
    {
      id: "linguagens",
      label: "Linguagens do Amor",
      disponivel: !!linguagens,
      resumo: linguagens
        ? `Receber: ${LINGUAGEM_LABEL[linguagens.receberPrincipal] ?? linguagens.receberPrincipal}`
        : undefined,
    },
    {
      id: "roda",
      label: "Roda da Vida",
      disponivel: !!avaliacao,
      resumo: avaliacao ? "12 dimensões avaliadas" : undefined,
    },
    {
      id: "emocional",
      label: "Diagnóstico Emocional",
      disponivel: !!diagnosticoEmocional || !!traco?.fusaoDiagnosticoEmocional,
      resumo: diagnosticoEmocional?.tagEvolucao ?? (traco?.fusaoDiagnosticoEmocional ? "Fusão no Traço" : undefined),
    },
  ];
}

function montarPanoramaFuncional(input: DossieInput, cruzamentos: CruzamentoDossie[]): string | null {
  const { primeiroNome, traco, temperamento, linguagens, avaliacao, vidaNum } = input;
  if (!traco && !temperamento && !vidaNum) return null;

  const partes: string[] = [];
  const nomeEst = traco?.estruturaPrincipal
    ? NOME_ESTRUTURA[traco.estruturaPrincipal] ?? traco.estruturaPrincipal
    : null;

  if (nomeEst && temperamento?.arquetipo) {
    partes.push(
      `${primeiroNome} opera com estrutura corporal ${nomeEst} e temperamento ${temperamento.arquetipo}. ` +
        `O corpo define como você se protege e sustenta; o temperamento define ritmo, decisão e estilo de vínculo.`,
    );
  } else if (nomeEst) {
    partes.push(
      `${primeiroNome} tem como eixo corporal a estrutura ${nomeEst} — isso organiza postura, regulação emocional e como você aparece no mundo.`,
    );
  } else if (temperamento?.arquetipo) {
    partes.push(`${primeiroNome} se move com temperamento ${temperamento.arquetipo}, que orienta reação, comunicação e prioridades.`);
  }

  if (vidaNum && NUMEROS_DE_VIDA[vidaNum]) {
    partes.push(
      `Na numerologia, o Caminho ${vidaNum} (${NUMEROS_DE_VIDA[vidaNum].arquetipo}) indica o tipo de desafio e realização que atravessa sua vida.`,
    );
  }

  if (linguagens?.receberPrincipal) {
    partes.push(
      `Nas relações, você recarrega energia principalmente por ${LINGUAGEM_LABEL[linguagens.receberPrincipal] ?? linguagens.receberPrincipal}` +
        (linguagens.desalinhamento?.ativo
          ? ", mas expressa vínculo por outro canal — isso gera ruído relacional até ser nomeado."
          : "."),
    );
  }

  if (avaliacao) {
    const menor = areasOrdenadas(avaliacao)[0];
    const maior = areasOrdenadas(avaliacao).at(-1);
    if (menor && maior) {
      partes.push(
        `Na Roda da Vida, ${AREAS_LABELS[menor.key]} (${menor.val}/10) pede atenção agora; ${AREAS_LABELS[maior.key]} (${maior.val}/10) é onde você já tem tração.`,
      );
    }
  }

  if (traco?.leituraEmocionalDeclarada) {
    partes.push(traco.leituraEmocionalDeclarada.split(".")[0] + ".");
  } else if (cruzamentos[0]) {
    partes.push(cruzamentos[0].corpo.split(".")[0] + ".");
  }

  return partes.length ? partes.join(" ") : null;
}

function montarPontosChave(input: DossieInput, cruzamentos: CruzamentoDossie[]): string[] {
  const { traco, temperamento, linguagens, avaliacao, vidaNum } = input;
  const pontos: string[] = [];

  if (traco?.estruturaPrincipal) {
    const nome = NOME_ESTRUTURA[traco.estruturaPrincipal] ?? traco.estruturaPrincipal;
    pontos.push(`Seu padrão corporal dominante é ${nome} (${traco.estruturas[traco.estruturaPrincipal] ?? ""}%) — define como você regula emoção, postura e proteção.`);
    if (traco.estruturaSecundaria) {
      const sec = NOME_ESTRUTURA[traco.estruturaSecundaria] ?? traco.estruturaSecundaria;
      pontos.push(`A estrutura secundária ${sec} modula o dominante e explica tensões internas recorrentes.`);
    }
    if (traco.fraseIdentidade) pontos.push(traco.fraseIdentidade);
  }

  if (temperamento?.arquetipo) {
    pontos.push(
      `Temperamento ${temperamento.arquetipo}: orienta velocidade de decisão, estilo de comunicação e como você reage sob pressão.`,
    );
    if (temperamento.pontoCego) pontos.push(`Ponto cego: ${temperamento.pontoCego}`);
  }

  if (vidaNum && NUMEROS_DE_VIDA[vidaNum]) {
    const v = NUMEROS_DE_VIDA[vidaNum];
    pontos.push(`Caminho de Vida ${vidaNum} (${v.arquetipo}): ${v.essencia?.split(".")[0] ?? v.missao?.split(".")[0] ?? "missão central da sua trajetória"}.`);
  }

  if (linguagens?.receberPrincipal) {
    pontos.push(
      `Para se sentir sustentado(a) nas relações, você precisa de ${LINGUAGEM_LABEL[linguagens.receberPrincipal] ?? linguagens.receberPrincipal}.`,
    );
    if (linguagens.desalinhamento?.ativo) {
      pontos.push("Há desalinhamento entre como você pede e como você expressa vínculo — isso precisa ser conversado, não apenas sentido.");
    }
  }

  if (avaliacao) {
    const menor = areasOrdenadas(avaliacao)[0];
    if (menor && menor.val < 7) {
      pontos.push(`Prioridade de vida agora: ${AREAS_LABELS[menor.key]} (${menor.val}/10) — área com maior gap entre desejo e realidade.`);
    }
  }

  if (traco?.perguntaTransformacao) {
    pontos.push(`Pergunta de integração: ${traco.perguntaTransformacao}`);
  } else if (cruzamentos[0]) {
    pontos.push(`Foco de reflexão: ${cruzamentos[0].titulo}.`);
  }

  const vistos = new Set<string>();
  return pontos.filter((p) => {
    if (vistos.has(p)) return false;
    vistos.add(p);
    return true;
  }).slice(0, 7);
}

function montarMapaEntendimento(input: DossieInput): { titulo: string; texto: string }[] {
  const { traco, temperamento, linguagens, avaliacao, diagnosticoEmocional } = input;
  const mapa: { titulo: string; texto: string }[] = [];

  if (traco?.sinteseHumana || traco?.mensagemTerapeutica) {
    mapa.push({
      titulo: "Como você funciona no cotidiano",
      texto: traco.sinteseHumana ?? traco.mensagemTerapeutica ?? "",
    });
  } else if (traco?.estruturaPrincipal) {
    mapa.push({
      titulo: "Como você funciona no cotidiano",
      texto: `Estrutura ${NOME_ESTRUTURA[traco.estruturaPrincipal]}: padrão de regulação corporal e emocional que organiza como você aparece, entrega e se protege.`,
    });
  }

  if (temperamento?.sinteseHumana) {
    mapa.push({
      titulo: "Como você decide e se relaciona",
      texto: temperamento.sinteseHumana,
    });
  }

  if (linguagens?.sinteseHumana || linguagens?.combinacao) {
    mapa.push({
      titulo: "Como você pede e oferece vínculo",
      texto: linguagens.sinteseHumana ?? linguagens.combinacao ?? "",
    });
  }

  if (avaliacao) {
    const urgente = areasOrdenadas(avaliacao).slice(0, 2);
    mapa.push({
      titulo: "Onde sua vida pede atenção",
      texto: urgente
        .map((a) => `${AREAS_LABELS[a.key]}: ${a.val}/10`)
        .join(" · ") + ". Áreas com nota mais baixa indicam onde energia está drenando ou parada.",
    });
  }

  if (diagnosticoEmocional?.padroesPct) {
    const dom = Object.entries(diagnosticoEmocional.padroesPct).sort((a, b) => b[1] - a[1])[0];
    if (dom) {
      mapa.push({
        titulo: "Padrão emocional dominante",
        texto: `Maior ativação em ${dom[0]} (${Math.round(dom[1] * 100)}%). Isso cruza com a leitura corporal e explica reações automáticas em vínculo, controle ou proteção.`,
      });
    }
  }

  if (traco?.couracaCorporal) {
    mapa.push({
      titulo: "Mecanismo de proteção",
      texto: traco.couracaCorporal,
    });
  }

  return mapa.slice(0, 5);
}

// ── API pública ────────────────────────────────────────────────────────────────

export function contarFontesDisponiveis(input: DossieInput): number {
  return montarMatriz(input).filter((f) => f.disponivel).length;
}

export function gerarDossieIntegrado(input: DossieInput): DossieIntegrado {
  const cruzamentos = gerarCruzamentos(input);
  const perguntaCentral =
    input.traco?.perguntaTransformacao ??
    input.temperamento?.perguntaCrescimento ??
    (cruzamentos[0] ? `${cruzamentos[0].titulo}: o que isso pede de você agora?` : null);

  return normalizarObjetoTextos({
    sinteseIdentidade: montarSinteseIdentidade(input),
    assinaturaIntegrada: montarAssinatura(input),
    perguntaCentral,
    panoramaFuncional: montarPanoramaFuncional(input, cruzamentos),
    pontosChave: montarPontosChave(input, cruzamentos),
    mapaEntendimento: montarMapaEntendimento(input),
    cruzamentos,
    acoesPrioritarias: gerarAcoes(input, cruzamentos),
    diagnosticoEmocional: montarDiagnostico(input),
    matrizFontes: montarMatriz(input),
  });
}

/** Extrai temperamento normalizado do resultado da API. */
export function parseTemperamentoFromApi(row: { resultado?: unknown } | null): TemperamentoDossie | null {
  if (!row?.resultado || typeof row.resultado !== "object") return null;
  const r = row.resultado as Record<string, unknown>;
  const perfil = r.perfil as Record<string, unknown> | undefined;
  const primario = (perfil?.primario as TemperamentoCodigo) ?? null;
  if (!primario) return null;
  const secundario = (perfil?.secundario as TemperamentoCodigo) ?? primario;
  const tipo = (perfil?.tipo as TipoPerfil) ?? "DOMINANTE";
  const scores = r.scores as Record<string, unknown> | undefined;
  const analise = r.analiseAprofundada as { id: string; paragrafos: string[] }[] | undefined;
  const secRel = analise?.find((s) => s.id === "relacoes");
  const secTrab = analise?.find((s) => s.id === "trabalho");
  return {
    primario,
    secundario: perfil?.secundario as string | undefined,
    arquetipo: tituloPerfilTemperamento(primario, secundario, tipo),
    sinteseHumana: r.sinteseHumana as string | undefined,
    perguntaCrescimento: r.perguntaCrescimento as string | undefined,
    pontoCego: r.pontoCego as string | undefined,
    trechoRelacoes: secRel?.paragrafos[0],
    trechoTrabalho: secTrab?.paragrafos[0],
    scoreE: scores?.scoreE as number | undefined,
    estabilidadeEmocional: scores?.estabilidadeEmocional as number | undefined,
    dimensoesLegiveis: r.dimensoesLegiveis as TemperamentoDossie["dimensoesLegiveis"],
  };
}

/** Extrai linguagens normalizadas do resultado da API. */
export function parseLinguagensFromApi(row: { resultado?: unknown } | null): LinguagensDossie | null {
  if (!row?.resultado || typeof row.resultado !== "object") return null;
  const r = row.resultado as Record<string, unknown>;
  const receber = r.receber as { principal?: string; secundaria?: string } | undefined;
  const expressar = r.expressar as { principal?: string; secundaria?: string } | undefined;
  const principal = (receber?.principal ?? r.principal) as string | undefined;
  if (!principal) return null;
  return {
    receberPrincipal: principal,
    receberSecundaria: receber?.secundaria,
    expressarPrincipal: (expressar?.principal ?? principal) as string,
    expressarSecundaria: expressar?.secundaria,
    desalinhamento: r.desalinhamento as LinguagensDossie["desalinhamento"],
    sinteseHumana: r.sinteseHumana as string | undefined,
    combinacao: r.combinacao as string | undefined,
  };
}

/** Extrai diagnóstico emocional do Traço ou do endpoint dedicado. */
export function parseDiagnosticoEmocional(
  traco: TracoDossie | null,
  row: { resultado?: unknown } | null,
): DiagnosticoEmocionalDb | null {
  if (row?.resultado && typeof row.resultado === "object") {
    const r = row.resultado as DiagnosticoEmocionalDb;
    if (r.padroesPct) return r;
  }
  const entrada = traco?.fusaoDiagnosticoEmocional?.entradaDiagnostico as DiagnosticoEmocionalDb | undefined;
  if (entrada?.padroesPct) return entrada;
  return null;
}
