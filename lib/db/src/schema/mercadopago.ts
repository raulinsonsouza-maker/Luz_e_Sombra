import { pgTable, text, serial, integer, timestamp, jsonb, index, unique, boolean } from "drizzle-orm/pg-core";
import { usuariosTable } from "./usuarios";

/** Credenciais OAuth da conta vendedora conectada no admin. */
export const integracoesPagamentoTable = pgTable("integracoes_pagamento", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull().default("mercadopago"),
  mpUserId: text("mp_user_id"),
  publicKey: text("public_key"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  connectedAt: timestamp("connected_at"),
  status: text("status").notNull().default("disconnected"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
}, (table) => ({
  providerIdx: index("idx_integracoes_pagamento_provider").on(table.provider),
}));

export const comprasMpTable = pgTable("compras_mp", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  checkoutToken: text("checkout_token").notNull(),
  mpPaymentId: text("mp_payment_id"),
  valor: text("valor").notNull().default("111.11"),
  metodoPagamento: text("metodo_pagamento"),
  status: text("status").notNull().default("pending"),
  /** fundadores = badge dos primeiros 111; lancamento = vendas seguintes */
  variant: text("variant").notNull().default("fundadores"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  acessoInicio: timestamp("acesso_inicio"),
  acessoAte: timestamp("acesso_ate"),
  garantiaAte: timestamp("garantia_ate"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
  pagoEm: timestamp("pago_em"),
  kommoLeadId: integer("kommo_lead_id"),
  kommoContactId: integer("kommo_contact_id"),
  kommoLastSyncAt: timestamp("kommo_last_sync_at"),
  kommoLastEvent: text("kommo_last_event"),
  /** Lembrete e-mail imediato (PIX pending no /process). */
  emailPendingReminderSentAt: timestamp("email_pending_reminder_sent_at"),
  /** Recuperação pós-cadastro sem pagamento. */
  emailReminder2hSentAt: timestamp("email_reminder_2h_sent_at"),
  emailReminder24hSentAt: timestamp("email_reminder_24h_sent_at"),
}, (table) => ({
  checkoutTokenUnique: unique("uq_compras_mp_checkout_token").on(table.checkoutToken),
  usuarioIdx: index("idx_compras_mp_usuario_id").on(table.usuarioId),
  statusIdx: index("idx_compras_mp_status").on(table.status),
  variantIdx: index("idx_compras_mp_variant").on(table.variant),
  mpPaymentIdx: index("idx_compras_mp_payment_id").on(table.mpPaymentId),
}));

export const webhookEventosMpTable = pgTable("webhook_eventos_mp", {
  id: serial("id").primaryKey(),
  eventId: text("event_id").notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload"),
  processadoEm: timestamp("processado_em").notNull().defaultNow(),
}, (table) => ({
  eventIdUnique: unique("uq_webhook_eventos_mp_event_id").on(table.eventId),
}));

/** Estado OAuth em andamento (PKCE/state). */
export const mpOauthStatesTable = pgTable("mp_oauth_states", {
  id: serial("id").primaryKey(),
  state: text("state").notNull(),
  codeVerifier: text("code_verifier"),
  usado: boolean("usado").notNull().default(false),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  expiraEm: timestamp("expira_em").notNull(),
}, (table) => ({
  stateUnique: unique("uq_mp_oauth_states_state").on(table.state),
}));

export type IntegracaoPagamento = typeof integracoesPagamentoTable.$inferSelect;
export type CompraMp = typeof comprasMpTable.$inferSelect;
export type WebhookEventoMp = typeof webhookEventosMpTable.$inferSelect;
