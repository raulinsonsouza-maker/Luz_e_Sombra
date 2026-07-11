import { pgTable, serial, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { usuariosTable } from "./usuarios";

export const passwordResetTokensTable = pgTable(
  "password_reset_tokens",
  {
    id: serial("id").primaryKey(),
    usuarioId: integer("usuario_id")
      .notNull()
      .references(() => usuariosTable.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    usedAt: timestamp("used_at"),
    criadoEm: timestamp("criado_em").defaultNow().notNull(),
  },
  (table) => ({
    usuarioIdx: index("idx_password_reset_usuario").on(table.usuarioId),
    tokenHashIdx: index("idx_password_reset_token_hash").on(table.tokenHash),
  }),
);

export const emailEnviosTable = pgTable(
  "email_envios",
  {
    id: serial("id").primaryKey(),
    usuarioId: integer("usuario_id").references(() => usuariosTable.id, { onDelete: "set null" }),
    destinatario: text("destinatario").notNull(),
    template: text("template").notNull(),
    assunto: text("assunto").notNull(),
    status: text("status").notNull(),
    resendId: text("resend_id"),
    erro: text("erro"),
    meta: jsonb("meta"),
    criadoEm: timestamp("criado_em").defaultNow().notNull(),
  },
  (table) => ({
    destinatarioIdx: index("idx_email_envios_destinatario").on(table.destinatario),
    templateIdx: index("idx_email_envios_template").on(table.template),
    statusIdx: index("idx_email_envios_status").on(table.status),
  }),
);

export type PasswordResetToken = typeof passwordResetTokensTable.$inferSelect;
export type EmailEnvio = typeof emailEnviosTable.$inferSelect;
