import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import {
  Bell, ChevronRight, Flame, Zap, Map, Target, Layers, Hash,
  CheckCircle2, Circle, TrendingUp,
} from "lucide-react";

interface Avaliacao {
  id: number;
  dataAvaliacao: string;
  plenitudeFelicidade: number;
  espiritualidade: number;
  saudeDisposicao: number;
  desenvolvimentoIntelectual: number;
  equilibrioEmocional: number;
  familia: number;
  desenvolvimentoAmoroso: number;
  vidaSocial: number;
  realizacaoProposito: number;
  recursosFinanceiros: number;
  contribuicaoSocial: number;
  criatividadeHobbyDiversao: number;
}

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
  jornada: { traco: boolean; roda: boolean; numerologia: boolean };
}

const AREAS = [
  { key: "plenitudeFelicidade",       nome: "Plenitude"      },
  { key: "espiritualidade",           nome: "Espiritualidade"},
  { key: "saudeDisposicao",           nome: "Saúde"          },
  { key: "desenvolvimentoIntelectual", nome: "Intelecto"     },
  { key: "equilibrioEmocional",       nome: "Emoções"        },
  { key: "familia",                   nome: "Família"        },
  { key: "desenvolvimentoAmoroso",    nome: "Amor"           },
  { key: "vidaSocial",                nome: "Social"         },
  { key: "realizacaoProposito",       nome: "Propósito"      },
  { key: "recursosFinanceiros",       nome: "Finanças"       },
  { key: "contribuicaoSocial",        nome: "Contribuição"   },
  { key: "criatividadeHobbyDiversao", nome: "Criatividade"   },
];

