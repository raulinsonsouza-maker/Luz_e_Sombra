CREATE INDEX IF NOT EXISTS idx_analise_traco_user_pessoa_recente
  ON analise_traco (usuario_id, pessoa_id, criado_em DESC);
