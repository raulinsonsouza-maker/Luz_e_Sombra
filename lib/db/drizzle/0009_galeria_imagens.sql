CREATE TABLE IF NOT EXISTS "galeria_imagens" (
  "id" serial PRIMARY KEY NOT NULL,
  "ordem" integer NOT NULL,
  "origem" text DEFAULT 'upload' NOT NULL,
  "path" text NOT NULL,
  "ativo" boolean DEFAULT true NOT NULL,
  "criado_em" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "uq_galeria_imagens_ordem" UNIQUE ("ordem")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_galeria_imagens_ativo_ordem" ON "galeria_imagens" ("ativo", "ordem");
--> statement-breakpoint
INSERT INTO "galeria_imagens" ("ordem", "origem", "path", "ativo")
SELECT g, 'estatico', '/imagens-dia/' || g || '.jpg', true
FROM generate_series(1, 100) AS g
ON CONFLICT ("ordem") DO NOTHING;