function calcularMedia(a: Avaliacao): number {
  return AREAS.reduce((sum, { key }) => sum + (a[key as keyof Avaliacao] as number), 0) / AREAS.length;
}

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function ScoreGauge({ score, cor }: { score: number; cor: string }) {
  const size = 96;
  const r = 38;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, score / 10);
  const dashOffset = circ * (1 - pct);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(200,165,107,0.1)" strokeWidth={7} />
        <circle
          cx={cx} cy={cy} r={r} fill="none" stroke={cor} strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 8px ${cor}66)` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {score > 0 ? (
          <>
            <span className="font-tan-mon-cheri" style={{ fontSize: 22, color: "#f7f2ec", lineHeight: 1 }}>
              {score.toFixed(1)}
            </span>
            <span style={{ fontSize: 9, color: "rgba(247,242,236,0.35)", marginTop: 3, letterSpacing: "0.08em" }}>
              média
            </span>
          </>
        ) : (
          <span style={{ fontSize: 16, color: "rgba(200,165,107,0.4)" }}>—</span>
        )}
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: "Jornada",       sub: "Ver progresso",   icon: Map,    href: "/jornada",          gold: false },
  { label: "Roda da Vida",  sub: "Nova avaliação",  icon: Target, href: "/avaliacao",         gold: true  },
  { label: "Traço",         sub: "Meu caráter",     icon: Layers, href: "/traco-de-carater",  gold: false },
  { label: "Numerologia",   sub: "Meus números",    icon: Hash,   href: "/numerologia",       gold: false },
];

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [ultimaAvaliacao, setUltimaAvaliacao] = useState<Avaliacao | null>(null);
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { navigate("/login"); return; }
    if (status === "loading") return;
    if (user?.primeiroAcesso) { navigate("/avaliacao?primeiro=true"); return; }
    buscarDados();
  }, [status, user]);

  async function buscarDados() {
    try {
      const [resAv, resProg] = await Promise.all([
        apiFetch("/avaliacoes"),
        apiFetch("/gamificacao/progresso"),
      ]);
      if (resAv.ok) {
        const lista: Avaliacao[] = await resAv.json();
        if (lista.length > 0) {
          const sorted = [...lista].sort(
            (a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
          );
          setUltimaAvaliacao(sorted[0]);
        }
      }
      if (resProg.ok) setProgresso(await resProg.json());
    } catch {}
    setCarregando(false);
  }

  const primeiroNome = (user?.nome || "").split(" ")[0] || "Usuário";
  const media = ultimaAvaliacao ? calcularMedia(ultimaAvaliacao) : null;

  const mediaCor = media === null ? "#c8a56b"
    : media >= 8.5 ? "#c8a56b"
    : media >= 7   ? "#5db97a"
    : media >= 5.5 ? "#5b9bd5"
    : "#c06fbf";

  const areasSorted = ultimaAvaliacao
    ? AREAS.map(a => ({ ...a, valor: ultimaAvaliacao[a.key as keyof Avaliacao] as number }))
        .sort((a, b) => a.valor - b.valor)
    : [];
  const focoPrincipal = areasSorted[0] ?? null;

  const xpPct = progresso
    ? Math.min(100, Math.round((progresso.xpNoNivel / progresso.xpParaProximo) * 100))
    : 0;

  const missoesPreview = progresso?.missoes.slice(0, 3) ?? [];
  const concluidasHoje = progresso?.missoes.filter(m => m.concluida).length ?? 0;
  const totalHoje = progresso?.missoes.length ?? 0;

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <div className="max-w-lg mx-auto px-4">

        {/* ── MOBILE TOP BAR ─────────────────────────────── */}
        <div className="flex items-center justify-between pt-5 pb-2 md:hidden">
          <span className="font-tan-mon-cheri text-base tracking-wide" style={{ color: "#f7f2ec" }}>
            Da Sombra à Luz
          </span>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.15)" }}
          >
            <Bell className="w-4 h-4" style={{ color: "rgba(200,165,107,0.6)" }} />
          </button>
        </div>

        {/* ── GREETING ───────────────────────────────────── */}
        <div className="pt-4 pb-5 md:pt-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>
            {saudacao()},
          </p>
          <h1 className="font-tan-mon-cheri mb-1" style={{ fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "#f7f2ec", lineHeight: 1.1 }}>
            {primeiroNome}
          </h1>
          <p className="text-sm" style={{ color: "rgba(247,242,236,0.4)" }}>
            {progresso?.descNivel ?? "Sua jornada de autoconhecimento começa aqui."}
          </p>
        </div>

        {/* ── SCORE + LEVEL CARD ─────────────────────────── */}
        <div
          className="rounded-3xl p-5 mb-4"
          style={{
            background: "linear-gradient(135deg, rgba(200,165,107,0.1) 0%, rgba(200,165,107,0.04) 100%)",
            border: "1px solid rgba(200,165,107,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(200,165,107,0.1)",
          }}
        >
          <div className="flex items-center gap-4">
            {/* Gauge */}
            <ScoreGauge score={media ?? 0} cor={mediaCor} />

            {/* Level + XP */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #c8a56b, #9c7742)",
                    boxShadow: "0 0 16px rgba(200,165,107,0.3)",
                  }}
                >
                  <span className="font-tan-mon-cheri text-sm" style={{ color: "#1a1208" }}>
                    {progresso?.nivel ?? 1}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
                    Nível {progresso?.nivel ?? 1}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#f7f2ec" }}>
                    {progresso?.nomeNivel ?? "Iniciante"}
                  </p>
                </div>
              </div>

              {/* XP Bar */}
              <div>
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
              </div>

              {/* Streak */}
              {progresso && progresso.streakDias > 0 && (
                <div className="flex items-center gap-1 mt-2.5">
                  <Flame className="w-3.5 h-3.5" style={{ color: "#e86c2b" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "rgba(247,242,236,0.5)" }}>
                    {progresso.streakDias} {progresso.streakDias === 1 ? "dia seguido" : "dias seguidos"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── CURRENT FOCUS ──────────────────────────────── */}
        {focoPrincipal && (
          <div
            className="rounded-2xl p-4 mb-4 flex items-center gap-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(200,165,107,0.1)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(200,165,107,0.1)" }}
            >
              <TrendingUp className="w-4 h-4" style={{ color: "#c8a56b" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold tracking-wider uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.5)" }}>
                Foco do momento
              </p>
              <p className="text-sm font-semibold" style={{ color: "#f7f2ec" }}>{focoPrincipal.nome}</p>
              <p className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
                {focoPrincipal.valor}/10 · Área que mais precisa de atenção
              </p>
            </div>
            <button
              onClick={() => navigate("/historico")}
              className="flex-shrink-0"
              style={{ color: "rgba(200,165,107,0.4)" }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {!ultimaAvaliacao && !carregando && (
          <div
            className="rounded-2xl p-4 mb-4 flex items-center gap-3"
            style={{
              background: "rgba(200,165,107,0.07)",
              border: "1px dashed rgba(200,165,107,0.25)",
            }}
          >
            <Target className="w-5 h-5 flex-shrink-0" style={{ color: "#c8a56b" }} />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#f7f2ec" }}>Inicie sua Roda da Vida</p>
              <p className="text-xs" style={{ color: "rgba(247,242,236,0.4)" }}>Mapeie as 12 dimensões da sua vida</p>
            </div>
            <button
              onClick={() => navigate("/avaliacao")}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            >
              Iniciar
            </button>
          </div>
        )}

        {/* ── MISSIONS PREVIEW ───────────────────────────── */}
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
              ? [0, 1, 2].map(i => (
                  <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: "rgba(200,165,107,0.05)" }} />
                ))
              : missoesPreview.map(missao => (
                  <div
                    key={missao.id}
                    className="rounded-2xl px-4 py-3 flex items-center gap-3"
                    style={{
                      background: missao.concluida ? "rgba(93,185,122,0.06)" : "rgba(255,255,255,0.03)",
                      border: missao.concluida ? "1px solid rgba(93,185,122,0.15)" : "1px solid rgba(200,165,107,0.08)",
                    }}
                  >
                    {missao.concluida ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#5db97a" }} />
                    ) : (
                      <Circle className="w-5 h-5 flex-shrink-0" style={{ color: "rgba(200,165,107,0.25)" }} />
                    )}
                    <p
                      className="flex-1 text-sm"
                      style={{
                        color: missao.concluida ? "rgba(247,242,236,0.35)" : "rgba(247,242,236,0.75)",
                        textDecoration: missao.concluida ? "line-through" : "none",
                      }}
                    >
                      {missao.titulo}
                    </p>
                    <span
                      className="text-[11px] font-bold flex-shrink-0"
                      style={{ color: missao.concluida ? "rgba(93,185,122,0.5)" : "rgba(200,165,107,0.6)" }}
                    >
                      +{missao.xpRecompensa} XP
                    </span>
                  </div>
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

        {/* ── QUICK ACTIONS ──────────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "rgba(200,165,107,0.5)" }}>
            Explorar
          </p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ label, sub, icon: Icon, href, gold }) => (
              <button
                key={href}
                onClick={() => navigate(href)}
                className="rounded-2xl p-4 text-left transition-all active:scale-95"
                style={{
                  background: gold
                    ? "linear-gradient(135deg, rgba(200,165,107,0.18) 0%, rgba(156,119,66,0.1) 100%)"
                    : "rgba(255,255,255,0.03)",
                  border: gold ? "1px solid rgba(200,165,107,0.35)" : "1px solid rgba(200,165,107,0.1)",
                  boxShadow: gold ? "0 4px 16px rgba(200,165,107,0.08)" : "none",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: gold ? "rgba(200,165,107,0.2)" : "rgba(200,165,107,0.08)",
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#c8a56b" }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: "#f7f2ec" }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(247,242,236,0.35)" }}>{sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── JOURNEY PROGRESS SUMMARY ────────────────────── */}
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
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(200,165,107,0.08)" }}
            >
              <Map className="w-5 h-5" style={{ color: "#c8a56b" }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold" style={{ color: "#f7f2ec" }}>Sua Jornada</p>
              <p className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
                {[progresso.jornada.traco, progresso.jornada.roda, progresso.jornada.numerologia].filter(Boolean).length} de 3 etapas concluídas
              </p>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(200,165,107,0.35)" }} />
          </button>
        )}

      </div>
    </div>
  );
}
