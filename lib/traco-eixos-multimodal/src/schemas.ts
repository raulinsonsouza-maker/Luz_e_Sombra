import { z } from "zod";

export const metricasFotoResumoSchema = z.object({
  tipo: z.enum(["rosto", "corpo-frente", "corpo-lado"]),
  shoulderW: z.number(),
  chestW: z.number(),
  waistW: z.number(),
  hipW: z.number(),
  thighW: z.number(),
  legW: z.number(),
  shr: z.number(),
  whr: z.number(),
  wsr: z.number(),
  ulr: z.number(),
  symm: z.number(),
  bodyPct: z.number(),
  edgeDensityBody: z.number(),
  forwardLean: z.number(),
  chestProjection: z.number(),
  confidence: z.number(),
});

export const metricasResumoSchema = z.object({
  versao: z.literal("metricas_resumo_v1"),
  fotos: z.array(metricasFotoResumoSchema),
  agregado: z.object({
    shrMedio: z.number(),
    whrMedio: z.number(),
    symmMedio: z.number(),
    forwardLeanMedio: z.number(),
    chestProjectionMedio: z.number(),
    edgeDensityMedio: z.number(),
    bodyPctMedio: z.number(),
    ulrMedio: z.number(),
    chestExpansionProxy: z.number(),
    pernasMedio: z.number(),
  }),
});

export const questionario20RespostasSchema = z
  .array(z.number().int().min(1).max(5))
  .length(20)
  .describe("Vinte respostas na escala 1–5, índice 0 = pergunta 1");
