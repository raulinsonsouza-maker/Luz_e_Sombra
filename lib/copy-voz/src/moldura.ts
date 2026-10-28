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

export type SlotsLeitura = Record<SlotId, string>;

export type SecaoLeitura = {
  id: SlotId;
  titulo: string;
  texto: string;
};

export type LeituraPortal = {
  secoes: SecaoLeitura[];
};
