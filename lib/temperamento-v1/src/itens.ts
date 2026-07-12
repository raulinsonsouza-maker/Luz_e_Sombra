export type EixoEysenck = "E" | "N";
export type RespostaSimNao = "sim" | "nao";
export type CodigoItem = `E${string}` | `N${string}`;

export interface ItemTemperamento {
  id: CodigoItem;
  texto: string;
  eixo: EixoEysenck;
  /** "sim" pontua 1 quando direcao positiva; "nao" pontua 1 quando direcao negativa. */
  direcao: "positiva" | "negativa";
}

export const ITENS_EYSENCK: readonly ItemTemperamento[] = [
  // Extroversão
  { id: "E01", texto: "Gosto de estar no centro das atenções em grupos.", eixo: "E", direcao: "positiva" },
  { id: "E02", texto: "Inicio conversas com pessoas que não conheço com facilidade.", eixo: "E", direcao: "positiva" },
  { id: "E03", texto: "Sinto-me com mais energia quando estou rodeado de gente.", eixo: "E", direcao: "positiva" },
  { id: "E04", texto: "Prefiro liderar ou tomar a frente quando surge uma tarefa em grupo.", eixo: "E", direcao: "positiva" },
  { id: "E05", texto: "Preciso de tempo sozinho para recarregar depois de eventos sociais.", eixo: "E", direcao: "negativa" },
  { id: "E06", texto: "Evito chamar atenção para mim em situações públicas.", eixo: "E", direcao: "negativa" },
  { id: "E07", texto: "Prefiro trabalhar sozinho a depender de muita interação constante.", eixo: "E", direcao: "negativa" },
  { id: "E08", texto: "Em festas, costumo ficar mais à margem do que no centro da conversa.", eixo: "E", direcao: "negativa" },
  // Neuroticismo (estabilidade emocional invertida na UI)
  { id: "N01", texto: "Pequenas críticas me incomodam por muito tempo.", eixo: "N", direcao: "positiva" },
  { id: "N02", texto: "Preocupo-me com coisas que ainda não aconteceram.", eixo: "N", direcao: "positiva" },
  { id: "N03", texto: "Meu humor muda com facilidade ao longo do dia.", eixo: "N", direcao: "positiva" },
  { id: "N04", texto: "Sinto-me tenso quando as coisas saem do planejado.", eixo: "N", direcao: "positiva" },
  { id: "N05", texto: "Mantenho a calma mesmo quando há pressão em volta.", eixo: "N", direcao: "negativa" },
  { id: "N06", texto: "Recupero-me rápido depois de um dia difícil.", eixo: "N", direcao: "negativa" },
  { id: "N07", texto: "Raramente fico remoendo erros do passado.", eixo: "N", direcao: "negativa" },
  { id: "N08", texto: "Consigo separar o que sinto do que preciso fazer na hora.", eixo: "N", direcao: "negativa" },
] as const;

export const CODIGOS_ITEM = ITENS_EYSENCK.map((i) => i.id);
export const TOTAL_ITENS = ITENS_EYSENCK.length;

const MAPA = new Map(ITENS_EYSENCK.map((i) => [i.id, i]));

export function itemPorId(id: string): ItemTemperamento | undefined {
  return MAPA.get(id as CodigoItem);
}
