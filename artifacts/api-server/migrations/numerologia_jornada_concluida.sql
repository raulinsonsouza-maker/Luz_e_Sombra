-- Conclusão explícita do módulo Numerologia na jornada (não basta ter data de nascimento no perfil).
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS numerologia_jornada_concluida BOOLEAN NOT NULL DEFAULT FALSE;
