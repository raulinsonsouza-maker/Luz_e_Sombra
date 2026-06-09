import { Suspense, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { AREAS_DA_VIDA, FormData } from "@/lib/types";
import { ChevronLeft, ChevronRight, Target, User, Calendar, ExternalLink } from "lucide-react";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import { JORNADA_MODULE_NAV } from "@/lib/jornadaHubConfig";
import { apiFetch } from "@/lib/auth";

// Icon map inline (avoids AreaIcon which uses brand-* classes)
import {
  Smile, Sparkles, Activity, Brain, Scale,
  Home, Heart, Users, Coins, Hand, Palette, LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Smile, Sparkles, Activity, Brain, Scale,
  Home, Heart, Users, Target, Coins, Hand, Palette,
};

function AreaIconDark({ iconName }: { iconName: string }) {
  const Icon = ICON_MAP[iconName] || Smile;
  return (
    <div
      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(200,165,107,0.15) 0%, rgba(156,119,66,0.08) 100%)",
        border: "1px solid rgba(200,165,107,0.3)",
      }}
    >
      <Icon size={30} strokeWidth={1.4} style={{ color: "#c8a56b" }} />
    </div>
  );
}

function formatarDataExibicao(iso: string): string {
  if (!iso) return "";
  const p = iso.split("-");
  if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
  return iso;
}

function scoreLabel(v: number): string {
  if (v <= 2) return "Precisa de atenção";
  if (v <= 4) return "Em desenvolvimento";
  if (v <= 6) return "Em equilíbrio";
  if (v <= 8) return "Florescendo";
  return "Pleno";
}

function scoreColor(v: number): string {
  if (v <= 2) return "#ef4444";
  if (v <= 4) return "#f97316";
  if (v <= 6) return "#eab308";
  if (v <= 8) return "#84cc16";
  return "#c8a56b";
}

