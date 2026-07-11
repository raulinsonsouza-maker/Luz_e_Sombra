import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { apiFetch } from "@/lib/auth";
import { toastApiError } from "@/lib/apiError";
import {
  ChevronLeft, Loader2, CheckCircle2, Circle, Play,
  BookOpen, Clock, ChevronRight, ExternalLink,
} from "lucide-react";
import { CursoCapa } from "@/components/CursoCapa";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import { getVideoEmbedUrl } from "@/lib/mediaEmbed";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { VideoEmBrevePlaceholder } from "@/components/VideoEmBrevePlaceholder";

interface Aula {
  id: number;
  titulo: string;
  descricao: string | null;
  videoUrl: string | null;
  conteudo: string | null;
  ordem: number;
  duracaoMin: number | null;
  concluida: boolean;
}

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  imagemUrl: string | null;
  categoria: string | null;
  nivel: string | null;
  publicado: boolean;
  aulas: Aula[];
}

/** Número da aula na ordem do curso (1…N), alinhado à lista — não usar só o campo `ordem` do banco. */
function indiceAula(aulas: Aula[], aulaId: number): number {
  const i = aulas.findIndex(a => a.id === aulaId);
  return i < 0 ? 0 : i + 1;
}

export default function CursoPage() {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [aulaAtiva, setAulaAtiva] = useState<Aula | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  useEffect(() => {
    if (!FEATURE_FLAGS.SHOW_COURSES_CATALOG) {
      navigate("/cursos");
      return;
    }
    if (id) buscarCurso();
  }, [id, navigate]);

  async function buscarCurso() {
    setLoading(true);
    try {
      const res = await apiFetch(`/cursos/${id}`);
      if (res.ok) {
        const data: Curso = await res.json();
        setCurso(data);
        if (data.aulas.length > 0) {
          const proxima = data.aulas.find(a => !a.concluida) ?? data.aulas[0];
          setAulaAtiva(proxima);
        }
      } else {
        navigate("/cursos");
      }
    } catch {
      navigate("/cursos");
    }
    setLoading(false);
  }

  async function toggleConcluida(aula: Aula) {
    setToggling(aula.id);
    const method = aula.concluida ? "DELETE" : "POST";
    try {
      const res = await apiFetch(`/cursos/aulas/${aula.id}/concluir`, { method });
      if (res.ok) {
        setCurso(prev => {
          if (!prev) return prev;
          const aulas = prev.aulas.map(a =>
            a.id === aula.id ? { ...a, concluida: !aula.concluida } : a
          );
          if (aulaAtiva?.id === aula.id) {
            setAulaAtiva({ ...aula, concluida: !aula.concluida });
          }
          return { ...prev, aulas };
        });
      }
    } catch {
      toastApiError();
    }
    setToggling(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  if (!curso) return null;

  const totalAulas = curso.aulas.length;
  const totalConcluidas = curso.aulas.filter(a => a.concluida).length;
  const pct = totalAulas > 0 ? Math.round((totalConcluidas / totalAulas) * 100) : 0;
  const embedUrl =
    FEATURE_FLAGS.SHOW_COURSE_LESSON_VIDEOS && aulaAtiva?.videoUrl
      ? getVideoEmbedUrl(aulaAtiva.videoUrl)
      : null;
  const nAtiva = aulaAtiva ? indiceAula(curso.aulas, aulaAtiva.id) : 0;
  const temVideoEmbutido = Boolean(embedUrl);

  return (
    <div className="min-h-screen pb-32"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}>
      <MobileTopBar titulo={curso.titulo} subtitulo={curso.categoria ?? "Curso"} />
      <div className="max-w-2xl mx-auto px-4 sm:px-5 pt-4 sm:pt-6">

        <NavBackButton to="/cursos" label="Cursos" />

        {/* Hero do curso */}
        <div className="rounded-2xl overflow-hidden mb-6 shadow-xl shadow-black/30"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.14)" }}>
          <CursoCapa cursoId={curso.id} imagemUrl={curso.imagemUrl} titulo={curso.titulo} heightClass="h-48 sm:h-56" />
          <div className="p-5 sm:p-6">
            {curso.categoria && (
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase mb-2 px-2 py-0.5 rounded-full"
                style={{ background: "rgba(200,165,107,0.12)", color: "rgba(200,165,107,0.75)" }}>
                {curso.categoria}
              </span>
            )}
            <h1 className="hidden md:block font-tan-mon-cheri text-2xl sm:text-3xl mb-3 leading-tight" style={{ color: "#f7f2ec" }}>
              {curso.titulo}
            </h1>
            <p className="text-sm sm:text-[15px] leading-relaxed mb-6" style={{ color: "rgba(247,242,236,0.52)" }}>
              {curso.descricao}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium" style={{ color: "rgba(247,242,236,0.45)" }}>
                Progresso do curso
              </span>
              <span className="text-xs font-semibold tabular-nums" style={{ color: pct === 100 ? "#6ecf8f" : "#c8a56b" }}>
                {totalConcluidas}/{totalAulas} aulas · {pct}%
              </span>
            </div>
            <div
              className="h-3 sm:h-3.5 rounded-full overflow-hidden"
              style={{
                background: "rgba(0,0,0,0.35)",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
                border: "1px solid rgba(200,165,107,0.12)",
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${pct}%`,
                  minWidth: pct > 0 ? "6px" : undefined,
                  background: pct === 100
                    ? "linear-gradient(90deg, #4ade80, #22c55e)"
                    : "linear-gradient(90deg, #8a6a3e, #d4b87a, #c8a56b)",
                  boxShadow: pct > 0 ? "0 0 12px rgba(200,165,107,0.35)" : undefined,
                }}
              />
            </div>
          </div>
        </div>

        {/* Aula em foco */}
        {aulaAtiva && (
          <div className="rounded-2xl overflow-hidden mb-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.14)" }}>

            {FEATURE_FLAGS.SHOW_COURSE_LESSON_VIDEOS && embedUrl ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={aulaAtiva.titulo}
                />
              </div>
            ) : FEATURE_FLAGS.SHOW_COURSE_LESSON_VIDEOS && aulaAtiva.videoUrl?.trim() ? (
              <div className="aspect-video w-full flex flex-col items-center justify-center gap-4 px-6 text-center py-8"
                style={{ background: "rgba(200,165,107,0.06)", borderBottom: "1px solid rgba(200,165,107,0.08)" }}>
                <Play className="w-10 h-10" style={{ color: "rgba(200,165,107,0.45)" }} />
                <p className="text-sm max-w-sm" style={{ color: "rgba(247,242,236,0.5)" }}>
                  Este link não pode ser reproduzido aqui. Abra no YouTube ou no navegador.
                </p>
                <a
                  href={aulaAtiva.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir vídeo
                </a>
              </div>
            ) : (
              <VideoEmBrevePlaceholder
                descricao="O vídeo desta aula será publicado em breve. Você pode ler o conteúdo abaixo enquanto isso."
              />
            )}

            <div className="p-5 sm:p-6">
              <h2 className="sr-only">{aulaAtiva.titulo}</h2>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(200,165,107,0.15)", color: "#c8a56b", border: "1px solid rgba(200,165,107,0.25)" }}
                >
                  Aula {nAtiva} de {totalAulas}
                </span>
                {aulaAtiva.duracaoMin != null && aulaAtiva.duracaoMin > 0 && (
                  <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(247,242,236,0.38)" }}>
                    <Clock className="w-3.5 h-3.5" />
                    {aulaAtiva.duracaoMin} min
                  </span>
                )}
                {aulaAtiva.concluida && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.12)", color: "#6ecf8f" }}>
                    Concluída
                  </span>
                )}
              </div>

              {/* Título visível só quando não há player (evita repetir o mesmo título 3x) */}
              {!temVideoEmbutido && (
                <p className="text-lg sm:text-xl font-semibold leading-snug mb-3" style={{ color: "#f7f2ec" }}>
                  {aulaAtiva.titulo}
                </p>
              )}

              {aulaAtiva.descricao?.trim() && (
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.55)" }}>
                  {aulaAtiva.descricao}
                </p>
              )}

              {aulaAtiva.conteudo?.trim() && (
                <div
                  className="text-sm leading-relaxed rounded-xl p-4 mb-5"
                  style={{
                    background: "rgba(200,165,107,0.05)",
                    border: "1px solid rgba(200,165,107,0.1)",
                    color: "rgba(247,242,236,0.72)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {aulaAtiva.conteudo}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleConcluida(aulaAtiva)}
                  disabled={toggling === aulaAtiva.id}
                  className="flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                  style={aulaAtiva.concluida
                    ? { background: "rgba(93,185,122,0.18)", color: "#6ecf8f", border: "1px solid rgba(93,185,122,0.35)" }
                    : { background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208", border: "none" }
                  }
                >
                  {toggling === aulaAtiva.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : aulaAtiva.concluida
                      ? <CheckCircle2 className="w-4 h-4" />
                      : <Circle className="w-4 h-4" />
                  }
                  {aulaAtiva.concluida ? "Aula concluída" : "Marcar aula como concluída"}
                </button>

                {(() => {
                  const idx = curso.aulas.findIndex(a => a.id === aulaAtiva.id);
                  const prev = curso.aulas[idx - 1];
                  const next = curso.aulas[idx + 1];
                  return (
                    <>
                      {prev && (
                        <button
                          type="button"
                          onClick={() => setAulaAtiva(prev)}
                          className="flex items-center gap-1 min-h-[44px] px-4 rounded-xl text-sm font-medium transition-all"
                          style={{ border: "1px solid rgba(200,165,107,0.22)", color: "rgba(200,165,107,0.75)" }}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </button>
                      )}
                      {next && (
                        <button
                          type="button"
                          onClick={() => setAulaAtiva(next)}
                          className="flex items-center gap-1 min-h-[44px] px-4 rounded-xl text-sm font-medium transition-all"
                          style={{ border: "1px solid rgba(200,165,107,0.22)", color: "rgba(200,165,107,0.75)" }}
                        >
                          Próxima
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Lista de aulas */}
        {curso.aulas.length > 0 && (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(200,165,107,0.12)" }}>
            <div className="px-5 sm:px-6 py-4 sm:py-5" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.55)" }}>
                Conteúdo do curso
              </p>
              <p className="text-[11px]" style={{ color: "rgba(247,242,236,0.28)" }}>
                Toque em uma aula para assistir ou ler
              </p>
            </div>
            {curso.aulas.map((aula, i) => {
              const ativa = aulaAtiva?.id === aula.id;
              const n = i + 1;
              return (
                <button
                  key={aula.id}
                  type="button"
                  onClick={() => setAulaAtiva(aula)}
                  className="w-full flex items-start gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left transition-all min-h-[72px]"
                  style={{
                    borderTop: i > 0 ? "1px solid rgba(200,165,107,0.07)" : undefined,
                    background: ativa ? "rgba(200,165,107,0.08)" : "transparent",
                    boxShadow: ativa ? "inset 3px 0 0 #c8a56b" : undefined,
                  }}
                  onMouseEnter={e => {
                    if (!ativa) (e.currentTarget as HTMLElement).style.background = "rgba(200,165,107,0.04)";
                  }}
                  onMouseLeave={e => {
                    if (!ativa) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div className="shrink-0 pt-0.5">
                    {aula.concluida
                      ? <CheckCircle2 className="w-5 h-5" style={{ color: "#5db97a" }} />
                      : <Circle className="w-5 h-5" style={{ color: ativa ? "#c8a56b" : "rgba(247,242,236,0.22)" }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: ativa ? "rgba(200,165,107,0.85)" : "rgba(200,165,107,0.45)" }}>
                      Aula {String(n).padStart(2, "0")}
                    </p>
                    <p className={`text-[15px] leading-snug ${ativa ? "font-semibold" : "font-medium"}`}
                      style={{ color: ativa ? "#f7f2ec" : "rgba(247,242,236,0.72)" }}>
                      {aula.titulo}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
                    {aula.duracaoMin != null && aula.duracaoMin > 0 && (
                      <span className="flex items-center gap-1 text-[11px] tabular-nums" style={{ color: "rgba(247,242,236,0.32)" }}>
                        <Clock className="w-3.5 h-3.5" />
                        {aula.duracaoMin} min
                      </span>
                    )}
                    {aula.videoUrl
                      ? <Play className="w-4 h-4" style={{ color: ativa ? "#c8a56b" : "rgba(247,242,236,0.2)" }} />
                      : <BookOpen className="w-4 h-4" style={{ color: "rgba(247,242,236,0.2)" }} />
                    }
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {curso.aulas.length === 0 && (
          <div className="text-center py-14 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.1)" }}>
            <BookOpen className="w-9 h-9 mx-auto mb-3 opacity-40" style={{ color: "#c8a56b" }} />
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.35)" }}>
              As aulas deste curso serão publicadas em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
