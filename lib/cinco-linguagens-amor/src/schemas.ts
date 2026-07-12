import { z } from "zod";
import {
  CODIGOS_CORE,
  CODIGOS_DESEMPATE,
  CODIGOS_EXPRESSAR,
  CODIGOS_PAR,
} from "./perguntas/index.js";

const lado = z.enum(["a", "b"]);

export const metadataLinguagensSchema = z.object({
  tempo_total_segundos: z.number().int().nonnegative().optional(),
  idioma: z.string().optional(),
  versao_questionario: z.string().optional(),
});

const CODIGOS_V3 = new Set(CODIGOS_PAR as readonly string[]);
const CODIGOS_V2 = /^(R0[1-9]|R1[0-5]|E0[1-9]|E1[0-5])$/;
const CODIGOS_V1 = /^P\d{2}$/;

export const entradaLinguagensAmorSchema = z.object({
  answers: z
    .record(z.string(), lado)
    .superRefine((rec, ctx) => {
      for (const cod of CODIGOS_CORE) {
        if (rec[cod] === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Escolha em falta: ${cod}`,
            path: ["answers", cod],
          });
        }
      }
      for (const k of Object.keys(rec)) {
        if (!CODIGOS_V3.has(k)) {
          let msg = `Código desconhecido: ${k}`;
          if (CODIGOS_V1.test(k)) msg = `Código v1 obsoleto (${k}). Refaça o questionário.`;
          else if (CODIGOS_V2.test(k)) msg = `Código v2 obsoleto (${k}). Refaça com R01–R20.`;
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msg,
            path: ["answers", k],
          });
        }
      }
      const desempateKeys = Object.keys(rec).filter((k) => k.startsWith("D"));
      for (const d of desempateKeys) {
        if (!CODIGOS_DESEMPATE.includes(d as (typeof CODIGOS_DESEMPATE)[number])) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Código de desempate inválido: ${d}`,
            path: ["answers", d],
          });
        }
      }
      const expressarKeys = Object.keys(rec).filter((k) => k.startsWith("E"));
      if (expressarKeys.length > 0 && expressarKeys.length !== CODIGOS_EXPRESSAR.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bloco expressar incompleto: envie E01–E05 ou nenhum.",
          path: ["answers"],
        });
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
