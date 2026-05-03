import { z } from "zod";
import { CODIGOS_PERGUNTA } from "./perguntas";

const respostaItem = z.number().int().min(1).max(5);

export const metadataTemperamentoSchema = z.object({
  tempo_total_segundos: z.number().int().nonnegative().optional(),
  idioma: z.string().optional(),
  versao_questionario: z.string().optional(),
});

export const entradaTemperamentoSchema = z.object({
  answers: z
    .record(z.string(), respostaItem)
    .superRefine((rec, ctx) => {
      for (const cod of CODIGOS_PERGUNTA) {
        if (rec[cod] === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Resposta em falta: ${cod}`,
            path: ["answers", cod],
          });
        }
      }
      for (const k of Object.keys(rec)) {
        if (!CODIGOS_PERGUNTA.includes(k)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Código desconhecido: ${k}`,
            path: ["answers", k],
          });
        }
      }
    }),
  metadata: metadataTemperamentoSchema.default({}),
});

export type EntradaTemperamento = z.infer<typeof entradaTemperamentoSchema>;
