import { pgTable, text, serial, boolean, timestamp, integer, index, jsonb, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usuariosTable = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  senha: text("senha").notNull(),
  nome: text("nome").notNull(),
  email: text("email").unique(),
  dataNascimento: text("data_nascimento"),
  fotoPerfil: text("foto_perfil"),
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

// ── Pessoas para análise (spouse, children, etc.) ──────────────────────────────
export const pessoasAnaliseTable = pgTable("pessoas_analise", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  relacao: text("relacao"),
  ordem: integer("ordem").notNull().default(0),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
}, (table) => ({
  usuarioIdx: index("idx_pessoas_analise_usuario_id").on(table.usuarioId),
}));

export const fotosTracoTable = pgTable("fotos_traco", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  pessoaId: integer("pessoa_id").references(() => pessoasAnaliseTable.id, { onDelete: "cascade" }),
  tipo: text("tipo").notNull(),
  objectPath: text("object_path").notNull(),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
}, (table) => ({
  usuarioIdIdx: index("idx_fotos_traco_usuario_id").on(table.usuarioId),
}));

export const analiseTracoTable = pgTable("analise_traco", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  pessoaId: integer("pessoa_id").references(() => pessoasAnaliseTable.id, { onDelete: "cascade" }),
  resultado: jsonb("resultado").notNull(),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
}, (table) => ({
  usuarioIdIdx: index("idx_analise_traco_usuario_id").on(table.usuarioId),
}));

/** Respostas + agregado do Diagnóstico Emocional (30 itens, v1). */
export const diagnosticoEmocional30Table = pgTable("diagnostico_emocional_30", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  respostas: jsonb("respostas").notNull(),
  resultado: jsonb("resultado").notNull(),
  versao: text("versao").notNull().default("diagnostico30_v1"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
}, (table) => ({
  usuarioIdx: index("idx_diagnostico_emocional_30_usuario").on(table.usuarioId),
}));

/** Respostas + resultado do questionário de temperamento (40 itens, v1). */
export const analiseTemperamento40Table = pgTable("analise_temperamento_40", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  respostas: jsonb("respostas").notNull(),
  resultado: jsonb("resultado").notNull(),
  versao: text("versao").notNull().default("temperamento_v1"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
}, (table) => ({
  usuarioIdx: index("idx_analise_temperamento_40_usuario").on(table.usuarioId),
}));

export const gamificacaoTable = pgTable("gamificacao", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().unique().references(() => usuariosTable.id, { onDelete: "cascade" }),
  xp: integer("xp").notNull().default(0),
  nivel: integer("nivel").notNull().default(1),
  streakDias: integer("streak_dias").notNull().default(0),
  melhorStreak: integer("melhor_streak").notNull().default(0),
  ultimoAcessoEm: text("ultimo_acesso_em"),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
});

export const missoesDiariasTable = pgTable("missoes_diarias", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  xpRecompensa: integer("xp_recompensa").notNull(),
  concluidaEm: timestamp("concluida_em"),
  dataReferencia: text("data_referencia").notNull(),
  criadaEm: timestamp("criada_em").notNull().defaultNow(),
}, (table) => ({
  usuarioDataIdx: index("idx_missoes_usuario_data").on(table.usuarioId, table.dataReferencia),
}));

// ── Comunidade ─────────────────────────────────────────────────────────────────

export const comunidadeTable = pgTable("comunidade", {
  id: serial("id").primaryKey(),
  autorId: integer("autor_id").notNull().references(() => usuariosTable.id),
  tipo: text("tipo").notNull().default("texto"),
  conteudo: text("conteudo").notNull(),
  mediaUrl: text("media_url"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
}, (table) => ({
  autorIdx: index("idx_comunidade_autor_id").on(table.autorId),
  criadoEmIdx: index("idx_comunidade_criado_em").on(table.criadoEm),
}));

export const reacoesTable = pgTable("reacoes_comunidade", {
  id: serial("id").primaryKey(),
  publicacaoId: integer("publicacao_id").notNull().references(() => comunidadeTable.id, { onDelete: "cascade" }),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  emoji: text("emoji").notNull(),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
}, (table) => ({
  uniqueReacao: unique("uq_reacao_pub_usuario_emoji").on(table.publicacaoId, table.usuarioId, table.emoji),
  publicacaoIdx: index("idx_reacoes_publicacao_id").on(table.publicacaoId),
}));

// ── Notificações ───────────────────────────────────────────────────────────────

export const notificacoesTable = pgTable("notificacoes", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  mensagem: text("mensagem").notNull(),
  tipo: text("tipo").notNull().default("geral"),
  lida: boolean("lida").notNull().default(false),
  link: text("link"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
}, (table) => ({
  usuarioIdx: index("idx_notificacoes_usuario").on(table.usuarioId),
  naoLidasIdx: index("idx_notificacoes_nao_lidas").on(table.usuarioId, table.lida),
}));

// ── Cursos ─────────────────────────────────────────────────────────────────────

export const cursosTable = pgTable("cursos", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  imagemUrl: text("imagem_url"),
  categoria: text("categoria"),
  nivel: text("nivel").default("todos"),
  publicado: boolean("publicado").notNull().default(false),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
});

export const aulasTable = pgTable("aulas", {
  id: serial("id").primaryKey(),
  cursoId: integer("curso_id").notNull().references(() => cursosTable.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  videoUrl: text("video_url"),
  conteudo: text("conteudo"),
  ordem: integer("ordem").notNull().default(0),
  duracaoMin: integer("duracao_min"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
}, (table) => ({
  cursoIdx: index("idx_aulas_curso_id").on(table.cursoId),
  ordemIdx: index("idx_aulas_ordem").on(table.cursoId, table.ordem),
}));

export const progressoCursosTable = pgTable("progresso_cursos", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  aulaId: integer("aula_id").notNull().references(() => aulasTable.id, { onDelete: "cascade" }),
  concluidaEm: timestamp("concluida_em").notNull().defaultNow(),
}, (table) => ({
  uniqueProgress: unique("uq_progresso_usuario_aula").on(table.usuarioId, table.aulaId),
  usuarioIdx: index("idx_progresso_usuario_id").on(table.usuarioId),
}));

// ── Schemas & types ────────────────────────────────────────────────────────────

export const insertUsuarioSchema = createInsertSchema(usuariosTable).omit({ id: true, criadoEm: true, atualizadoEm: true });
export const insertAvaliacaoSchema = createInsertSchema(avaliacoesTable).omit({ id: true, criadaEm: true });

export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;
export type Usuario = typeof usuariosTable.$inferSelect;
export type InsertAvaliacao = z.infer<typeof insertAvaliacaoSchema>;
export type Avaliacao = typeof avaliacoesTable.$inferSelect;
export type PessoaAnalise = typeof pessoasAnaliseTable.$inferSelect;
export type FotoTraco = typeof fotosTracoTable.$inferSelect;
export type AnaliseTraco = typeof analiseTracoTable.$inferSelect;
export type Gamificacao = typeof gamificacaoTable.$inferSelect;
export type MissaoDiaria = typeof missoesDiariasTable.$inferSelect;
export type Comunidade = typeof comunidadeTable.$inferSelect;
export type Reacao = typeof reacoesTable.$inferSelect;
export type Curso = typeof cursosTable.$inferSelect;
export type Aula = typeof aulasTable.$inferSelect;
export type ProgressoCurso = typeof progressoCursosTable.$inferSelect;
export type Notificacao = typeof notificacoesTable.$inferSelect;
