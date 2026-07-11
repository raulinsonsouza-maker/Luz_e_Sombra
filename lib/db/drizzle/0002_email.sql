CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "id" serial PRIMARY KEY NOT NULL,
  "usuario_id" integer NOT NULL REFERENCES "usuarios"("id") ON DELETE cascade,
  "token_hash" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "used_at" timestamp,
  "criado_em" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_password_reset_usuario" ON "password_reset_tokens" ("usuario_id");
CREATE INDEX IF NOT EXISTS "idx_password_reset_token_hash" ON "password_reset_tokens" ("token_hash");

CREATE TABLE IF NOT EXISTS "email_envios" (
  "id" serial PRIMARY KEY NOT NULL,
  "usuario_id" integer REFERENCES "usuarios"("id") ON DELETE set null,
  "destinatario" text NOT NULL,
  "template" text NOT NULL,
  "assunto" text NOT NULL,
  "status" text NOT NULL,
  "resend_id" text,
  "erro" text,
  "meta" jsonb,
  "criado_em" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_email_envios_destinatario" ON "email_envios" ("destinatario");
CREATE INDEX IF NOT EXISTS "idx_email_envios_template" ON "email_envios" ("template");
CREATE INDEX IF NOT EXISTS "idx_email_envios_status" ON "email_envios" ("status");
