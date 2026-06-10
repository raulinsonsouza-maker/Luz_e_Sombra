import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import MobileTopBar from "@/components/MobileTopBar";
import PageIntroHeader from "@/components/PageIntroHeader";
import {
  CheckCircle2,
  Lock,
  ChevronRight,
  Layers,
  FlaskConical,
  Heart,
  Target,
  Sparkles,
  TrendingUp,
  Crown,
  Hash,
} from "lucide-react";

interface ModuloApi {
  slug: string;
  tituloIntro: string;
  descricaoIntro: string;
  ordem: number;
  hubHref: string;
  status: "done" | "active" | "locked";
  analiseConcluida: boolean;
  minicursoConcluido: boolean;
}

interface Progresso {
  nomeNivel: string;
  nivel: number;
  streakDias?: number;
}

const XP_POR_SLUG: Record<string, number> = {
  traco: 100,
  temperamento: 60,
  "linguagens-amor": 60,
  roda: 50,
  numerologia: 40,
};

function iconePorSlug(slug: string) {
  switch (slug) {
    case "traco":
      return Layers;
    case "temperamento":
      return FlaskConical;
    case "linguagens-amor":
      return Heart;
    case "roda":
      return Target;
    case "numerologia":
      return Hash;
    default:
      return Layers;
  }
}

