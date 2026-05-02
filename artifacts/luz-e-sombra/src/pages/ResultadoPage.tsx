import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import RadarChart from "@/components/RadarChart";
import LineChart from "@/components/LineChart";
import AreaIcon from "@/components/AreaIcon";
import { AREAS_DA_VIDA } from "@/lib/types";
import { ArrowRight, Download, Sparkles, TrendingUp, ArrowUp, ArrowDown, Minus } from "lucide-react";
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
  usuario: { id: number; nome: string; dataNascimento: string | null; username: string };
}

export default function ResultadoPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const urlParams = new URLSearchParams(window.location.search);
  const primeiroAcesso = urlParams.get("primeiro") === "true";
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [todasAvaliacoes, setTodasAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const resAtual = await apiFetch(`/avaliacoes/${params.id}`);
        if (resAtual.ok) {
          const data = await resAtual.json();
          setAvaliacao(data);
          const resTodas = await apiFetch("/avaliacoes");
          if (resTodas.ok) {
            const todas = await resTodas.json();
            setTodasAvaliacoes(todas);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar avaliação:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, [params.id]);

  if (loading) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-transparent mx-auto" />
      </div>
    );
  }

  if (!avaliacao) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-brand-medium mb-4">Avaliação não encontrada</p>
          <button onClick={() => navigate("/")} className="luxury-btn-primary">Voltar</button>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: AREAS_DA_VIDA.map(area => area.titulo),
    values: [
      avaliacao.plenitudeFelicidade, avaliacao.espiritualidade, avaliacao.saudeDisposicao,
      avaliacao.desenvolvimentoIntelectual, avaliacao.equilibrioEmocional, avaliacao.familia,
      avaliacao.desenvolvimentoAmoroso, avaliacao.vidaSocial, avaliacao.realizacaoProposito,
      avaliacao.recursosFinanceiros, avaliacao.contribuicaoSocial, avaliacao.criatividadeHobbyDiversao,
    ],
  };

  const media = chartData.values.reduce((a, b) => a + b, 0) / chartData.values.length;

  const calcularMedia = (aval: Avaliacao) => {
    const valores = [
      aval.plenitudeFelicidade, aval.espiritualidade, aval.saudeDisposicao,
      aval.desenvolvimentoIntelectual, aval.equilibrioEmocional, aval.familia,
      aval.desenvolvimentoAmoroso, aval.vidaSocial, aval.realizacaoProposito,
      aval.recursosFinanceiros, aval.contribuicaoSocial, aval.criatividadeHobbyDiversao,
    ];
    return valores.reduce((a, b) => a + b, 0) / valores.length;
  };

  const evolucaoData = todasAvaliacoes.length > 1 ? {
    labels: todasAvaliacoes.map(a => format(new Date(a.dataAvaliacao), "dd/MM", { locale: ptBR })),
    datasets: [{
      label: "Evolução da Média",
      data: todasAvaliacoes.map(a => calcularMedia(a)),
      borderColor: "rgba(152, 121, 76, 1)",
      backgroundColor: "rgba(152, 121, 76, 0.1)",
      tension: 0.4,
    }],
  } : null;

  const mediaInicial = todasAvaliacoes.length >= 2
    ? calcularMedia(todasAvaliacoes[todasAvaliacoes.length - 1])
    : null;
  const progresso = mediaInicial !== null ? media - mediaInicial : null;

  return (
    <div className="luxury-shell py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">

        {/* Header */}
        <div className="luxury-card-strong p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-2">
            Resultado
          </p>
          <h1 className="font-tan-mon-cheri text-4xl md:text-5xl text-brand-dark mb-6">
            Sua Roda da Vida
          </h1>

          {primeiroAcesso && (
            <div className="flex items-start gap-3 p-5 rounded-xl mb-6"
              style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.3)" }}>
              <Sparkles className="w-4 h-4 text-brand-bronze flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-dark font-semibold text-sm mb-1">Parabéns pela sua primeira avaliação!</p>
                <p className="text-brand-medium text-sm">Agora você tem acesso completo às ferramentas de autoconhecimento.</p>
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="grid md:grid-cols-3 gap-4 mb-6 pt-4 border-t border-brand-gold/15">
            <div>
              <p className="text-xs tracking-widest uppercase text-brand-medium mb-1">Nome</p>
              <p className="font-medium text-brand-dark">{avaliacao.usuario.nome}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-brand-medium mb-1">Nascimento</p>
              <p className="font-medium text-brand-dark">
                {avaliacao.usuario.dataNascimento
                  ? avaliacao.usuario.dataNascimento.split("-").reverse().join("/")
                  : "Não informado"}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-brand-medium mb-1">Data da Avaliação</p>
              <p className="font-medium text-brand-dark">
                {format(new Date(avaliacao.dataAvaliacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-end gap-2">
            <span className="font-tan-mon-cheri text-6xl text-brand-dark leading-none">{media.toFixed(1)}</span>
            <span className="text-brand-medium text-xl mb-2">/10</span>
            <span className="text-xs tracking-widest uppercase text-brand-medium mb-3 ml-2">média geral</span>
          </div>
        </div>

        {/* Radar chart */}
        <div className="luxury-card-strong p-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-6">Mapa das Áreas</p>
          <RadarChart data={chartData} />
        </div>

        {/* Evolution */}
        {evolucaoData && (
          <div className="luxury-card-strong p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-brand-bronze" />
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium">Evolução</p>
                <p className="text-brand-dark font-medium">Sua Jornada ao Longo do Tempo</p>
              </div>
            </div>

            <div className="mb-6">
              <LineChart data={evolucaoData} />
            </div>

            {progresso !== null && (
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-gold/15">
                <div>
                  <p className="text-xs tracking-widest uppercase text-brand-medium mb-1">Primeira</p>
                  <p className="font-tan-mon-cheri text-3xl text-brand-dark">{mediaInicial?.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-brand-medium mb-1">Atual</p>
                  <p className="font-tan-mon-cheri text-3xl text-brand-dark">{media.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-brand-medium mb-1">Progresso</p>
                  <div className="flex items-center gap-1">
                    {progresso > 0
                      ? <ArrowUp className="w-4 h-4 text-green-600" />
                      : progresso < 0
                      ? <ArrowDown className="w-4 h-4 text-red-500" />
                      : <Minus className="w-4 h-4 text-brand-medium" />
                    }
                    <p className={`font-tan-mon-cheri text-3xl ${progresso > 0 ? "text-green-600" : progresso < 0 ? "text-red-500" : "text-brand-medium"}`}>
                      {progresso > 0 ? "+" : ""}{progresso.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Area scores */}
        <div className="luxury-card-strong p-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-6">Notas por Área</p>
          <div className="grid md:grid-cols-2 gap-4">
            {AREAS_DA_VIDA.map((area, index) => {
              const valor = chartData.values[index];
              const percentage = (valor / 10) * 100;
              return (
                <div key={area.id} className="p-4 rounded-xl transition-all hover:shadow-md"
                  style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <AreaIcon iconName={area.icon} size={32} className="w-10 h-10" />
                      <span className="font-medium text-brand-dark text-sm">{area.titulo}</span>
                    </div>
                    <span className="font-tan-mon-cheri text-2xl text-brand-bronze">{valor}</span>
                  </div>
                  <div className="w-full bg-brand-gold/15 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-brand-bronze to-brand-gold h-1 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center no-print pb-8">
          <button
            onClick={() => navigate("/")}
            className="luxury-btn-primary"
          >
            {primeiroAcesso ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            {primeiroAcesso ? "Acessar Área de Membro" : "Início"}
          </button>
          {!primeiroAcesso && (
            <button
              onClick={() => navigate("/avaliacao?novo=true")}
              className="luxury-btn-secondary"
            >
              Nova Avaliação
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="luxury-btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>

      </div>
    </div>
  );
}
