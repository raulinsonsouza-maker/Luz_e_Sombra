import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { mensagemDoDia } from "@/lib/mensagensDiarias";
import MobileTopBar from "@/components/MobileTopBar";
import MissaoDiariaCard from "@/components/MissaoDiariaCard";
import { useConcluirMissao } from "@/hooks/useConcluirMissao";
import {
  ChevronRight,
  Flame,
  Zap,
  Map,
  Users2,
  GraduationCap,
} from "lucide-react";

interface Missao {
  id: number;
  titulo: string;
  xpRecompensa: number;
  concluida: boolean;
}

interface Progresso {
  xp: number;
  nivel: number;
  nomeNivel: string;
  descNivel: string;
  xpNoNivel: number;
  xpParaProximo: number;
  streakDias: number;
  melhorStreak: number;
  missoes: Missao[];
  jornada: {
    traco: boolean;
    temperamento?: boolean;
    roda: boolean;
    numerologia: boolean;
    linguagensAmor?: boolean;
  };
}

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const QUICK_ACTIONS = [
  { label: "Comunidade", sub: "Espaço compartilhado", icon: Users2, href: "/comunidade" },
  { label: "Jornada", sub: "Sua trilha", icon: Map, href: "/jornada" },
  { label: "Cursos", sub: "Aprofunde-se", icon: GraduationCap, href: "/cursos" },
] as const;

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [carregando, setCarregando] = useState(true);
  const { concluirMissao, concluindo } = useConcluirMissao(setProgresso);

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
      return;
    }
    if (status === "loading") return;
    buscarDados();
  }, [status, user]);

  async function buscarDados() {
    try {
      const resProg = await apiFetch("/gamificacao/progresso");
      if (resProg.ok) setProgresso(await resProg.json());
    } catch {
      /* noop */
    }
    setCarregando(false);
  }

  const primeiroNome = (user?.nome || "").split(" ")[0] || "Usuário";

  const xpPct = progresso
    ? Math.min(100, Math.round((progresso.xpNoNivel / progresso.xpParaProximo) * 100))
    : 0;

  const missoesPreview = progresso?.missoes.slice(0, 3) ?? [];
  const concluidasHoje = progresso?.missoes.filter((m) => m.concluida).length ?? 0;
  const totalHoje = progresso?.missoes.length ?? 0;

  const etapasInicianteConcluidas = progresso
    ? [
        progresso.jornada.traco,
        progresso.jornada.temperamento === true,
        progresso.jornada.linguagensAmor === true,
        progresso.jornada.roda,
      ].filter(Boolean).length
    : 0;

  const TOTAL_ETAPAS_INICIANTE = 4;

  return (
    <div className="min-h-screen pb-28 journey-forest-bg">
      <MobileTopBar />

      <div className="max-w-lg mx-auto px-4">
        {/* Saudação */}
        <div className="pt-4 pb-5 md:pt-8">
          <div
            className="rounded-3xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(200,165,107,0.1) 0%, rgba(200,165,107,0.03) 100%)",
              border: "1px solid rgba(200,165,107,0.2)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(200,165,107,0.1)",
            }}
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.55)" }}>
              {saudacao()},
            </p>
            <h1
              className="font-tan-mon-cheri mb-3"
              style={{ fontSize: "clamp(2rem, 6vw, 3rem)", color: "#f7f2ec", lineHeight: 1.08 }}
            >
              {primeiroNome}
            </h1>
            <div className="w-14 h-px mb-4 rounded-full" style={{ background: "linear-gradient(90deg, #c8a56b, rgba(200,165,107,0))" }} />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.52)" }}>
              {mensagemDoDia()}
            </p>
          </div>
        </div>

        {/* Nível + XP */}
        <div
          className="rounded-3xl p-5 mb-4"
          style={{
            background: "linear-gradient(135deg, rgba(200,165,107,0.1) 0%, rgba(200,165,107,0.04) 100%)",
            border: "1px solid rgba(200,165,107,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(200,165,107,0.1)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #c8a56b, #9c7742)",
                boxShadow: "0 0 16px rgba(200,165,107,0.3)",
              }}
            >
              <span className="text-base font-bold" style={{ color: "#1a1208" }}>
                {progresso?.nivel ?? 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.5)" }}>
                Nível {progresso?.nivel ?? 1}
              </p>
              <p className="text-base font-semibold mb-4" style={{ color: "#f7f2ec" }}>
                {progresso?.nomeNivel ?? "Iniciante"}
              </p>

              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" style={{ color: "#c8a56b" }} />
                  <span className="text-[11px] font-medium" style={{ color: "#c8a56b" }}>
                    {progresso ? `${progresso.xpNoNivel} XP` : "0 XP"}
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: "rgba(247,242,236,0.3)" }}>
                  {progresso ? `${progresso.xpNoNivel}/${progresso.xpParaProximo}` : "0/500"}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(200,165,107,0.1)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${xpPct}%`,
                    background: "linear-gradient(90deg, #9c7742, #c8a56b)",
                    transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: "0 0 6px rgba(200,165,107,0.4)",
                  }}
                />
              </div>

              {progresso && progresso.streakDias > 0 && (
                <div className="flex items-center gap-1 mt-3">
                  <Flame className="w-3.5 h-3.5" style={{ color: "#e86c2b" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "rgba(247,242,236,0.5)" }}>
                    {progresso.streakDias} {progresso.streakDias === 1 ? "dia seguido" : "dias seguidos"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Missões do dia */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
                Missões do dia
              </p>
            </div>
            {progresso && (
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: concluidasHoje === totalHoje ? "rgba(93,185,122,0.15)" : "rgba(200,165,107,0.12)",
                    color: concluidasHoje === totalHoje ? "#5db97a" : "#c8a56b",
                  }}
                >
                  {concluidasHoje}/{totalHoje}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            {carregando
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: "rgba(200,165,107,0.05)" }} />
                ))
              : missoesPreview.map((missao) => (
                  <MissaoDiariaCard
                    key={missao.id}
                    missao={missao}
                    compact
                    concluindo={concluindo === missao.id}
                    onConcluir={concluirMissao}
                  />
                ))}
          </div>

          <button
            onClick={() => navigate("/missoes")}
            className="w-full mt-3 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all"
            style={{
              background: "rgba(200,165,107,0.07)",
              border: "1px solid rgba(200,165,107,0.15)",
              color: "#c8a56b",
            }}
          >
            Ver todas as missões
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Explorar */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "rgba(200,165,107,0.5)" }}>
            Explorar
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(({ label, sub, icon: Icon, href }) => (
              <button
                key={href}
                onClick={() => navigate(href)}
                className="rounded-2xl p-3 sm:p-4 text-left transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(200,165,107,0.1)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                  style={{ background: "rgba(200,165,107,0.08)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#c8a56b" }} />
                </div>
                <p className="text-sm font-semibold leading-tight" style={{ color: "#f7f2ec" }}>
                  {label}
                </p>
                <p className="text-[11px] mt-0.5 leading-snug" style={{ color: "rgba(247,242,236,0.35)" }}>
                  {sub}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Sua Jornada */}
        {progresso && (
          <button
            onClick={() => navigate("/jornada")}
            className="w-full rounded-2xl p-4 mb-4 flex items-center gap-4 transition-all"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(200,165,107,0.1)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(200,165,107,0.08)" }}
            >
              <Map className="w-5 h-5" style={{ color: "#c8a56b" }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold" style={{ color: "#f7f2ec" }}>
                Sua Jornada
              </p>
              <p className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
                {etapasInicianteConcluidas} de {TOTAL_ETAPAS_INICIANTE} etapas concluídas
              </p>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "rgba(200,165,107,0.35)" }} />
          </button>
        )}
      </div>
    </div>
  );
}
