import type { ParForcado } from "../types.js";

/** Bloco opcional v3 — como você demonstra amor (5 perguntas). */
export const CODIGOS_EXPRESSAR = ["E01", "E02", "E03", "E04", "E05"] as const;

export type CodigoExpressar = (typeof CODIGOS_EXPRESSAR)[number];

export const PARES_EXPRESSAR: ParForcado[] = [
  { id: "E01", bloco: "expressar", textoA: "Costumo elogiar e agradecer com palavras sinceras.", textoB: "Prefiro marcar tempo de qualidade só para a pessoa.", linguagemA: "palavras", linguagemB: "tempo" },
  { id: "E02", bloco: "expressar", textoA: "Gosto de surpreender com presentes pensados.", textoB: "O que faço naturalmente é ajudar nas tarefas do dia a dia.", linguagemA: "presentes", linguagemB: "servicos" },
  { id: "E03", bloco: "expressar", textoA: "Mostro amor com abraços, carinho e proximidade.", textoB: "Prefiro dizer o que sinto em vez de só demonstrar com o corpo.", linguagemA: "toque", linguagemB: "palavras" },
  { id: "E04", bloco: "expressar", textoA: "Resolvo problemas práticos para aliviar a pessoa.", textoB: "Expresso carinho com toque e presença física.", linguagemA: "servicos", linguagemB: "toque" },
  { id: "E05", bloco: "expressar", textoA: "Planejo encontros e conversas sem distrações.", textoB: "Costumo lembrar datas e dar algo simbólico.", linguagemA: "tempo", linguagemB: "presentes" },
];
