ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "telefone" text;
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "status_acesso" text DEFAULT 'active' NOT NULL;

CREATE TABLE IF NOT EXISTS "compras_cakto" (
  "id" serial PRIMARY KEY NOT NULL,
  "usuario_id" integer NOT NULL REFERENCES "usuarios"("id") ON DELETE cascade,
  "checkout_token" text NOT NULL,
  "cakto_order_id" text,
  "valor" text,
  "metodo_pagamento" text,
  "status" text DEFAULT 'pending' NOT NULL,
  "variant" text DEFAULT 'control' NOT NULL,
  "utm_source" text,
  "utm_medium" text,
  "utm_campaign" text,
  "utm_content" text,
  "utm_term" text,
  "criado_em" timestamp DEFAULT now() NOT NULL,
  "atualizado_em" timestamp DEFAULT now() NOT NULL,
  "pago_em" timestamp,
  CONSTRAINT "uq_compras_cakto_checkout_token" UNIQUE("checkout_token")
);

CREATE INDEX IF NOT EXISTS "idx_compras_cakto_usuario_id" ON "compras_cakto" ("usuario_id");
CREATE INDEX IF NOT EXISTS "idx_compras_cakto_status" ON "compras_cakto" ("status");

CREATE TABLE IF NOT EXISTS "webhook_eventos_cakto" (
  "id" serial PRIMARY KEY NOT NULL,
  "event_id" text NOT NULL,
  "event_type" text NOT NULL,
  "payload" jsonb,
  "processado_em" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "uq_webhook_eventos_cakto_event_id" UNIQUE("event_id")
);
