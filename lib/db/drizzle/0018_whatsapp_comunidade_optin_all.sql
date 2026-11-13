-- Opt-in comunidade ON para todos (pedido do produto); novos cadastros também.
ALTER TABLE "usuarios" ALTER COLUMN "whatsapp_comunidade_opt_in" SET DEFAULT true;
UPDATE "usuarios" SET "whatsapp_comunidade_opt_in" = true WHERE "whatsapp_comunidade_opt_in" = false;
