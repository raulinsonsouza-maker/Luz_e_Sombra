import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { ChevronLeft, Lock, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import MobileTopBar from "@/components/MobileTopBar";
import { getVideoEmbedUrl } from "@/lib/mediaEmbed";
import { MinicursoEmbedido } from "@/components/MinicursoEmbedido";

interface ModuloApi {
  slug: string;
  tituloIntro: string;
  descricaoIntro: string;
  videoIntroUrl: string | null;
  cursoVinculadoId: number | null;
  ordem: number;
  hrefAnalise: string;
  hubHref: string;
  analiseConcluida: boolean;
  minicursoConcluido: boolean;
  minicursoProgresso: { total: number; concluidas: number } | null;
  status: "done" | "active" | "locked";
}

export default function JornadaHubPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { status } = useAuth();
  const [lista, setLista] = useState<ModuloApi[]>([]);
  const [loading, setLoading] = useState(true);

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/modulos-jornada");
      if (res.ok) setLista(await res.json());
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
  }, [status, navigate]);

  useEffect(() => {
    void buscar();
  }, [buscar]);

  const modulo = useMemo(() => lista.find((m) => m.slug === slug), [lista, slug]);

  const proximoHub = useMemo(() => {
    if (!modulo || lista.length === 0) return null;
    const ordenados = [...lista].sort((a, b) => a.ordem - b.ordem);
    const i = ordenados.findIndex((m) => m.slug === modulo.slug);
    if (i < 0 || i >= ordenados.length - 1) return null;
    return ordenados[i + 1].hubHref;
  }, [lista, modulo]);

  const moduloCompleto =
    modulo && modulo.analiseConcluida && modulo.minicursoConcluido;

  const embedIntro = modulo?.videoIntroUrl ? getVideoEmbedUrl(modulo.videoIntroUrl) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center journey-forest-bg">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  if (!modulo) {
    return (
      <div className="min-h-screen px-4 pt-8 journey-forest-bg">
        <MobileTopBar titulo="Jornada" subtitulo="Módulo não encontrado" />
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm mb-4" style={{ color: "rgba(247,242,236,0.5)" }}>
            Módulo não encontrado.
          </p>
          <button
            type="button"
            onClick={() => navigate("/jornada")}
            className="text-sm underline"
            style={{ color: "#c8a56b" }}
          >
            Voltar à jornada
          </button>
        </div>
      </div>
    );
  }

  if (modulo.status === "locked") {
    return (
      <div className="min-h-screen px-4 pt-6 pb-28 journey-forest-bg">
        <MobileTopBar titulo={modulo.tituloIntro} subtitulo="Módulo bloqueado" />
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => navigate("/jornada")}
            className="flex items-center gap-2 text-sm mb-6"
            style={{ color: "rgba(200,165,107,0.65)" }}
          >
            <ChevronLeft className="w-4 h-4" />
            Jornada
          </button>
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: "#f7f2ec" }} />
            <h1 className="font-tan-mon-cheri text-xl mb-2" style={{ color: "#f7f2ec" }}>
              Módulo bloqueado
            </h1>
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.45)" }}>
              Complete o passo anterior na jornada (análise + minicurso) para desbloquear este módulo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 journey-forest-bg">
      <MobileTopBar titulo={modulo.tituloIntro} subtitulo="Módulo da jornada" />
      <div className="max-w-lg mx-auto px-4 pt-6">
        <button
          type="button"
          onClick={() => navigate("/jornada")}
          className="flex items-center gap-2 text-sm mb-6"
          style={{ color: "rgba(200,165,107,0.65)" }}
        >
          <ChevronLeft className="w-4 h-4" />
          Jornada
        </button>

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-2 hidden md:block" style={{ color: "rgba(200,165,107,0.5)" }}>
            Módulo
          </p>
          <h1 className="font-tan-mon-cheri text-2xl mb-2 hidden md:block" style={{ color: "#f7f2ec" }}>
            {modulo.tituloIntro}
          </h1>
          <p className="text-sm leading-relaxed mt-1 md:mt-0" style={{ color: "rgba(247,242,236,0.5)" }}>
            {modulo.descricaoIntro}
          </p>
        </div>

        {/* 1 — Vídeo intro */}
        <section className="mb-8">
          <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.55)" }}>
            1 · Introdução
          </h2>
          {embedIntro ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-3">
              <iframe
                src={embedIntro}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Introdução ao módulo"
              />
            </div>
          ) : (
            <div
              className="rounded-xl p-6 text-center text-sm"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.1)", color: "rgba(247,242,236,0.35)" }}
            >
              Vídeo de introdução será configurado pelo administrador.
            </div>
          )}
        </section>

        {/* 2 — Análise */}
        <section className="mb-8">
          <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.55)" }}>
            2 · Análise
          </h2>
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.14)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: "#f7f2ec" }}>
                  Questionário / análise do módulo
                </p>
                <p className="text-xs" style={{ color: "rgba(247,242,236,0.45)" }}>
                  {modulo.analiseConcluida
                    ? "Análise registada na sua conta."
                    : "Reserve alguns minutos num lugar calmo. Depois, desbloqueia o minicurso."}
                </p>
              </div>
              {modulo.analiseConcluida ? (
                <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: "#5db97a" }} />
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => navigate(modulo.hrefAnalise)}
              className="mt-4 w-full py-3 rounded-xl text-sm font-semibold"
              style={{
                background: modulo.analiseConcluida
                  ? "rgba(200,165,107,0.12)"
                  : "linear-gradient(135deg, #c8a56b, #9c7742)",
                color: modulo.analiseConcluida ? "#c8a56b" : "#1a1208",
                border: modulo.analiseConcluida ? "1px solid rgba(200,165,107,0.25)" : "none",
              }}
            >
              {modulo.analiseConcluida ? "Rever / refazer análise" : "Iniciar análise"}
            </button>
          </div>
        </section>

        {/* 3 — Minicurso */}
        <section className="mb-8">
          <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.55)" }}>
            3 · Minicurso
          </h2>
          {!modulo.analiseConcluida ? (
            <div
              className="rounded-2xl p-6 flex flex-col items-center text-center gap-3"
              style={{ background: "rgba(0,0,0,0.2)", border: "1px dashed rgba(200,165,107,0.2)" }}
            >
              <Lock className="w-8 h-8 opacity-40" style={{ color: "#c8a56b" }} />
              <p className="text-sm" style={{ color: "rgba(247,242,236,0.45)" }}>
                Conclua primeiro a análise para desbloquear o minicurso e aprofundar os resultados.
              </p>
            </div>
          ) : !modulo.cursoVinculadoId ? (
            <div
              className="rounded-xl p-5 text-sm text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.1)", color: "rgba(247,242,236,0.45)" }}
            >
              O minicurso será associado aqui pelo administrador (curso publicado na área de gestão).
            </div>
          ) : (
            <MinicursoEmbedido
              cursoId={modulo.cursoVinculadoId}
              tituloExtra="Aprofunde os resultados com este percurso guiado."
              onTodasAulasConcluidas={buscar}
            />
          )}
        </section>

        {moduloCompleto && proximoHub && (
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(200,165,107,0.15), rgba(60,42,28,0.35))",
              border: "1px solid rgba(200,165,107,0.28)",
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: "#c8a56b" }} />
              <p className="font-semibold text-sm" style={{ color: "#f7f2ec" }}>
                Parabéns! Módulo concluído.
              </p>
            </div>
            <p className="text-xs" style={{ color: "rgba(247,242,236,0.55)" }}>
              Segue para o próximo passo da tua jornada quando estiveres pronto(a).
            </p>
            <button
              type="button"
              onClick={() => navigate(proximoHub)}
              className="py-3 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            >
              Próximo módulo
            </button>
          </div>
        )}

        {moduloCompleto && !proximoHub && (
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: "rgba(93,185,122,0.08)", border: "1px solid rgba(93,185,122,0.25)" }}
          >
            <p className="font-semibold text-sm mb-1" style={{ color: "#6ecf8f" }}>
              Nível Iniciante completo neste módulo.
            </p>
            <p className="text-xs" style={{ color: "rgba(247,242,236,0.5)" }}>
              Volta à Jornada para veres o quadro geral ou explora a comunidade e os cursos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
