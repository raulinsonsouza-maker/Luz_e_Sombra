import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import MobileTopBar from "@/components/MobileTopBar";
import PageIntroHeader from "@/components/PageIntroHeader";
import { CheckCircle2, Circle, Flame, Trophy, Star, Zap, Sunrise, Crown, Target, Gem, Sparkles, Shield, Compass, Mountain, Award, type LucideIcon } from "lucide-react";

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
  streakDias: number;
  melhorStreak: number;
  missoes: Missao[];
  jornada?: {
    traco?: boolean;
    roda?: boolean;
  };
}

interface LevelUpInfo {
  nivel: number;
  nomeNivel: string;
}

const NIVEL_NOMES: Record<number, string> = {
  1: "Iniciante",
  2: "Observador",
  3: "Explorador",
  4: "Transformador",
  5: "Iluminado",
};

interface ConquistaItem {
  id: string;
  icon: LucideIcon;
  titulo: string;
  desc: string;
  xp: number;
  desbloqueada: boolean;
}
const CONQUISTAS: ConquistaItem[] = [
  { id: "primeiro-passo", icon: Sunrise, titulo: "Primeiro Passo", desc: "Conclua sua primeira missão", xp: 50, desbloqueada: false },
  { id: "ritmo-inicial", icon: Sparkles, titulo: "Ritmo Inicial", desc: "Conclua 2 missões no mesmo dia", xp: 60, desbloqueada: false },
  { id: "dia-fechado", icon: Target, titulo: "Dia Fechado", desc: "Conclua as 4 missões do dia", xp: 120, desbloqueada: false },
  { id: "foco-semanal", icon: Shield, titulo: "Foco Semanal", desc: "Mantenha 3 dias de sequência", xp: 80, desbloqueada: false },
  { id: "sete-dias", icon: Flame, titulo: "7 Dias Seguidos", desc: "Mantenha sequência por 7 dias", xp: 100, desbloqueada: false },
  { id: "quinze-dias", icon: Flame, titulo: "Constância de 15 Dias", desc: "Mantenha sequência por 15 dias", xp: 180, desbloqueada: false },
  { id: "trinta-dias", icon: Flame, titulo: "Constância de 30 Dias", desc: "Mantenha sequência por 30 dias", xp: 300, desbloqueada: false },
  { id: "xp-100", icon: Zap, titulo: "Energia Inicial", desc: "Alcance 100 XP", xp: 70, desbloqueada: false },
  { id: "xp-300", icon: Star, titulo: "Autoconhecedor", desc: "Alcance 300 XP", xp: 150, desbloqueada: false },
  { id: "xp-750", icon: Award, titulo: "Disciplina Viva", desc: "Alcance 750 XP", xp: 220, desbloqueada: false },
  { id: "xp-1500", icon: Award, titulo: "Mente Forte", desc: "Alcance 1500 XP", xp: 320, desbloqueada: false },
  { id: "xp-3000", icon: Award, titulo: "Mestre da Prática", desc: "Alcance 3000 XP", xp: 500, desbloqueada: false },
  { id: "nivel-2", icon: Gem, titulo: "Observador", desc: "Alcance o Nível 2", xp: 200, desbloqueada: false },
  { id: "nivel-3", icon: Compass, titulo: "Explorador", desc: "Alcance o Nível 3", xp: 260, desbloqueada: false },
  { id: "nivel-4", icon: Mountain, titulo: "Transformador", desc: "Alcance o Nível 4", xp: 360, desbloqueada: false },
  { id: "nivel-5", icon: Crown, titulo: "Iluminado", desc: "Alcance o Nível 5", xp: 600, desbloqueada: false },
  { id: "traco", icon: Crown, titulo: "Traço Revelado", desc: "Finalize o Traço de Caráter", xp: 100, desbloqueada: false },
  { id: "roda", icon: Target, titulo: "Roda Completa", desc: "Complete sua Roda da Vida", xp: 50, desbloqueada: false },
  { id: "jornada-integrada", icon: Trophy, titulo: "Jornada Integrada", desc: "Conclua Traço e Roda da Vida", xp: 250, desbloqueada: false },
];

