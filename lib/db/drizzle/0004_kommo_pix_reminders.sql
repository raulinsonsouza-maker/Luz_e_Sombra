ALTER TABLE "compras_cakto" ADD COLUMN IF NOT EXISTS "kommo_reminder_2h_sent_at" timestamp;
ALTER TABLE "compras_cakto" ADD COLUMN IF NOT EXISTS "kommo_reminder_24h_sent_at" timestamp;
