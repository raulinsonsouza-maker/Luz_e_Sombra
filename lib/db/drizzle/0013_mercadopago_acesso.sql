ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "acesso_inicio" timestamp;
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "acesso_ate" timestamp;
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "garantia_ate" timestamp;

CREATE TABLE IF NOT EXISTS "integracoes_pagamento" (
  "id" serial PRIMARY KEY NOT NULL,
  "provider" text DEFAULT 'mercadopago' NOT NULL,
  "mp_user_id" text,
  "public_key" text,
  "access_token" text,
  "refresh_token" text,
  "expires_at" timestamp,
  "connected_at" timestamp,
  "status" text DEFAULT 'disconnected' NOT NULL,
  "criado_em" timestamp DEFAULT now() NOT NULL,
  "atualizado_em" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_integracoes_pagamento_provider" ON "integracoes_pagamento" ("provider");

CREATE TABLE IF NOT EXISTS "compras_mp" (
  "id" serial PRIMARY KEY NOT NULL,
  "usuario_id" integer NOT NULL,
  "checkout_token" text NOT NULL,
  "mp_payment_id" text,
  "valor" text DEFAULT '111.11' NOT NULL,
  "metodo_pagamento" text,
  "status" text DEFAULT 'pending' NOT NULL,
  "variant" text DEFAULT 'fundadores' NOT NULL,
  "utm_source" text,
  "utm_medium" text,
  "utm_campaign" text,
  "utm_content" text,
  "utm_term" text,
  "acesso_inicio" timestamp,
  "acesso_ate" timestamp,
  "garantia_ate" timestamp,
  "criado_em" timestamp DEFAULT now() NOT NULL,
  "atualizado_em" timestamp DEFAULT now() NOT NULL,
  "pago_em" timestamp,
  "kommo_lead_id" integer,
  "kommo_contact_id" integer,
  "kommo_last_sync_at" timestamp,
  "kommo_last_event" text
);
DO $$ BEGIN
  ALTER TABLE "compras_mp" ADD CONSTRAINT "compras_mp_usuario_id_usuarios_id_fk"
    FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
CREATE UNIQUE INDEX IF NOT EXISTS "uq_compras_mp_checkout_token" ON "compras_mp" ("checkout_token");
CREATE INDEX IF NOT EXISTS "idx_compras_mp_usuario_id" ON "compras_mp" ("usuario_id");
CREATE INDEX IF NOT EXISTS "idx_compras_mp_status" ON "compras_mp" ("status");
CREATE INDEX IF NOT EXISTS "idx_compras_mp_variant" ON "compras_mp" ("variant");
CREATE INDEX IF NOT EXISTS "idx_compras_mp_payment_id" ON "compras_mp" ("mp_payment_id");

CREATE TABLE IF NOT EXISTS "webhook_eventos_mp" (
  "id" serial PRIMARY KEY NOT NULL,
  "event_id" text NOT NULL,
  "event_type" text NOT NULL,
  "payload" jsonb,
  "processado_em" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "uq_webhook_eventos_mp_event_id" ON "webhook_eventos_mp" ("event_id");

CREATE TABLE IF NOT EXISTS "mp_oauth_states" (
  "id" serial PRIMARY KEY NOT NULL,
  "state" text NOT NULL,
  "code_verifier" text,
  "usado" boolean DEFAULT false NOT NULL,
  "criado_em" timestamp DEFAULT now() NOT NULL,
  "expira_em" timestamp NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "uq_mp_oauth_states_state" ON "mp_oauth_states" ("state");
