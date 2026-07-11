ALTER TABLE "compras_cakto" ADD COLUMN IF NOT EXISTS "kommo_lead_id" integer;
ALTER TABLE "compras_cakto" ADD COLUMN IF NOT EXISTS "kommo_contact_id" integer;
ALTER TABLE "compras_cakto" ADD COLUMN IF NOT EXISTS "kommo_last_sync_at" timestamp;
ALTER TABLE "compras_cakto" ADD COLUMN IF NOT EXISTS "kommo_last_event" text;

CREATE INDEX IF NOT EXISTS "idx_compras_cakto_kommo_lead_id" ON "compras_cakto" ("kommo_lead_id");