export default function JornadaPage() {
  const [, navigate] = useLocation();
  const { status } = useAuth();
  const [modulos, setModulos] = useState<ModuloApi[]>([]);
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [carregando, setCarregando] = useState(true);

  const buscarTudo = useCallback(async () => {
    setCarregando(true);
    try {
      const [rMod, rGam] = await Promise.all([
        apiFetch("/modulos-jornada"),
        apiFetch("/gamificacao/progresso"),
      ]);
      if (rMod.ok) setModulos(await rMod.json());
      if (rGam.ok) setProgresso(await rGam.json());
    } catch {
      /* ignore */
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
      return;
    }
    if (status === "loading") return;
    void buscarTudo();
  }, [status, navigate, buscarTudo]);

  const inicianteOrdenado = [...modulos].sort((a, b) => a.ordem - b.ordem);
  const concluidasIniciante = inicianteOrdenado.filter((m) => m.status === "done").length;

  return (
    <div className="min-h-screen pb-28 journey-forest-bg">
      <MobileTopBar />
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="mb-8">
          <PageIntroHeader
            eyebrow="Sua Jornada"
            titulo="Cada etapa revela"
            subtitulo="Uma nova versão sua."
          />
          {progresso && (
            <p className="text-sm mt-3" style={{ color: "rgba(247,242,236,0.45)" }}>
              Nível {progresso.nivel} · {progresso.nomeNivel}
              {typeof progresso.streakDias === "number" ? ` · 🔥 ${progresso.streakDias} dias seguidos` : ""}
            </p>
          )}
          {!carregando && inicianteOrdenado.length > 0 && (
            <p className="text-xs mt-2" style={{ color: "rgba(247,242,236,0.35)" }}>
              Iniciante: {concluidasIniciante}/{inicianteOrdenado.length} módulos concluídos
            </p>
          )}
        </div>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color: "#c8a56b" }} />
            <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.65)" }}>
              Iniciante
            </h2>
          </div>

          <div className="relative">
            <div
              className="absolute left-8 top-8 bottom-8 w-px"
              style={{
                background: "linear-gradient(to bottom, rgba(200,165,107,0.35), rgba(200,165,107,0.05))",
              }}
            />

            <div className="space-y-4">
              {carregando ? (
                <p className="text-sm pl-20" style={{ color: "rgba(247,242,236,0.35)" }}>
                  A carregar…
                </p>
              ) : (
                inicianteOrdenado.map((mod, idx) => {
                  const s = mod.status;
                  const Icon = iconePorSlug(mod.slug);
                  const num = String(idx + 1).padStart(2, "0");
                  const xp = XP_POR_SLUG[mod.slug] ?? 40;

                  return (
                    <div key={mod.slug} className="relative flex gap-4">
                      <div className="relative z-10 shrink-0">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
                          style={{
                            background:
                              s === "done"
                                ? "linear-gradient(135deg, #c8a56b, #9c7742)"
                                : s === "active"
                                  ? "rgba(200,165,107,0.1)"
                                  : "rgba(255,255,255,0.03)",
                            border:
                              s === "done"
                                ? "2px solid #c8a56b"
                                : s === "active"
                                  ? "2px solid rgba(200,165,107,0.6)"
                                  : "2px solid rgba(255,255,255,0.06)",
                            boxShadow: s === "active" ? "0 0 22px rgba(200,165,107,0.22)" : "none",
                          }}
                        >
                          {s === "done" ? (
                            <CheckCircle2 className="w-6 h-6" style={{ color: "#1e1812" }} />
                          ) : s === "locked" ? (
                            <Lock className="w-5 h-5" style={{ color: "rgba(247,242,236,0.2)" }} />
                          ) : (
                            <Icon className="w-5 h-5" style={{ color: "#c8a56b" }} />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 pb-4">
                        <div
                          className="rounded-2xl p-4 transition-all"
                          style={{
                            background:
                              s === "done"
                                ? "linear-gradient(135deg, rgba(200,165,107,0.16), rgba(64,44,28,0.28))"
                                : s === "active"
                                  ? "linear-gradient(135deg, rgba(200,165,107,0.22), rgba(60,42,28,0.3))"
                                  : "rgba(255,255,255,0.02)",
                            border:
                              s === "done"
                                ? "1px solid rgba(200,165,107,0.2)"
                                : s === "active"
                                  ? "1px solid rgba(200,165,107,0.3)"
                                  : "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span
                                  className="text-[10px] font-bold tracking-widest"
                                  style={{
                                    color: s === "locked" ? "rgba(247,242,236,0.2)" : "rgba(200,165,107,0.6)",
                                  }}
                                >
                                  {num}
                                </span>
                                {s === "done" && (
                                  <span
                                    className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase"
                                    style={{ background: "rgba(93,185,122,0.15)", color: "#5db97a" }}
                                  >
                                    Concluído
                                  </span>
                                )}
                                {s === "locked" && (
                                  <span
                                    className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase"
                                    style={{
                                      background: "rgba(255,255,255,0.04)",
                                      color: "rgba(247,242,236,0.2)",
                                    }}
                                  >
                                    Bloqueado
                                  </span>
                                )}
                                {s === "active" && (
                                  <span
                                    className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase"
                                    style={{ background: "rgba(200,165,107,0.15)", color: "#c8a56b" }}
                                  >
                                    Em andamento
                                  </span>
                                )}
                              </div>
                              <h3
                                className="font-semibold text-sm mb-0.5"
                                style={{ color: s === "locked" ? "rgba(247,242,236,0.25)" : "#f7f2ec" }}
                              >
                                {mod.tituloIntro}
                              </h3>
                              <p
                                className="text-xs"
                                style={{
                                  color: s === "locked" ? "rgba(247,242,236,0.15)" : "rgba(247,242,236,0.45)",
                                }}
                              >
                                {s === "locked"
                                  ? "Completa o passo anterior (análise + minicurso)"
                                  : "Introdução → análise → minicurso para aprofundar"}
                              </p>
                              {s !== "locked" && (
                                <p className="text-[11px] mt-2 line-clamp-3" style={{ color: "rgba(247,242,236,0.3)" }}>
                                  {mod.descricaoIntro}
                                </p>
                              )}
                            </div>
                            {s !== "locked" && (
                              <button
                                type="button"
                                onClick={() => navigate(mod.hubHref)}
                                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                                style={{
                                  background:
                                    s === "done" ? "rgba(200,165,107,0.1)" : "linear-gradient(135deg, #c8a56b, #9c7742)",
                                  color: s === "done" ? "#c8a56b" : "#1a1208",
                                  border: s === "done" ? "1px solid rgba(200,165,107,0.3)" : "none",
                                }}
                              >
                                {s === "done" ? "Abrir" : "Começar"}
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          {s !== "locked" && (
                            <div className="flex items-center gap-1 mt-3">
                              <span className="text-[10px]" style={{ color: "rgba(200,165,107,0.4)" }}>
                                +{xp} XP (análise)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section className="mb-10 opacity-90">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" style={{ color: "rgba(200,165,107,0.45)" }} />
            <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>
              Intermediário
            </h2>
          </div>
          <div
            className="rounded-2xl p-5 flex gap-4 items-start"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.08)" }}
            >
              <Lock className="w-5 h-5" style={{ color: "rgba(247,242,236,0.18)" }} />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: "rgba(247,242,236,0.35)" }}>
                Em desenvolvimento
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.22)" }}>
                Numerologia aprofundada, diagnóstico emocional integrado e novos percursos — brevemente com a mesma
                estrutura (vídeo → análise → minicurso).
              </p>
            </div>
          </div>
        </section>

        <section className="opacity-90">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4" style={{ color: "rgba(200,165,107,0.35)" }} />
            <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.4)" }}>
              Avançado
            </h2>
          </div>
          <div
            className="rounded-2xl p-5 flex gap-4 items-start"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.08)" }}
            >
              <Lock className="w-5 h-5" style={{ color: "rgba(247,242,236,0.18)" }} />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: "rgba(247,242,236,0.35)" }}>
                Em desenvolvimento
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.22)" }}>
                Módulos mentais, financeiros e espirituais — conteúdos avançados em preparação.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
