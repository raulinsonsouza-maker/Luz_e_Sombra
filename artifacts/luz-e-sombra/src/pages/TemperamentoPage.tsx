import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import PageIntroHeader from "@/components/PageIntroHeader";
import { JORNADA_MODULE_NAV } from "@/lib/jornadaHubConfig";
import TemperamentoPainelResultado from "@/pages/temperamento/TemperamentoPainelResultado";
import type { ResultadoTemperamentoUi } from "@/pages/temperamento/enriquecerResultado";
import {
  gerarOrdemItens,
  TOTAL_ITENS,
  entradaTemperamentoSchema,
  itemPorId,
  VERSAO_TEMPERAMENTO_ATUAL,
  type ItemTemperamento,
  type RespostaSimNao,
} from "@workspace/temperamento-v1";

const STORAGE_KEY = "luz_temperamento_v3_draft";
const TOTAL = TOTAL_ITENS;
const TEMP_NAV = JORNADA_MODULE_NAV.temperamento;

type Fase = "intro" | "perguntas" | "enviando" | "resultado";

type DraftPersist = {
  ordemIds: string[];
  answers: Record<string, RespostaSimNao>;
  qIndex: number;
  startedAt: number;
};

function itensFromIds(ids: string[]): ItemTemperamento[] {
  return ids.map((id) => itemPorId(id)!);
}

function primeiroIndiceSemResposta(ids: string[], answers: Record<string, RespostaSimNao>): number {
  const i = ids.findIndex((id) => answers[id] === undefined);
  return i === -1 ? Math.max(0, ids.length - 1) : i;
}

function contarRespostas(answers: Record<string, RespostaSimNao>): number {
  return Object.keys(answers).filter((k) => answers[k] === "sim" || answers[k] === "nao").length;
}

