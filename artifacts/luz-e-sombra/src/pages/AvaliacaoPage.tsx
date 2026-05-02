import { Suspense, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { AREAS_DA_VIDA, FormData } from "@/lib/types";
import { ChevronLeft, ChevronRight, User, Calendar, Sparkles, Heart, Star, TrendingUp } from "lucide-react";
import AreaIcon from "@/components/AreaIcon";
import { apiFetch } from "@/lib/auth";

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
            const ultima = avaliacoes[0];
            navigate(`/resultado/${ultima.id}`);
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
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSliderChange = (areaId: string, value: number) => {
    setFormData({ ...formData, [areaId]: value });
  };

  const isStepValid = () => {
    if (currentStep === 0) return formData.nome.trim().length > 0;
    return true;
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
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    }
  };

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto"
              style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.3)" }}>
              <Sparkles className="w-8 h-8 text-brand-bronze" strokeWidth={1.5} />
            </div>
            <h2 className="font-tan-mon-cheri text-3xl md:text-4xl text-brand-dark mb-2">
              Roda da Vida
            </h2>
            <p className="text-brand-medium">Vamos começar sua avaliação</p>
          </div>

          {primeiroAcesso ? (
            <div className="rounded-2xl p-6 mb-2"
              style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.25)" }}>
              <div className="flex items-start gap-3">
                <Star className="w-4 h-4 text-brand-bronze flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-brand-dark font-semibold text-sm mb-1">Primeira avaliação</p>
                  <p className="text-brand-medium text-sm leading-relaxed">
                    Seus dados foram preenchidos automaticamente. Confirme e siga para avaliar cada área da sua vida.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-6 mb-2"
              style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.25)" }}>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-brand-bronze flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-brand-dark font-semibold text-sm mb-1">Nova avaliação</p>
                  <p className="text-brand-medium text-sm leading-relaxed">
                    Esta avaliação será adicionada ao seu histórico e não substitui as anteriores.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl p-6"
            style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.2)" }}>
            <div className="flex items-start gap-3">
              <Heart className="w-4 h-4 text-brand-bronze flex-shrink-0 mt-0.5" />
              <p className="text-brand-medium text-sm leading-relaxed">
                <span className="font-semibold text-brand-dark">Não existe certo ou errado</span> — apenas o que você sente neste momento.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="flex items-center text-xs font-semibold tracking-widest uppercase text-brand-medium mb-2">
                <User className="w-3.5 h-3.5 mr-2 text-brand-bronze" />
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                className="luxury-input"
                placeholder="Digite seu nome completo"
              />
            </div>
            <div>
              <label className="flex items-center text-xs font-semibold tracking-widest uppercase text-brand-medium mb-2">
                <Calendar className="w-3.5 h-3.5 mr-2 text-brand-bronze" />
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={e => setFormData({ ...formData, dataNascimento: e.target.value })}
                className="luxury-input"
              />
            </div>
          </div>
        </div>
      );
    }

    const area = AREAS_DA_VIDA[currentStep - 1];
    const currentValue = formData[area.id as keyof FormData] as number;

    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="text-center mb-8">
          <AreaIcon iconName={area.icon} className="mb-6 mx-auto" />
          <h2 className="font-tan-mon-cheri text-3xl md:text-4xl text-brand-dark mb-2">
            {area.titulo}
          </h2>
          <p className="text-brand-medium">{area.descricao}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs tracking-widest uppercase text-brand-medium">Muito ruim</span>
            <span className="font-tan-mon-cheri text-4xl text-brand-bronze">{currentValue}</span>
            <span className="text-xs tracking-widest uppercase text-brand-medium">Excelente</span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={currentValue}
            onChange={e => handleSliderChange(area.id, parseInt(e.target.value))}
            className="w-full luxury-range"
          />

          <div className="flex justify-between text-xs text-brand-medium/50">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <span key={num}>{num}</span>
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
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-transparent"></div>
          <p className="mt-4 text-brand-medium text-sm">Verificando avaliações anteriores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-shell flex items-center justify-center p-4 py-10">
      <div className="max-w-2xl w-full">

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-medium">
              Etapa {currentStep + 1} de {totalSteps}
            </span>
            <span className="text-xs text-brand-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-brand-gold/15 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-brand-bronze to-brand-gold h-1 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="luxury-card-strong p-8 md:p-12">
          {renderStep()}

          <div className="flex gap-4 mt-10">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ borderColor: "rgba(200,165,107,0.4)", color: "#5f4a2f" }}
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1 luxury-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {currentStep === totalSteps - 1 ? "Ver Resultado" : "Próximo"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AvaliacaoPage() {
  return (
    <Suspense fallback={
      <div className="luxury-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-transparent"></div>
      </div>
    }>
      <AvaliacaoContent />
    </Suspense>
  );
}
