ALTER TABLE comentarios_comunidade
ADD COLUMN IF NOT EXISTS parent_comentario_id INTEGER REFERENCES comentarios_comunidade(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_comentarios_parent_id ON comentarios_comunidade(parent_comentario_id);
