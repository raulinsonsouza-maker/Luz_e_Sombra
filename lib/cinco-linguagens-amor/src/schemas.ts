import { z } from "zod";
import { CODIGOS_PAR } from "./perguntas.js";

const lado = z.enum(["a", "b"]);

export const metadataLinguagensSchema = z.object({
  tempo_total_segundos: z.number().int().nonnegative().optional(),
  idioma: z.string().optional(),
  versao_questionario: z.string().optional(),
});

export const entradaLinguagensAmorSchema = z.object({
  answers: z
    .record(z.string(), lado)
    .superRefine((rec, ctx) => {
      for (const cod of CODIGOS_PAR) {
        if (rec[cod] === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Escolha em falta: ${cod}`,
            path: ["answers", cod],
          });
        }
      }
      const codigos = CODIGOS_PAR as readonly string[];
      for (const k of Object.keys(rec)) {
        if (!codigos.includes(k)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Código desconhecido: ${k}`,
            path: ["answers", k],
          });
        }
      }
    }),
  metadata: metadataLinguagensSchema.default({}),
});

export type EntradaLinguagensAmorParsed = z.infer<typeof entradaLinguagensAmorSchema>;
