import type { TemperamentoCodigo } from "./types";

export type LadoEscolha = "a" | "b";

export interface ParForcadoTemperamento {
  id: string;
  textoA: string;
  textoB: string;
  temperamentoA: TemperamentoCodigo;
  temperamentoB: TemperamentoCodigo;
}

/** 24 escolhas forçadas — cada temperamento aparece 12 vezes (matriz 6×4). */
export const CODIGOS_PAR = [
  "T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08",
  "T09", "T10", "T11", "T12", "T13", "T14", "T15", "T16",
  "T17", "T18", "T19", "T20", "T21", "T22", "T23", "T24",
] as const;

export type CodigoPar = (typeof CODIGOS_PAR)[number];

export const PARES_FORCADOS: readonly ParForcadoTemperamento[] = [
  // Colérico × Sanguíneo
  {
    id: "T01",
    textoA: "Preciso ver resultado concreto ainda hoje.",
    textoB: "Preciso sentir que a equipa está motivada e envolvida.",
    temperamentoA: "COLERICO",
    temperamentoB: "SANGUINEO",
  },
  {
    id: "T02",
    textoA: "Adoro quando um ambiente ganha vida e energia.",
    textoB: "Adoro quando um projeto cruza a meta de entrega.",
    temperamentoA: "SANGUINEO",
    temperamentoB: "COLERICO",
  },
  {
    id: "T03",
    textoA: "Em grupo, naturalmente tomo a frente e distribuo tarefas.",
    textoB: "Em grupo, animo o ambiente e conecto quem precisa falar.",
    temperamentoA: "COLERICO",
    temperamentoB: "SANGUINEO",
  },
  {
    id: "T04",
    textoA: "Prefiro improvisar com as pessoas do que seguir roteiro.",
    textoB: "Prefiro roteiro claro com prazos do que improvisar sem rumo.",
    temperamentoA: "SANGUINEO",
    temperamentoB: "COLERICO",
  },
  // Colérico × Melancólico
  {
    id: "T05",
    textoA: "Melhor feito hoje do que perfeito amanhã.",
    textoB: "Melhor bem feito do que rápido e com falhas.",
    temperamentoA: "COLERICO",
    temperamentoB: "MELANCOLICO",
  },
  {
    id: "T06",
    textoA: "Antes de agir, preciso entender todas as implicações.",
    textoB: "Entendo melhor quando já estou em movimento.",
    temperamentoA: "MELANCOLICO",
    temperamentoB: "COLERICO",
  },
  {
    id: "T07",
    textoA: "Metas ambiciosas me energizam.",
    textoB: "Qualidade e significado importam mais que velocidade.",
    temperamentoA: "COLERICO",
    temperamentoB: "MELANCOLICO",
  },
  {
    id: "T08",
    textoA: "Crítica construtiva me ajuda a melhorar.",
    textoB: "Feedback demorado me frustra quando preciso avançar.",
    temperamentoA: "MELANCOLICO",
    temperamentoB: "COLERICO",
  },
  // Colérico × Fleumático
  {
    id: "T09",
    textoA: "Conflito direto às vezes é necessário para avançar.",
    textoB: "Harmonia no grupo vale mais que ter razão na hora.",
    temperamentoA: "COLERICO",
    temperamentoB: "FLEUMATICO",
  },
  {
    id: "T10",
    textoA: "Mantenho calma mesmo quando tudo parece urgente.",
    textoB: "Urgência me faz performar no meu melhor nível.",
    temperamentoA: "FLEUMATICO",
    temperamentoB: "COLERICO",
  },
  {
    id: "T11",
    textoA: "Decisões rápidas são melhores que esperar consenso.",
    textoB: "Prefiro ouvir todos antes de fechar uma decisão.",
    temperamentoA: "COLERICO",
    temperamentoB: "FLEUMATICO",
  },
  {
    id: "T12",
    textoA: "Rotina estável me deixa tranquilo.",
    textoB: "Mudança constante me mantém vivo e focado.",
    temperamentoA: "FLEUMATICO",
    temperamentoB: "COLERICO",
  },
  // Sanguíneo × Melancólico
  {
    id: "T13",
    textoA: "Festas e encontros sociais me recarregam.",
    textoB: "Tempo a sós para pensar me recarrega.",
    temperamentoA: "SANGUINEO",
    temperamentoB: "MELANCOLICO",
  },
  {
    id: "T14",
    textoA: "Detalhes que outros ignoram eu percebo logo.",
    textoB: "O quadro geral importa mais que cada detalhe.",
    temperamentoA: "MELANCOLICO",
    temperamentoB: "SANGUINEO",
  },
  {
    id: "T15",
    textoA: "Falo o que penso na hora, com espontaneidade.",
    textoB: "Penso muito antes de dizer algo que possa magoar.",
    temperamentoA: "SANGUINEO",
    temperamentoB: "MELANCOLICO",
  },
  {
    id: "T16",
    textoA: "Profundidade em poucas relações me satisfaz.",
    textoB: "Conhecer muitas pessoas me dá energia.",
    temperamentoA: "MELANCOLICO",
    temperamentoB: "SANGUINEO",
  },
  // Sanguíneo × Fleumático
  {
    id: "T17",
    textoA: "Adoro ser notado e ouvido num grupo.",
    textoB: "Prefiro observar em silêncio e entrar só quando necessário.",
    temperamentoA: "SANGUINEO",
    temperamentoB: "FLEUMATICO",
  },
  {
    id: "T18",
    textoA: "Paz e estabilidade são meu ideal diário.",
    textoB: "Novidade e surpresa deixam meu dia mais vivo.",
    temperamentoA: "FLEUMATICO",
    temperamentoB: "SANGUINEO",
  },
  {
    id: "T19",
    textoA: "Multitarefa e estímulo constante me funcionam bem.",
    textoB: "Um ritmo calmo e previsível me funciona melhor.",
    temperamentoA: "SANGUINEO",
    temperamentoB: "FLEUMATICO",
  },
  {
    id: "T20",
    textoA: "Evito drama e prefiro ambientes previsíveis.",
    textoB: "Emoção intensa faz parte de uma vida plena.",
    temperamentoA: "FLEUMATICO",
    temperamentoB: "SANGUINEO",
  },
  // Melancólico × Fleumático
  {
    id: "T21",
    textoA: "Perfeccionismo me impede de aceitar 'mais ou menos'.",
    textoB: "'Bom o suficiente' me permite viver em paz.",
    temperamentoA: "MELANCOLICO",
    temperamentoB: "FLEUMATICO",
  },
  {
    id: "T22",
    textoA: "Aceito situações imperfeitas sem grande angústia.",
    textoB: "Erros e falhas me incomodam por dentro.",
    temperamentoA: "FLEUMATICO",
    temperamentoB: "MELANCOLICO",
  },
  {
    id: "T23",
    textoA: "Analiso profundamente antes de me comprometer.",
    textoB: "Prefiro ir com calma sem pressão de decidir já.",
    temperamentoA: "MELANCOLICO",
    temperamentoB: "FLEUMATICO",
  },
  {
    id: "T24",
    textoA: "Sou paciente com processos lentos dos outros.",
    textoB: "Inconsistência e falta de rigor me irritam.",
    temperamentoA: "FLEUMATICO",
    temperamentoB: "MELANCOLICO",
  },
] as const;

export const TOTAL_PARES = PARES_FORCADOS.length;

export function parPorId(id: string): ParForcadoTemperamento | undefined {
  return PARES_FORCADOS.find((p) => p.id === id);
}
