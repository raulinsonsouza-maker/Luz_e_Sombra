/**
 * Flags de lançamento — altere para `true` quando o conteúdo estiver pronto.
 */
export const FEATURE_FLAGS = {
  /** Vídeos de introdução nos módulos da jornada (/jornada/:slug) */
  SHOW_COURSE_INTRO_VIDEOS: false,
  /** Vídeos das aulas em CursoPage e MinicursoEmbedido */
  SHOW_COURSE_LESSON_VIDEOS: false,
  /** Catálogo em /cursos e minicursos vinculados à jornada */
  SHOW_COURSES_CATALOG: false,
} as const;
