import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { TrendingUp, TrendingDown, Minus, Target, Loader2, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { apiFetch } from "@/lib/auth";

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

const AREAS = [
  { key: "plenitudeFelicidade", nome: "Plenitude e Felicidade" },
  { key: "espiritualidade", nome: "Espiritualidade" },
  { key: "saudeDisposicao", nome: "Saúde e Disposição" },
  { key: "desenvolvimentoIntelectual", nome: "Desenvolvimento Intelectual" },
  { key: "equilibrioEmocional", nome: "Equilíbrio Emocional" },
  { key: "familia", nome: "Família" },
  { key: "desenvolvimentoAmoroso", nome: "Desenvolvimento Amoroso" },
  { key: "vidaSocial", nome: "Vida Social" },
  { key: "realizacaoProposito", nome: "Realização e Propósito" },
  { key: "recursosFinanceiros", nome: "Recursos Financeiros" },
  { key: "contribuicaoSocial", nome: "Contribuição Social" },
  { key: "criatividadeHobbyDiversao", nome: "Criatividade, Hobby e Diversão" },
];

export default function HistoricoPage() {
  const [, navigate] = useLocation();
  const { status } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
    else if (status === "authenticated") buscarAvaliacoes();
  }, [status]);

  async function buscarAvaliacoes() {
    try {
      const res = await apiFetch("/avaliacoes");
      if (res.ok) setAvaliacoes(await res.json());
    } catch {}
    setCarregando(false);
  }

  function calcularMedia(a: Avaliacao): number {
    const vals = AREAS.map(area => a[area.key as keyof Avaliacao] as number);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  function renderTendencia(diferenca: number) {
    if (diferenca > 0.5) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (diferenca < -0.5) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-brand-medium opacity-40" />;
  }

  if (status === "loading" || carregando) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-bronze animate-spin" />
      </div>
    );
  }

  const avaliacoesOrdenadas = [...avaliacoes].sort(
    (a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
  );
  const mais = avaliacoesOrdenadas[0];
  const anterior = avaliacoesOrdenadas[1];

  return (
    <div className="luxury-shell py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-2">Evolução</p>
          <h1 className="font-tan-mon-cheri text-4xl md:text-5xl text-brand-dark">
            Histórico de Avaliações
          </h1>
          {avaliacoes.length > 0 && (
            <p className="text-brand-medium mt-2">
              {avaliacoes.length} avaliação{avaliacoes.length !== 1 ? "ões" : ""} realizada{avaliacoes.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {avaliacoes.length === 0 ? (
          <div className="luxury-card-strong p-12 text-center">
            <Target className="w-12 h-12 text-brand-medium mx-auto mb-4 opacity-30" />
            <h2 className="font-tan-mon-cheri text-2xl text-brand-dark mb-2">Nenhuma avaliação ainda</h2>
            <p className="text-brand-medium text-sm mb-6 max-w-sm mx-auto">
              Faça sua primeira avaliação da Roda da Vida para começar a acompanhar sua evolução.
            </p>
            <button onClick={() => navigate("/avaliacao")} className="luxury-btn-primary">
              Fazer Avaliação
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Comparison */}
            {anterior && (
              <div className="luxury-card-strong p-8">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-6">
                  Comparação de Evolução
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="p-6 rounded-2xl"
                    style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.3)" }}>
                    <p className="text-xs tracking-widest uppercase text-brand-medium mb-1">Mais Recente</p>
                    <p className="text-xs text-brand-medium mb-4">
                      {new Date(mais.dataAvaliacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                    <div className="flex items-end gap-3">
                      <span className="font-tan-mon-cheri text-6xl text-brand-bronze leading-none">{calcularMedia(mais).toFixed(1)}</span>
                      <span className="text-brand-medium mb-2">/10</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl"
                    style={{ background: "rgba(200,165,107,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}>
                    <p className="text-xs tracking-widest uppercase text-brand-medium mb-1">Anterior</p>
                    <p className="text-xs text-brand-medium mb-4">
                      {new Date(anterior.dataAvaliacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                    <div className="flex items-end gap-3">
                      <span className="font-tan-mon-cheri text-6xl text-brand-dark opacity-40 leading-none">{calcularMedia(anterior).toFixed(1)}</span>
                      <span className="text-brand-medium mb-2 opacity-40">/10</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-medium mb-4">Evolução por Área</p>
                <div className="space-y-2">
                  {AREAS.map(area => {
                    const atual = mais[area.key as keyof Avaliacao] as number;
                    const ant = anterior[area.key as keyof Avaliacao] as number;
                    const dif = atual - ant;
                    return (
                      <div key={area.key} className="flex items-center justify-between p-3 rounded-xl gap-2"
                        style={{ background: "rgba(200,165,107,0.03)" }}>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="flex-shrink-0">{renderTendencia(dif)}</span>
                          <span className="text-sm text-brand-dark truncate">{area.nome}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-brand-medium whitespace-nowrap">{ant}→{atual}</span>
                          <span className={`text-sm font-semibold min-w-[40px] text-right flex items-center justify-end gap-0.5 ${dif > 0 ? "text-green-600" : dif < 0 ? "text-red-500" : "text-brand-medium opacity-40"}`}>
                            {dif > 0 ? <ArrowUp className="w-3 h-3" /> : dif < 0 ? <ArrowDown className="w-3 h-3" /> : null}
                            {dif !== 0 ? (dif > 0 ? "+" : "") + dif.toFixed(1) : "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Full history */}
            <div className="luxury-card-strong p-8">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-6">
                Histórico Completo
              </p>
              <div className="space-y-3">
                {avaliacoesOrdenadas.map((avaliacao, index) => (
                  <button
                    key={avaliacao.id}
                    className="w-full flex items-center justify-between p-5 rounded-xl text-left group transition-all hover:shadow-md"
                    style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}
                    onClick={() => navigate(`/resultado/${avaliacao.id}`)}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(200,165,107,0.4)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(200,165,107,0.15)")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-14 h-14 rounded-xl flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #9c7742, #c8a56b)" }}>
                        <span className="font-tan-mon-cheri text-xl text-white">{calcularMedia(avaliacao).toFixed(1)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-brand-dark text-sm">
                          Avaliação #{avaliacoes.length - index}
                        </p>
                        <p className="text-xs text-brand-medium mt-0.5">
                          {new Date(avaliacao.dataAvaliacao).toLocaleDateString("pt-BR", {
                            day: "2-digit", month: "long", year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-medium group-hover:text-brand-bronze group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
