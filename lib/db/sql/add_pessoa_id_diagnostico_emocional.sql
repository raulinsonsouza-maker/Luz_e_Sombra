-- Isolamento do diagnóstico emocional por pessoa (Eu = NULL).
ALTER TABLE diagnostico_emocional_30
  ADD COLUMN IF NOT EXISTS pessoa_id integer REFERENCES pessoas_analise(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_diagnostico_emocional_30_user_pessoa_recente
  ON diagnostico_emocional_30 (usuario_id, pessoa_id, criado_em DESC);
