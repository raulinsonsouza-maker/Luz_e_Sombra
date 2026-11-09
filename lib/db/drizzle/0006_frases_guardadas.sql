CREATE TABLE IF NOT EXISTS "frases_guardadas" (
  "id" serial PRIMARY KEY NOT NULL,
  "usuario_id" integer NOT NULL,
  "dia" integer NOT NULL,
  "frase" text NOT NULL,
  "reflexao" text DEFAULT '' NOT NULL,
  "convite" text DEFAULT '' NOT NULL,
  "guardada_em" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "uq_frases_guardadas_usuario_dia" UNIQUE("usuario_id","dia")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_frases_guardadas_usuario" ON "frases_guardadas" ("usuario_id");
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "frases_guardadas" ADD CONSTRAINT "frases_guardadas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
