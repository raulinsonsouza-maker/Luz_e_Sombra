-- 6º passo da jornada Iniciante: Dossiê de Vida (síntese integrada)

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS dossie_jornada_concluida BOOLEAN NOT NULL DEFAULT FALSE;

INSERT INTO configuracoes_modulos (slug, titulo_intro, descricao_intro, video_intro_url, curso_vinculado_id, ordem, nivel_dificuldade)
VALUES
  (
    'dossie',
    'Dossiê de Vida',
    'Cruzamento de todas as análises da fase Iniciante num retrato claro de como você funciona, o que sustenta seus padrões e o que pede atenção agora.',
    NULL,
    NULL,
    6,
    'iniciante'
  )
ON CONFLICT (slug) DO NOTHING;
