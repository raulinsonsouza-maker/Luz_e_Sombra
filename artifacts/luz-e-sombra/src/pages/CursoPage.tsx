import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { apiFetch } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft, Loader2, CheckCircle2, Circle, Play,
  BookOpen, Clock, ChevronRight, GraduationCap
} from "lucide-react";

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

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes("youtu.be")) videoId = u.pathname.slice(1);
    else if (u.hostname.includes("youtube.com")) videoId = u.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
  } catch {
    return null;
  }
}

export default function CursoPage() {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [aulaAtiva, setAulaAtiva] = useState<Aula | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  useEffect(() => {
    if (id) buscarCurso();
  }, [id]);

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
    } catch {}
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

  const totalConcluidas = curso.aulas.filter(a => a.concluida).length;
  const pct = curso.aulas.length > 0 ? Math.round((totalConcluidas / curso.aulas.length) * 100) : 0;
  const embedUrl = aulaAtiva?.videoUrl ? getYouTubeEmbedUrl(aulaAtiva.videoUrl) : null;

  return (
    <div className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}>
      <div className="max-w-2xl mx-auto px-4 pt-4">

        {/* Back */}
        <button
          onClick={() => navigate("/cursos")}
          className="flex items-center gap-2 mb-5 text-sm transition-all"
          style={{ color: "rgba(200,165,107,0.5)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#c8a56b"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(200,165,107,0.5)"; }}
        >
          <ChevronLeft className="w-4 h-4" />
          Todos os cursos
        </button>

        {/* Course header */}
        <div className="rounded-2xl p-5 mb-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.15), rgba(156,119,66,0.08))", border: "1px solid rgba(200,165,107,0.15)" }}>
              <GraduationCap className="w-5 h-5" style={{ color: "#c8a56b" }} />
            </div>
            <div className="flex-1">
              {curso.categoria && (
                <p className="text-xs mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>{curso.categoria}</p>
              )}
              <h1 className="font-tan-mon-cheri text-xl mb-2" style={{ color: "#f7f2ec" }}>{curso.titulo}</h1>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(247,242,236,0.5)" }}>{curso.descricao}</p>
              <div className="flex items-center gap-4">
                <span className="text-xs" style={{ color: "rgba(247,242,236,0.3)" }}>
                  {curso.aulas.length} aula{curso.aulas.length !== 1 ? "s" : ""}
                </span>
                <span className="text-xs font-medium" style={{ color: pct === 100 ? "#5db97a" : "#c8a56b" }}>
                  {pct}% concluído
                </span>
              </div>
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "rgba(200,165,107,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: pct === 100 ? "linear-gradient(90deg, #5db97a, #3da65a)" : "linear-gradient(90deg, #9c7742, #c8a56b)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active lesson viewer */}
        {aulaAtiva && (
          <div className="rounded-2xl overflow-hidden mb-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}>

            {/* Video embed */}
            {embedUrl ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={aulaAtiva.titulo}
                />
              </div>
            ) : (
              <div className="aspect-video w-full flex items-center justify-center"
                style={{ background: "rgba(200,165,107,0.04)" }}>
                <div className="text-center">
                  <Play className="w-10 h-10 mx-auto mb-2" style={{ color: "rgba(200,165,107,0.3)" }} />
                  <p className="text-xs" style={{ color: "rgba(247,242,236,0.25)" }}>Sem vídeo para esta aula</p>
                </div>
              </div>
            )}

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
                    Aula {(aulaAtiva.ordem + 1).toString().padStart(2, "0")}
                  </p>
                  <h2 className="font-semibold text-lg mb-2" style={{ color: "#f7f2ec" }}>{aulaAtiva.titulo}</h2>
                  {aulaAtiva.descricao && (
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(247,242,236,0.5)" }}>
                      {aulaAtiva.descricao}
                    </p>
                  )}
                  {aulaAtiva.conteudo && (
                    <div
                      className="text-sm leading-relaxed rounded-xl p-4"
                      style={{
                        background: "rgba(200,165,107,0.04)",
                        border: "1px solid rgba(200,165,107,0.1)",
                        color: "rgba(247,242,236,0.7)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {aulaAtiva.conteudo}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => toggleConcluida(aulaAtiva)}
                  disabled={toggling === aulaAtiva.id}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                  style={aulaAtiva.concluida
                    ? { background: "rgba(93,185,122,0.15)", color: "#5db97a", border: "1px solid rgba(93,185,122,0.3)" }
                    : { background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }
                  }
                >
                  {toggling === aulaAtiva.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : aulaAtiva.concluida
                      ? <CheckCircle2 className="w-4 h-4" />
                      : <Circle className="w-4 h-4" />
                  }
                  {aulaAtiva.concluida ? "Concluída" : "Marcar como concluída"}
                </button>

                {/* Next lesson */}
                {(() => {
                  const idx = curso.aulas.findIndex(a => a.id === aulaAtiva.id);
                  const next = curso.aulas[idx + 1];
                  return next ? (
                    <button
                      onClick={() => setAulaAtiva(next)}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm transition-all"
                      style={{ border: "1px solid rgba(200,165,107,0.2)", color: "rgba(200,165,107,0.6)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#c8a56b"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(200,165,107,0.6)"; }}
                    >
                      Próxima
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Lesson list */}
        {curso.aulas.length > 0 && (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.1)" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(200,165,107,0.08)" }}>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
                Aulas do Curso
              </p>
            </div>
            {curso.aulas.map((aula, i) => {
              const ativa = aulaAtiva?.id === aula.id;
              return (
                <button
                  key={aula.id}
                  onClick={() => setAulaAtiva(aula)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all"
                  style={{
                    borderTop: i > 0 ? "1px solid rgba(200,165,107,0.06)" : undefined,
                    background: ativa ? "rgba(200,165,107,0.06)" : "transparent",
                  }}
                  onMouseEnter={e => { if (!ativa) (e.currentTarget as HTMLElement).style.background = "rgba(200,165,107,0.03)"; }}
                  onMouseLeave={e => { if (!ativa) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div className="shrink-0">
                    {aula.concluida
                      ? <CheckCircle2 className="w-4 h-4" style={{ color: "#5db97a" }} />
                      : <Circle className="w-4 h-4" style={{ color: ativa ? "#c8a56b" : "rgba(247,242,236,0.2)" }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs mb-0.5" style={{ color: "rgba(200,165,107,0.4)" }}>
                      Aula {(i + 1).toString().padStart(2, "0")}
                    </p>
                    <p className="text-sm font-medium truncate" style={{ color: ativa ? "#f7f2ec" : "rgba(247,242,236,0.6)" }}>
                      {aula.titulo}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {aula.duracaoMin && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(247,242,236,0.25)" }}>
                        <Clock className="w-3 h-3" />
                        {aula.duracaoMin}min
                      </span>
                    )}
                    {aula.videoUrl
                      ? <Play className="w-3.5 h-3.5" style={{ color: ativa ? "#c8a56b" : "rgba(247,242,236,0.15)" }} />
                      : <BookOpen className="w-3.5 h-3.5" style={{ color: "rgba(247,242,236,0.15)" }} />
                    }
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {curso.aulas.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(200,165,107,0.3)" }} />
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.3)" }}>
              As aulas serão adicionadas em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
