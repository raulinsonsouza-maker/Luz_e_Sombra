import type { Eixo, ModeloMultimodalScores } from "./types";

/** Textos das 20 perguntas (índice 0 = Q1). `invertida`: maior valor na escala = menos do traço no eixo-alvo. */
export const PERGUNTAS_EIXOS_20: { id: number; texto: string; invertida?: boolean }[] = [
  { id: 1, texto: "Sinto minhas emoções de forma intensa" },
  { id: 2, texto: "Evito sentir emoções desconfortáveis" },
  { id: 3, texto: "Tenho dificuldade em identificar o que estou sentindo" },
  { id: 4, texto: "Me sinto desconectado emocionalmente" },
  { id: 5, texto: "Guardo emoções para mim" },
  { id: 6, texto: "Sinto necessidade de proteção emocional" },
  { id: 7, texto: "Tenho facilidade em me abrir emocionalmente", invertida: true },
  { id: 8, texto: "Preciso entender tudo antes de agir" },
  { id: 9, texto: "Tenho dificuldade em desligar minha mente" },
  { id: 10, texto: "Penso demais antes de tomar decisões" },
  { id: 11, texto: "Gosto de manter controle sobre situações" },
  { id: 12, texto: "Me incomoda não ter previsibilidade" },
  { id: 13, texto: "Fico preso em pensamentos repetitivos" },
  { id: 14, texto: "Consigo agir sem precisar controlar tudo", invertida: true },
  { id: 15, texto: "Evito conflitos sempre que possível" },
  { id: 16, texto: "Busco aprovação antes de agir" },
  { id: 17, texto: "Assumo controle naturalmente" },
  { id: 18, texto: "Tenho dificuldade em dizer não" },
  { id: 19, texto: "Me adapto facilmente às situações", invertida: true },
  { id: 20, texto: "Evito me expor ou me mostrar demais" },
];

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Converte valor 1–5 para contribuição 0–1 (maior = mais intenso no construto, salvo invertida). */
function valorContribuicao(v: number, invertida?: boolean): number {
  const x = invertida ? 6 - v : v;
  return clamp01((x - 1) / 4);
}

function mediaContribuicao(respostas: number[], indices1Based: number[], invertidas?: boolean[]): number {
  let s = 0;
  let c = 0;
  for (let i = 0; i < indices1Based.length; i++) {
    const idx = indices1Based[i] - 1;
    const inv = invertidas?.[i] ?? PERGUNTAS_EIXOS_20[idx]?.invertida;
    const v = respostas[idx];
    if (v === undefined || v < 1 || v > 5) continue;
    s += valorContribuicao(v, inv);
    c++;
  }
  return c > 0 ? s / c : 0.5;
}

/**
 * Mapeamento do plano:
 * controle = média(Q8,Q11,Q12,Q17)
 * retracao = média(Q3,Q4,Q5,Q20)
 * dependencia = média(Q15,Q16,Q18)
 * expansao = inverso(Q7,Q14,Q19)
 * rigidez = média(Q2,Q9,Q10,Q13)
 */
export function questionarioParaEixos0a1(respostas: number[]): Record<Eixo, number> {
  if (respostas.length !== 20) throw new Error("São necessárias exatamente 20 respostas (1–5).");

  const controle = mediaContribuicao(respostas, [8, 11, 12, 17]);
  const retracao = mediaContribuicao(respostas, [3, 4, 5, 20]);
  const dependencia = mediaContribuicao(respostas, [15, 16, 18]);
  const expansao = mediaContribuicao(respostas, [7, 14, 19], [true, true, true]);
  const rigidez = mediaContribuicao(respostas, [2, 9, 10, 13]);

  return { controle, retracao, dependencia, expansao, rigidez };
}

export function eixos01ParaScores100(r: Record<Eixo, number>): ModeloMultimodalScores {
  const out = {} as ModeloMultimodalScores;
  for (const k of ["controle", "retracao", "dependencia", "expansao", "rigidez"] as Eixo[]) {
    out[k] = Math.round(100 * clamp01(r[k]));
  }
  return out;
}

export function questionarioParaScores100(respostas: number[]): ModeloMultimodalScores {
  return eixos01ParaScores100(questionarioParaEixos0a1(respostas));
}
