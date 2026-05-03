/** Textos canónicos (v1) — alinhados à especificação de produto. */

export const ESCALA_PASSADO_LABELS = [
  "Nunca",
  "Pouco",
  "Moderado",
  "Muito",
  "Extremamente",
] as const;

export const ESCALA_PRESENTE_LABELS = [
  "Não é mais assim",
  "Raramente",
  "Às vezes",
  "Frequentemente",
  "Muito forte ainda",
] as const;

export const ESCALA_CONSCIENCIA_LABELS = [
  "Nada",
  "Pouco",
  "Médio",
  "Bastante",
  "Muito",
] as const;

/** 25 itens com dupla escala (índice 0 = pergunta 1). */
export const PERGUNTAS_PASSADO_PRESENTE: readonly string[] = [
  "Eu sentia falta de atenção e afeto na infância",
  "Eu tenho dificuldade de demonstrar vulnerabilidade",
  "Eu gosto de ter controle das situações",
  "Eu me sinto sozinha mesmo acompanhada",
  "Eu me cobro para fazer tudo certo",
  "Eu tenho dificuldade de confiar totalmente nas pessoas",
  "Eu seguro o que sinto",
  "Eu me sinto carente em alguns momentos",
  'Eu tenho dificuldade de dizer "não"',
  "Eu observo as pessoas antes de me abrir emocionalmente",
  "Eu me sinto sobrecarregada com frequência",
  "Eu tenho medo de ser deixada ou esquecida",
  "Eu controlo minhas emoções",
  "Eu evito depender dos outros",
  "Eu me fecho emocionalmente em algumas situações",
  "Eu busco validação emocional das pessoas",
  "Eu tolero mais do que gostaria nas relações",
  "Eu preciso me sentir segura para me entregar",
  "Eu me sinto desconectada em alguns momentos",
  "Eu assumo liderança naturalmente",
  "Eu acumulo emoções ao invés de expressar",
  "Eu tenho dificuldade de relaxar",
  "Eu prefiro me isolar em alguns momentos",
  "Eu sinto dificuldade de confiar na vida ou no mundo",
  "Eu sinto que preciso provar meu valor",
] as const;

/** 5 itens — só escala consciência (perguntas 26–30). */
export const PERGUNTAS_CONSCIENCIA: readonly string[] = [
  "Eu tenho consciência dos meus padrões emocionais",
  "Eu já trabalhei minhas dores emocionais",
  "Eu percebo quando estou repetindo um padrão",
  "Eu evoluí emocionalmente nos últimos anos",
  "Hoje eu me sinto mais equilibrada emocionalmente",
] as const;

/** Índices 0..24 → padrão interno (1-based IDs do doc). */
export const INDICES_POR_PADRAO = {
  vinculo: [0, 3, 7, 11, 15],
  controle: [1, 4, 12, 17, 21],
  estrategia: [2, 5, 9, 13, 19],
  retencao: [6, 8, 10, 16, 20],
  desconexao: [14, 18, 22, 23, 24],
} as const;

export type PadraoInterno = keyof typeof INDICES_POR_PADRAO;
