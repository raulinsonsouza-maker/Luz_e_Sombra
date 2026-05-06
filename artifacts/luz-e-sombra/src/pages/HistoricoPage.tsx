import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { TrendingUp, TrendingDown, Minus, Target, Loader2, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import MobileTopBar from "@/components/MobileTopBar";
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

function DarkCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl ${className}`}
      style={{
        background: "rgba(30,24,18,0.6)",
        border: "1px solid rgba(200,165,107,0.12)",
        backdropFilter: "blur(20px)",
      }}
    >
      {children}
    </div>
  );
}

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

  function getMediaColor(m: number): string {
    if (m < 4) return "#ef4444";
    if (m < 5.5) return "#f97316";
    if (m < 7) return "#eab308";
    return "#c8a56b";
  }

  function renderTendencia(dif: number) {
    if (dif > 0.5) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (dif < -0.5) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4" style={{ color: "rgba(247,242,236,0.25)" }} />;
  }

  if (status === "loading" || carregando) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
      >
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  const avaliacoesOrdenadas = [...avaliacoes].sort(
    (a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
  );
  const mais = avaliacoesOrdenadas[0];
  const anterior = avaliacoesOrdenadas[1];

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <MobileTopBar titulo="Histórico" subtitulo="Evolução da Roda da Vida" />
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-4">

        {/* ── Header (desktop — mobile via MobileTopBar) ── */}
        <div className="mb-2 hidden md:block">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
            Evolução
          </p>
          <h1 className="font-tan-mon-cheri text-3xl md:text-4xl mb-1" style={{ color: "#f7f2ec" }}>
            Histórico de Avaliações
          </h1>
          {avaliacoes.length > 0 && (
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.4)" }}>
              {avaliacoes.length} avaliação{avaliacoes.length !== 1 ? "ões" : ""} realizada{avaliacoes.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {avaliacoes.length === 0 ? (
          <DarkCard className="p-12 text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-4"
              style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.15)" }}
            >
              <Target className="w-8 h-8" style={{ color: "rgba(200,165,107,0.4)" }} />
            </div>
            <h2 className="font-tan-mon-cheri text-2xl mb-2" style={{ color: "#f7f2ec" }}>
              Nenhuma avaliação ainda
            </h2>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "rgba(247,242,236,0.4)" }}>
              Faça sua primeira avaliação da Roda da Vida para começar a acompanhar sua evolução.
            </p>
            <button
              onClick={() => navigate("/avaliacao")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1e1812" }}
            >
              Fazer Avaliação
              <ArrowRight className="w-4 h-4" />
            </button>
          </DarkCard>
        ) : (
          <div className="space-y-4">

            {/* ── Comparison ── */}
            {anterior && (
              <DarkCard className="p-6 md:p-8">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: "rgba(200,165,107,0.5)" }}>
                  Comparação de Evolução
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-6 rounded-2xl"
                    style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.25)" }}>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
                      Mais Recente
                    </p>
                    <p className="text-xs mb-4" style={{ color: "rgba(247,242,236,0.35)" }}>
                      {new Date(mais.dataAvaliacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                    <div className="flex items-end gap-3">
                      <span className="font-tan-mon-cheri text-5xl md:text-6xl leading-none" style={{ color: getMediaColor(calcularMedia(mais)) }}>
                        {calcularMedia(mais).toFixed(1)}
                      </span>
                      <span className="mb-2" style={{ color: "rgba(200,165,107,0.4)" }}>/10</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,165,107,0.1)" }}>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.4)" }}>
                      Anterior
                    </p>
                    <p className="text-xs mb-4" style={{ color: "rgba(247,242,236,0.25)" }}>
                      {new Date(anterior.dataAvaliacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                    <div className="flex items-end gap-3">
                      <span className="font-tan-mon-cheri text-5xl md:text-6xl leading-none" style={{ color: "rgba(247,242,236,0.25)" }}>
                        {calcularMedia(anterior).toFixed(1)}
                      </span>
                      <span className="mb-2" style={{ color: "rgba(200,165,107,0.25)" }}>/10</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.45)" }}>
                  Evolução por Área
                </p>
                <div className="space-y-1.5">
                  {AREAS.map(area => {
                    const atual = mais[area.key as keyof Avaliacao] as number;
                    const ant = anterior[area.key as keyof Avaliacao] as number;
                    const dif = atual - ant;
                    return (
                      <div key={area.key}
                        className="flex items-center justify-between p-3 rounded-xl gap-2"
                        style={{ background: "rgba(255,255,255,0.02)" }}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="flex-shrink-0">{renderTendencia(dif)}</span>
                          <span className="text-sm truncate" style={{ color: "rgba(247,242,236,0.65)" }}>{area.nome}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs whitespace-nowrap" style={{ color: "rgba(247,242,236,0.3)" }}>
                            {ant}→{atual}
                          </span>
                          <span
                            className="text-sm font-semibold min-w-[44px] text-right flex items-center justify-end gap-0.5"
                            style={{
                              color: dif > 0 ? "#4ade80"
                                : dif < 0 ? "#f87171"
                                : "rgba(247,242,236,0.2)",
                            }}
                          >
                            {dif > 0 ? <ArrowUp className="w-3 h-3" />
                              : dif < 0 ? <ArrowDown className="w-3 h-3" /> : null}
                            {dif !== 0 ? (dif > 0 ? "+" : "") + dif.toFixed(1) : "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DarkCard>
            )}

            {/* ── Full history ── */}
            <DarkCard className="p-6 md:p-8">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: "rgba(200,165,107,0.5)" }}>
                Histórico Completo
              </p>
              <div className="space-y-2.5">
                {avaliacoesOrdenadas.map((avaliacao, index) => {
                  const m = calcularMedia(avaliacao);
                  const mColor = getMediaColor(m);
                  return (
                    <button
                      key={avaliacao.id}
                      className="w-full flex items-center justify-between p-4 md:p-5 rounded-2xl text-left transition-all"
                      style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.12)" }}
                      onClick={() => navigate(`/resultado/${avaliacao.id}`)}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(200,165,107,0.35)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(200,165,107,0.12)")}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl flex-shrink-0"
                          style={{ background: `${mColor}18`, border: `1px solid ${mColor}44` }}
                        >
                          <span className="font-tan-mon-cheri text-lg md:text-xl" style={{ color: mColor }}>
                            {m.toFixed(1)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: "rgba(247,242,236,0.8)" }}>
                            Avaliação #{avaliacoes.length - index}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "rgba(247,242,236,0.35)" }}>
                            {new Date(avaliacao.dataAvaliacao).toLocaleDateString("pt-BR", {
                              day: "2-digit", month: "long", year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1"
                        style={{ color: "rgba(200,165,107,0.4)" }} />
                    </button>
                  );
                })}
              </div>
            </DarkCard>

          </div>
        )}
      </div>
    </div>
  );
}
