import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowRight, FlaskConical, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import PageIntroHeader from "@/components/PageIntroHeader";
import { JORNADA_MODULE_NAV } from "@/lib/jornadaHubConfig";
import TemperamentoPainelResultado from "@/pages/temperamento/TemperamentoPainelResultado";
import type { ResultadoTemperamentoUi } from "@/pages/temperamento/enriquecerResultado";
import {
  gerarOrdemBlocosPerguntas,
  PERGUNTAS,
  entradaTemperamentoSchema,
  type ItemPergunta,
} from "@workspace/temperamento-v1";

const STORAGE_KEY = "luz_temperamento_v1_draft";
const TOTAL = 40;
const TEMP_NAV = JORNADA_MODULE_NAV.temperamento;

const NOME_DIM: Record<string, string> = {
  ENG: "Energia e ritmo",
  SOC: "Sociabilidade e expressão",
  DOM: "Dominância e controlo",
  EST: "Estabilidade emocional",
  PRO: "Profundidade e análise",
};

const ESCALA_EXTREMOS = {
  um: "Discordo totalmente",
  cinco: "Concordo totalmente",
} as const;

type Fase = "intro" | "perguntas" | "enviando" | "resultado";

type DraftPersist = {
  blocosCodes: string[][];
  answers: Record<string, number>;
  /** Índice global 0–39 na ordem dos blocos (preferido) */
  qIndex?: number;
  /** Legado: bloco 0–4 (migrado para qIndex ao carregar) */
  blockIndex?: number;
  startedAt: number;
};

function blocosFromCodes(codes: string[][]): ItemPergunta[][] {
  const map = new Map(PERGUNTAS.map((p) => [p.codigo, p]));
  return codes.map((row) => row.map((c) => map.get(c)!));
}

function codesFromBlocos(blocos: ItemPergunta[][]): string[][] {
  return blocos.map((b) => b.map((p) => p.codigo));
}

function flatFromBlocos(blocos: ItemPergunta[][]): ItemPergunta[] {
  return blocos.flat();
}

function primeiroIndiceSemResposta(flat: ItemPergunta[], answers: Record<string, number>): number {
  const i = flat.findIndex((p) => typeof answers[p.codigo] !== "number");
  return i === -1 ? Math.max(0, flat.length - 1) : i;
}

function migrarQIndex(d: DraftPersist, flat: ItemPergunta[]): number {
  if (typeof d.qIndex === "number" && d.qIndex >= 0 && d.qIndex < flat.length) return d.qIndex;
  if (typeof d.blockIndex === "number") {
    const b = Math.min(4, Math.max(0, d.blockIndex));
    return Math.min(flat.length - 1, b * 8);
  }
  return primeiroIndiceSemResposta(flat, d.answers ?? {});
}

