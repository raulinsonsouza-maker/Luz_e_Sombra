import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, FlaskConical, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import {
  gerarOrdemBlocosPerguntas,
  PERGUNTAS,
  entradaTemperamentoSchema,
  type ItemPergunta,
} from "@workspace/temperamento-v1";

const STORAGE_KEY = "luz_temperamento_v1_draft";

const NOME_DIM: Record<string, string> = {
  ENG: "Energia / ritmo",
  SOC: "Sociabilidade / expressão",
  DOM: "Dominância / controlo",
  EST: "Estabilidade emocional",
  PRO: "Profundidade / análise",
};

const ESCALA = [
  { v: 1, l: "Discordo totalmente" },
  { v: 2, l: "Discordo" },
  { v: 3, l: "Neutro" },
  { v: 4, l: "Concordo" },
  { v: 5, l: "Concordo totalmente" },
] as const;

type Fase = "intro" | "blocos" | "enviando" | "resultado";

type DraftPersist = {
  blocosCodes: string[][];
  answers: Record<string, number>;
  blockIndex: number;
  startedAt: number;
};

function blocosFromCodes(codes: string[][]): ItemPergunta[][] {
  const map = new Map(PERGUNTAS.map((p) => [p.codigo, p]));
  return codes.map((row) => row.map((c) => map.get(c)!));
}

function codesFromBlocos(blocos: ItemPergunta[][]): string[][] {
  return blocos.map((b) => b.map((p) => p.codigo));
}

function isBlocoCompleto(bloco: ItemPergunta[], answers: Record<string, number>): boolean {
  return bloco.every((p) => typeof answers[p.codigo] === "number");
}

