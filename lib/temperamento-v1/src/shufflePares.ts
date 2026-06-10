import { PARES_FORCADOS, type ParForcadoTemperamento } from "./pares";

function shuffleInPlace<T>(arr: T[], rng: () => number = Math.random): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

/** Embaralha os 24 pares para cada sessão. */
export function gerarOrdemPares(rng: () => number = Math.random): ParForcadoTemperamento[] {
  const copia = [...PARES_FORCADOS];
  shuffleInPlace(copia, rng);
  return copia;
}
