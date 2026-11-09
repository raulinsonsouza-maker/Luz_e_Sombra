/** Energia 1–9 e intensidades 11/22/33 — mesma voz, escalas dia/mês/coletivo. */
export type EnergiaNumerologica = {
  energia: string;
  titulo: string;
  /** Lead curto (2–3 frases). */
  descricao: string;
  /** Parágrafo denso — texto principal na Home. */
  profundidade: string;
  /** O que favorece nesta escala. */
  clima: string;
  /** Armadilha típica nesta escala. */
  sombra: string;
  reflexao: string;
  acoes: string[];
  evitar: string[];
  palavrasChave: string[];
};

export type EnergiaMesPessoal = EnergiaNumerologica & {
  areas: string[];
};

/** Raiz 1–9 de um mestre (11→2, 22→4, 33→6). */
export function raizDoMestre(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

const FALLBACK: EnergiaNumerologica = {
  energia: "Equilibrar",
  titulo: "Um tempo para juntar o que já aparece",
  descricao: "Use o que já está claro, sem abrir frente nova.",
  profundidade:
    "Escolha uma pendência e avance nela. O resto pode esperar. Clareza vem do que você conclui, não do que planeja.",
  clima: "Consolidar o que já começou.",
  sombra: "Abrir muita coisa ao mesmo tempo e não terminar nada.",
  reflexao: '"O que já está claro e você ainda não usou?"',
  acoes: ["Escolha uma pendência e avance nela.", "Feche um ciclo pequeno antes de abrir outro.", "Anote o que já está óbvio."],
  evitar: ["Abrir frentes novas por ansiedade.", "Ignorar o que já pediu conclusão."],
  palavrasChave: ["clareza", "conclusão", "foco", "simples"],
};

export function energiaDeBase(
  base: Record<number, EnergiaNumerologica>,
  n: number,
): EnergiaNumerologica {
  if (base[n]) return base[n];
  const raiz = raizDoMestre(n);
  if (raiz !== n && base[raiz]) return base[raiz];
  return FALLBACK;
}
