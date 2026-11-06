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
  const np = NOME_TEMPERAMENTO[opts.primario];
  return [
    `Isto descreve o jeito mais constante de você reagir. Não é uma caixa fechada. O que mais aparece é o jeito ${np}.`,
    "O questionário separa quatro jeitos: animar as pessoas, resolver e cobrar, pensar fundo antes de agir, e manter a calma.",
    "Se um segundo jeito aparece perto do primeiro, os dois são seus. Um manda quando você está com pressa. O outro aparece quando você relaxa.",
  ];
}

function paragrafoUnicoMotor(primario: TemperamentoCodigo): string {
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
  return base[primario];
}

function paragrafoDecisao(primario: TemperamentoCodigo): string {
  const bases: Record<TemperamentoCodigo, string> = {
    COLERICO: "Você decide para agir. Escolhe um caminho e corrige depois, em vez de esperar o cenário perfeito.",
    SANGUINEO: "Você decide pelo clima e pela chance do momento. Lê as pessoas rápido, e pode mudar de rota quando surge algo mais animado.",
    MELANCOLICO: "Você decide depois de olhar os riscos e os detalhes. Quanto mais importante, mais você pensa antes de fechar.",
    FLEUMATICO: "Você decide pelo caminho que machuca menos as pessoas. Pode demorar quando sente que alguém vai ficar incomodado.",
  };
  return bases[primario];
}

function paragrafoReacao(primario: TemperamentoCodigo): string {
  const bases: Record<TemperamentoCodigo, string> = {
    COLERICO: "No dia a dia, você empurra a tarefa para frente. Quando a carga passa do limite, a pressa vira impaciência com quem está mais lento.",
    SANGUINEO: "No dia a dia, você anima, conversa e improvisa. Sem gente e sem novidade, a vontade se espalha e a tarefa fica pela metade.",
    MELANCOLICO: "No dia a dia, você observa, planeja e capricha. Quando a pressa aperta, o medo de errar pode travar a entrega.",
    FLEUMATICO: "No dia a dia, você sustenta o ritmo e evita briga. Quando a pressão sobe, pode ficar quieto demais para não criar clima.",
  };
  return bases[primario];
}

function sombraComExemplo(primario: TemperamentoCodigo): string[] {
  const map: Record<TemperamentoCodigo, string[]> = {
    COLERICO: [
      "O exagero aparece quando tudo vira urgência. Você ganha a tarefa e perde a relação, ou decide por todos sem consultar.",
      "Exemplo: em uma reunião tensa, você fecha o assunto rápido. O problema 'some', mas o ressentimento fica.",
    ],
    SANGUINEO: [
      "O exagero aparece quando a empolgação inicial some. Projetos, conversas ou compromissos podem ficar pela metade.",
      "Exemplo: você se entusiasma com uma ideia, começa com força e, semanas depois, já está em outra frente.",
    ],
    MELANCOLICO: [
      "O exagero aparece quando o medo de errar trava você. Pensar demais toma o lugar de agir.",
      "Exemplo: você adia enviar um trabalho porque ainda não está 'como deveria', mesmo já sendo suficiente.",
    ],
    FLEUMATICO: [
      "O exagero aparece quando a paz vira silêncio sobre o que importa. Você engole incômodos até não dar mais.",
      "Exemplo: você concorda por fora, acumula por dentro e explode ou se afasta sem avisar.",
    ],
  };
  return map[primario];
}

function leituraEixosPedagogica(): string[] {
  return [
    "Leia isto como um espelho do seu jeito, não como uma nota. O que combina com a sua semana, fique. O que não combina, solte.",
    "Nenhum jeito é melhor do que o outro. Cada um tem um dom e um exagero.",
    "Se o texto não parecer você, refaça o questionário com calma. Responda pelo que acontece na maior parte do tempo, não pelo dia de hoje.",
  ];
}

export function montarAnaliseAprofundada(opts: EntradaAnaliseAprofundada): RelatorioSecao[] {
  const { primario, secundario, tipo, empateProximo } = opts;
  const secoes: RelatorioSecao[] = [
    { id: "mapa", titulo: "O seu jeito", paragrafos: mapaTemperamental(opts) },
    { id: "motor", titulo: "O que te move", paragrafos: [paragrafoUnicoMotor(primario)] },
    { id: "decisao", titulo: "Como você decide", paragrafos: [paragrafoDecisao(primario)] },
    { id: "reacao", titulo: "No dia a dia", paragrafos: [paragrafoReacao(primario)] },
    { id: "relacoes", titulo: "Com as pessoas", paragrafos: [RELACOES[primario]] },
    { id: "trabalho", titulo: "No trabalho", paragrafos: [TRABALHO[primario]] },
    { id: "sombra", titulo: "Quando passa do ponto", paragrafos: sombraComExemplo(primario) },
    {
      id: "crescimento",
      titulo: "O que fazer agora",
      paragrafos: [
        "Três passos para as próximas semanas. Faça um de cada vez, sem esperar o dia perfeito:",
        ...PROTOCOLO[primario].map((p, i) => `${i + 1}. ${p}`),
      ],
    },
    { id: "eixos", titulo: "Como ler isto", paragrafos: leituraEixosPedagogica() },
  ];

  if ((tipo === "DUPLO" || tipo === "MISTO" || empateProximo) && primario !== secundario) {
    secoes.splice(1, 0, {
      id: "dinamica",
      titulo: "A dinâmica interna do seu perfil",
      paragrafos: [
        `O que mais aparece é o jeito ${NOME_TEMPERAMENTO[primario]}, com um traço de ${NOME_TEMPERAMENTO[secundario]}. Uma parte puxa para um lado. A outra ajusta o resultado.`,
        empateProximo
          ? "Os dois jeitos estão perto. Por isso, em dias diferentes, você pode parecer outra pessoa."
          : "O segundo jeito não apaga o primeiro. Ele aparece nas decisões, nas conversas e quando a pressão sobe.",
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