export default function TemperamentoPage() {
  const [, navigate] = useLocation();
  const { status } = useAuth();
  const [fase, setFase] = useState<Fase>("intro");
  const [blocos, setBlocos] = useState<ItemPergunta[][]>([]);
  const [blockIndex, setBlockIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [erro, setErro] = useState<string | null>(null);
  const [resultadoApi, setResultadoApi] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
  }, [status, navigate]);

  const iniciarOuRecuperar = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw) as DraftPersist;
        if (
          Array.isArray(d.blocosCodes) &&
          d.blocosCodes.length === 5 &&
          d.blocosCodes.every((row) => row.length === 8)
        ) {
          setBlocos(blocosFromCodes(d.blocosCodes));
          setAnswers(typeof d.answers === "object" && d.answers ? d.answers : {});
          setBlockIndex(Math.min(4, Math.max(0, d.blockIndex ?? 0)));
          setStartedAt(typeof d.startedAt === "number" ? d.startedAt : Date.now());
          setFase("blocos");
          return;
        }
      }
    } catch {
      /* ignore */
    }
    const novo = gerarOrdemBlocosPerguntas();
    setBlocos(novo);
    setAnswers({});
    setBlockIndex(0);
    const t = Date.now();
    setStartedAt(t);
    const draft: DraftPersist = {
      blocosCodes: codesFromBlocos(novo),
      answers: {},
      blockIndex: 0,
      startedAt: t,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
    setFase("blocos");
  }, []);

  const carregarUltimoServidor = useCallback(async () => {
    try {
      const res = await apiFetch("/temperamento/ultimo");
      if (!res.ok) return;
      const row = (await res.json()) as { resultado?: Record<string, unknown> } | null;
      if (row?.resultado?.perfil) {
        setResultadoApi(row.resultado);
        setFase("resultado");
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (fase !== "blocos" || blocos.length === 0) return;
    const draft: DraftPersist = {
      blocosCodes: codesFromBlocos(blocos),
      answers,
      blockIndex,
      startedAt,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [fase, blocos, answers, blockIndex, startedAt]);

  const blocoAtual = blocos[blockIndex];
  const preenchidosNoBloco = useMemo(() => {
    if (!blocoAtual) return 0;
    return blocoAtual.filter((p) => typeof answers[p.codigo] === "number").length;
  }, [blocoAtual, answers]);

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
        setFase("blocos");
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      setResultadoApi(data as Record<string, unknown>);
      setFase("resultado");
    } catch {
      setErro("Falha de rede.");
      setFase("blocos");
    }
  }

  const podeAvancarBloco = blocoAtual && isBlocoCompleto(blocoAtual, answers);

  function avancarBloco() {
    if (!podeAvancarBloco) return;
    if (blockIndex < 4) {
      const ni = blockIndex + 1;
      setBlockIndex(ni);
    } else {
      void enviar();
    }
  }

  function voltarBloco() {
    if (blockIndex <= 0) return;
    setBlockIndex((i) => i - 1);
  }

  const bg = "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)";

  if (fase === "resultado" && resultadoApi) {
    const perfil = resultadoApi.perfil as
      | { tipo?: string; primario?: string; secundario?: string; arquetipo?: string; frase_sintese?: string }
      | undefined;
    const pct = resultadoApi.scores as
      | { temperamentos_percentuais?: Record<string, number> }
      | undefined;
    const rel = resultadoApi.relatorioInterno as
      | { titulo?: string; secoes?: { id: string; titulo: string; paragrafos: string[] }[] }
      | undefined;
    const conf = typeof resultadoApi.confiabilidade === "number" ? resultadoApi.confiabilidade : null;
    const qf = resultadoApi.quality_flag as string | undefined;
    const alertas = (resultadoApi.alertas as string[] | undefined) ?? [];

    return (
      <div className="min-h-screen pb-28 px-4 pt-6" style={{ background: bg }}>
        <div className="max-w-lg mx-auto space-y-6">
          <button
            type="button"
            className="text-sm opacity-70 hover:opacity-100"
            style={{ color: "#c8a56b" }}
            onClick={() => navigate("/jornada")}
          >
            Voltar à jornada
          </button>
          <h1 className="font-tan-mon-cheri text-2xl" style={{ color: "#f7f2ec" }}>
            {rel?.titulo ?? perfil?.arquetipo ?? "O teu temperamento"}
          </h1>
          {perfil?.frase_sintese && (
            <p className="text-sm italic opacity-90" style={{ color: "rgba(247,242,236,0.75)" }}>
              {perfil.frase_sintese}
            </p>
          )}
          <div className="rounded-2xl p-4 space-y-2" style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.25)" }}>
            <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(200,165,107,0.7)" }}>
              Percentuais
            </p>
            {pct?.temperamentos_percentuais &&
              Object.entries(pct.temperamentos_percentuais).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm" style={{ color: "#f7f2ec" }}>
                  <span>{k}</span>
                  <span className="font-semibold">{v}%</span>
                </div>
              ))}
            {perfil?.tipo && (
              <p className="text-sm mt-2" style={{ color: "rgba(247,242,236,0.65)" }}>
                Tipo de perfil: <strong>{perfil.tipo}</strong> · Primário {perfil.primario} · Secundário {perfil.secundario}
              </p>
            )}
          </div>
          {conf !== null && (
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.55)" }}>
              Índice de confiabilidade: <strong>{conf}</strong>/100
            </p>
          )}
          {(qf && qf !== "OK") || alertas.length > 0 ? (
            <div className="rounded-xl p-3 text-sm" style={{ background: "rgba(180,80,80,0.12)", color: "#f0d0d0" }}>
              {qf && qf !== "OK" && <p>Qualidade das respostas: {qf}</p>}
              {alertas.map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
          ) : null}
          <div className="space-y-6 pt-2">
            {rel?.secoes?.map((sec) => (
              <section key={sec.id}>
                <h2 className="text-sm font-bold tracking-wide mb-2" style={{ color: "#c8a56b" }}>
                  {sec.titulo}
                </h2>
                <div className="space-y-2 text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.82)" }}>
                  {sec.paragrafos.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <button
            type="button"
            className="w-full py-3 rounded-xl font-medium"
            style={{ background: "#c8a56b", color: "#1e1812" }}
            onClick={() => {
              setResultadoApi(null);
              setFase("intro");
              setBlocos([]);
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
      <div className="min-h-screen pb-28 px-4 pt-8 flex flex-col" style={{ background: bg }}>
        <div className="max-w-lg mx-auto flex-1 flex flex-col">
          <FlaskConical className="w-12 h-12 mb-4 mx-auto" style={{ color: "#c8a56b" }} />
          <h1 className="font-tan-mon-cheri text-2xl text-center mb-3" style={{ color: "#f7f2ec" }}>
            Análise de temperamento
          </h1>
          <p className="text-sm text-center mb-6 leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
            40 afirmações em escala de 1 a 5. Os blocos são temáticos (5 temas de 8 perguntas); a ordem dos temas varia a
            cada sessão. Responde com honestidade — não existem respostas certas ou erradas.
          </p>
          <div className="mt-auto space-y-3">
            <button
              type="button"
              className="w-full py-3.5 rounded-xl font-semibold"
              style={{ background: "#c8a56b", color: "#1e1812" }}
              onClick={iniciarOuRecuperar}
            >
              Começar
            </button>
            <button
              type="button"
              className="w-full py-2.5 rounded-xl text-sm"
              style={{ background: "rgba(255,255,255,0.06)", color: "#f7f2ec" }}
              onClick={() => void carregarUltimoServidor()}
            >
              Ver última análise guardada
            </button>
            <button type="button" className="w-full py-2 text-sm opacity-70" style={{ color: "#f7f2ec" }} onClick={() => navigate("/jornada")}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (fase === "enviando") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  if (!blocoAtual) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm" style={{ background: bg, color: "#f7f2ec" }}>
        A carregar…
      </div>
    );
  }

  const dimNome = NOME_DIM[blocoAtual[0]!.dimensao] ?? blocoAtual[0]!.dimensao;

  return (
    <div className="min-h-screen pb-32 px-4 pt-6" style={{ background: bg }}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button type="button" className="text-sm flex items-center gap-1 opacity-80" style={{ color: "#c8a56b" }} onClick={() => navigate("/jornada")}>
            <ArrowLeft className="w-4 h-4" /> Jornada
          </button>
          <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>
            Bloco {blockIndex + 1} / 5
          </span>
        </div>
        <div className="h-2 rounded-full mb-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full transition-all rounded-full"
            style={{
              width: `${((blockIndex + preenchidosNoBloco / 8) / 5) * 100}%`,
              background: "linear-gradient(90deg, #9c7742, #c8a56b)",
            }}
          />
        </div>
        <p className="text-xs mb-6" style={{ color: "rgba(247,242,236,0.45)" }}>
          {dimNome} · {preenchidosNoBloco}/8 neste bloco
        </p>
        {erro && <p className="text-sm mb-4 text-red-300">{erro}</p>}

        <div className="space-y-6">
          {blocoAtual.map((p) => (
            <div
              key={p.codigo}
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-[10px] font-bold tracking-wider mb-2" style={{ color: "rgba(200,165,107,0.55)" }}>
                {p.codigo}
              </p>
              <p className="text-sm mb-3 leading-snug" style={{ color: "#f7f2ec" }}>
                {p.texto}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ESCALA.map(({ v, l }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setResposta(p.codigo, v)}
                    className="flex-1 min-w-[52px] py-2 px-1 rounded-lg text-[10px] leading-tight transition-all"
                    style={{
                      background: answers[p.codigo] === v ? "rgba(200,165,107,0.25)" : "rgba(255,255,255,0.04)",
                      border: answers[p.codigo] === v ? "1px solid #c8a56b" : "1px solid rgba(255,255,255,0.08)",
                      color: answers[p.codigo] === v ? "#f7f2ec" : "rgba(247,242,236,0.55)",
                    }}
                  >
                    <span className="block font-bold mb-0.5">{v}</span>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 pt-2 max-w-lg mx-auto flex gap-2" style={{ background: "linear-gradient(transparent, #1e1812 40%)" }}>
          {blockIndex > 0 && (
            <button
              type="button"
              onClick={voltarBloco}
              className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
              style={{ background: "rgba(255,255,255,0.06)", color: "#f7f2ec" }}
            >
              <ArrowLeft className="w-4 h-4" /> Anterior
            </button>
          )}
          <button
            type="button"
            disabled={!podeAvancarBloco}
            onClick={avancarBloco}
            className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-35"
            style={{ background: "#c8a56b", color: "#1e1812" }}
          >
            {blockIndex < 4 ? (
              <>
                Seguinte <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              "Concluir e ver resultado"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
