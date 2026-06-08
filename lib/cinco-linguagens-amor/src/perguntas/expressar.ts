import type { ParForcado } from "../types.js";

/** Bloco 2 — como você costuma demonstrar amor. Matriz balanceada: 6 aparições por linguagem. */
export const CODIGOS_EXPRESSAR = [
  "E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08", "E09", "E10",
  "E11", "E12", "E13", "E14", "E15",
] as const;

export type CodigoExpressar = (typeof CODIGOS_EXPRESSAR)[number];

export const PARES_EXPRESSAR: ParForcado[] = [
  { id: "E01", bloco: "expressar", textoA: "Costumo elogiar e agradecer com palavras sinceras.", textoB: "Prefiro marcar tempo de qualidade só para a pessoa.", linguagemA: "palavras", linguagemB: "tempo" },
  { id: "E02", bloco: "expressar", textoA: "Gosto de surpreender com presentes pensados.", textoB: "O que faço naturalmente é ajudar nas tarefas do dia a dia.", linguagemA: "presentes", linguagemB: "servicos" },
  { id: "E03", bloco: "expressar", textoA: "Mostro amor com abraços, carinho e proximidade.", textoB: "Prefiro dizer o que sinto em vez de só demonstrar com o corpo.", linguagemA: "toque", linguagemB: "palavras" },
  { id: "E04", bloco: "expressar", textoA: "Planejo encontros e conversas sem distrações.", textoB: "Costumo lembrar datas e dar algo simbólico.", linguagemA: "tempo", linguagemB: "presentes" },
  { id: "E05", bloco: "expressar", textoA: "Resolvo problemas práticos para aliviar a pessoa.", textoB: "Expresso carinho com toque e presença física.", linguagemA: "servicos", linguagemB: "toque" },
  { id: "E06", bloco: "expressar", textoA: "Escrevo mensagens ou notas de afirmação.", textoB: "Ofereço mimos que mostram que prestei atenção.", linguagemA: "palavras", linguagemB: "presentes" },
  { id: "E07", bloco: "expressar", textoA: "Reservo momentos na agenda para estar presente.", textoB: "Assumo tarefas sem precisar ser lembrado(a).", linguagemA: "tempo", linguagemB: "servicos" },
  { id: "E08", bloco: "expressar", textoA: "Inicio gestos físicos de conforto e pertença.", textoB: "Dou presentes simples, mas com significado.", linguagemA: "toque", linguagemB: "presentes" },
  { id: "E09", bloco: "expressar", textoA: "Digo claramente o quanto a pessoa importa para mim.", textoB: "Prefiro um abraço a um discurso longo.", linguagemA: "palavras", linguagemB: "toque" },
  { id: "E10", bloco: "expressar", textoA: "Crio rituais a dois (passeio, café, conversa).", textoB: "Reconheço em voz alta o que a pessoa fez bem.", linguagemA: "tempo", linguagemB: "palavras" },
  { id: "E11", bloco: "expressar", textoA: "Lembro detalhes e transformo em gestos tangíveis.", textoB: "Fico perto fisicamente em momentos difíceis.", linguagemA: "presentes", linguagemB: "toque" },
  { id: "E12", bloco: "expressar", textoA: "Antecipo necessidades e coloco a mão na massa.", textoB: "Encorajo com palavras gentis e específicas.", linguagemA: "servicos", linguagemB: "palavras" },
  { id: "E13", bloco: "expressar", textoA: "Desligo distrações para ouvir de verdade.", textoB: "Seguro a mão ou abraço quando a pessoa precisa.", linguagemA: "tempo", linguagemB: "toque" },
  { id: "E14", bloco: "expressar", textoA: "Surpreendo com algo que a pessoa mencionou antes.", textoB: "Faço favores concretos sem cobrar retorno.", linguagemA: "presentes", linguagemB: "servicos" },
  { id: "E15", bloco: "expressar", textoA: "Organizo a rotina para facilitar a vida do outro.", textoB: "Priorizo estar junto, mesmo em silêncio confortável.", linguagemA: "servicos", linguagemB: "tempo" },
];
