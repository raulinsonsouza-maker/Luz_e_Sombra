import type { Dimensao } from "./types";
import { perguntasPorDimensao, type ItemPergunta } from "./perguntas";

function shuffleInPlace<T>(arr: T[], rng: () => number = Math.random): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

/**
 * Ordem dos blocos temáticos: dimensões embaralhadas com **SOC nunca em primeiro**.
 * Dentro de cada bloco, as 8 perguntas são embaralhadas.
 */
export function gerarOrdemBlocosPerguntas(rng: () => number = Math.random): ItemPergunta[][] {
  const dims: Dimensao[] = ["ENG", "SOC", "DOM", "EST", "PRO"];
  shuffleInPlace(dims, rng);
  if (dims[0] === "SOC") {
    const swapIdx = dims.findIndex((d) => d !== "SOC");
    if (swapIdx > 0) [dims[0], dims[swapIdx]] = [dims[swapIdx]!, dims[0]!];
  }

  const blocos: ItemPergunta[][] = [];
  for (const d of dims) {
    const items = [...perguntasPorDimensao(d)];
    shuffleInPlace(items, rng);
    blocos.push(items);
  }
  return blocos;
}
