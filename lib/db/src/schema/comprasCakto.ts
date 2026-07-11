import { pgTable, text, serial, integer, timestamp, jsonb, index, unique } from "drizzle-orm/pg-core";
import { usuariosTable } from "./usuarios";

export const comprasCaktoTable = pgTable("compras_cakto", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuariosTable.id, { onDelete: "cascade" }),
  checkoutToken: text("checkout_token").notNull(),
  caktoOrderId: text("cakto_order_id"),
  valor: text("valor"),
  metodoPagamento: text("metodo_pagamento"),
  status: text("status").notNull().default("pending"),
  variant: text("variant").notNull().default("control"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  criadoEm: timestamp("criado_em").notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em").notNull().defaultNow(),
  pagoEm: timestamp("pago_em"),
}, (table) => ({
  checkoutTokenUnique: unique("uq_compras_cakto_checkout_token").on(table.checkoutToken),
  usuarioIdx: index("idx_compras_cakto_usuario_id").on(table.usuarioId),
  statusIdx: index("idx_compras_cakto_status").on(table.status),
}));

export const webhookEventosCaktoTable = pgTable("webhook_eventos_cakto", {
  id: serial("id").primaryKey(),
  eventId: text("event_id").notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload"),
  processadoEm: timestamp("processado_em").notNull().defaultNow(),
}, (table) => ({
  eventIdUnique: unique("uq_webhook_eventos_cakto_event_id").on(table.eventId),
}));

export type CompraCakto = typeof comprasCaktoTable.$inferSelect;
export type WebhookEventoCakto = typeof webhookEventosCaktoTable.$inferSelect;