export default function MissoesPage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [tab, setTab] = useState<"diarias" | "conquistas">("diarias");
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [concluindo, setConcluindo] = useState<number | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpInfo | null>(null);

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

  async function concluirMissao(id: number) {
    if (concluindo) return;
    setConcluindo(id);
    try {
      const res = await apiFetch(`/gamificacao/missoes/${id}/concluir`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setProgresso(prev => prev ? {
          ...prev,
          xp: data.totalXp,
          nivel: data.nivel,
          nomeNivel: data.nomeNivel,
          missoes: prev.missoes.map(m => m.id === id ? { ...m, concluida: true } : m),
        } : prev);
        if (data.leveledUp) {
          setLevelUp({ nivel: data.nivel, nomeNivel: data.nomeNivel });
        }
      }
    } catch {}
    setConcluindo(null);
  }

  const concluidasHoje = progresso?.missoes.filter(m => m.concluida).length ?? 0;
  const totalHoje = progresso?.missoes.length ?? 0;
  const xpDisponivelHoje = progresso?.missoes.filter(m => !m.concluida).reduce((s, m) => s + m.xpRecompensa, 0) ?? 0;
  const conquistasComputadas: ConquistaItem[] = CONQUISTAS.map((c) => {
    let desbloqueada = false;
    if (!progresso) return { ...c, desbloqueada: false };
    if (c.id === "primeiro-passo") desbloqueada = concluidasHoje >= 1 || progresso.xp > 0;
    else if (c.id === "ritmo-inicial") desbloqueada = concluidasHoje >= 2;
    else if (c.id === "dia-fechado") desbloqueada = totalHoje > 0 && concluidasHoje >= totalHoje;
    else if (c.id === "foco-semanal") desbloqueada = progresso.streakDias >= 3 || progresso.melhorStreak >= 3;
    else if (c.id === "sete-dias") desbloqueada = progresso.streakDias >= 7 || progresso.melhorStreak >= 7;
    else if (c.id === "quinze-dias") desbloqueada = progresso.streakDias >= 15 || progresso.melhorStreak >= 15;
    else if (c.id === "trinta-dias") desbloqueada = progresso.streakDias >= 30 || progresso.melhorStreak >= 30;
    else if (c.id === "xp-100") desbloqueada = progresso.xp >= 100;
    else if (c.id === "xp-300") desbloqueada = progresso.xp >= 300;
    else if (c.id === "xp-750") desbloqueada = progresso.xp >= 750;
    else if (c.id === "xp-1500") desbloqueada = progresso.xp >= 1500;
    else if (c.id === "xp-3000") desbloqueada = progresso.xp >= 3000;
    else if (c.id === "nivel-2") desbloqueada = progresso.nivel >= 2;
    else if (c.id === "nivel-3") desbloqueada = progresso.nivel >= 3;
    else if (c.id === "nivel-4") desbloqueada = progresso.nivel >= 4;
    else if (c.id === "nivel-5") desbloqueada = progresso.nivel >= 5;
    else if (c.id === "traco") desbloqueada = progresso.jornada?.traco === true;
    else if (c.id === "roda") desbloqueada = progresso.jornada?.roda === true;
    else if (c.id === "jornada-integrada") desbloqueada = progresso.jornada?.traco === true && progresso.jornada?.roda === true;
    return { ...c, desbloqueada };
  });

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <MobileTopBar />
      {/* Level-up modal */}
      {levelUp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-8 text-center"
            style={{
              background: "linear-gradient(160deg, #2f251b, #1e1812)",
              border: "1px solid rgba(200,165,107,0.4)",
              boxShadow: "0 0 60px rgba(200,165,107,0.2)",
            }}
          >
            <div
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", boxShadow: "0 0 40px rgba(200,165,107,0.4)" }}
            >
              <Gem className="w-10 h-10" style={{ color: "#1a1208" }} />
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.6)" }}>
              Você evoluiu!
            </p>
            <h2 className="font-tan-mon-cheri text-3xl mb-1" style={{ color: "#f7f2ec" }}>
              NÍVEL {levelUp.nivel}
            </h2>
            <p className="font-tan-mon-cheri text-xl mb-3" style={{ color: "#c8a56b" }}>
              {levelUp.nomeNivel}
            </p>
            <p className="text-sm mb-6" style={{ color: "rgba(247,242,236,0.5)" }}>
              {levelUp.nomeNivel === "Observador" && "Você está aprendendo a se observar e entender seus padrões."}
              {levelUp.nomeNivel === "Explorador" && "Sua consciência se expande. Continue explorando sua essência."}
              {levelUp.nomeNivel === "Transformador" && "A mudança real está em suas mãos. Você está transformando."}
              {levelUp.nomeNivel === "Iluminado" && "Você floresceu. Sua jornada é inspiração para o mundo."}
            </p>
            <div
              className="flex items-center justify-center gap-4 mb-6 py-3 rounded-2xl"
              style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.15)" }}
            >
              <div className="text-center">
                <p className="text-xs" style={{ color: "rgba(200,165,107,0.5)" }}>Recompensa</p>
                <p className="font-bold text-sm" style={{ color: "#c8a56b" }}>+100 XP bônus</p>
              </div>
              <div className="w-px h-8" style={{ background: "rgba(200,165,107,0.2)" }} />
              <div className="text-center">
                <p className="text-xs" style={{ color: "rgba(200,165,107,0.5)" }}>Novo conteúdo</p>
                <p className="font-bold text-sm" style={{ color: "#c8a56b" }}>Desbloqueado</p>
              </div>
            </div>
            <button
              onClick={() => setLevelUp(null)}
              className="w-full py-3 rounded-2xl font-semibold text-sm transition-all"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 pt-6">
        <PageIntroHeader eyebrow="Missões" titulo="Ações que transformam" subtitulo="Constância diária e conquistas da jornada" />

        {/* Tabs */}
        <div
          className="flex rounded-2xl p-1 mb-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.1)" }}
        >
          {(["diarias", "conquistas"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: tab === t ? "linear-gradient(135deg, rgba(200,165,107,0.25), rgba(200,165,107,0.1))" : "transparent",
                color: tab === t ? "#c8a56b" : "rgba(247,242,236,0.35)",
                border: tab === t ? "1px solid rgba(200,165,107,0.2)" : "1px solid transparent",
              }}
            >
              {t === "diarias" ? "Diárias" : "Conquistas"}
            </button>
          ))}
        </div>

        {/* Daily missions */}
        {tab === "diarias" && (
          <>
            {/* Progress summary */}
            {!carregando && progresso && (
              <div
                className="rounded-2xl p-4 mb-4 flex items-center justify-between"
                style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.15)" }}
              >
                <div>
                  <p className="text-xs" style={{ color: "rgba(200,165,107,0.6)" }}>Missões hoje</p>
                  <p className="font-tan-mon-cheri text-xl" style={{ color: "#f7f2ec" }}>
                    {concluidasHoje}/{totalHoje}
                  </p>
                </div>
                {xpDisponivelHoje > 0 && (
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "rgba(200,165,107,0.6)" }}>XP disponível</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Zap className="w-3.5 h-3.5" style={{ color: "#c8a56b" }} />
                      <p className="font-bold text-sm" style={{ color: "#c8a56b" }}>+{xpDisponivelHoje} XP</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mission list */}
            <div className="space-y-3 mb-6">
              {carregando ? (
                [0, 1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "rgba(200,165,107,0.05)" }} />
                ))
              ) : progresso?.missoes.map(missao => (
                <div
                  key={missao.id}
                  className="rounded-2xl p-4 flex items-center gap-3 transition-all"
                  style={{
                    background: missao.concluida ? "rgba(93,185,122,0.06)" : "rgba(255,255,255,0.03)",
                    border: missao.concluida ? "1px solid rgba(93,185,122,0.2)" : "1px solid rgba(200,165,107,0.1)",
                  }}
                >
                  {missao.concluida ? (
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: "#5db97a" }} />
                  ) : (
                    <Circle className="w-6 h-6 flex-shrink-0" style={{ color: "rgba(200,165,107,0.3)" }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium leading-snug"
                      style={{
                        color: missao.concluida ? "rgba(247,242,236,0.45)" : "#f7f2ec",
                        textDecoration: missao.concluida ? "line-through" : "none",
                      }}
                    >
                      {missao.titulo}
                    </p>
                  </div>
                  {missao.concluida ? (
                    <span
                      className="text-xs font-bold flex-shrink-0"
                      style={{ color: "rgba(93,185,122,0.7)" }}
                    >
                      +{missao.xpRecompensa} XP
                    </span>
                  ) : (
                    <button
                      onClick={() => concluirMissao(missao.id)}
                      disabled={concluindo === missao.id}
                      className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
                    >
                      {concluindo === missao.id ? "..." : `+${missao.xpRecompensa} XP`}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Streak */}
            {progresso && (
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Flame className="w-5 h-5" style={{ color: "#e86c2b" }} />
                  <p className="font-semibold text-sm" style={{ color: "#f7f2ec" }}>Sequência atual</p>
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <p className="font-tan-mon-cheri text-4xl" style={{ color: "#c8a56b" }}>
                    {progresso.streakDias}
                  </p>
                  <p className="text-sm mb-1.5" style={{ color: "rgba(247,242,236,0.45)" }}>dias</p>
                </div>
                <p className="text-xs" style={{ color: "rgba(247,242,236,0.3)" }}>
                  Melhor sequência: {progresso.melhorStreak} dias
                </p>
              </div>
            )}
          </>
        )}

        {/* Conquistas */}
        {tab === "conquistas" && (
          <div className="space-y-3">
            {conquistasComputadas.map((c, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{
                  background: c.desbloqueada ? "rgba(200,165,107,0.08)" : "rgba(255,255,255,0.02)",
                  border: c.desbloqueada ? "1px solid rgba(200,165,107,0.25)" : "1px solid rgba(255,255,255,0.04)",
                  opacity: c.desbloqueada ? 1 : 0.5,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: c.desbloqueada ? "rgba(200,165,107,0.15)" : "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(200,165,107,0.15)",
                  }}
                >
                  <c.icon className="w-6 h-6" style={{ color: c.desbloqueada ? "#c8a56b" : "rgba(200,165,107,0.25)" }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: c.desbloqueada ? "#f7f2ec" : "rgba(247,242,236,0.4)" }}>
                    {c.titulo}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(247,242,236,0.3)" }}>
                    {c.desc}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold" style={{ color: c.desbloqueada ? "#c8a56b" : "rgba(200,165,107,0.3)" }}>
                    +{c.xp} XP
                  </p>
                  {c.desbloqueada ? (
                    <Trophy className="w-4 h-4 mt-1 ml-auto" style={{ color: "#c8a56b" }} />
                  ) : (
                    <Star className="w-4 h-4 mt-1 ml-auto" style={{ color: "rgba(200,165,107,0.2)" }} />
                  )}
                </div>
              </div>
            ))}
            <p className="text-center text-xs pt-2" style={{ color: "rgba(247,242,236,0.2)" }}>
              Complete missões e etapas da jornada para desbloquear
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
