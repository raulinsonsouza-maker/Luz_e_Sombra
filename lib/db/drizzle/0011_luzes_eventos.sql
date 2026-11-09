CREATE TABLE IF NOT EXISTS "luzes_eventos" (
  "id" serial PRIMARY KEY NOT NULL,
  "usuario_id" integer NOT NULL,
  "tipo" text NOT NULL,
  "data_referencia" text NOT NULL,
  "criado_em" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "luzes_eventos_usuario_tipo_data" UNIQUE("usuario_id","tipo","data_referencia")
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "luzes_eventos" ADD CONSTRAINT "luzes_eventos_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
