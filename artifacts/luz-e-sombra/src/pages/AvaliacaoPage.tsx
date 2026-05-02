import { Suspense, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { AREAS_DA_VIDA, FormData } from "@/lib/types";
import { ChevronLeft, ChevronRight, User, Calendar, Sparkles, Heart, Home } from "lucide-react";
import AreaIcon from "@/components/AreaIcon";
import { apiFetch } from "@/lib/auth";

function AvaliacaoContent() {
  const [location, navigate] = useLocation();
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-gold/20 to-brand-bronze/20 rounded-2xl border-2 border-brand-gold/40 mb-6 mx-auto">
              <Sparkles className="w-10 h-10 text-brand-bronze" strokeWidth={1.5} />
            </div>
            <h2 className="font-tan-mon-cheri text-3xl md:text-4xl text-brand-dark mb-3">
              Roda da Vida
            </h2>
            <p className="text-brand-medium text-lg">
              Vamos começar sua avaliação
            </p>
          </div>

          {primeiroAcesso ? (
            <div className="text-left bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl p-6 mb-6 border-2 border-purple-300">
              <p className="text-purple-900 leading-relaxed font-semibold mb-2">
                🌟 Bem-vindo(a) à sua primeira avaliação!
              </p>
              <p className="text-purple-800 leading-relaxed">
                Para começar, vamos fazer sua primeira avaliação da Roda da Vida.
                Seus dados já foram preenchidos automaticamente. Confirme-os e siga para avaliar as áreas da sua vida.
              </p>
            </div>
          ) : (
            <div className="text-left bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 mb-6 border-2 border-green-300">
              <p className="text-green-900 leading-relaxed font-semibold mb-2">
                📈 Nova Avaliação para Acompanhar sua Evolução
              </p>
              <p className="text-green-800 leading-relaxed">
                Esta nova avaliação será <strong>adicionada</strong> ao seu histórico (não sobrescreve as anteriores).
              </p>
            </div>
          )}

          <div className="text-left bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 mb-6 border border-brand-gold/30">
            <p className="text-brand-darker leading-relaxed mb-4">
              Este formulário é o primeiro passo do seu processo de transformação.
            </p>
            <p className="text-brand-darker leading-relaxed mb-4 flex items-start gap-2">
              <Heart className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" fill="currentColor" strokeWidth={2} />
              <span><strong className="text-brand-bronze">Não existe certo ou errado</strong> — apenas o que você sente agora.</span>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-brand-dark mb-2">
                <User className="w-4 h-4 mr-2 text-brand-bronze" />
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-3 border-2 border-brand-gold/50 rounded-xl focus:ring-2 focus:ring-brand-bronze focus:border-brand-gold transition-all"
                placeholder="Digite seu nome completo"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-brand-dark mb-2">
                <Calendar className="w-4 h-4 mr-2 text-brand-bronze" />
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={e => setFormData({ ...formData, dataNascimento: e.target.value })}
                className="w-full px-4 py-3 border-2 border-brand-gold/50 rounded-xl focus:ring-2 focus:ring-brand-bronze focus:border-brand-gold transition-all"
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
          <h2 className="font-tan-mon-cheri text-3xl md:text-4xl text-brand-dark mb-3">
            {area.titulo}
          </h2>
          <p className="text-brand-medium text-lg">{area.descricao}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm text-brand-medium">Muito ruim</span>
            <span className="text-3xl font-bold text-brand-bronze">{currentValue}</span>
            <span className="text-sm text-brand-medium">Excelente</span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={currentValue}
            onChange={e => handleSliderChange(area.id, parseInt(e.target.value))}
            className="w-full luxury-range"
          />

          <div className="flex justify-between text-xs text-brand-medium/60">
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-bronze"></div>
          <p className="mt-4 text-brand-medium">Verificando avaliações anteriores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-shell flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-brand-medium hover:text-brand-dark transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Voltar ao Portal</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-brand-medium">
              Etapa {currentStep + 1} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-brand-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-brand-gold/20 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-brand-bronze to-brand-gold h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="luxury-card-strong p-8 md:p-12">
          {renderStep()}

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-gold text-brand-dark font-semibold rounded-xl hover:bg-brand-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-bronze to-brand-gold text-white font-semibold rounded-xl hover:from-brand-dark hover:to-brand-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {currentStep === totalSteps - 1 ? "Ver Resultado" : "Próximo"}
              <ChevronRight className="w-5 h-5" />
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
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-bronze"></div>
          <p className="mt-4 text-brand-medium">Carregando avaliação...</p>
        </div>
      </div>
    }>
      <AvaliacaoContent />
    </Suspense>
  );
}
