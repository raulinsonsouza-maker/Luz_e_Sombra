import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import MobileTopBar from "@/components/MobileTopBar";
import { dataPorExtenso, fraseDoDia } from "@/lib/frasesAno";
import { toast } from "sonner";
import {
  Check,
  ChevronRight,
  Map,
  Users2,
  GraduationCap,
  Sparkles,
  FileText,
} from "lucide-react";

interface ModuloJornada {
  slug: string;
  tituloIntro: string;
  status: "done" | "active" | "locked";
  hubHref: string;
  hrefAnalise: string;
}

interface Progresso {
  luzes: number;
  conviteConcluido: boolean;
  jornada: {
    traco: boolean;
    temperamento?: boolean;
    roda: boolean;
    numerologia: boolean;
    linguagensAmor?: boolean;
    dossie?: boolean;
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
  { label: "Cursos", sub: "Em breve", icon: GraduationCap, href: "/cursos" },
] as const;

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [modulosJornada, setModulosJornada] = useState<ModuloJornada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [concluindoConvite, setConcluindoConvite] = useState(false);
  const hoje = fraseDoDia();

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
      const [resProg, resMod] = await Promise.all([
        apiFetch("/gamificacao/progresso"),
        apiFetch("/modulos-jornada"),
      ]);
      if (resProg.ok) setProgresso(await resProg.json());
      if (resMod.ok) setModulosJornada(await resMod.json());
    } catch {
      /* noop */
    }
    setCarregando(false);
  }

  const primeiroNome = (user?.nome || "").split(" ")[0] || "Usuário";

  async function concluirConvite() {
    if (progresso?.conviteConcluido || concluindoConvite) return;
    setConcluindoConvite(true);
    try {
      const res = await apiFetch("/gamificacao/convite/concluir", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok || typeof data.luzes === "number") {
        setProgresso((atual) =>
          atual
            ? { ...atual, conviteConcluido: true, luzes: data.luzes ?? atual.luzes + 1 }
            : atual,
        );
      } else {
        toast.error("Não foi possível marcar o convite.");
      }
    } catch {
      toast.error("Não foi possível marcar o convite.");
    }
    setConcluindoConvite(false);
  }

  const etapasInicianteConcluidas = progresso
    ? [
        progresso.jornada.traco,
        progresso.jornada.temperamento === true,
        progresso.jornada.linguagensAmor === true,
        progresso.jornada.roda,
        progresso.jornada.numerologia,
        progresso.jornada.dossie === true,
      ].filter(Boolean).length
    : 0;

  const TOTAL_ETAPAS_INICIANTE = 6;

  const moduloAtivo = modulosJornada.find((m) => m.status === "active");

  return (
    <div className="min-h-screen pb-28 journey-forest-bg">
      <MobileTopBar />

      <div className="max-w-lg mx-auto px-4">
        <div className="pt-4 pb-5 md:pt-8">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.55)" }}>
            {dataPorExtenso()}
          </p>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: "rgba(247,242,236,0.45)" }}>
            {saudacao()},
          </p>
          <h1
            className="font-tan-mon-cheri mb-4"
            style={{ fontSize: "clamp(2rem, 6vw, 3rem)", color: "#f7f2ec", lineHeight: 1.08 }}
          >
            {primeiroNome}
          </h1>
          <button
            type="button"
            onClick={() => navigate("/reflexao")}
            className="relative w-full overflow-hidden rounded-3xl text-left"
            style={{ minHeight: 380 }}
          >
            <img src="/images/peao.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "rgba(18,12,8,0.5)" }} />
            <div className="relative flex min-h-[380px] flex-col items-center justify-center gap-5 px-6 py-10 text-center">
              <p className="font-tan-mon-cheri text-xl leading-snug" style={{ color: "#f7f2ec" }}>
                {hoje.frase}
              </p>
              <span
                className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold"
                style={{ background: "rgba(247,242,236,0.92)", color: "#1a1208" }}
              >
                Ver detalhes
              </span>
            </div>
          </button>
        </div>

        {/* Seu próximo passo */}
        {moduloAtivo && (
          <div
            className="rounded-3xl p-5 mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(200,165,107,0.14) 0%, rgba(60,42,28,0.35) 100%)",
              border: "1px solid rgba(200,165,107,0.28)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" style={{ color: "#c8a56b" }} />
              <p className="text-xs font-bold tracking-wider uppercase" style={{ color: "#c8a56b" }}>
                Seu próximo passo
              </p>
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: "#f7f2ec" }}>
              {moduloAtivo.tituloIntro}
            </p>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
              Continue sua jornada por aqui — é o módulo ativo agora.
            </p>
            <button
              type="button"
              onClick={() => navigate(moduloAtivo.hubHref)}
              className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #c8a56b, #9c7742)",
                color: "#1a1208",
              }}
            >
              Ir para o módulo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dossiê integrado — passo 6 da jornada */}
        {etapasInicianteConcluidas >= 4 && progresso?.jornada.dossie !== true && (
          <button
            type="button"
            onClick={() => navigate("/jornada/dossie")}
            className="w-full rounded-3xl p-5 mb-4 text-left transition-all active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, rgba(93,185,122,0.08) 0%, rgba(200,165,107,0.06) 100%)",
              border: "1px solid rgba(93,185,122,0.22)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(93,185,122,0.12)" }}
              >
                <FileText className="w-5 h-5" style={{ color: "#5db97a" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-1" style={{ color: "#f7f2ec" }}>
                  Dossiê de Vida — 6º passo
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                  {etapasInicianteConcluidas >= 5
                    ? "Fase Iniciante quase completa. Abra o dossiê para ver o cruzamento de todas as análises."
                    : `${etapasInicianteConcluidas} análises prontas. Continue a jornada para desbloquear a síntese integrada.`}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 mt-1" style={{ color: "rgba(93,185,122,0.6)" }} />
            </div>
          </button>
        )}

        <div
          className="rounded-3xl p-5 mb-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(200,165,107,0.16)",
          }}
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#5db97a" }}>
            Seu convite de hoje
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.78)" }}>
            {hoje.convite}
          </p>
          <button
            type="button"
            onClick={() => void concluirConvite()}
            disabled={carregando || concluindoConvite || progresso?.conviteConcluido}
            className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{
              background: progresso?.conviteConcluido ? "rgba(93,185,122,0.16)" : "linear-gradient(135deg, #c8a56b, #9c7742)",
              color: progresso?.conviteConcluido ? "#5db97a" : "#1a1208",
            }}
          >
            <Check className="w-4 h-4" />
            {progresso?.conviteConcluido ? "Convite feito · +1 Luz" : "Marcar como feito · +1 Luz"}
          </button>
          <p className="text-xs mt-3 leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
            Luzes: o reconhecimento de cada passo. {progresso?.luzes ?? 0}{" "}
            {(progresso?.luzes ?? 0) === 1 ? "Luz" : "Luzes"} até aqui.
          </p>
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
