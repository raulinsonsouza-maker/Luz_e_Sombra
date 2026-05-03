import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowRight, CheckCircle2, Heart, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  computarDiagnostico30,
  entradaDiagnostico30Schema,
  PERGUNTAS_PASSADO_PRESENTE,
  PERGUNTAS_CONSCIENCIA,
  ESCALA_PASSADO_LABELS,
  ESCALA_PRESENTE_LABELS,
  ESCALA_CONSCIENCIA_LABELS,
} from "@workspace/traco-diagnostico-emocional";
import {
  isDiagnostico30RespostasCompletas,
  parsePessoaIdFromSearch,
  readDiagnostico30RespostasEntrada,
  storageKeyDiagnostico30,
  tracoQueryPessoa,
} from "@/lib/tracoFormStorage";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("luz_e_sombra_token");
  return fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
}

const LABEL_PADRAO: Record<string, string> = {
  vinculo: "Conexão e vínculo",
  controle: "Controle interno",
  estrategia: "Estratégia e adaptação",
  retencao: "Retenção emocional",
  desconexao: "Desconexão e proteção",
};

type Fase = "intro" | "perguntas" | "resultado";

export default function DiagnosticoEmocionalPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const pessoaId = useMemo(() => parsePessoaIdFromSearch(search), [search]);
  const storageKey = useMemo(() => storageKeyDiagnostico30(pessoaId), [pessoaId]);
  const { status } = useAuth();
  const [fase, setFase] = useState<Fase>("intro");
  const [idx, setIdx] = useState(0);
  const [passado, setPassado] = useState<number[]>(() => Array(25).fill(0));
  const [presente, setPresente] = useState<number[]>(() => Array(25).fill(0));
  const [consciencia, setConsciencia] = useState<number[]>(() => Array(5).fill(0));
  const [computado, setComputado] = useState<ReturnType<typeof computarDiagnostico30> | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
  }, [status, navigate]);

  const carregarPersistido = useCallback(async () => {
    try {
      const localEnt = readDiagnostico30RespostasEntrada(pessoaId);
      if (localEnt) {
        setPassado([...localEnt.passado]);
        setPresente([...localEnt.presente]);
        setConsciencia([...localEnt.consciencia]);
        if (isDiagnostico30RespostasCompletas(localEnt)) {
          setComputado(computarDiagnostico30(localEnt));
          setFase("resultado");
        }
        return;
      }
      if (pessoaId !== null) return;
      const res = await apiFetch("/diagnostico-emocional/ultimo");
      if (!res.ok) return;
      const row = (await res.json()) as { respostas?: unknown } | null;
      if (!row?.respostas) return;
      const r = entradaDiagnostico30Schema.safeParse(row.respostas);
      if (!r.success) return;
      setPassado([...r.data.passado]);
      setPresente([...r.data.presente]);
      setConsciencia([...r.data.consciencia]);
      if (isDiagnostico30RespostasCompletas(r.data)) {
        setComputado(computarDiagnostico30(r.data));
        setFase("resultado");
      }
    } catch {
      /* ignore */
    }
  }, [pessoaId]);

  useEffect(() => {
    setFase("intro");
    setIdx(0);
    setComputado(null);
    void carregarPersistido();
  }, [storageKey, carregarPersistido]);

  const totalPerguntas = 30;
  const progresso =
    fase === "intro" ? 0 : fase === "resultado" ? 1 : (idx + 1) / totalPerguntas;

  const isDual = idx < 25;
  const podeAvancar = isDual
    ? passado[idx]! >= 1 && passado[idx]! <= 5 && presente[idx]! >= 1 && presente[idx]! <= 5
    : consciencia[idx - 25]! >= 1 && consciencia[idx - 25]! <= 5;

  function avancar() {
    if (!podeAvancar) return;
    if (idx < 29) {
      setIdx((i) => i + 1);
      return;
    }
    const ent = { passado, presente, consciencia };
    const parsed = entradaDiagnostico30Schema.safeParse(ent);
    if (!parsed.success) return;
    const comp = computarDiagnostico30(parsed.data);
    setComputado(comp);
    const payload = { respostas: parsed.data, resultado: comp.diagnosticoEmocional };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    void apiFetch("/diagnostico-emocional", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    }).catch(() => {});
    setFase("resultado");
  }

  function voltar() {
    if (idx > 0) setIdx((i) => i - 1);
    else setFase("intro");
  }

  const tagInfo = (tag: string) => {
    if (tag === "integrado") return { emoji: "🟢", label: "Integrado", cor: "#5db97a" };
    if (tag === "inconsciente") return { emoji: "🔴", label: "Inconsciente", cor: "#c06fbf" };
    return { emoji: "🟡", label: "Em processo", cor: "#c8a56b" };
  };

  return (
    <div className="min-h-screen pb-28" style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}>
      <div className="max-w-lg mx-auto px-4 pt-8 pb-10">
        {fase === "intro" && (
          <section>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.55)" }}>
              Diagnóstico Emocional
            </p>
            <h1 className="font-tan-mon-cheri text-2xl mb-4" style={{ color: "#f7f2ec" }}>
              Antes de olhar o corpo, o contexto emocional
            </h1>
            {pessoaId !== null && (
              <p
                className="text-xs mb-4 rounded-lg px-3 py-2"
                style={{
                  color: "rgba(200,165,107,0.95)",
                  background: "rgba(200,165,107,0.08)",
                  border: "1px solid rgba(200,165,107,0.22)",
                }}
              >
                Estas <strong>30 respostas</strong> ficam guardadas só para esta pessoa no Traço de Caráter (não se misturam com o teu &quot;Eu&quot; nem com outras análises).
              </p>
            )}
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(247,242,236,0.55)" }}>
              Este diagnóstico vai te ajudar a entender seus padrões emocionais e seu momento atual.
              Leva menos de 3 minutos para responder.
            </p>
            <button
              type="button"
              onClick={() => {
                setFase("perguntas");
                setIdx(0);
              }}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #c8a56b, #8a6a3a)",
                color: "#1a1208",
              }}
            >
              Começar
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        )}

        {fase === "perguntas" && (
          <>
            <div className="mb-6" style={{ borderBottom: "1px solid rgba(200,165,107,0.12)" }}>
              <p className="text-xs mb-2" style={{ color: "rgba(200,165,107,0.45)" }}>
                {idx + 1} / {totalPerguntas}
              </p>
              <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progresso * 100}%`,
                    background: "linear-gradient(90deg, #7a9e6a, #c8a56b)",
                  }}
                />
              </div>
            </div>

            {isDual ? (
              <div className="space-y-6">
                <h2 className="font-tan-mon-cheri text-lg leading-snug" style={{ color: "#f7f2ec" }}>
                  {PERGUNTAS_PASSADO_PRESENTE[idx]}
                </h2>
                <div>
                  <p className="text-xs mb-2" style={{ color: "rgba(200,165,107,0.65)" }}>
                    Como isso era na sua vida (principalmente no passado ou infância)?
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={`p-${v}`}
                        type="button"
                        onClick={() => setPassado((a) => {
                          const n = [...a];
                          n[idx] = v;
                          return n;
                        })}
                        className="py-3 rounded-xl text-sm font-bold"
                        style={{
                          background: passado[idx] === v ? "rgba(200,165,107,0.25)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${passado[idx] === v ? "rgba(200,165,107,0.45)" : "rgba(255,255,255,0.08)"}`,
                          color: passado[idx] === v ? "#c8a56b" : "rgba(247,242,236,0.5)",
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] mt-2 leading-snug" style={{ color: "rgba(247,242,236,0.35)" }}>
                    1 = {ESCALA_PASSADO_LABELS[0]} · 5 = {ESCALA_PASSADO_LABELS[4]}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-2" style={{ color: "rgba(200,165,107,0.65)" }}>
                    Como isso está na sua vida hoje?
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={`r-${v}`}
                        type="button"
                        onClick={() => setPresente((a) => {
                          const n = [...a];
                          n[idx] = v;
                          return n;
                        })}
                        className="py-3 rounded-xl text-sm font-bold leading-tight"
                        style={{
                          background: presente[idx] === v ? "rgba(200,165,107,0.25)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${presente[idx] === v ? "rgba(200,165,107,0.45)" : "rgba(255,255,255,0.08)"}`,
                          color: presente[idx] === v ? "#c8a56b" : "rgba(247,242,236,0.5)",
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] mt-2 leading-snug" style={{ color: "rgba(247,242,236,0.35)" }}>
                    1 = {ESCALA_PRESENTE_LABELS[0]} · 5 = {ESCALA_PRESENTE_LABELS[4]}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-tan-mon-cheri text-lg leading-snug" style={{ color: "#f7f2ec" }}>
                  {PERGUNTAS_CONSCIENCIA[idx - 25]}
                </h2>
                <p className="text-xs" style={{ color: "rgba(200,165,107,0.65)" }}>
                  Sobre seu nível de consciência emocional hoje:
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setConsciencia((a) => {
                        const n = [...a];
                        n[idx - 25] = v;
                        return n;
                      })}
                      className="py-3 rounded-xl text-sm font-bold leading-tight"
                      style={{
                        background: consciencia[idx - 25] === v ? "rgba(200,165,107,0.25)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${consciencia[idx - 25] === v ? "rgba(200,165,107,0.45)" : "rgba(255,255,255,0.08)"}`,
                        color: consciencia[idx - 25] === v ? "#c8a56b" : "rgba(247,242,236,0.5)",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] mt-2" style={{ color: "rgba(247,242,236,0.35)" }}>
                  1 = {ESCALA_CONSCIENCIA_LABELS[0]} · 5 = {ESCALA_CONSCIENCIA_LABELS[4]}
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
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
                className="flex-1 py-3 rounded-xl text-sm font-semibold disabled:opacity-35"
                style={{
                  background: "linear-gradient(135deg, #c8a56b, #8a6a3a)",
                  color: "#1a1208",
                }}
              >
                {idx >= 29 ? "Concluir" : "Seguinte"}
              </button>
            </div>
          </>
        )}

        {fase === "resultado" && computado && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-6 h-6" style={{ color: "#5db97a" }} />
              <h1 className="font-tan-mon-cheri text-2xl" style={{ color: "#f7f2ec" }}>
                Seu mapa emocional
              </h1>
            </div>
            {(() => {
              const t = tagInfo(computado.diagnosticoEmocional.tagEvolucao);
              return (
                <div
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: "rgba(200,165,107,0.5)" }}>
                      Nível de evolução (automático)
                    </p>
                    <p className="font-semibold" style={{ color: t.cor }}>
                      {t.label}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.4)" }}>
                      Consciência média: {computado.diagnosticoEmocional.mediaConsciencia.toFixed(1)} / 5
                    </p>
                  </div>
                </div>
              );
            })()}

            <div
              className="rounded-2xl p-4 space-y-3"
              style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.15)" }}
            >
              <p className="text-xs uppercase tracking-wider flex items-center gap-2" style={{ color: "rgba(200,165,107,0.55)" }}>
                <Heart className="w-3.5 h-3.5" /> Perfil (pesos integrados)
              </p>
              {Object.entries(computado.diagnosticoEmocional.padroesPct)
                .sort((a, b) => b[1] - a[1])
                .map(([k, pct]) => (
                  <div key={k}>
                    <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(247,242,236,0.55)" }}>
                      <span>{LABEL_PADRAO[k] ?? k}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg, #8a9ec4, #c8a56b)" }}
                      />
                    </div>
                  </div>
                ))}
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
              Este resultado entra na análise de <strong style={{ color: "rgba(200,165,107,0.85)" }}>Traço de Caráter</strong>{" "}
              quando houver fotos: as percentagens finais combinam o que o corpo mostra com o que você declarou aqui.
            </p>

            <button
              type="button"
              onClick={() => navigate(`/traco-de-carater${tracoQueryPessoa(pessoaId)}`)}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #c8a56b, #8a6a3a)",
                color: "#1a1208",
              }}
            >
              <Sparkles className="w-4 h-4" />
              Ir para Traço de Caráter
            </button>
            <button
              type="button"
              onClick={() => {
                setPassado(Array(25).fill(0));
                setPresente(Array(25).fill(0));
                setConsciencia(Array(5).fill(0));
                setComputado(null);
                setIdx(0);
                setFase("intro");
                try {
                  localStorage.removeItem(storageKey);
                } catch {
                  /* ignore */
                }
              }}
              className="w-full py-2 text-xs"
              style={{ color: "rgba(224,123,57,0.65)" }}
            >
              Refazer do zero
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
