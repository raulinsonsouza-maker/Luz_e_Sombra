import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { GraduationCap, Loader2, BookOpen, CheckCircle2, ChevronRight, Lock } from "lucide-react";

interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  imagemUrl: string | null;
  categoria: string | null;
  nivel: string | null;
  publicado: boolean;
  aulasCount: number;
  aulasConcluidasCount: number;
}

const NIVEL_LABEL: Record<string, string> = {
  todos: "Todos os níveis",
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export default function CursosPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarCursos();
  }, []);

  async function buscarCursos() {
    setLoading(true);
    try {
      const res = await apiFetch("/cursos");
      if (res.ok) setCursos(await res.json());
    } catch {}
    setLoading(false);
  }

  const cursosPublicados = cursos.filter(c => c.publicado);
  const cursosRascunho = cursos.filter(c => !c.publicado);

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
            Aprendizado & Crescimento
          </p>
          <h1 className="font-tan-mon-cheri text-3xl mb-1" style={{ color: "#f7f2ec" }}>Cursos</h1>
          <p className="text-sm" style={{ color: "rgba(247,242,236,0.4)" }}>
            Transforme conhecimento em prática
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#c8a56b" }} />
          </div>
        ) : cursosPublicados.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.15)" }}
            >
              <GraduationCap className="w-7 h-7" style={{ color: "rgba(200,165,107,0.4)" }} />
            </div>
            <p className="font-tan-mon-cheri text-xl mb-2" style={{ color: "rgba(247,242,236,0.4)" }}>
              Em breve
            </p>
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.25)" }}>
              Os primeiros cursos estão sendo preparados com cuidado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cursosPublicados.map(curso => (
              <CursoCard key={curso.id} curso={curso} onClick={() => navigate(`/cursos/${curso.id}`)} />
            ))}
          </div>
        )}

        {/* Admin: draft courses */}
        {user?.isAdmin && cursosRascunho.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.4)" }}>
              Rascunhos (admin)
            </p>
            <div className="space-y-3">
              {cursosRascunho.map(curso => (
                <CursoCard
                  key={curso.id}
                  curso={curso}
                  rascunho
                  onClick={() => navigate(`/cursos/${curso.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CursoCard({ curso, rascunho, onClick }: { curso: Curso; rascunho?: boolean; onClick: () => void }) {
  const pct = curso.aulasCount > 0
    ? Math.round((curso.aulasConcluidasCount / curso.aulasCount) * 100)
    : 0;
  const concluido = curso.aulasCount > 0 && pct === 100;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden transition-all"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${rascunho ? "rgba(200,165,107,0.08)" : "rgba(200,165,107,0.12)"}`,
        opacity: rascunho ? 0.65 : 1,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.25)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = rascunho ? "rgba(200,165,107,0.08)" : "rgba(200,165,107,0.12)"; }}
    >
      <div className="p-5 flex gap-4">
        {/* Icon / thumb */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.15), rgba(156,119,66,0.08))", border: "1px solid rgba(200,165,107,0.15)" }}
        >
          {concluido
            ? <CheckCircle2 className="w-6 h-6" style={{ color: "#5db97a" }} />
            : <BookOpen className="w-6 h-6" style={{ color: "#c8a56b" }} />
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                {rascunho && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(200,165,107,0.1)", color: "rgba(200,165,107,0.6)" }}>
                    <Lock className="w-2.5 h-2.5" />
                    Rascunho
                  </span>
                )}
                {curso.categoria && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(200,165,107,0.08)", color: "rgba(200,165,107,0.5)" }}>
                    {curso.categoria}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm leading-tight mb-1 truncate" style={{ color: "#f7f2ec" }}>
                {curso.titulo}
              </h3>
              <p className="text-xs line-clamp-2" style={{ color: "rgba(247,242,236,0.45)" }}>
                {curso.descricao}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "rgba(200,165,107,0.4)" }} />
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px]" style={{ color: "rgba(247,242,236,0.3)" }}>
                {curso.aulasConcluidasCount}/{curso.aulasCount} aulas
              </span>
              {pct > 0 && (
                <span className="text-[10px] font-medium" style={{ color: concluido ? "#5db97a" : "#c8a56b" }}>
                  {pct}%
                </span>
              )}
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(200,165,107,0.08)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: concluido
                    ? "linear-gradient(90deg, #5db97a, #3da65a)"
                    : "linear-gradient(90deg, #9c7742, #c8a56b)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
