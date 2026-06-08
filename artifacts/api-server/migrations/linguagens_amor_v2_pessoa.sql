ALTER TABLE analise_linguagens_amor
  ADD COLUMN IF NOT EXISTS pessoa_id integer REFERENCES pessoas_analise(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_analise_linguagens_user_pessoa
  ON analise_linguagens_amor(usuario_id, pessoa_id, criado_em DESC);
