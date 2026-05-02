import { pgTable, text, serial, boolean, timestamp, integer, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usuariosTable = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  senha: text("senha").notNull(),
  nome: text("nome").notNull(),
  email: text("email").unique(),
  dataNascimento: text("data_nascimento"),
  primeiroAcesso: boolean("primeiro_acesso").notNull().default(true),
  ativo: boolean("ativo").notNull().default(true),
  isAdmin: boolean("is_admin").notNull().default(false),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
});

export const avaliacoesTable = pgTable("avaliacoes", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  dataAvaliacao: timestamp("data_avaliacao").notNull().defaultNow(),
  plenitudeFelicidade: integer("plenitude_felicidade").notNull(),
  espiritualidade: integer("espiritualidade").notNull(),
  saudeDisposicao: integer("saude_disposicao").notNull(),
  desenvolvimentoIntelectual: integer("desenvolvimento_intelectual").notNull(),
  equilibrioEmocional: integer("equilibrio_emocional").notNull(),
  familia: integer("familia").notNull(),
  desenvolvimentoAmoroso: integer("desenvolvimento_amoroso").notNull(),
  vidaSocial: integer("vida_social").notNull(),
  realizacaoProposito: integer("realizacao_proposito").notNull(),
  recursosFinanceiros: integer("recursos_financeiros").notNull(),
  contribuicaoSocial: integer("contribuicao_social").notNull(),
  criatividadeHobbyDiversao: integer("criatividade_hobby_diversao").notNull(),
  criadaEm: timestamp("criada_em").notNull().defaultNow(),
}, (table) => ({
  usuarioIdIdx: index("idx_avaliacoes_usuario_id").on(table.usuarioId),
  dataAvaliacaoIdx: index("idx_avaliacoes_data").on(table.dataAvaliacao),
}));

export const insertUsuarioSchema = createInsertSchema(usuariosTable).omit({ id: true, criadoEm: true, atualizadoEm: true });
export const insertAvaliacaoSchema = createInsertSchema(avaliacoesTable).omit({ id: true, criadaEm: true });

export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;
export type Usuario = typeof usuariosTable.$inferSelect;
export type InsertAvaliacao = z.infer<typeof insertAvaliacaoSchema>;
export type Avaliacao = typeof avaliacoesTable.$inferSelect;
