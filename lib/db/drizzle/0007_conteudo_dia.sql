CREATE TABLE IF NOT EXISTS "conteudo_dia" (
  "id" serial PRIMARY KEY NOT NULL,
  "data" text NOT NULL,
  "frase" text DEFAULT '' NOT NULL,
  "reflexao" text DEFAULT '' NOT NULL,
  "convite" text DEFAULT '' NOT NULL,
  "imagem_url" text,
  "atualizado_em" timestamp DEFAULT now() NOT NULL,
  "atualizado_por" integer,
  CONSTRAINT "uq_conteudo_dia_data" UNIQUE("data")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_conteudo_dia_data" ON "conteudo_dia" ("data");
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "conteudo_dia" ADD CONSTRAINT "conteudo_dia_atualizado_por_usuarios_id_fk" FOREIGN KEY ("atualizado_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
