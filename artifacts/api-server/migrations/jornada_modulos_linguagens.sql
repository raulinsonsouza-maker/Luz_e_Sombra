-- Módulos da jornada (config), vínculo curso↔módulo, análise 5 linguagens do amor

ALTER TABLE cursos ADD COLUMN IF NOT EXISTS modulo_jornada TEXT;
CREATE INDEX IF NOT EXISTS idx_cursos_modulo_jornada ON cursos(modulo_jornada);

CREATE TABLE IF NOT EXISTS configuracoes_modulos (
  slug TEXT PRIMARY KEY,
  titulo_intro TEXT NOT NULL,
  descricao_intro TEXT NOT NULL,
  video_intro_url TEXT,
  curso_vinculado_id INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  nivel_dificuldade TEXT NOT NULL DEFAULT 'iniciante',
  atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_config_modulos_ordem ON configuracoes_modulos(ordem);

CREATE TABLE IF NOT EXISTS analise_linguagens_amor (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  respostas JSONB NOT NULL,
  pontuacoes JSONB NOT NULL,
  linguagem_principal TEXT NOT NULL,
  linguagem_secundaria TEXT NOT NULL,
  resultado JSONB NOT NULL,
  versao TEXT NOT NULL DEFAULT 'linguagens_amor_v1',
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analise_linguagens_amor_usuario ON analise_linguagens_amor(usuario_id);

-- Seed inicial (placeholders; admin pode editar)
INSERT INTO configuracoes_modulos (slug, titulo_intro, descricao_intro, video_intro_url, curso_vinculado_id, ordem, nivel_dificuldade)
VALUES
  ('traco', 'Traço de Caráter', 'Entenda como funciona a análise visual e o questionário. Em seguida, faça a análise e desbloqueie o minicurso.', NULL, NULL, 1, 'iniciante'),
  ('temperamento', 'Temperamento', 'Introdução ao questionário de temperamento e ao que você vai descobrir. Depois, complete a análise e o minicurso.', NULL, NULL, 2, 'iniciante'),
  ('linguagens-amor', '5 Linguagens do Amor', 'Descubra como você dá e recebe afeto. Complete o questionário e aprofunde no minicurso.', NULL, NULL, 3, 'iniciante'),
  ('roda', 'Roda da Vida', 'Avalie as áreas da sua vida com clareza. Depois, use o minicurso para transformar insights em ação.', NULL, NULL, 4, 'iniciante')
ON CONFLICT (slug) DO NOTHING;
