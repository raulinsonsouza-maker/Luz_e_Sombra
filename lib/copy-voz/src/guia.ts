/** Regras editoriais para copy user-facing (PT-BR, você). */
export const VOZ_REGRAS = {
  pessoa: "você",
  proibido: ["—"] as const,
  citacao: '"..."',
  preferir: "em vez de",
} as const;

/** Substituições PT-PT → PT-BR (ordem importa: frases longas primeiro). */
export const MAPA_PT_BR: ReadonlyArray<[RegExp, string]> = [
  [/Como pensas\b/g, "Como você pensa"],
  [/Como ages\b/g, "Como você age"],
  [/A tua força real/g, "A sua força real"],
  [/Padrão de sabotagem/g, "Padrão de autossabotagem"],
  [/Próximo passo/g, "Próximo passo"],
  [/está a olhar/g, "está olhando"],
  [/quando ninguém está a olhar/g, "quando ninguém está olhando"],
  [/\bteu Eu\b/g, "seu Eu"],
  [/\bteu\b/g, "seu"],
  [/\btua\b/g, "sua"],
  [/\bVais ver\b/g, "Você verá"],
  [/\bvais ver\b/g, "você verá"],
  [/\bcontigo\b/g, "com você"],
  [/\bpara ti\b/g, "para você"],
];

/** Inglês coloquial → PT-BR. */
export const MAPA_LEXICO: ReadonlyArray<[RegExp, string]> = [
  [/\bbreakdown\b/gi, "colapso"],
  [/\bbreakthrough\b/gi, "virada"],
  [/\bfeedback\b/gi, "retorno"],
  [/\bao invés de\b/g, "em vez de"],
];
