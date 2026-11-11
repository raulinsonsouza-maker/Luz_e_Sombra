import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import RadarChart from "@/components/RadarChart";
import LineChart from "@/components/LineChart";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import PageIntroHeader from "@/components/PageIntroHeader";
import RodaAnaliseArea from "@/components/RodaAnaliseArea";
import DarkCard from "@/components/DarkCard";
import { JORNADA_MODULE_NAV } from "@/lib/jornadaHubConfig";
import { AREAS_DA_VIDA } from "@/lib/types";
import { apiFetch } from "@/lib/auth";
import {
  gerarAnaliseRodaCruzada,
  parseLinguagensCruzadas,
  parseTemperamentoCruzado,
  parseTracoCruzado,
  scoresDeAvaliacao,
  type ResultadoRodaCruzada,
} from "@/lib/rodaCruzada";
import {
  Sparkles, TrendingUp, ArrowUp, ArrowDown, Minus,
} from "lucide-react";

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

function getMediaLabel(media: number, amplitude: number): { label: string; sublabel: string } {
  if (amplitude >= 4) {
    if (media < 5.5) return { label: "Contraste forte", sublabel: "Tem área pedindo cuidado urgente, e a média sozinha não conta isso" };
    return { label: "Contraste forte", sublabel: "Tem áreas cheias e áreas pedindo cuidado de verdade" };
  }
  if (media < 4) return { label: "Começo honesto", sublabel: "Aqui começa o cuidado, sem maquiagem" };
  if (media < 5.5) return { label: "Pede cuidado", sublabel: "Várias áreas pedem atenção, e você já olhou para elas" };
  if (media < 7) return { label: "Em construção", sublabel: "Há base, e ainda há espaço claro para crescer" };
  if (media < 8.5) return { label: "Boa média", sublabel: "A vida tem chão. O detalhe agora importa mais que o número" };
  return { label: "Roda plena", sublabel: "Equilíbrio raro, para cuidar com carinho e sem relaxar" };
}

function getMediaColor(media: number): string {
  if (media < 4) return "#ef4444";
  if (media < 5.5) return "#f97316";
  if (media < 7) return "#eab308";
  if (media < 8.5) return "#c8a56b";
  return "#84cc16";
}

function calcularMedia(aval: Avaliacao): number {
  const v = [
    aval.plenitudeFelicidade, aval.espiritualidade, aval.saudeDisposicao,
    aval.desenvolvimentoIntelectual, aval.equilibrioEmocional, aval.familia,
    aval.desenvolvimentoAmoroso, aval.vidaSocial, aval.realizacaoProposito,
    aval.recursosFinanceiros, aval.contribuicaoSocial, aval.criatividadeHobbyDiversao,
  ];
  return v.reduce((a, b) => a + b, 0) / v.length;
}

