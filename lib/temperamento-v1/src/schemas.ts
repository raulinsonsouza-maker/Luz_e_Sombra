import { z } from "zod";
import { CODIGOS_PAR } from "./pares";

const lado = z.enum(["a", "b"]);

export const metadataTemperamentoSchema = z.object({
  tempo_total_segundos: z.number().int().nonnegative().optional(),
  idioma: z.string().optional(),
  versao_questionario: z.string().optional(),
});

const CODIGOS_V2 = new Set(CODIGOS_PAR as readonly string[]);
const CODIGOS_V1 = /^(ENG|SOC|DOM|EST|PRO)\d{2}$/;

export const entradaTemperamentoSchema = z.object({
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
      for (const k of Object.keys(rec)) {
        if (!CODIGOS_V2.has(k)) {
          const msg = CODIGOS_V1.test(k)
            ? `Código v1 obsoleto (${k}). Refaça o questionário com T01–T24.`
            : `Código desconhecido: ${k}`;
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msg,
            path: ["answers", k],
          });
        }
      }
    }),
  metadata: metadataTemperamentoSchema.default({}),
});

export type EntradaTemperamento = z.infer<typeof entradaTemperamentoSchema>;
