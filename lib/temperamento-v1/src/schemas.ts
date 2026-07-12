import { z } from "zod";
import { CODIGOS_ITEM } from "./itens";

const resposta = z.enum(["sim", "nao"]);

export const metadataTemperamentoSchema = z.object({
  tempo_total_segundos: z.number().int().nonnegative().optional(),
  idioma: z.string().optional(),
  versao_questionario: z.string().optional(),
});

const CODIGOS_V3 = new Set(CODIGOS_ITEM as readonly string[]);
const CODIGOS_V2 = /^T\d{2}$/;
const CODIGOS_V1 = /^(ENG|SOC|DOM|EST|PRO)\d{2}$/;

export const entradaTemperamentoSchema = z.object({
  answers: z
    .record(z.string(), resposta)
    .superRefine((rec, ctx) => {
      for (const cod of CODIGOS_ITEM) {
        if (rec[cod] === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Resposta em falta: ${cod}`,
            path: ["answers", cod],
          });
        }
      }
      for (const k of Object.keys(rec)) {
        if (!CODIGOS_V3.has(k)) {
          let msg = `Código desconhecido: ${k}`;
          if (CODIGOS_V2.test(k)) {
            msg = `Código v2 obsoleto (${k}). Refaça o questionário com as 16 afirmações.`;
          } else if (CODIGOS_V1.test(k)) {
            msg = `Código v1 obsoleto (${k}). Refaça o questionário.`;
          }
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
