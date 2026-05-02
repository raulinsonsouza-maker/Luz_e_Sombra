import { Suspense, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { AREAS_DA_VIDA, FormData } from "@/lib/types";
import {
  ChevronLeft, ChevronRight, Sparkles, TrendingUp,
  User, Calendar, ExternalLink, BookOpen,
} from "lucide-react";
import AreaIcon from "@/components/AreaIcon";
import { apiFetch } from "@/lib/auth";

function formatarDataExibicao(iso: string): string {
  if (!iso) return "";
  const p = iso.split("-");
  if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
  return iso;
}

function AvaliacaoContent() {
  const [, navigate] = useLocation();
  const { user, status, updateUser } = useAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const forcarNovo = urlParams.get("novo") === "true";
  const primeiroAcesso = urlParams.get("primeiro") === "true";

  const [currentStep, setCurrentStep] = useState(0);
  const [carregando, setCarregando] = useState(!forcarNovo);
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
          if (avaliacoes && avaliacoes.length > 0) {
            navigate(`/resultado/${avaliacoes[0].id}`);
            return;
          }
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

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSliderChange = (areaId: string, value: number) => {
    setFormData({ ...formData, [areaId]: value });
  };

  const handleSubmit = async () => {
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
          updateUser({ primeiroAcesso: false });
          await apiFetch("/usuarios/primeiro-acesso/me", { method: "PUT" });
        }
        navigate(`/resultado/${avaliacao.id}${primeiroAcesso ? "?primeiro=true" : ""}`);
      }
    } catch (e) {
      console.error("Erro ao enviar avaliação:", e);
    }
  };

  // ── Score label helper ──────────────────────────────────────────────────
  function scoreLabel(v: number): string {
    if (v <= 2) return "Muito baixo";
    if (v <= 4) return "Baixo";
    if (v <= 6) return "Médio";
    if (v <= 8) return "Bom";
    return "Excelente";
  }

  function scoreColor(v: number): string {
    if (v <= 2) return "#ef4444";
    if (v <= 4) return "#f97316";
    if (v <= 6) return "#eab308";
    if (v <= 8) return "#84cc16";
    return "#c8a56b";
  }

  // ── Step 0 — Welcome ───────────────────────────────────────────────────
  const renderWelcome = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto"
          style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.3)" }}>
          <Sparkles className="w-7 h-7 text-brand-bronze" strokeWidth={1.5} />
        </div>
        <h2 className="font-tan-mon-cheri text-3xl md:text-4xl text-brand-dark mb-2">
          Roda da Vida
        </h2>
        <p className="text-brand-medium text-sm">Uma fotografia honesta do seu momento atual</p>
      </div>

      {/* User identity */}
      <div className="rounded-2xl p-4 md:p-5"
        style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(200,165,107,0.12)", border: "1px solid rgba(200,165,107,0.25)" }}>
              <User className="w-4 h-4 text-brand-bronze" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand-medium mb-0.5">Avaliando</p>
              <p className="font-tan-mon-cheri text-xl text-brand-dark">{user?.nome || "—"}</p>
              {user?.dataNascimento && (
                <p className="flex items-center gap-1.5 text-xs text-brand-medium mt-1">
                  <Calendar className="w-3 h-3" />
                  {formatarDataExibicao(user.dataNascimento)}
                </p>
              )}
            </div>
          </div>
          <a href="/perfil"
            className="flex items-center gap-1 text-xs text-brand-medium/50 hover:text-brand-bronze transition-colors flex-shrink-0 mt-0.5">
            <ExternalLink className="w-3 h-3" />
            Editar
          </a>
        </div>
      </div>

      {/* Context */}
      {primeiroAcesso ? (
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.25)" }}>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-4 h-4 text-brand-bronze flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-brand-dark font-semibold text-sm mb-1">Primeira avaliação</p>
              <p className="text-brand-medium text-sm leading-relaxed">
                Esta é sua linha de base — o ponto de partida da sua jornada de autoconhecimento. Seja completamente honesto: não existe resposta certa.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.25)" }}>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-4 h-4 text-brand-bronze flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-brand-dark font-semibold text-sm mb-1">Nova avaliação</p>
              <p className="text-brand-medium text-sm leading-relaxed">
                Esta avaliação será adicionada ao seu histórico. Você poderá comparar sua evolução ao longo do tempo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* What to expect */}
      <div className="rounded-2xl p-4"
        style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
        <div className="flex items-start gap-3">
          <BookOpen className="w-4 h-4 text-brand-bronze flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-brand-dark font-semibold text-sm mb-2">Como funciona</p>
            <p className="text-brand-medium text-sm leading-relaxed mb-2">
              Você vai avaliar <strong className="text-brand-dark">12 áreas da sua vida</strong> em uma escala de 1 a 10. Para cada área, você receberá perguntas de reflexão para se aprofundar antes de pontuar.
            </p>
            <p className="text-brand-medium text-sm leading-relaxed">
              Não existe certo ou errado — apenas o que você genuinamente sente neste momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Area steps ─────────────────────────────────────────────────────────
  const renderArea = () => {
    const area = AREAS_DA_VIDA[currentStep - 1];
    const currentValue = formData[area.id as keyof FormData] as number;
    const label = scoreLabel(currentValue);
    const color = scoreColor(currentValue);

    return (
      <div className="space-y-5 animate-fadeIn">

        {/* Header */}
        <div className="text-center">
          <AreaIcon iconName={area.icon} className="mb-4 mx-auto" />
          <h2 className="font-tan-mon-cheri text-2xl md:text-3xl text-brand-dark mb-1">
            {area.titulo}
          </h2>
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-bronze">
            {area.subtitulo}
          </p>
        </div>

        {/* Reflection prompts */}
        <div className="rounded-2xl p-4 md:p-5"
          style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.18)" }}>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-bronze mb-3">
            Reflita com honestidade
          </p>
          <ul className="space-y-3">
            {area.reflexoes.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-brand-bronze flex-shrink-0 mt-1 text-xs">—</span>
                <span className="text-sm text-brand-darker leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scale anchors */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 md:p-4"
            style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <p className="text-xs font-semibold tracking-wider uppercase mb-1.5"
              style={{ color: "#ef4444" }}>
              Nota 1 – 3
            </p>
            <p className="text-xs text-brand-medium leading-relaxed">{area.baixo}</p>
          </div>
          <div className="rounded-xl p-3 md:p-4"
            style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.2)" }}>
            <p className="text-xs font-semibold tracking-wider uppercase text-brand-bronze mb-1.5">
              Nota 8 – 10
            </p>
            <p className="text-xs text-brand-medium leading-relaxed">{area.alto}</p>
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-3 pt-1">
          {/* Score display */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs tracking-widest uppercase text-brand-medium/60">Muito baixo</span>
            <div className="text-center">
              <span className="font-tan-mon-cheri text-5xl md:text-6xl transition-all" style={{ color }}>
                {currentValue}
              </span>
              <p className="text-xs font-semibold tracking-widest uppercase mt-0.5" style={{ color }}>
                {label}
              </p>
            </div>
            <span className="text-xs tracking-widest uppercase text-brand-medium/60">Excelente</span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={currentValue}
            onChange={e => handleSliderChange(area.id, parseInt(e.target.value))}
            className="w-full luxury-range"
          />

          {/* Tick marks */}
          <div className="flex justify-between px-0.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <span key={n}
                className="text-xs transition-all"
                style={{ color: n === currentValue ? color : "rgba(95,74,47,0.3)", fontWeight: n === currentValue ? "700" : "400" }}>
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  if (carregando) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-transparent" />
          <p className="mt-4 text-brand-medium text-sm">Verificando avaliações anteriores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-shell flex items-center justify-center p-4 py-8 md:py-12">
      <div className="max-w-lg w-full">

        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-medium">
              {currentStep === 0 ? "Início" : `Área ${currentStep} de ${AREAS_DA_VIDA.length}`}
            </span>
            <span className="text-xs text-brand-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-brand-gold/15 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-brand-bronze to-brand-gold h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {currentStep > 0 && (
            <p className="text-xs text-brand-medium/60 mt-1.5 text-center">
              {AREAS_DA_VIDA[currentStep - 1].titulo}
            </p>
          )}
        </div>

        {/* Card */}
        <div className="luxury-card-strong p-6 md:p-8">
          {currentStep === 0 ? renderWelcome() : renderArea()}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ borderColor: "rgba(200,165,107,0.4)", color: "#5f4a2f", minWidth: "80px" }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            <button
              onClick={handleNext}
              className="flex-1 luxury-btn-primary"
            >
              {currentStep === totalSteps - 1 ? "Ver Resultado" : currentStep === 0 ? "Começar Avaliação" : "Próxima Área"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Area dots (mobile-friendly mini progress) */}
        {currentStep > 0 && (
          <div className="flex justify-center gap-1.5 mt-4 flex-wrap px-2">
            {AREAS_DA_VIDA.map((_, i) => (
              <div key={i}
                className="rounded-full transition-all"
                style={{
                  width: i + 1 === currentStep ? "20px" : "6px",
                  height: "6px",
                  background: i + 1 < currentStep
                    ? "rgba(200,165,107,0.8)"
                    : i + 1 === currentStep
                      ? "linear-gradient(90deg, #9c7742, #c8a56b)"
                      : "rgba(200,165,107,0.2)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AvaliacaoPage() {
  return (
    <Suspense fallback={
      <div className="luxury-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-transparent" />
      </div>
    }>
      <AvaliacaoContent />
    </Suspense>
  );
}
