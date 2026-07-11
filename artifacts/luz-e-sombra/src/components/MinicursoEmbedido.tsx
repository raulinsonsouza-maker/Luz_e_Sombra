import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/auth";
import {
  Loader2, CheckCircle2, Circle, Play, BookOpen, Clock, ChevronRight, ChevronLeft, ExternalLink,
} from "lucide-react";
import { getVideoEmbedUrl } from "@/lib/mediaEmbed";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { VideoEmBrevePlaceholder } from "@/components/VideoEmBrevePlaceholder";

export interface AulaMinicurso {
  id: number;
  titulo: string;
  descricao: string | null;
  videoUrl: string | null;
  conteudo: string | null;
  ordem: number;
  duracaoMin: number | null;
  concluida: boolean;
}

interface CursoPayload {
  id: number;
  titulo: string;
  descricao: string;
  aulas: AulaMinicurso[];
}

function indiceAula(aulas: AulaMinicurso[], aulaId: number): number {
  const i = aulas.findIndex((a) => a.id === aulaId);
  return i < 0 ? 0 : i + 1;
}

interface Props {
  cursoId: number;
  tituloExtra?: string;
  /** Chamado quando todas as aulas ficam concluídas */
  onTodasAulasConcluidas?: () => void;
}

export function MinicursoEmbedido({ cursoId, tituloExtra, onTodasAulasConcluidas }: Props) {
  const [curso, setCurso] = useState<CursoPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [aulaAtiva, setAulaAtiva] = useState<AulaMinicurso | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);
  const [avisou100, setAvisou100] = useState(false);

  const buscarCurso = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/cursos/${cursoId}`);
      if (res.ok) {
        const data: CursoPayload = await res.json();
        setCurso(data);
        if (data.aulas.length > 0) {
          const proxima = data.aulas.find((a) => !a.concluida) ?? data.aulas[0];
          setAulaAtiva(proxima);
        }
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [cursoId]);

  useEffect(() => {
    void buscarCurso();
  }, [buscarCurso]);

  useEffect(() => {
    if (!curso?.aulas.length || avisou100) return;
    const total = curso.aulas.length;
    const done = curso.aulas.filter((a) => a.concluida).length;
    if (total > 0 && done === total) {
      setAvisou100(true);
      onTodasAulasConcluidas?.();
    }
  }, [curso, avisou100, onTodasAulasConcluidas]);

  async function toggleConcluida(aula: AulaMinicurso) {
    setToggling(aula.id);
    const method = aula.concluida ? "DELETE" : "POST";
    try {
      const res = await apiFetch(`/cursos/aulas/${aula.id}/concluir`, { method });
      if (res.ok) {
        setCurso((prev) => {
          if (!prev) return prev;
          const aulas = prev.aulas.map((a) =>
            a.id === aula.id ? { ...a, concluida: !a.concluida } : a,
          );
          if (aulaAtiva?.id === aula.id) {
            setAulaAtiva({ ...aula, concluida: !aula.concluida });
          }
          return { ...prev, aulas };
        });
      }
    } catch {
      /* ignore */
    }
    setToggling(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  if (!curso) {
    return (
      <p className="text-sm text-center py-6" style={{ color: "rgba(247,242,236,0.4)" }}>
        Não foi possível carregar o minicurso.
      </p>
    );
  }

  const totalAulas = curso.aulas.length;
  const totalConcluidas = curso.aulas.filter((a) => a.concluida).length;
  const pct = totalAulas > 0 ? Math.round((totalConcluidas / totalAulas) * 100) : 0;
  const embedUrl =
    FEATURE_FLAGS.SHOW_COURSE_LESSON_VIDEOS && aulaAtiva?.videoUrl
      ? getVideoEmbedUrl(aulaAtiva.videoUrl)
      : null;
  const nAtiva = aulaAtiva ? indiceAula(curso.aulas, aulaAtiva.id) : 0;
  const temVideoEmbutido = Boolean(embedUrl);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.14)" }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.55)" }}>
          Minicurso
        </p>
        <h3 className="font-semibold text-base mb-1" style={{ color: "#f7f2ec" }}>
          {curso.titulo}
          {tituloExtra ? (
            <span className="block text-[11px] font-normal mt-1" style={{ color: "rgba(247,242,236,0.45)" }}>
              {tituloExtra}
            </span>
          ) : null}
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 mt-3">
          <span className="text-[11px]" style={{ color: "rgba(247,242,236,0.45)" }}>
            Progresso
          </span>
          <span className="text-[11px] font-semibold tabular-nums" style={{ color: pct === 100 ? "#6ecf8f" : "#c8a56b" }}>
            {totalConcluidas}/{totalAulas} aulas · {pct}%
          </span>
        </div>
        <div
          className="h-2.5 rounded-full overflow-hidden"
          style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(200,165,107,0.12)",
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              minWidth: pct > 0 ? "6px" : undefined,
              background:
                pct === 100
                  ? "linear-gradient(90deg, #4ade80, #22c55e)"
                  : "linear-gradient(90deg, #8a6a3e, #d4b87a, #c8a56b)",
            }}
          />
        </div>
      </div>

      {aulaAtiva && (
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.14)" }}
        >
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
            <div
              className="aspect-video w-full flex flex-col items-center justify-center gap-4 px-6 text-center py-8"
              style={{ background: "rgba(200,165,107,0.06)", borderBottom: "1px solid rgba(200,165,107,0.08)" }}
            >
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
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(200,165,107,0.15)",
                  color: "#c8a56b",
                  border: "1px solid rgba(200,165,107,0.25)",
                }}
              >
                Aula {nAtiva} de {totalAulas}
              </span>
              {aulaAtiva.duracaoMin != null && aulaAtiva.duracaoMin > 0 && (
                <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(247,242,236,0.38)" }}>
                  <Clock className="w-3.5 h-3.5" />
                  {aulaAtiva.duracaoMin} min
                </span>
              )}
            </div>

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
                className="text-sm leading-relaxed rounded-xl p-4 mb-5 whitespace-pre-wrap"
                style={{
                  background: "rgba(200,165,107,0.05)",
                  border: "1px solid rgba(200,165,107,0.1)",
                  color: "rgba(247,242,236,0.72)",
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
                style={
                  aulaAtiva.concluida
                    ? {
                        background: "rgba(93,185,122,0.18)",
                        color: "#6ecf8f",
                        border: "1px solid rgba(93,185,122,0.35)",
                      }
                    : { background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208", border: "none" }
                }
              >
                {toggling === aulaAtiva.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : aulaAtiva.concluida ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                {aulaAtiva.concluida ? "Aula concluída" : "Marcar aula como concluída"}
              </button>

              {(() => {
                const idx = curso.aulas.findIndex((a) => a.id === aulaAtiva.id);
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

      {curso.aulas.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(200,165,107,0.12)" }}
        >
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.55)" }}>
              Aulas
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
                className="w-full flex items-start gap-4 px-5 py-4 text-left transition-all min-h-[72px]"
                style={{
                  borderTop: i > 0 ? "1px solid rgba(200,165,107,0.07)" : undefined,
                  background: ativa ? "rgba(200,165,107,0.08)" : "transparent",
                  boxShadow: ativa ? "inset 3px 0 0 #c8a56b" : undefined,
                }}
              >
                <div className="shrink-0 pt-0.5">
                  {aula.concluida ? (
                    <CheckCircle2 className="w-5 h-5" style={{ color: "#5db97a" }} />
                  ) : (
                    <Circle className="w-5 h-5" style={{ color: ativa ? "#c8a56b" : "rgba(247,242,236,0.22)" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wide mb-1"
                    style={{ color: ativa ? "rgba(200,165,107,0.85)" : "rgba(200,165,107,0.45)" }}
                  >
                    Aula {String(n).padStart(2, "0")}
                  </p>
                  <p
                    className={`text-[15px] leading-snug ${ativa ? "font-semibold" : "font-medium"}`}
                    style={{ color: ativa ? "#f7f2ec" : "rgba(247,242,236,0.72)" }}
                  >
                    {aula.titulo}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {curso.aulas.length === 0 && (
        <div className="text-center py-10 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.1)" }}>
          <BookOpen className="w-9 h-9 mx-auto mb-3 opacity-40" style={{ color: "#c8a56b" }} />
          <p className="text-sm" style={{ color: "rgba(247,242,236,0.35)" }}>
            Este curso ainda não tem aulas publicadas.
          </p>
        </div>
      )}
    </div>
  );
}
