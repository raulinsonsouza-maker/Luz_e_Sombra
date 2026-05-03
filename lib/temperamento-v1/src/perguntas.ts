import type { Dimensao } from "./types";

export interface ItemPergunta {
  codigo: string;
  texto: string;
  dimensao: Dimensao;
  peso: number;
  reversa: boolean;
}

/** 40 itens — mesma estrutura de pesos em todas as dimensões (3×1.2 + 5×1.0 = 8.6). */
export const PERGUNTAS: readonly ItemPergunta[] = [
  // ENG
  { codigo: "ENG01", texto: "Eu costumo agir antes mesmo de ter um plano completo.", dimensao: "ENG", peso: 1.2, reversa: false },
  { codigo: "ENG02", texto: "Quando estou parado por muito tempo, sinto uma inquietação física.", dimensao: "ENG", peso: 1.0, reversa: false },
  { codigo: "ENG03", texto: "Tarefas repetitivas ou lentas me esgotam mais do que tarefas difíceis.", dimensao: "ENG", peso: 1.0, reversa: false },
  { codigo: "ENG04", texto: "Prefiro começar algo imperfeito agora do que esperar o momento ideal.", dimensao: "ENG", peso: 1.2, reversa: false },
  { codigo: "ENG05", texto: "Sinto energia aumentar quando enfrento desafios imediatos.", dimensao: "ENG", peso: 1.0, reversa: false },
  { codigo: "ENG06", texto: "Tenho tendência a acelerar processos mesmo quando outros preferem ir devagar.", dimensao: "ENG", peso: 1.0, reversa: false },
  { codigo: "ENG07", texto: "Gosto de ter múltiplas coisas acontecendo ao mesmo tempo.", dimensao: "ENG", peso: 1.0, reversa: false },
  { codigo: "ENG08", texto: "Raramente sinto necessidade de pausar para 'recarregar' antes de continuar.", dimensao: "ENG", peso: 1.2, reversa: false },
  // SOC
  { codigo: "SOC01", texto: "Ambientes movimentados e cheios de pessoas me energizam.", dimensao: "SOC", peso: 1.2, reversa: false },
  { codigo: "SOC02", texto: "Converso com facilidade, mesmo com pessoas que acabei de conhecer.", dimensao: "SOC", peso: 1.0, reversa: false },
  { codigo: "SOC03", texto: "Expresso o que sinto de forma espontânea, sem precisar de muito esforço.", dimensao: "SOC", peso: 1.0, reversa: false },
  { codigo: "SOC04", texto: "Me sinto desconfortável quando fico isolado por períodos longos.", dimensao: "SOC", peso: 1.2, reversa: false },
  { codigo: "SOC05", texto: "Gosto de ser o centro das atenções em situações sociais.", dimensao: "SOC", peso: 1.0, reversa: false },
  { codigo: "SOC06", texto: "Tenho facilidade em animar e engajar grupos de pessoas.", dimensao: "SOC", peso: 1.0, reversa: false },
  { codigo: "SOC07", texto: "Prefiro trabalhar com outras pessoas do que trabalhar sozinho.", dimensao: "SOC", peso: 1.0, reversa: false },
  { codigo: "SOC08", texto: "Me sinto mais vivo em situações sociais do que em momentos de solitude.", dimensao: "SOC", peso: 1.2, reversa: false },
  // DOM
  { codigo: "DOM01", texto: "Em grupos, naturalmente assumo a direção das coisas.", dimensao: "DOM", peso: 1.2, reversa: false },
  { codigo: "DOM02", texto: "Me incomoda profundamente não ter controle sobre situações importantes.", dimensao: "DOM", peso: 1.0, reversa: false },
  { codigo: "DOM03", texto: "Tomo decisões rápidas mesmo sob pressão e incerteza.", dimensao: "DOM", peso: 1.2, reversa: false },
  { codigo: "DOM04", texto: "Quando algo não sai como planejei, sinto frustração intensa.", dimensao: "DOM", peso: 1.0, reversa: false },
  { codigo: "DOM05", texto: "Prefiro assumir responsabilidade total a dividir o controle.", dimensao: "DOM", peso: 1.0, reversa: false },
  { codigo: "DOM06", texto: "Sou naturalmente competitivo e orientado a superar metas.", dimensao: "DOM", peso: 1.0, reversa: false },
  { codigo: "DOM07", texto: "Tenho dificuldade em aceitar que alguém menos capaz esteja no comando.", dimensao: "DOM", peso: 1.0, reversa: false },
  { codigo: "DOM08", texto: "Quando acredito que estou certo, defendo minha posição com firmeza.", dimensao: "DOM", peso: 1.2, reversa: false },
  // EST
  { codigo: "EST01", texto: "Mantenho a calma mesmo quando a situação ao redor está caótica.", dimensao: "EST", peso: 1.2, reversa: false },
  { codigo: "EST02", texto: "Evito conflitos diretos sempre que existe uma alternativa diplomática.", dimensao: "EST", peso: 1.0, reversa: false },
  { codigo: "EST03", texto: "Demoro para ter reações emocionais fortes — processo antes de sentir.", dimensao: "EST", peso: 1.2, reversa: false },
  { codigo: "EST04", texto: "Tenho paciência genuína com pessoas e processos lentos.", dimensao: "EST", peso: 1.0, reversa: false },
  { codigo: "EST05", texto: "É raro eu ter explosões emocionais, mesmo em situações muito difíceis.", dimensao: "EST", peso: 1.0, reversa: false },
  { codigo: "EST06", texto: "Priorizo harmonia nos relacionamentos, mesmo que isso exija ceder.", dimensao: "EST", peso: 1.0, reversa: false },
  { codigo: "EST07", texto: "Sou visto pelas pessoas como uma presença estabilizadora e confiável.", dimensao: "EST", peso: 1.0, reversa: false },
  { codigo: "EST08", texto: "Recupero meu equilíbrio rapidamente após situações de estresse intenso.", dimensao: "EST", peso: 1.2, reversa: false },
  // PRO
  { codigo: "PRO01", texto: "Analiso uma situação em múltiplos ângulos antes de agir.", dimensao: "PRO", peso: 1.2, reversa: false },
  { codigo: "PRO02", texto: "Percebo detalhes e inconsistências que as outras pessoas costumam ignorar.", dimensao: "PRO", peso: 1.0, reversa: false },
  { codigo: "PRO03", texto: "Tenho tendência a overthinking — penso demais antes de decidir.", dimensao: "PRO", peso: 1.0, reversa: false },
  { codigo: "PRO04", texto: "Busco precisão e perfeição, mesmo quando 'bom o suficiente' já seria aceitável.", dimensao: "PRO", peso: 1.2, reversa: false },
  { codigo: "PRO05", texto: "Prefiro profundidade de análise à velocidade de execução.", dimensao: "PRO", peso: 1.0, reversa: false },
  { codigo: "PRO06", texto: "Planejo com cuidado e detalhe antes de executar qualquer projeto significativo.", dimensao: "PRO", peso: 1.0, reversa: false },
  { codigo: "PRO07", texto: "Reviso decisões mentalmente mesmo depois de tomadas.", dimensao: "PRO", peso: 1.0, reversa: false },
  { codigo: "PRO08", texto: "Tenho um senso crítico elevado — tanto com meu trabalho quanto com o dos outros.", dimensao: "PRO", peso: 1.2, reversa: false },
] as const;

export const CODIGOS_PERGUNTA = PERGUNTAS.map((p) => p.codigo);

export const CODIGOS_SET = new Set(CODIGOS_PERGUNTA);

export function perguntasPorDimensao(d: Dimensao): readonly ItemPergunta[] {
  return PERGUNTAS.filter((p) => p.dimensao === d);
}
