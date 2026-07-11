import { z } from "zod";

const score1to10 = z.coerce.number().int().min(1).max(10);

export const createAvaliacaoSchema = z.object({
  plenitudeFelicidade: score1to10,
  espiritualidade: score1to10,
  saudeDisposicao: score1to10,
  desenvolvimentoIntelectual: score1to10,
  equilibrioEmocional: score1to10,
  familia: score1to10,
  desenvolvimentoAmoroso: score1to10,
  vidaSocial: score1to10,
  realizacaoProposito: score1to10,
  recursosFinanceiros: score1to10,
  contribuicaoSocial: score1to10,
  criatividadeHobbyDiversao: score1to10,
});

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9._-]{3,30}$/, "Username inválido: 3-30 caracteres (minúsculas, números, . _ -)");

const senhaSchema = z.string().min(6, "Senha deve ter pelo menos 6 caracteres");

const senhaForteSchema = z
  .string()
  .min(8, "Senha deve ter pelo menos 8 caracteres")
  .refine(
    (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(v),
    "Senha deve conter pelo menos 1 caractere especial",
  );

const emailOptionalSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Email inválido")
  .transform((v) => (v === "" ? null : v));

export const updateMeSchema = z
  .object({
    nome: z.string().trim().min(1, "Nome não pode ser vazio").optional(),
    dataNascimento: z.string().nullable().optional(),
    senhaAtual: z.string().optional(),
    novaSenha: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.novaSenha !== undefined && data.novaSenha !== "") {
        return !!data.senhaAtual && senhaSchema.safeParse(data.novaSenha).success;
      }
      return true;
    },
    { message: "Senha atual é obrigatória e nova senha deve ter pelo menos 6 caracteres" }
  );

export const fotoPerfilObjectPathSchema = z.object({
  objectPath: z.string().startsWith("/objects/", "objectPath inválido"),
});

export const createUsuarioAdminSchema = z.object({
  username: usernameSchema,
  senha: senhaSchema,
  nome: z.string().trim().min(1, "Nome é obrigatório"),
  email: emailOptionalSchema.optional(),
  dataNascimento: z.string().nullable().optional(),
  isAdmin: z.boolean().optional(),
});

export const updateUsuarioAdminSchema = z
  .object({
    nome: z.string().trim().min(1).optional(),
    email: emailOptionalSchema.optional(),
    dataNascimento: z.string().nullable().optional(),
    ativo: z.boolean().optional(),
    isAdmin: z.boolean().optional(),
    senha: senhaSchema.optional(),
    novaSenha: senhaSchema.optional(),
    primeiroAcesso: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "Nenhum dado para atualizar" });

export const tracoPessoaCreateSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório"),
  relacao: z.string().optional(),
  ordem: z.coerce.number().int().optional(),
});

export const tracoPessoaUpdateSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").optional(),
  relacao: z.string().nullable().optional(),
});

export const tracoFotoSchema = z.object({
  tipo: z.enum(["rosto", "corpo-frente", "corpo-lado"]),
  objectPath: z.string().startsWith("/objects/"),
  pessoaId: z.union([z.number().int().positive(), z.null()]).optional(),
});

export const tracoAnalisarEnvelopeSchema = z.object({
  resultado: z.record(z.string(), z.unknown()),
  pessoaId: z.union([z.number().int().positive(), z.null()]).optional(),
  snapshotPessoaId: z.union([z.number().int().positive(), z.null()]).optional(),
  pessoaNome: z.string().optional(),
  diagnosticoEmocional: z.unknown().optional(),
});

const emailRequiredSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "E-mail inválido");

export const forgotPasswordSchema = z.object({
  email: emailRequiredSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(16, "Token inválido"),
  novaSenha: senhaForteSchema,
});

export const funnelRegisterSchema = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório"),
  email: emailRequiredSchema,
  telefone: z.string().trim().min(10, "Celular é obrigatório"),
  senha: senhaForteSchema,
  variant: z.enum(["control", "vsl"]).default("control"),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      content: z.string().optional(),
      term: z.string().optional(),
    })
    .optional(),
});

export function parseBody<T extends z.ZodTypeAny>(
  schema: T,
  body: unknown,
):
  | { success: true; data: z.infer<T> }
  | { success: false; error: string; detalhes?: unknown } {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join("; ") || "Corpo inválido";
    return { success: false, error: msg, detalhes: parsed.error.flatten() };
  }
  return { success: true, data: parsed.data };
}