export default function TemperamentoPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { status } = useAuth();
  const [fase, setFase] = useState<Fase>("intro");
  const [blocos, setBlocos] = useState<ItemPergunta[][]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [erro, setErro] = useState<string | null>(null);
  const [resultadoApi, setResultadoApi] = useState<ResultadoTemperamentoUi | null>(null);
  const [carregandoUltimo, setCarregandoUltimo] = useState(false);
  const [msgIntro, setMsgIntro] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
  }, [status, navigate]);

  const flatPerguntas = useMemo(() => flatFromBlocos(blocos), [blocos]);
  const perguntaAtual = flatPerguntas[qIndex];
  const progresso = fase === "perguntas" && flatPerguntas.length === TOTAL ? (qIndex + 1) / TOTAL : 0;
  const respostaAtual = perguntaAtual ? answers[perguntaAtual.codigo] : undefined;
  const podeAvancar = typeof respostaAtual === "number";

  const iniciarOuRecuperar = useCallback(() => {
    setMsgIntro(null);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw) as DraftPersist;
        if (
          Array.isArray(d.blocosCodes) &&
          d.blocosCodes.length === 5 &&
          d.blocosCodes.every((row) => row.length === 8)
        ) {
          const b = blocosFromCodes(d.blocosCodes);
          const flat = flatFromBlocos(b);
          setBlocos(b);
          setAnswers(typeof d.answers === "object" && d.answers ? d.answers : {});
          setQIndex(migrarQIndex(d, flat));
          setStartedAt(typeof d.startedAt === "number" ? d.startedAt : Date.now());
          setFase("perguntas");
          return;
        }
      }
    } catch {
      /* ignore */
    }
    const novo = gerarOrdemBlocosPerguntas();
    setBlocos(novo);
    setAnswers({});
    setQIndex(0);
    const t = Date.now();
    setStartedAt(t);
    const draft: DraftPersist = {
      blocosCodes: codesFromBlocos(novo),
      answers: {},
      qIndex: 0,
      startedAt: t,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
    setFase("perguntas");
  }, []);

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
      const novo = gerarOrdemBlocosPerguntas();
      setBlocos(novo);
      setAnswers({});
      setQIndex(0);
      setStartedAt(Date.now());
      setFase("perguntas");
    }
  }, [status, search, carregarUltimoServidor]);

  useEffect(() => {
    if (fase !== "perguntas" || blocos.length === 0) return;
    const draft: DraftPersist = {
      blocosCodes: codesFromBlocos(blocos),
      answers,
      qIndex,
      startedAt,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [fase, blocos, answers, qIndex, startedAt]);

  function setResposta(codigo: string, valor: number) {
    setAnswers((prev) => ({ ...prev, [codigo]: valor }));
  }

  async function enviar() {
    const parsed = entradaTemperamentoSchema.safeParse({
      answers,
      metadata: {
        tempo_total_segundos: Math.max(0, Math.floor((Date.now() - startedAt) / 1000)),
        idioma: "pt-BR",
        versao_questionario: "1.0",
      },
    });
    if (!parsed.success) {
      setErro("Respostas incompletas ou inválidas.");
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
        setErro((data as { error?: string }).error ?? "Erro ao enviar.");
        setFase("perguntas");
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      setResultadoApi(data as ResultadoTemperamentoUi);
      setFase("resultado");
    } catch {
      setErro("Falha de rede.");
      setFase("perguntas");
    }
  }

  function avancar() {
    if (!podeAvancar || flatPerguntas.length !== TOTAL) return;
    if (qIndex < TOTAL - 1) {
      setQIndex((i) => i + 1);
      return;
    }
    void enviar();
  }

  function voltar() {
    if (qIndex > 0) {
      setQIndex((i) => i - 1);
      return;
    }
    setFase("intro");
  }

  const bg = "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)";

  if (fase === "resultado" && resultadoApi) {
    const qf = resultadoApi.quality_flag as string | undefined;
    const alertas = (resultadoApi.alertas as string[] | undefined) ?? [];

    return (
      <div className="min-h-screen pb-28 md:pb-12 px-4 pt-6" style={{ background: bg }}>
        <MobileTopBar titulo="Temperamento" subtitulo="Seu mapa temperamental" />
        <div className="max-w-lg md:max-w-2xl mx-auto space-y-6">
          <NavBackButton to={TEMP_NAV.hub} label={TEMP_NAV.backLabel} />

          <PageIntroHeader
            className="hidden md:block mb-2"
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
              setBlocos([]);
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
        <MobileTopBar titulo="Temperamento" subtitulo="Cinco dimensões, quarenta reflexões" />
        <div className="max-w-lg mx-auto px-4 pt-8 pb-10">
          <NavBackButton to={TEMP_NAV.hub} label={TEMP_NAV.backLabel} />
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.55)" }}>
            Análise de temperamento
          </p>
          <h1 className="font-tan-mon-cheri text-2xl mb-4" style={{ color: "#f7f2ec" }}>
            Cinco dimensões, quarenta reflexões
          </h1>
          <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(247,242,236,0.55)" }}>
            Você verá <strong>uma afirmação de cada vez</strong>, numa escala de 1 a 5. A ordem dos temas muda em cada sessão.
            Não há respostas certas: o importante é o que é verdade para ti na maior parte do tempo.
          </p>
          <p className="text-xs leading-relaxed mb-8" style={{ color: "rgba(247,242,236,0.38)" }}>
            O progresso guarda-se automaticamente neste dispositivo se saíres a meio.
          </p>
          {msgIntro && (
            <div
              className="rounded-xl px-3 py-2.5 text-sm mb-4"
              style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.22)", color: "rgba(247,242,236,0.85)" }}
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
            {(() => {
              try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                  const d = JSON.parse(raw) as DraftPersist;
                  if (Array.isArray(d.blocosCodes) && d.blocosCodes.length === 5) {
                    return "Continuar onde parei";
                  }
                }
              } catch {
                /* ignore */
              }
              return "Começar";
            })()}
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

  if (!perguntaAtual || flatPerguntas.length !== TOTAL) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm" style={{ background: bg, color: "#f7f2ec" }}>
        A carregar…
      </div>
    );
  }

  const dimNome = NOME_DIM[perguntaAtual.dimensao] ?? perguntaAtual.dimensao;
  const noBloco = (qIndex % 8) + 1;

  return (
    <div className="min-h-screen pb-28" style={{ background: bg }}>
      <MobileTopBar titulo="Temperamento" subtitulo={`${qIndex + 1} de ${TOTAL}`} />
      <div className="max-w-lg mx-auto px-4 pt-8 pb-10">
        <NavBackButton to={TEMP_NAV.hub} label={TEMP_NAV.backLabel} />
        <div className="mb-6" style={{ borderBottom: "1px solid rgba(200,165,107,0.12)" }}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-xs" style={{ color: "rgba(200,165,107,0.45)" }}>
              {qIndex + 1} / {TOTAL}
            </p>
            <span
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{ color: "rgba(200,165,107,0.85)", background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.2)" }}
            >
              {dimNome}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progresso * 100}%`,
                background: "linear-gradient(90deg, #9c7742, #c8a56b)",
              }}
            />
          </div>
          <p className="text-[10px] mb-3" style={{ color: "rgba(247,242,236,0.35)" }}>
            Pergunta {noBloco} de 8 neste tema · marca o grau em que a frase te descreve
          </p>
        </div>

        {erro && <p className="text-sm mb-4 text-red-300">{erro}</p>}

        <div className="space-y-6">
          <h2 className="font-tan-mon-cheri text-lg leading-snug" style={{ color: "#f7f2ec" }}>
            {perguntaAtual.texto}
          </h2>
          <div>
            <p className="text-xs mb-2" style={{ color: "rgba(200,165,107,0.65)" }}>
              Quanto concordas com esta afirmação?
            </p>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setResposta(perguntaAtual.codigo, v)}
                  className="py-3 rounded-xl text-sm font-bold leading-tight"
                  style={{
                    background: respostaAtual === v ? "rgba(200,165,107,0.25)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${respostaAtual === v ? "rgba(200,165,107,0.45)" : "rgba(255,255,255,0.08)"}`,
                    color: respostaAtual === v ? "#c8a56b" : "rgba(247,242,236,0.5)",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="text-[10px] mt-2 leading-snug" style={{ color: "rgba(247,242,236,0.35)" }}>
              1 = {ESCALA_EXTREMOS.um} · 5 = {ESCALA_EXTREMOS.cinco}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-10">
          <button
            type="button"
            onClick={voltar}
            className="flex-1 py-3 rounded-xl text-sm"
            style={{ color: "rgba(200,165,107,0.75)", border: "1px solid rgba(200,165,107,0.2)" }}
          >
            Voltar
          </button>
          <button
            type="button"
            disabled={!podeAvancar}
            onClick={avancar}
            className="flex-1 py-3 rounded-xl text-sm font-semibold disabled:opacity-35 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #c8a56b, #8a6a3a)",
              color: "#1a1208",
            }}
          >
            {qIndex >= TOTAL - 1 ? "Concluir" : "Seguinte"}
            {qIndex < TOTAL - 1 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
