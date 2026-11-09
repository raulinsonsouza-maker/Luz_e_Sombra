/** Energia 1–9 e mestres 11/22/33 — mesma voz, escalas dia/mês/coletivo. */
export type EnergiaNumerologica = {
  energia: string;
  titulo: string;
  descricao: string;
  profundidade: string;
  reflexao: string;
  acoes: string[];
  evitar: string[];
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

export function energiaDeBase(
  base: Record<number, EnergiaNumerologica>,
  n: number,
): EnergiaNumerologica {
  if (base[n]) return base[n];
  const raiz = raizDoMestre(n);
  if (raiz !== n && base[raiz]) return base[raiz];
  return {
    energia: "Equilibrar",
    titulo: "Um dia para juntar o que já aparece",
    descricao: "Hoje pede que você use o que já está claro, sem abrir frente nova.",
    profundidade: "Escolha uma coisa pendente e avance nela. O resto pode esperar.",
    reflexao: '"O que já está claro e você ainda não usou?"',
    acoes: ["Escolha uma pendência e avance nela hoje."],
    evitar: ["Abrir muita coisa ao mesmo tempo."],
  };
}
