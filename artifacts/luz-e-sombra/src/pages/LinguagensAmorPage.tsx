import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import MobileTopBar from "@/components/MobileTopBar";
import {
  PARES_FORCADOS,
  entradaLinguagensAmorSchema,
  LABEL_LINGUAGEM,
} from "@workspace/cinco-linguagens-amor";

const STORAGE_KEY = "luz_linguagens_amor_v1_draft";
const TOTAL = 30;

type Fase = "intro" | "perguntas" | "enviando" | "resultado";

type DraftPersist = {
  answers: Record<string, "a" | "b">;
  qIndex: number;
  startedAt: number;
};

export default function LinguagensAmorPage() {
  const [, navigate] = useLocation();
  const { status } = useAuth();
  const [fase, setFase] = useState<Fase>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "a" | "b">>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [erro, setErro] = useState<string | null>(null);
  const [resultadoApi, setResultadoApi] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
  }, [status, navigate]);

  const parAtual = PARES_FORCADOS[qIndex];
  const progresso = fase === "perguntas" ? (qIndex + 1) / TOTAL : 0;

  const iniciarOuRecuperar = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw) as DraftPersist;
        if (d.answers && typeof d.qIndex === "number") {
          setAnswers(typeof d.answers === "object" ? d.answers : {});
          setQIndex(Math.min(TOTAL - 1, Math.max(0, d.qIndex)));
          setStartedAt(typeof d.startedAt === "number" ? d.startedAt : Date.now());
          setFase("perguntas");
          return;
        }
      }
    } catch {
      /* ignore */
    }
    const t = Date.now();
    setAnswers({});
    setQIndex(0);
    setStartedAt(t);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: {}, qIndex: 0, startedAt: t } satisfies DraftPersist));
    } catch {
      /* ignore */
    }
    setFase("perguntas");
  }, []);

  useEffect(() => {
    if (fase !== "perguntas") return;
    const draft: DraftPersist = { answers, qIndex, startedAt };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [fase, answers, qIndex, startedAt]);

  function escolher(lado: "a" | "b") {
    if (!parAtual) return;
    setAnswers((prev) => ({ ...prev, [parAtual.id]: lado }));
    if (qIndex < TOTAL - 1) {
      setQIndex((i) => i + 1);
      return;
    }
    void enviar({ ...answers, [parAtual.id]: lado });
  }

  async function enviar(ans: Record<string, "a" | "b">) {
    const parsed = entradaLinguagensAmorSchema.safeParse({
      answers: ans,
      metadata: {
        tempo_total_segundos: Math.max(0, Math.floor((Date.now() - startedAt) / 1000)),
        idioma: "pt-BR",
        versao_questionario: "1.0",
      },
    });
    if (!parsed.success) {
      setErro("Respostas incompletas.");
      return;
    }
    setErro(null);
    setFase("enviando");
    try {
      const res = await apiFetch("/linguagens-amor", {
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
      setResultadoApi(data as Record<string, unknown>);
      setFase("resultado");
    } catch {
      setErro("Falha de rede.");
      setFase("perguntas");
    }
  }

  function voltar() {
    if (qIndex > 0) {
      setQIndex((i) => i - 1);
      return;
    }
    setFase("intro");
  }

  const rankingDisplay = useMemo(() => {
    const r = resultadoApi?.ranking as { linguagem?: string; pontos?: number; pct?: number }[] | undefined;
    return Array.isArray(r) ? r : [];
  }, [resultadoApi]);

  const bg = "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)";

  if (fase === "resultado" && resultadoApi) {
    const principal = String(resultadoApi.principal ?? "");
    const sec = String(resultadoApi.secundaria ?? "");
    return (
      <div className="min-h-screen pb-28 px-4 pt-6" style={{ background: bg }}>
        <MobileTopBar titulo="Linguagens do amor" subtitulo="As tuas escolhas" />
        <div className="max-w-lg mx-auto space-y-6">
          <button
            type="button"
            onClick={() => navigate("/jornada/linguagens-amor")}
            className="text-sm opacity-70 hover:opacity-100"
            style={{ color: "#c8a56b" }}
          >
            Voltar ao módulo (intro + minicurso)
          </button>
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
            <Heart className="w-10 h-10 mb-4" style={{ color: "#c8a56b" }} />
            <h1 className="font-tan-mon-cheri text-2xl mb-2" style={{ color: "#f7f2ec" }}>
              As tuas linguagens do amor
            </h1>
            <p className="text-sm mb-4" style={{ color: "rgba(247,242,236,0.55)" }}>
              Principal: <strong style={{ color: "#f7f2ec" }}>{LABEL_LINGUAGEM[principal as keyof typeof LABEL_LINGUAGEM] ?? principal}</strong>
              {" · "}
              Secundária:{" "}
              <strong style={{ color: "#f7f2ec" }}>{LABEL_LINGUAGEM[sec as keyof typeof LABEL_LINGUAGEM] ?? sec}</strong>
            </p>
            {rankingDisplay.length > 0 && (
              <ul className="space-y-2 text-sm" style={{ color: "rgba(247,242,236,0.65)" }}>
                {rankingDisplay.map((row) => (
                  <li key={String(row.linguagem)} className="flex justify-between gap-2">
                    <span>{LABEL_LINGUAGEM[(row.linguagem ?? "") as keyof typeof LABEL_LINGUAGEM] ?? row.linguagem}</span>
                    <span className="tabular-nums opacity-80">{row.pontos} pts ({row.pct}%)</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-sm mt-5 leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(247,242,236,0.55)" }}>
              {String(resultadoApi.interpretacaoPar ?? resultadoApi.interpretacaoPrincipal ?? "")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (fase === "enviando") {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center px-4" style={{ background: bg }}>
        <div className="absolute top-0 left-0 right-0">
          <MobileTopBar titulo="Linguagens do amor" subtitulo="A guardar…" />
        </div>
        <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: "#c8a56b" }} />
        <p className="text-sm" style={{ color: "rgba(247,242,236,0.5)" }}>
          A guardar a tua análise…
        </p>
      </div>
    );
  }

  if (fase === "intro") {
    return (
      <div className="min-h-screen pb-28 px-4 pt-8" style={{ background: bg }}>
        <MobileTopBar titulo="5 Linguagens do Amor" subtitulo="Questionário de pares" />
        <div className="max-w-lg mx-auto">
          <Heart className="w-12 h-12 mb-6 hidden md:block" style={{ color: "#c8a56b" }} />
          <h1 className="font-tan-mon-cheri text-3xl mb-4 hidden md:block" style={{ color: "#f7f2ec" }}>
            5 Linguagens do Amor
          </h1>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(247,242,236,0.55)" }}>
            Em cada par, escolhe a frase que mais te representa. São {TOTAL} escolhas — não há certo ou errado, apenas o teu
            jeito de dar e receber afeto.
          </p>
          <button
            type="button"
            onClick={iniciarOuRecuperar}
            className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
          >
            Começar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 px-4 pt-6" style={{ background: bg }}>
      <MobileTopBar titulo="Linguagens do amor" subtitulo={`${qIndex + 1} de ${TOTAL}`} />
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={voltar} className="text-xs" style={{ color: "rgba(200,165,107,0.65)" }}>
            Voltar
          </button>
          <span className="text-[11px] tabular-nums" style={{ color: "rgba(247,242,236,0.35)" }}>
            {qIndex + 1} / {TOTAL}
          </span>
        </div>
        <div className="h-2 rounded-full mb-8 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progresso * 100}%`,
              background: "linear-gradient(90deg, #8a6a3e, #c8a56b)",
            }}
          />
        </div>

        {erro && (
          <p className="text-sm mb-4 text-red-400/90">{erro}</p>
        )}

        {parAtual && (
          <div className="space-y-6">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>
              O que é mais verdadeiro para ti?
            </p>
            <button
              type="button"
              onClick={() => escolher("a")}
              className="w-full text-left p-5 rounded-2xl text-sm leading-relaxed transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(200,165,107,0.18)",
                color: "#f7f2ec",
              }}
            >
              A — {parAtual.textoA}
            </button>
            <button
              type="button"
              onClick={() => escolher("b")}
              className="w-full text-left p-5 rounded-2xl text-sm leading-relaxed transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(200,165,107,0.18)",
                color: "#f7f2ec",
              }}
            >
              B — {parAtual.textoB}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
