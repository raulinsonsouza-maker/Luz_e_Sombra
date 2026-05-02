import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, Target, Loader2 } from "lucide-react";
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

  function renderIconeTendencia(diferenca: number) {
    if (diferenca > 0.5) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (diferenca < -0.5) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  }

  if (status === "loading" || carregando) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-bronze animate-spin" />
      </div>
    );
  }

  const avaliacoesOrdenadas = [...avaliacoes].sort(
    (a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
  );
  const mais = avaliacoesOrdenadas[0];
  const anterior = avaliacoesOrdenadas[1];

  return (
    <div className="luxury-shell py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-brand-dark hover:text-brand-bronze transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Início
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-bronze to-brand-gold rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-tan-mon-cheri text-4xl text-brand-dark">Histórico de Avaliações</h1>
              <p className="text-brand-medium">
                {avaliacoes.length} avaliação{avaliacoes.length !== 1 ? "ões" : ""} realizada{avaliacoes.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {avaliacoes.length === 0 ? (
          <div className="luxury-card-strong p-12 text-center">
            <Target className="w-16 h-16 text-brand-medium mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-brand-dark mb-2">Nenhuma avaliação ainda</h2>
            <p className="text-brand-medium mb-6">Faça sua primeira avaliação da Roda da Vida para começar a acompanhar sua evolução.</p>
            <button onClick={() => navigate("/avaliacao")} className="px-8 py-4 bg-gradient-to-r from-brand-bronze to-brand-gold text-white font-semibold rounded-xl hover:from-brand-dark hover:to-brand-medium transition-all">
              Fazer Avaliação
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {anterior && (
              <div className="luxury-card-strong p-8">
                <h2 className="text-2xl font-semibold text-brand-dark mb-6">📊 Comparação de Evolução</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-xl p-6 border border-brand-gold/30">
                    <p className="text-sm text-brand-medium mb-2">Mais Recente</p>
                    <p className="text-xs text-brand-darker mb-4">{new Date(mais.dataAvaliacao).toLocaleDateString("pt-BR")}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-bronze to-brand-gold flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">{calcularMedia(mais).toFixed(1)}</span>
                      </div>
                      <div><p className="text-xs text-brand-medium">Média Geral</p><p className="text-sm font-semibold text-brand-dark">de 10</p></div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-6 border border-gray-300">
                    <p className="text-sm text-gray-600 mb-2">Anterior</p>
                    <p className="text-xs text-gray-700 mb-4">{new Date(anterior.dataAvaliacao).toLocaleDateString("pt-BR")}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">{calcularMedia(anterior).toFixed(1)}</span>
                      </div>
                      <div><p className="text-xs text-gray-600">Média Geral</p><p className="text-sm font-semibold text-gray-700">de 10</p></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-brand-dark mb-4">Evolução por Área</h3>
                  {AREAS.map(area => {
                    const atual = mais[area.key as keyof Avaliacao] as number;
                    const ant = anterior[area.key as keyof Avaliacao] as number;
                    const dif = atual - ant;
                    return (
                      <div key={area.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 flex-1">
                          {renderIconeTendencia(dif)}
                          <span className="text-sm font-medium text-brand-dark">{area.nome}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{ant} → {atual}</span>
                          <span className={`text-sm font-semibold min-w-[60px] text-right ${dif > 0 ? "text-green-600" : dif < 0 ? "text-red-600" : "text-gray-400"}`}>
                            {dif > 0 ? "+" : ""}{dif.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="luxury-card-strong p-8">
              <h2 className="text-2xl font-semibold text-brand-dark mb-6">📅 Histórico Completo</h2>
              <div className="space-y-4">
                {avaliacoesOrdenadas.map((avaliacao, index) => (
                  <div
                    key={avaliacao.id}
                    className="p-6 bg-gradient-to-br from-brand-gold/5 to-brand-bronze/5 rounded-xl border border-brand-gold/20 hover:border-brand-gold/40 transition-all cursor-pointer"
                    onClick={() => navigate(`/resultado/${avaliacao.id}`)}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-bronze to-brand-gold flex items-center justify-center shadow-md">
                          <span className="text-xl font-bold text-white">{calcularMedia(avaliacao).toFixed(1)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-dark">Avaliação #{avaliacoes.length - index}</p>
                          <p className="text-xs text-brand-medium">
                            {new Date(avaliacao.dataAvaliacao).toLocaleDateString("pt-BR", {
                              day: "2-digit", month: "long", year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-brand-gold/20 text-brand-dark font-medium rounded-lg hover:bg-brand-gold/30 transition-colors text-sm">
                        Ver Detalhes →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
