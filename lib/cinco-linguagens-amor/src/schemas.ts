import { z } from "zod";
import { CODIGOS_PAR } from "./perguntas/index.js";

const lado = z.enum(["a", "b"]);

export const metadataLinguagensSchema = z.object({
  tempo_total_segundos: z.number().int().nonnegative().optional(),
  idioma: z.string().optional(),
  versao_questionario: z.string().optional(),
});

const CODIGOS_V2 = new Set(CODIGOS_PAR as readonly string[]);
const CODIGOS_V1 = /^P\d{2}$/;

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
      for (const k of Object.keys(rec)) {
        if (!CODIGOS_V2.has(k)) {
          const msg = CODIGOS_V1.test(k)
            ? `Código v1 obsoleto (${k}). Refaça o questionário com R01–E15.`
            : `Código desconhecido: ${k}`;
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msg,
            path: ["answers", k],
          });
        }
      }
    }),
  metadata: metadataLinguagensSchema.default({}),
});

export const linguagemAmorSchema = z.enum(["palavras", "tempo", "presentes", "servicos", "toque"]);

export const entradaCompatibilidadeSchema = z.union([
  z.object({ pessoaIdOutro: z.number().int().positive() }),
  z.object({
    manual: z.object({
      nome: z.string().min(1),
      relacao: z.string().optional(),
      principalExpressar: linguagemAmorSchema,
      principalReceber: linguagemAmorSchema.optional(),
    }),
  }),
]);

export type EntradaLinguagensAmorParsed = z.infer<typeof entradaLinguagensAmorSchema>;
