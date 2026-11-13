ALTER TABLE "compras_mp" ADD COLUMN IF NOT EXISTS "wa_welcome_sent_at" timestamp;
ALTER TABLE "compras_mp" ADD COLUMN IF NOT EXISTS "wa_pix_pending_sent_at" timestamp;
ALTER TABLE "compras_mp" ADD COLUMN IF NOT EXISTS "wa_reminder_2h_sent_at" timestamp;
ALTER TABLE "compras_mp" ADD COLUMN IF NOT EXISTS "wa_reminder_24h_sent_at" timestamp;
ALTER TABLE "compras_mp" ADD COLUMN IF NOT EXISTS "wa_access_granted_sent_at" timestamp;

ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "whatsapp_opt_out" boolean NOT NULL DEFAULT false;
