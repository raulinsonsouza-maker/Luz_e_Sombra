/** Ordem e títulos da leitura. Os painéis não conhecem estes nomes. */
export const MOLDURA = {
  secoes: [
    { id: "quemVoceE", titulo: "Quem você é" },
    { id: "noDiaADia", titulo: "No dia a dia" },
    { id: "sombra", titulo: "A sombra" },
    { id: "oQueFazer", titulo: "O que fazer com isso" },
  ],
} as const;

export type SlotId = (typeof MOLDURA.secoes)[number]["id"];

/** Um pedaço da leitura. O rótulo vira o título curto acima do texto. */
export type ItemLeitura = {
  rotulo?: string;
  texto: string;
};

export type PecaLeitura = string | ItemLeitura;

/** Um texto corrido ou vários pedaços. Cada pedaço vira um parágrafo na tela. */
export type ConteudoSlot = PecaLeitura | readonly PecaLeitura[];

export type SlotsLeitura = Record<SlotId, ConteudoSlot>;

export type SecaoLeitura = {
  id: SlotId;
  titulo: string;
  texto: string;
  paragrafos: string[];
  itens: ItemLeitura[];
};

export type LeituraPortal = {
  secoes: SecaoLeitura[];
};
