ALTER TABLE "gamificacao" ADD COLUMN IF NOT EXISTS "luzes" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "convites_diarios" (
  "id" serial PRIMARY KEY NOT NULL,
  "usuario_id" integer NOT NULL,
  "data_referencia" text NOT NULL,
  "concluido_em" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "convites_diarios_usuario_data" UNIQUE("usuario_id","data_referencia")
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "convites_diarios" ADD CONSTRAINT "convites_diarios_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
