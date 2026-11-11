ALTER TABLE "compras_mp" ADD COLUMN IF NOT EXISTS "email_pending_reminder_sent_at" timestamp;
ALTER TABLE "compras_mp" ADD COLUMN IF NOT EXISTS "email_reminder_2h_sent_at" timestamp;
ALTER TABLE "compras_mp" ADD COLUMN IF NOT EXISTS "email_reminder_24h_sent_at" timestamp;
