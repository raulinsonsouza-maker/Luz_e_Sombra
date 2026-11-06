import type { TemperamentoCodigo } from "./types";

export type EixoEysenck = "E" | "N";
export type RespostaSimNao = "sim" | "nao";
export type CodigoItem = `E${string}` | `N${string}`;

export interface ItemTemperamento {
  id: CodigoItem;
  texto: string;
  eixo: EixoEysenck;
  /** "sim" pontua 1 quando direcao positiva; "nao" pontua 1 quando direcao negativa. */
  direcao: "positiva" | "negativa";
  /** Jeito que esta frase descreve. Sim (ou não, se a direção for negativa) soma neste temperamento. */
  alvo: TemperamentoCodigo;
}

export const ITENS_EYSENCK: readonly ItemTemperamento[] = [
  { id: "E01", texto: "Eu puxo assunto com facilidade, até com quem acabei de conhecer.", eixo: "E", direcao: "positiva", alvo: "SANGUINEO" },
  { id: "E02", texto: "Estar no meio das pessoas me anima mais do que me cansa.", eixo: "E", direcao: "positiva", alvo: "SANGUINEO" },
  { id: "E03", texto: "Quando algo me chateia, eu desabafo e logo volto ao bom humor.", eixo: "E", direcao: "positiva", alvo: "SANGUINEO" },
  { id: "E04", texto: "Eu gosto de contar história e fazer as pessoas rirem.", eixo: "E", direcao: "positiva", alvo: "SANGUINEO" },
  { id: "E05", texto: "Se ninguém decide, eu tomo a frente e resolvo.", eixo: "E", direcao: "positiva", alvo: "COLERICO" },
  { id: "E06", texto: "Eu fico irritado quando as pessoas demoram para ir ao ponto.", eixo: "E", direcao: "positiva", alvo: "COLERICO" },
  { id: "E07", texto: "Eu prefiro terminar a tarefa a ficar conversando sem conclusão.", eixo: "E", direcao: "positiva", alvo: "COLERICO" },
  { id: "E08", texto: "Quando alguém atrasa o que combinou, eu cobro na hora.", eixo: "E", direcao: "positiva", alvo: "COLERICO" },
  { id: "N01", texto: "Eu penso bastante antes de decidir, para não errar.", eixo: "N", direcao: "positiva", alvo: "MELANCOLICO" },
  { id: "N02", texto: "Uma crítica fica na minha cabeça por vários dias.", eixo: "N", direcao: "positiva", alvo: "MELANCOLICO" },
  { id: "N03", texto: "Eu reparo em detalhes que a maioria deixa passar.", eixo: "N", direcao: "positiva", alvo: "MELANCOLICO" },
  { id: "N04", texto: "Eu guardo o que sinto em vez de falar na hora.", eixo: "N", direcao: "positiva", alvo: "MELANCOLICO" },
  { id: "N05", texto: "Eu mantenho a calma mesmo quando todo mundo está nervoso.", eixo: "N", direcao: "positiva", alvo: "FLEUMATICO" },
  { id: "N06", texto: "Eu evito discussão, mesmo quando discordo.", eixo: "N", direcao: "positiva", alvo: "FLEUMATICO" },
  { id: "N07", texto: "Eu gosto de rotina e não tenho pressa para mudar as coisas.", eixo: "N", direcao: "positiva", alvo: "FLEUMATICO" },
  { id: "N08", texto: "As pessoas me procuram porque eu escuto sem interromper.", eixo: "N", direcao: "positiva", alvo: "FLEUMATICO" },
] as const;

export const CODIGOS_ITEM = ITENS_EYSENCK.map((i) => i.id);
export const TOTAL_ITENS = ITENS_EYSENCK.length;

const MAPA = new Map(ITENS_EYSENCK.map((i) => [i.id, i]));

export function itemPorId(id: string): ItemTemperamento | undefined {
  return MAPA.get(id as CodigoItem);
}
