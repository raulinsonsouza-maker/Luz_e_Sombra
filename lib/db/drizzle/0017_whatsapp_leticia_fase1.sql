ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "whatsapp_comunidade_opt_in" boolean NOT NULL DEFAULT false;
ALTER TABLE "compras_mp" ADD COLUMN IF NOT EXISTS "pix_copia_e_cola" text;