export default function ResultadoPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const urlParams = new URLSearchParams(window.location.search);
  const primeiroAcesso = urlParams.get("primeiro") === "true";
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [todasAvaliacoes, setTodasAvaliacoes] = useState<Avaliacao[]>([]);
  const [cruzada, setCruzada] = useState<ResultadoRodaCruzada | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const [resAval, resLista, resTemp, resLing, resTraco] = await Promise.all([
          apiFetch(`/avaliacoes/${params.id}`),
          apiFetch("/avaliacoes"),
          apiFetch("/temperamento/ultimo"),
          apiFetch("/linguagens-amor/ultimo"),
          apiFetch("/traco/analise"),
        ]);

        if (!resAval.ok) {
          if (vivo) setAvaliacao(null);
          return;
        }

        const aval = (await resAval.json()) as Avaliacao;
        if (!vivo) return;
        setAvaliacao(aval);

        if (resLista.ok) {
          setTodasAvaliacoes(await resLista.json());
        }

        const temp = resTemp.ok ? parseTemperamentoCruzado(await resTemp.json()) : null;
        const ling = resLing.ok ? parseLinguagensCruzadas(await resLing.json()) : null;
        const tracoRow = resTraco.ok ? await resTraco.json() : null;
        const traco = parseTracoCruzado(tracoRow);

        const scores = scoresDeAvaliacao(aval as unknown as Record<string, number>);
        setCruzada(
          gerarAnaliseRodaCruzada(scores, {
            temperamento: temp,
            traco,
            linguagens: ling,
          }),
        );
      } catch (e) {
        console.error(e);
      } finally {
        if (vivo) setLoading(false);
      }
    })();
    return () => {
      vivo = false;
    };
  }, [params.id]);

  const areasOrdenadas = useMemo(() => {
    if (!avaliacao) return [];
    const valores = [
      avaliacao.plenitudeFelicidade, avaliacao.espiritualidade, avaliacao.saudeDisposicao,
      avaliacao.desenvolvimentoIntelectual, avaliacao.equilibrioEmocional, avaliacao.familia,
      avaliacao.desenvolvimentoAmoroso, avaliacao.vidaSocial, avaliacao.realizacaoProposito,
      avaliacao.recursosFinanceiros, avaliacao.contribuicaoSocial, avaliacao.criatividadeHobbyDiversao,
    ];
    return AREAS_DA_VIDA.map((area, i) => ({ area, valor: valores[i] })).sort((a, b) => a.valor - b.valor);
  }, [avaliacao]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
      >
        <div
          className="animate-spin rounded-full h-10 w-10 border-2"
          style={{ borderColor: "rgba(200,165,107,0.3)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!avaliacao) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
      >
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: "rgba(247,242,236,0.6)" }}>Avaliação não encontrada</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-2xl text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1e1812" }}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const valores = [
    avaliacao.plenitudeFelicidade, avaliacao.espiritualidade, avaliacao.saudeDisposicao,
    avaliacao.desenvolvimentoIntelectual, avaliacao.equilibrioEmocional, avaliacao.familia,
    avaliacao.desenvolvimentoAmoroso, avaliacao.vidaSocial, avaliacao.realizacaoProposito,
    avaliacao.recursosFinanceiros, avaliacao.contribuicaoSocial, avaliacao.criatividadeHobbyDiversao,
  ];
  const chartData = { labels: AREAS_DA_VIDA.map((a) => a.titulo), values: valores };
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const mediaColor = getMediaColor(media);
  const amplitudeHero = areasOrdenadas[areasOrdenadas.length - 1].valor - areasOrdenadas[0].valor;
  const { label: mediaLabel, sublabel: mediaSublabel } = getMediaLabel(media, amplitudeHero);

  const evolucaoData = todasAvaliacoes.length > 1
    ? {
        labels: [...todasAvaliacoes].reverse().map((a) => format(new Date(a.dataAvaliacao), "dd/MM", { locale: ptBR })),
        datasets: [{
          label: "Evolução da Média",
          data: [...todasAvaliacoes].reverse().map((a) => calcularMedia(a)),
          borderColor: "rgba(200,165,107,1)",
          backgroundColor: "rgba(200,165,107,0.08)",
          tension: 0.4,
        }],
      }
    : null;

  const mediaInicial = todasAvaliacoes.length >= 2
    ? calcularMedia(todasAvaliacoes[todasAvaliacoes.length - 1])
    : null;
  const progresso = mediaInicial !== null ? media - mediaInicial : null;

  const fontesAtivas = cruzada
    ? [
        cruzada.fontes.temperamento ? "temperamento" : null,
        cruzada.fontes.traco ? "traço" : null,
        cruzada.fontes.linguagens ? "linguagens do amor" : null,
      ].filter(Boolean)
    : [];

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4 animate-fadeIn">
        <MobileTopBar titulo="Resultado" voltar={JORNADA_MODULE_NAV.roda.hub} />
        <NavBackButton
          to={JORNADA_MODULE_NAV.roda.hub}
          label={JORNADA_MODULE_NAV.roda.backLabel}
          className="mb-2 hidden md:flex"
        />
        <PageIntroHeader
          eyebrow="Roda da Vida"
          titulo="Resultado"
          subtitulo="Leitura profunda de cada área, cruzada com o que já sabemos de você"
          className="mb-2"
          hiddenOnMobile
        />

        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1e1812 0%, #2f251b 60%, #1e1812 100%)", border: "1px solid rgba(200,165,107,0.2)" }}
        >
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #c8a56b 40%, #9c7742 60%, transparent)" }} />

          <div className="p-6 md:p-10">
            {primeiroAcesso && (
              <div
                className="flex items-start gap-3 p-4 rounded-2xl mb-6"
                style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.3)" }}
              >
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#c8a56b" }} />
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: "#e8d5b0" }}>Parabéns pela sua primeira avaliação</p>
                  <p className="text-sm" style={{ color: "rgba(200,165,107,0.7)" }}>
                    Esta é sua linha de base, o ponto de partida da sua jornada.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.5)" }}>
                  Roda da Vida
                </p>
                <h1 className="font-tan-mon-cheri text-3xl md:text-4xl mb-1" style={{ color: "#e8d5b0" }}>
                  {avaliacao.usuario.nome}
                </h1>
                <p className="text-sm" style={{ color: "rgba(200,165,107,0.5)" }}>
                  {format(new Date(avaliacao.dataAvaliacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-end gap-2 justify-end">
                  <span className="font-tan-mon-cheri text-6xl md:text-7xl leading-none" style={{ color: mediaColor }}>
                    {media.toFixed(1)}
                  </span>
                  <span className="text-xl mb-2" style={{ color: "rgba(200,165,107,0.4)" }}>/10</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: mediaColor }}>{mediaLabel}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>{mediaSublabel}</p>
              </div>
            </div>

            <div
              className="grid grid-cols-3 gap-3 mt-6 pt-5"
              style={{ borderTop: "1px solid rgba(200,165,107,0.12)" }}
            >
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "rgba(200,165,107,0.45)" }}>
                  Mais forte
                </p>
                <p className="font-tan-mon-cheri text-sm" style={{ color: "#c8a56b" }}>
                  {areasOrdenadas[areasOrdenadas.length - 1].area.titulo}
                </p>
                <p className="font-tan-mon-cheri text-2xl" style={{ color: "#c8a56b" }}>
                  {areasOrdenadas[areasOrdenadas.length - 1].valor}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "rgba(200,165,107,0.45)" }}>
                  Mais atenção
                </p>
                <p className="font-tan-mon-cheri text-sm text-red-400">
                  {areasOrdenadas[0].area.titulo}
                </p>
                <p className="font-tan-mon-cheri text-2xl text-red-400">
                  {areasOrdenadas[0].valor}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "rgba(200,165,107,0.45)" }}>
                  Contraste
                </p>
                <p className="font-tan-mon-cheri text-sm" style={{ color: "rgba(200,165,107,0.6)" }}>Entre os polos</p>
                <p className="font-tan-mon-cheri text-2xl" style={{ color: "rgba(200,165,107,0.8)" }}>
                  {amplitudeHero}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #c8a56b 40%, #9c7742 60%, transparent)" }} />
        </div>

        <DarkCard className="p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
            Sua roda
          </p>
          <p className="text-sm mb-5" style={{ color: "rgba(247,242,236,0.4)" }}>
            O desenho completo. Em seguida, a leitura de cada área.
          </p>
          <RadarChart data={chartData} />
        </DarkCard>

        {cruzada && (
          <>
            <DarkCard className="p-5 sm:p-6 md:p-8 space-y-4">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
                Sua roda agora
              </p>
              {cruzada.abertura.map((p) => (
                <p key={p} className="text-sm md:text-[15px] leading-relaxed" style={{ color: "rgba(247,242,236,0.86)", lineHeight: 1.75 }}>
                  {p}
                </p>
              ))}
              {fontesAtivas.length > 0 && (
                <p className="text-xs pt-1" style={{ color: "rgba(200,165,107,0.55)" }}>
                  Esta leitura cruza a roda com {fontesAtivas.join(", ")}.
                </p>
              )}
            </DarkCard>

            <div className="space-y-1 pt-2">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase px-1" style={{ color: "rgba(200,165,107,0.5)" }}>
                Análise por área
              </p>
              <p className="text-sm px-1 mb-3" style={{ color: "rgba(247,242,236,0.4)" }}>
                Das que pedem mais cuidado às que já sustentam. Em cada uma: o que acontece, o cruzamento e como cuidar.
              </p>
            </div>

            <div className="space-y-4">
              {cruzada.analises.map((analise) => (
                <RodaAnaliseArea key={analise.id} analise={analise} />
              ))}
            </div>
          </>
        )}

        {evolucaoData && (
          <DarkCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <TrendingUp className="w-4 h-4" style={{ color: "#c8a56b" }} />
              <p className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
                Sua jornada
              </p>
            </div>
            <p className="text-sm mb-6" style={{ color: "rgba(247,242,236,0.4)" }}>
              {todasAvaliacoes.length} retratos no tempo. O movimento importa mais que o número isolado.
            </p>
            <LineChart data={evolucaoData} />

            {progresso !== null && (
              <div
                className="grid grid-cols-3 gap-4 mt-6 pt-5"
                style={{ borderTop: "1px solid rgba(200,165,107,0.12)" }}
              >
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>Início</p>
                  <p className="font-tan-mon-cheri text-3xl" style={{ color: "#f7f2ec" }}>{mediaInicial?.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>Atual</p>
                  <p className="font-tan-mon-cheri text-3xl" style={{ color: "#f7f2ec" }}>{media.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>Evolução</p>
                  <div className="flex items-center gap-1">
                    {progresso > 0 ? <ArrowUp className="w-4 h-4 text-green-400" />
                      : progresso < 0 ? <ArrowDown className="w-4 h-4 text-red-400" />
                      : <Minus className="w-4 h-4" style={{ color: "rgba(247,242,236,0.35)" }} />}
                    <p
                      className={`font-tan-mon-cheri text-3xl ${progresso > 0 ? "text-green-400" : progresso < 0 ? "text-red-400" : ""}`}
                      style={progresso === 0 ? { color: "rgba(247,242,236,0.35)" } : undefined}
                    >
                      {progresso > 0 ? "+" : ""}{progresso.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DarkCard>
        )}
      </div>
    </div>
  );
}
