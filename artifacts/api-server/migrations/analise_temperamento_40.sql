CREATE TABLE IF NOT EXISTS analise_temperamento_40 (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  respostas JSONB NOT NULL,
  resultado JSONB NOT NULL,
  versao TEXT NOT NULL DEFAULT 'temperamento_v1',
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analise_temperamento_40_usuario ON analise_temperamento_40(usuario_id);
