-- Executar uma vez na base PostgreSQL (ex.: psql ou painel do host).
CREATE TABLE IF NOT EXISTS diagnostico_emocional_30 (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  respostas JSONB NOT NULL,
  resultado JSONB NOT NULL,
  versao TEXT NOT NULL DEFAULT 'diagnostico30_v1',
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_diagnostico_emocional_30_usuario ON diagnostico_emocional_30(usuario_id);