export default function TemperamentoPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { status } = useAuth();
  const [fase, setFase] = useState<Fase>("intro");
  const [ordemIds, setOrdemIds] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, RespostaSimNao>>({});
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [erro, setErro] = useState<string | null>(null);
  const [resultadoApi, setResultadoApi] = useState<ResultadoTemperamentoUi | null>(null);
  const [carregandoUltimo, setCarregandoUltimo] = useState(false);
  const [msgIntro, setMsgIntro] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
  }, [status, navigate]);

  const itensOrdenados = useMemo(() => itensFromIds(ordemIds), [ordemIds]);
  const itemAtual = itensOrdenados[qIndex];
  const progresso = fase === "perguntas" && ordemIds.length === TOTAL ? (qIndex + 1) / TOTAL : 0;

  const iniciarNovo = useCallback(() => {
    const novo = gerarOrdemItens();
    const ids = novo.map((i) => i.id);
    setOrdemIds(ids);
    setAnswers({});
    setQIndex(0);
    const t = Date.now();
    setStartedAt(t);
    const draft: DraftPersist = { ordemIds: ids, answers: {}, qIndex: 0, startedAt: t };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
    setFase("perguntas");
  }, []);

  const iniciarOuRecuperar = useCallback(() => {
    setMsgIntro(null);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw) as DraftPersist;
        if (Array.isArray(d.ordemIds) && d.ordemIds.length === TOTAL) {
          setOrdemIds(d.ordemIds);
          setAnswers(typeof d.answers === "object" && d.answers ? d.answers : {});
          setQIndex(
            typeof d.qIndex === "number"
              ? Math.min(TOTAL - 1, Math.max(0, d.qIndex))
              : primeiroIndiceSemResposta(d.ordemIds, d.answers ?? {}),
          );
          setStartedAt(typeof d.startedAt === "number" ? d.startedAt : Date.now());
          setFase("perguntas");
          return;
        }
      }
    } catch {
      /* ignore */
    }
    iniciarNovo();
  }, [iniciarNovo]);

  const carregarUltimoServidor = useCallback(async () => {
    setMsgIntro(null);
    setCarregandoUltimo(true);
    try {
      const res = await apiFetch("/temperamento/ultimo");
      if (!res.ok) {
        setMsgIntro("Não foi possível carregar agora. Tenta de novo daqui a pouco.");
        return;
      }
      const row = (await res.json()) as { resultado?: ResultadoTemperamentoUi } | null;
      if (row?.resultado?.perfil) {
        setResultadoApi(row.resultado);
        setFase("resultado");
        return;
      }
      setMsgIntro("Ainda não há um resultado guardado nesta conta. Completa o questionário uma vez para o veres aqui.");
    } catch {
      setMsgIntro("Não foi possível carregar. Verifica a ligação à internet.");
    } finally {
      setCarregandoUltimo(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.get("ver") === "resultado") {
      void carregarUltimoServidor();
      return;
    }
    if (params.get("nova") === "1") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      iniciarNovo();
    }
  }, [status, search, carregarUltimoServidor, iniciarNovo]);

  useEffect(() => {
    if (fase !== "perguntas" || ordemIds.length !== TOTAL) return;
    const draft: DraftPersist = { ordemIds, answers, qIndex, startedAt };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [fase, ordemIds, answers, qIndex, startedAt]);

  async function enviar(ans: Record<string, RespostaSimNao>) {
    const parsed = entradaTemperamentoSchema.safeParse({
      answers: ans,
      metadata: {
        tempo_total_segundos: Math.max(0, Math.floor((Date.now() - startedAt) / 1000)),
        idioma: "pt-BR",
        versao_questionario: VERSAO_TEMPERAMENTO_ATUAL,
      },
    });
    if (!parsed.success) {
      setErro("Respostas incompletas.");
      return;
    }
    setErro(null);
    setFase("enviando");
    try {
      const res = await apiFetch("/temperamento/", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErro((data as { error?: string }).error ?? "Erro ao enviar. Tenta de novo.");
        setFase("perguntas");
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      setResultadoApi(data as ResultadoTemperamentoUi);
      setFase("resultado");
    } catch {
      setErro("Falha de rede. As tuas respostas estão guardadas localmente.");
      setFase("perguntas");
    }
  }

  function escolher(resposta: RespostaSimNao) {
    if (!itemAtual) return;
    const novas = { ...answers, [itemAtual.id]: resposta };
    setAnswers(novas);
    if (qIndex < TOTAL - 1) {
      setTimeout(() => setQIndex((i) => i + 1), 120);
      return;
    }
    void enviar(novas);
  }

  function voltar() {
    if (qIndex > 0) {
      setQIndex((i) => i - 1);
      return;
    }
    setFase("intro");
  }

  const bg = "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)";

  function draftLabel(): string {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw) as DraftPersist;
        if (Array.isArray(d.ordemIds) && d.ordemIds.length === TOTAL) {
          const n = contarRespostas(d.answers ?? {});
          if (n > 0) return `Continuar onde parei (${n}/${TOTAL})`;
          return "Continuar onde parei";
        }
      }
    } catch {
      /* ignore */
    }
    return "Começar";
  }

  if (fase === "resultado" && resultadoApi) {
    const qf = resultadoApi.quality_flag as string | undefined;
    const alertas = (resultadoApi.alertas as string[] | undefined) ?? [];

    return (
      <div className="min-h-screen pb-28 px-4 pt-6" style={{ background: bg }}>
        <MobileTopBar titulo="Temperamento" subtitulo="Seu mapa temperamental" />
        <div className="max-w-lg md:max-w-2xl mx-auto space-y-6">
          <NavBackButton to={TEMP_NAV.hub} label={TEMP_NAV.backLabel} />

          <PageIntroHeader
            hiddenOnMobile
            className="mb-2"
            eyebrow="Análise de temperamento"
            titulo="Seu perfil"
            subtitulo="Quem você é por dentro"
          />

          {(qf && qf !== "OK") || alertas.length > 0 ? (
            <div className="rounded-xl p-3 text-sm" style={{ background: "rgba(180,80,80,0.12)", color: "#f0d0d0" }}>
              {qf && qf !== "OK" && <p>Qualidade das respostas: {qf}</p>}
              {alertas.map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
          ) : null}

          <TemperamentoPainelResultado resultado={resultadoApi} />

          <button
            type="button"
            className="w-full py-3.5 rounded-xl font-semibold"
            style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            onClick={() => {
              setResultadoApi(null);
              setFase("intro");
              setOrdemIds([]);
              setQIndex(0);
            }}
          >
            Refazer questionário
          </button>
        </div>
      </div>
    );
  }

  if (fase === "intro") {
    return (
      <div className="min-h-screen pb-28" style={{ background: bg }}>
        <MobileTopBar titulo="Temperamento" subtitulo="16 afirmações · ~3 min" />
        <div className="max-w-lg mx-auto px-4 pt-8 pb-10">
          <NavBackButton to={TEMP_NAV.hub} label={TEMP_NAV.backLabel} />
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.55)" }}>
            Análise de temperamento
          </p>
          <h1 className="font-tan-mon-cheri text-2xl mb-4" style={{ color: "#f7f2ec" }}>
            Quem você é por dentro
          </h1>
          <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(247,242,236,0.55)" }}>
            Para cada afirmação, responda <strong>Sim</strong> ou <strong>Não</strong> pelo que é mais verdadeiro na{" "}
            <strong>maior parte do tempo</strong>, não só hoje. São {TOTAL} perguntas rápidas.
          </p>
          <p className="text-xs leading-relaxed mb-8" style={{ color: "rgba(247,242,236,0.38)" }}>
            O progresso guarda-se automaticamente neste dispositivo se saíres a meio.
          </p>
          {msgIntro && (
            <div
              className="rounded-xl px-3 py-2.5 text-sm mb-4"
              style={{
                background: "rgba(200,165,107,0.08)",
                border: "1px solid rgba(200,165,107,0.22)",
                color: "rgba(247,242,236,0.85)",
              }}
            >
              {msgIntro}
            </div>
          )}
          <button
            type="button"
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] mb-3"
            style={{
              background: "linear-gradient(135deg, #c8a56b, #8a6a3a)",
              color: "#1a1208",
            }}
            onClick={iniciarOuRecuperar}
          >
            {draftLabel()}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={carregandoUltimo}
            className="w-full py-3 rounded-2xl text-sm font-medium disabled:opacity-45"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(247,242,236,0.85)",
              border: "1px solid rgba(200,165,107,0.2)",
            }}
            onClick={() => void carregarUltimoServidor()}
          >
            {carregandoUltimo ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#c8a56b" }} />
                A carregar…
              </span>
            ) : (
              "Ver o meu último resultado (conta)"
            )}
          </button>
          <p className="text-[11px] mt-2 text-center leading-snug" style={{ color: "rgba(247,242,236,0.35)" }}>
            Só disponível depois de concluíres o questionário pelo menos uma vez com sessão iniciada.
          </p>
        </div>
      </div>
    );
  }

  if (fase === "enviando") {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{ background: bg }}>
        <div className="absolute top-0 left-0 right-0">
          <MobileTopBar titulo="Temperamento" subtitulo="A processar..." />
        </div>
        <div className="absolute top-24 left-0 right-0 px-4 max-w-lg mx-auto">
          <NavBackButton to={TEMP_NAV.hub} label={TEMP_NAV.backLabel} className="mb-0" />
        </div>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  if (!itemAtual || ordemIds.length !== TOTAL) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm" style={{ background: bg, color: "#f7f2ec" }}>
        A carregar…
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: bg }}>
      <MobileTopBar titulo="Temperamento" subtitulo={`${qIndex + 1} de ${TOTAL} · ~3 min`} />
      <div className="max-w-lg mx-auto px-4 pt-8 pb-10">
        <NavBackButton to={TEMP_NAV.hub} label={TEMP_NAV.backLabel} />

        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={voltar} className="text-xs" style={{ color: "rgba(200,165,107,0.65)" }}>
            Voltar
          </button>
          <span className="text-[11px] tabular-nums" style={{ color: "rgba(247,242,236,0.35)" }}>
            {qIndex + 1} / {TOTAL}
          </span>
        </div>

        <div className="h-1.5 rounded-full overflow-hidden mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progresso * 100}%`,
              background: "linear-gradient(90deg, #9c7742, #c8a56b)",
            }}
          />
        </div>

        {erro && (
          <div className="mb-4 space-y-2">
            <p className="text-sm text-red-300">{erro}</p>
            {contarRespostas(answers) === TOTAL && (
              <button
                type="button"
                className="text-xs underline"
                style={{ color: "rgba(200,165,107,0.8)" }}
                onClick={() => void enviar(answers)}
              >
                Tentar enviar de novo
              </button>
            )}
          </div>
        )}

        <div className="space-y-6">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>
            Na maior parte do tempo…
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#f7f2ec", lineHeight: 1.75 }}>
            {itemAtual.texto}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={answers[itemAtual.id] === "sim"}
              onClick={() => escolher("sim")}
              className="py-4 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] min-h-[48px]"
              style={{
                background: answers[itemAtual.id] === "sim" ? "rgba(200,165,107,0.18)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${answers[itemAtual.id] === "sim" ? "rgba(200,165,107,0.45)" : "rgba(200,165,107,0.2)"}`,
                color: "#f7f2ec",
              }}
            >
              Sim
            </button>
            <button
              type="button"
              aria-pressed={answers[itemAtual.id] === "nao"}
              onClick={() => escolher("nao")}
              className="py-4 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] min-h-[48px]"
              style={{
                background: answers[itemAtual.id] === "nao" ? "rgba(200,165,107,0.18)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${answers[itemAtual.id] === "nao" ? "rgba(200,165,107,0.45)" : "rgba(200,165,107,0.2)"}`,
                color: "#f7f2ec",
              }}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
