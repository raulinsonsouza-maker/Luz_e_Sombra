const STOPWORDS = new Set([
  "a", "o", "e", "de", "da", "do", "em", "um", "uma", "os", "as", "que", "para", "com", "seu", "sua",
  "você", "mais", "como", "quando", "mas", "não", "por", "isso", "se", "na", "no", "ao", "são", "ser",
]);

function tokens(texto: string): Set<string> {
  return new Set(
    texto
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length > 3 && !STOPWORDS.has(t)),
  );
}

export function overlapRatio(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) {
    if (tb.has(t)) inter += 1;
  }
  return inter / Math.min(ta.size, tb.size);
}

export function validarBlocosUnicos(blocos: Record<string, string>, maxOverlap = 0.3): string[] {
  const erros: string[] = [];
  const keys = Object.keys(blocos);
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const ratio = overlapRatio(blocos[keys[i]!]!, blocos[keys[j]!]!);
      if (ratio > maxOverlap) {
        erros.push(`Overlap ${(ratio * 100).toFixed(0)}% entre ${keys[i]} e ${keys[j]}`);
      }
    }
  }
  return erros;
}
