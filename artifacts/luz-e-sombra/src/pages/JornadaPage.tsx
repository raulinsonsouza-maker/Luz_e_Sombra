import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { CheckCircle2, Lock, ChevronRight, Layers, Target, Hash, Brain, Wallet, Sparkles, Heart } from "lucide-react";

interface Progresso {
  jornada: {
    traco: boolean;
    roda: boolean;
    numerologia: boolean;
  };
  nivel: number;
  nomeNivel: string;
}

interface Etapa {
  num: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  icon: React.ElementType;
  href?: string;
  xpRecompensa: number;
  key: "traco" | "roda" | "numerologia" | null;
}

const ETAPAS: Etapa[] = [
  {
    num: "01",
    titulo: "Traço de Caráter",
    subtitulo: "Conheça sua estrutura de personalidade",
    descricao: "Baseada na bioenergética e psicologia corporal, essa análise revela com gentileza os padrões mais profundos que habitam em você — com compaixão e respeito pela sua história.",
    icon: Layers,
    href: "/traco-de-carater",
    xpRecompensa: 100,
    key: "traco",
  },
  {
    num: "02",
    titulo: "Roda da Vida",
    subtitulo: "Mapeie as áreas da sua vida com honestidade",
    descricao: "Um olhar amoroso sobre 12 dimensões da sua vida. Sem julgamento — apenas clareza de onde você está e para onde quer ir.",
    icon: Target,
    href: "/avaliacao",
    xpRecompensa: 50,
    key: "roda",
  },
  {
    num: "03",
    titulo: "Numerologia",
    subtitulo: "Os números que contam a sua história",
    descricao: "Descubra o que seu número de vida, expressão e alma revelam sobre sua missão e seus ciclos de crescimento.",
    icon: Hash,
    href: "/numerologia",
    xpRecompensa: 40,
    key: "numerologia",
  },
  {
    num: "04",
    titulo: "Módulo Emocional",
    subtitulo: "Inteligência emocional profunda",
    descricao: "Trabalhe seus padrões emocionais, gatilhos e desenvolva regulação interna.",
    icon: Heart,
    href: "/quem-sou-eu",
    xpRecompensa: 80,
    key: null,
  },
  {
    num: "05",
    titulo: "Módulo Mental",
    subtitulo: "Reprogramação de crenças",
    descricao: "Identifique e transforme os padrões mentais que limitam seu crescimento.",
    icon: Brain,
    href: undefined,
    xpRecompensa: 80,
    key: null,
  },
  {
    num: "06",
    titulo: "Módulo Financeiro",
    subtitulo: "Consciência e abundância",
    descricao: "Explore sua relação com dinheiro e construa uma mentalidade de prosperidade.",
    icon: Wallet,
    href: undefined,
    xpRecompensa: 80,
    key: null,
  },
  {
    num: "07",
    titulo: "Módulo Espiritual",
    subtitulo: "Conexão com seu propósito maior",
    descricao: "Integre todas as dimensões do ser e viva alinhado com sua essência mais profunda.",
    icon: Sparkles,
    href: undefined,
    xpRecompensa: 100,
    key: null,
  },
];

function getStatus(etapa: Etapa, progresso: Progresso | null, index: number): "done" | "active" | "locked" {
  if (!progresso) return index === 0 ? "active" : "locked";

  if (etapa.key === "traco") return progresso.jornada.traco ? "done" : "active";
  if (etapa.key === "roda") {
    if (progresso.jornada.roda) return "done";
    return progresso.jornada.traco ? "active" : "locked";
  }
  if (etapa.key === "numerologia") {
    if (progresso.jornada.numerologia) return "done";
    return progresso.jornada.roda ? "active" : "locked";
  }

  const firstThreeDone = progresso.jornada.traco && progresso.jornada.roda && progresso.jornada.numerologia;
  if (index === 3) return firstThreeDone ? "active" : "locked";
  return "locked";
}

export default function JornadaPage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { navigate("/login"); return; }
    if (status === "loading") return;
    buscarProgresso();
  }, [status]);

  async function buscarProgresso() {
    try {
      const res = await apiFetch("/gamificacao/progresso");
      if (res.ok) setProgresso(await res.json());
    } catch {}
    setCarregando(false);
  }

  const concluidas = progresso
    ? [progresso.jornada.traco, progresso.jornada.roda, progresso.jornada.numerologia].filter(Boolean).length
    : 0;

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
            Sua Jornada
          </p>
          <h1 className="font-tan-mon-cheri text-2xl mb-1" style={{ color: "#f7f2ec" }}>
            Cada etapa revela<br />uma nova versão sua.
          </h1>
          {progresso && (
            <p className="text-sm mt-3" style={{ color: "rgba(247,242,236,0.45)" }}>
              {concluidas} de {ETAPAS.filter(e => e.key !== null).length} etapas concluídas
            </p>
          )}
        </div>

        {/* Progress line + steps */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute left-8 top-8 bottom-8 w-px"
            style={{ background: "linear-gradient(to bottom, rgba(200,165,107,0.35), rgba(200,165,107,0.05))" }}
          />

          <div className="space-y-4">
            {ETAPAS.map((etapa, idx) => {
              const s = getStatus(etapa, progresso, idx);
              const Icon = etapa.icon;

              return (
                <div key={etapa.num} className="relative flex gap-4">
                  {/* Circle */}
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
                        boxShadow: s === "active" ? "0 0 20px rgba(200,165,107,0.15)" : "none",
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

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div
                      className="rounded-2xl p-4 transition-all"
                      style={{
                        background:
                          s === "done"
                            ? "rgba(200,165,107,0.06)"
                            : s === "active"
                            ? "rgba(200,165,107,0.08)"
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
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-[10px] font-bold tracking-widest"
                              style={{ color: s === "locked" ? "rgba(247,242,236,0.2)" : "rgba(200,165,107,0.6)" }}
                            >
                              {etapa.num}
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
                                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(247,242,236,0.2)" }}
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
                            {etapa.titulo}
                          </h3>
                          <p
                            className="text-xs"
                            style={{ color: s === "locked" ? "rgba(247,242,236,0.15)" : "rgba(247,242,236,0.45)" }}
                          >
                            {s === "locked" ? "Complete as etapas anteriores para desbloquear" : etapa.subtitulo}
                          </p>
                          {s !== "locked" && (
                            <p className="text-[11px] mt-2" style={{ color: "rgba(247,242,236,0.3)" }}>
                              {etapa.descricao}
                            </p>
                          )}
                        </div>
                        {s !== "locked" && etapa.href && (
                          <button
                            onClick={() => navigate(etapa.href!)}
                            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                            style={{
                              background: s === "done" ? "rgba(200,165,107,0.1)" : "linear-gradient(135deg, #c8a56b, #9c7742)",
                              color: s === "done" ? "#c8a56b" : "#1a1208",
                              border: s === "done" ? "1px solid rgba(200,165,107,0.3)" : "none",
                            }}
                          >
                            {s === "done" ? "Revisar" : "Iniciar"}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      {s !== "locked" && (
                        <div className="flex items-center gap-1 mt-3">
                          <span className="text-[10px]" style={{ color: "rgba(200,165,107,0.4)" }}>+{etapa.xpRecompensa} XP</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