function AvaliacaoContent() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const forcarNovo = urlParams.get("novo") === "true";
  const primeiroAcesso = urlParams.get("primeiro") === "true";

  const [currentStep, setCurrentStep] = useState(0);
  const [carregando, setCarregando] = useState(!forcarNovo);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    dataNascimento: "",
    plenitudeFelicidade: 5,
    espiritualidade: 5,
    saudeDisposicao: 5,
    desenvolvimentoIntelectual: 5,
    equilibrioEmocional: 5,
    familia: 5,
    desenvolvimentoAmoroso: 5,
    vidaSocial: 5,
    realizacaoProposito: 5,
    recursosFinanceiros: 5,
    contribuicaoSocial: 5,
    criatividadeHobbyDiversao: 5,
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || prev.nome,
        dataNascimento: user.dataNascimento || prev.dataNascimento,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (forcarNovo) { setCarregando(false); return; }
    async function verificar() {
      try {
        const res = await apiFetch("/avaliacoes");
        if (res.ok) {
          const avaliacoes = await res.json();
          if (avaliacoes?.length > 0) { navigate(`/resultado/${avaliacoes[0].id}`); return; }
        }
      } catch {}
      setCarregando(false);
    }
    verificar();
  }, [forcarNovo]);

  const totalSteps = AREAS_DA_VIDA.length + 1;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
    else handleSubmit();
  };
  const handleBack = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await apiFetch("/avaliacoes", {
        method: "POST",
        body: JSON.stringify({
          plenitudeFelicidade: formData.plenitudeFelicidade,
          espiritualidade: formData.espiritualidade,
          saudeDisposicao: formData.saudeDisposicao,
          desenvolvimentoIntelectual: formData.desenvolvimentoIntelectual,
          equilibrioEmocional: formData.equilibrioEmocional,
          familia: formData.familia,
          desenvolvimentoAmoroso: formData.desenvolvimentoAmoroso,
          vidaSocial: formData.vidaSocial,
          realizacaoProposito: formData.realizacaoProposito,
          recursosFinanceiros: formData.recursosFinanceiros,
          contribuicaoSocial: formData.contribuicaoSocial,
          criatividadeHobbyDiversao: formData.criatividadeHobbyDiversao,
        }),
      });
      if (res.ok) {
        const avaliacao = await res.json();
        if (user?.primeiroAcesso) {
          await apiFetch("/usuarios/primeiro-acesso/me", { method: "PUT" });
        }
        navigate(`/resultado/${avaliacao.id}${primeiroAcesso ? "?primeiro=true" : ""}`);
      }
    } catch (e) {
      console.error("Erro ao enviar avaliação:", e);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (carregando) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
      >
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-t-transparent mb-4"
            style={{ borderColor: "rgba(200,165,107,0.3)", borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "rgba(247,242,236,0.4)" }}>
            Verificando avaliações anteriores...
          </p>
        </div>
      </div>
    );
  }

  const progress = currentStep / totalSteps * 100;
  const area = currentStep > 0 ? AREAS_DA_VIDA[currentStep - 1] : null;
  const currentValue = area ? (formData[area.id as keyof FormData] as number) : 5;
  const color = scoreColor(currentValue);
  const label = scoreLabel(currentValue);

  // ── Welcome step ──────────────────────────────────────────────────────────
  const renderWelcome = () => (
    <div className="space-y-5">
      {/* Hero (título em mobile via MobileTopBar) */}
      <div className="text-center pt-2 pb-4">
        <div
          className="hidden md:inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 mx-auto"
          style={{
            background: "linear-gradient(135deg, rgba(200,165,107,0.15) 0%, rgba(156,119,66,0.08) 100%)",
            border: "1px solid rgba(200,165,107,0.3)",
          }}
        >
          <Target className="w-8 h-8" style={{ color: "#c8a56b" }} strokeWidth={1.4} />
        </div>

        <div className="hidden md:flex items-center justify-center gap-3 mb-3">
          <div className="w-6 h-px" style={{ background: "rgba(200,165,107,0.4)" }} />
          <span className="text-xs tracking-[0.25em] uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
            Autoconhecimento
          </span>
          <div className="w-6 h-px" style={{ background: "rgba(200,165,107,0.4)" }} />
        </div>

        <h1
          className="hidden md:block font-tan-mon-cheri text-3xl md:text-4xl mb-3"
          style={{ color: "#f7f2ec", lineHeight: 1.25 }}
        >
          Roda da Vida
        </h1>
        <p className="text-sm leading-relaxed mt-2 md:mt-0" style={{ color: "rgba(247,242,236,0.5)", maxWidth: 340, margin: "0 auto" }}>
          Uma fotografia honesta do seu momento atual em 12 dimensões da vida
        </p>
      </div>

      {/* User identity */}
      <div
        className="rounded-2xl p-4 flex items-center justify-between gap-3"
        style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.15)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.2)" }}
          >
            <User className="w-4 h-4" style={{ color: "#c8a56b" }} />
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.5)" }}>
              Avaliando
            </p>
            <p className="font-tan-mon-cheri text-lg" style={{ color: "#f7f2ec" }}>
              {user?.nome || "—"}
            </p>
            {user?.dataNascimento && (
              <p className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "rgba(247,242,236,0.35)" }}>
                <Calendar className="w-3 h-3" />
                {formatarDataExibicao(user.dataNascimento)}
              </p>
            )}
          </div>
        </div>
        <a
          href="/perfil"
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: "rgba(200,165,107,0.4)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#c8a56b")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,165,107,0.4)")}
        >
          <ExternalLink className="w-3 h-3" />
          Editar
        </a>
      </div>

      {/* Context card */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(30,24,18,0.6)", border: "1px solid rgba(200,165,107,0.12)" }}
      >
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
          {primeiroAcesso ? "Primeira avaliação" : "Nova avaliação"}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
          {primeiroAcesso
            ? "Esta é sua linha de base — o ponto de partida da sua jornada. Seja completamente honesto: não existe resposta certa."
            : "Esta avaliação será adicionada ao seu histórico. Você poderá comparar sua evolução ao longo do tempo."}
        </p>
      </div>

      {/* How it works */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{ background: "rgba(30,24,18,0.4)", border: "1px solid rgba(200,165,107,0.08)" }}
      >
        <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>
          Como funciona
        </p>
        <div className="space-y-2.5">
          {[
            { n: "1", t: "12 áreas da vida", d: "Plenitude, Saúde, Emoções, Finanças, Família e mais" },
            { n: "2", t: "Escala de 1 a 10", d: "Para cada área, questões de reflexão te guiam à nota mais honesta" },
            { n: "3", t: "Radar da sua vida", d: "Ao final, você recebe um mapa visual de onde está e para onde crescer" },
          ].map(item => (
            <div key={item.n} className="flex gap-3 items-start">
              <div
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "rgba(200,165,107,0.15)", color: "#c8a56b" }}
              >
                {item.n}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "rgba(247,242,236,0.8)" }}>{item.t}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.4)" }}>{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Area step ──────────────────────────────────────────────────────────────
  const renderArea = () => {
    if (!area) return null;
    return (
      <div className="space-y-5">
        {/* Area header */}
        <div className="flex items-center gap-4">
          <AreaIconDark iconName={area.icon} />
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
              {area.subtitulo}
            </p>
            <h2
              className="font-tan-mon-cheri text-2xl md:text-3xl"
              style={{ color: "#f7f2ec", lineHeight: 1.2 }}
            >
              {area.titulo}
            </h2>
          </div>
        </div>

        {/* Reflection prompts */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.12)" }}
        >
          <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.5)" }}>
            Reflita com honestidade
          </p>
          <ul className="space-y-3">
            {area.reflexoes.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 mt-1" style={{ color: "rgba(200,165,107,0.5)", fontSize: 10 }}>◆</span>
                <span className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)" }}>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scale anchors */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            <p className="text-xs font-semibold tracking-wider uppercase mb-1.5" style={{ color: "rgba(239,68,68,0.7)" }}>
              Nota 1 – 3
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>{area.baixo}</p>
          </div>
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.18)" }}
          >
            <p className="text-xs font-semibold tracking-wider uppercase mb-1.5" style={{ color: "rgba(200,165,107,0.7)" }}>
              Nota 8 – 10
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>{area.alto}</p>
          </div>
        </div>

        {/* Score display */}
        <div className="text-center py-2">
          <div
            className="font-tan-mon-cheri text-7xl md:text-8xl transition-all duration-200"
            style={{ color, lineHeight: 1 }}
          >
            {currentValue}
          </div>
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mt-2 transition-all duration-200"
            style={{ color }}
          >
            {label}
          </p>
        </div>

        {/* Number picker — 10 clickable buttons */}
        <div>
          <div className="grid grid-cols-10 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
              const isSelected = n === currentValue;
              const isFilled = n <= currentValue;
              const btnColor = scoreColor(n);
              return (
                <button
                  key={n}
                  onClick={() => setFormData({ ...formData, [area.id]: n })}
                  className="rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-150"
                  style={{
                    height: 44,
                    background: isSelected
                      ? btnColor
                      : isFilled
                        ? `${btnColor}22`
                        : "rgba(255,255,255,0.04)",
                    border: isSelected
                      ? `2px solid ${btnColor}`
                      : isFilled
                        ? `1px solid ${btnColor}55`
                        : "1px solid rgba(255,255,255,0.08)",
                    color: isSelected
                      ? "#1e1812"
                      : isFilled
                        ? btnColor
                        : "rgba(247,242,236,0.3)",
                    transform: isSelected ? "scale(1.08)" : "scale(1)",
                    boxShadow: isSelected ? `0 2px 12px ${btnColor}55` : "none",
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-1.5 px-0.5">
            <span className="text-xs" style={{ color: "rgba(247,242,236,0.2)" }}>Muito baixo</span>
            <span className="text-xs" style={{ color: "rgba(247,242,236,0.2)" }}>Excelente</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <MobileTopBar titulo="Roda da Vida" subtitulo="12 dimensões da vida" />
      <div className="max-w-lg mx-auto px-4 pt-6">
        <NavBackButton
          to={JORNADA_MODULE_NAV.roda.hub}
          label={JORNADA_MODULE_NAV.roda.backLabel}
        />

        {/* ── Progress bar ── */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>
              {currentStep === 0 ? "Início" : `Área ${currentStep} de ${AREAS_DA_VIDA.length}`}
            </span>
            <span className="text-xs font-medium" style={{ color: "rgba(200,165,107,0.5)" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="w-full rounded-full h-1"
            style={{ background: "rgba(200,165,107,0.1)" }}
          >
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(to right, #9c7742, #c8a56b)",
              }}
            />
          </div>
        </div>

        {/* ── Card ── */}
        <div
          className="rounded-3xl p-6 md:p-8 mb-5"
          style={{
            background: "rgba(30,24,18,0.7)",
            border: "1px solid rgba(200,165,107,0.12)",
            backdropFilter: "blur(20px)",
          }}
        >
          {currentStep === 0 ? renderWelcome() : renderArea()}

          {/* ── Navigation ── */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl text-sm font-medium transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              style={{ border: "1px solid rgba(200,165,107,0.25)", color: "rgba(247,242,236,0.55)", minWidth: 52 }}
              onMouseEnter={e => {
                if (currentStep > 0) {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.45)";
                  (e.currentTarget as HTMLElement).style.color = "#c8a56b";
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.25)";
                (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.55)";
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            <button
              onClick={handleNext}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #c8a56b 0%, #9c7742 100%)",
                color: "#1e1812",
                boxShadow: "0 4px 20px rgba(200,165,107,0.25)",
              }}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-[#1e1812] animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  {currentStep === 0 ? "Começar Avaliação" : currentStep === totalSteps - 1 ? "Ver Resultado" : "Próxima Área"}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Area dots ── */}
        {currentStep > 0 && (
          <div className="flex justify-center gap-1.5 flex-wrap px-2 pb-4">
            {AREAS_DA_VIDA.map((_, i) => {
              const done = i + 1 < currentStep;
              const active = i + 1 === currentStep;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i + 1)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: active ? 24 : 7,
                    height: 7,
                    background: done
                      ? "rgba(200,165,107,0.7)"
                      : active
                        ? "linear-gradient(90deg, #9c7742, #c8a56b)"
                        : "rgba(200,165,107,0.15)",
                  }}
                />
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default function AvaliacaoPage() {
  return (
    <Suspense fallback={
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
      >
        <div
          className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent"
          style={{ borderColor: "rgba(200,165,107,0.3)", borderTopColor: "transparent" }}
        />
      </div>
    }>
      <AvaliacaoContent />
    </Suspense>
  );
}
