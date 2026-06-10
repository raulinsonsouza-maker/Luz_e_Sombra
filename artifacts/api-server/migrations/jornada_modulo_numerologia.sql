-- Módulo 5 da jornada iniciante: Numerologia
INSERT INTO configuracoes_modulos (slug, titulo_intro, descricao_intro, video_intro_url, curso_vinculado_id, ordem, nivel_dificuldade)
VALUES (
  'numerologia',
  'Numerologia',
  'Descubra o mapa dos seus números de vida, expressão e ciclos. Use a data de nascimento do perfil e explore o relatório completo.',
  NULL,
  NULL,
  5,
  'iniciante'
)
ON CONFLICT (slug) DO NOTHING;
