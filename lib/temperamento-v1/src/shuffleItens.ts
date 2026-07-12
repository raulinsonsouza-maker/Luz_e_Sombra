import { ITENS_EYSENCK, type ItemTemperamento } from "./itens";

function shuffleInPlace<T>(arr: T[], rng: () => number = Math.random): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

/** Embaralha itens intercalando E e N para reduzir fadiga. */
export function gerarOrdemItens(rng: () => number = Math.random): ItemTemperamento[] {
  const e = ITENS_EYSENCK.filter((i) => i.eixo === "E");
  const n = ITENS_EYSENCK.filter((i) => i.eixo === "N");
  shuffleInPlace(e, rng);
  shuffleInPlace(n, rng);
  const resultado: ItemTemperamento[] = [];
  for (let i = 0; i < Math.max(e.length, n.length); i++) {
    if (e[i]) resultado.push(e[i]!);
    if (n[i]) resultado.push(n[i]!);
  }
  return resultado;
}
