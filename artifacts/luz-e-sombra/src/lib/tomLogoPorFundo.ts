import { LOGO_CLARO, LOGO_OURO } from "@/lib/marca";

export type TomLogo = "claro" | "ouro";

const cache = new Map<string, TomLogo>();

function luminanciaMedia(img: HTMLImageElement): number {
  const canvas = document.createElement("canvas");
  const lado = 48;
  canvas.width = lado;
  canvas.height = lado;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return 0;
  ctx.drawImage(img, 0, 0, lado, lado);
  const { data } = ctx.getImageData(0, 0, lado, lado);
  let soma = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] ?? 0;
    if (a < 16) continue;
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    soma += 0.2126 * r + 0.7152 * g + 0.0722 * b;
    n += 1;
  }
  return n ? soma / n : 0;
}

/** Fundo claro → logo ouro (escuro). Fundo escuro → logo claro. */
export function tomLogoPorLuminancia(media: number): TomLogo {
  return media >= 140 ? "ouro" : "claro";
}

export function srcLogo(tom: TomLogo): string {
  return tom === "ouro" ? LOGO_OURO : LOGO_CLARO;
}

export async function detectarTomLogo(src: string): Promise<TomLogo> {
  const cached = cache.get(src);
  if (cached) return cached;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const tom = tomLogoPorLuminancia(luminanciaMedia(img));
      cache.set(src, tom);
      resolve(tom);
    };
    img.onerror = () => {
      cache.set(src, "claro");
      resolve("claro");
    };
    img.src = src;
  });
}
