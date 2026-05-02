import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import RadarChart from "@/components/RadarChart";
import LineChart from "@/components/LineChart";
import AreaIcon from "@/components/AreaIcon";
import { AREAS_DA_VIDA } from "@/lib/types";
import { Home, Download, Sparkles, TrendingUp } from "lucide-react";
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-bronze mx-auto"></div>
          <p className="mt-4 text-brand-medium">Carregando resultado...</p>
        </div>
      </div>
    );
  }

  if (!avaliacao) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-brand-medium">Avaliação não encontrada</p>
          <button onClick={() => navigate("/")} className="mt-4 luxury-btn-primary">Voltar</button>
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

  return (
    <div className="luxury-shell py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="luxury-card-strong p-8 md:p-12 animate-fadeIn">
          <div className="text-center mb-8">
            <h1 className="font-tan-mon-cheri text-5xl md:text-6xl text-brand-dark mb-2">Seu Resultado</h1>
            <p className="text-brand-medium text-lg">Confira o equilíbrio das suas áreas da vida</p>
          </div>

          {primeiroAcesso && (
            <div className="mb-6 bg-purple-50 rounded-xl p-6 border border-purple-200">
              <p className="text-purple-900 font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Parabéns pela sua primeira avaliação!
              </p>
              <p className="text-purple-700 text-sm mt-2">
                Agora você tem acesso completo às ferramentas de autoconhecimento.
              </p>
            </div>
          )}

          <div className="bg-gradient-to-r from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 mb-8 border border-brand-gold/30">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-brand-medium mb-1">Nome</p>
                <p className="font-semibold text-brand-dark">{avaliacao.usuario.nome}</p>
              </div>
              <div>
                <p className="text-sm text-brand-medium mb-1">Data de Nascimento</p>
                <p className="font-semibold text-brand-dark">
                  {avaliacao.usuario.dataNascimento
                    ? avaliacao.usuario.dataNascimento.split("-").reverse().join("/")
                    : "Não informado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-medium mb-1">Data da Avaliação</p>
                <p className="font-semibold text-brand-dark">
                  {format(new Date(avaliacao.dataAvaliacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-brand-bronze to-brand-gold text-white rounded-2xl px-8 py-4">
              <p className="text-sm font-medium mb-1">Média Geral</p>
              <p className="text-4xl font-bold">{media.toFixed(1)}</p>
              <p className="text-sm">de 10</p>
            </div>
          </div>

          <div className="mb-8">
            <RadarChart data={chartData} />
          </div>

          {evolucaoData && (
            <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-900">📈 Sua Evolução ao Longo do Tempo</h2>
                  <p className="text-green-700 text-sm">
                    Acompanhe seu progresso através de {todasAvaliacoes.length} avaliações
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <LineChart data={evolucaoData} />
              </div>

              {todasAvaliacoes.length >= 2 && (
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Primeira Avaliação</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {calcularMedia(todasAvaliacoes[todasAvaliacoes.length - 1]).toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4 text-center border-2 border-green-300">
                    <p className="text-sm text-green-700 mb-1">Avaliação Atual</p>
                    <p className="text-2xl font-bold text-green-900">{media.toFixed(1)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Progresso Total</p>
                    <p className={`text-2xl font-bold ${media >= calcularMedia(todasAvaliacoes[todasAvaliacoes.length - 1]) ? "text-green-600" : "text-amber-600"}`}>
                      {(media - calcularMedia(todasAvaliacoes[todasAvaliacoes.length - 1])) >= 0 ? "+" : ""}
                      {(media - calcularMedia(todasAvaliacoes[todasAvaliacoes.length - 1])).toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">pontos</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-8">
            <h3 className="font-tan-mon-cheri text-3xl text-brand-dark mb-4">Notas por Área</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {AREAS_DA_VIDA.map((area, index) => {
                const valor = chartData.values[index];
                const percentage = (valor / 10) * 100;
                return (
                  <div key={area.id} className="bg-brand-gold/5 rounded-xl p-4 hover:shadow-md transition-all border border-brand-gold/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <AreaIcon iconName={area.icon} size={32} className="w-12 h-12" />
                        <span className="font-medium text-brand-dark">{area.titulo}</span>
                      </div>
                      <span className="text-2xl font-bold text-brand-bronze">{valor}</span>
                    </div>
                    <div className="w-full bg-brand-gold/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-brand-bronze to-brand-gold h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center no-print">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-bronze to-brand-gold text-white font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              {primeiroAcesso ? <Sparkles className="w-5 h-5" /> : <Home className="w-5 h-5" />}
              {primeiroAcesso ? "Acessar Área de Membro" : "Voltar ao Início"}
            </button>
            {!primeiroAcesso && (
              <button
                onClick={() => navigate("/avaliacao?novo=true")}
                className="flex items-center gap-2 px-6 py-3 border-2 border-brand-gold text-brand-dark font-semibold rounded-xl hover:bg-brand-gold/10 transition-all"
              >
                Nova Avaliação
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 border-2 border-brand-bronze text-brand-bronze font-semibold rounded-xl hover:bg-brand-gold/10 transition-all"
            >
              <Download className="w-5 h-5" />
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
