import { pgTable, text, serial, integer, boolean, timestamp, unique, index } from "drizzle-orm/pg-core";

/** Acervo de imagens do portal (rotação diária + uploads admin). */
export const galeriaImagensTable = pgTable("galeria_imagens", {
  id: serial("id").primaryKey(),
  ordem: integer("ordem").notNull(),
  /** estatico = /imagens-dia/N.jpg · upload = /objects/... */
  origem: text("origem").notNull().default("upload"),
  path: text("path").notNull(),
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
}, (table) => ({
  ordemUnique: unique("uq_galeria_imagens_ordem").on(table.ordem),
  ativoOrdemIdx: index("idx_galeria_imagens_ativo_ordem").on(table.ativo, table.ordem),
}));

export type GaleriaImagem = typeof galeriaImagensTable.$inferSelect;
