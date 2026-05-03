import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PERGUNTAS_EIXOS_20 } from "@workspace/traco-eixos-multimodal";

const STORAGE_KEY = "luz_questionario_20_respostas";

export default function DiagnosticoEixosPage() {
  const [, setLocation] = useLocation();
  const [index, setIndex] = useState(0);
  const [respostas, setRespostas] = useState<number[]>(() => Array(20).fill(0));

  const pergunta = PERGUNTAS_EIXOS_20[index];
  const answered = respostas.filter((r) => r >= 1 && r <= 5).length;
  const isComplete = answered === 20;

  const setValor = useCallback((valor: number) => {
    setRespostas((prev) => {
      const n = [...prev];
      n[index] = valor;
      return n;
    });
    if (index < 19) setIndex((i) => i + 1);
  }, [index]);

  const handleConcluir = () => {
    if (!isComplete) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(respostas));
    } catch {
      // ignore
    }
    setLocation("/traco-de-carater");
  };

  const handleReiniciar = () => {
    setRespostas(Array(20).fill(0));
    setIndex(0);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg, #1e1812 0%, #2a1f14 50%, #2f251b 100%)" }}>
      <section
        className="px-4 pt-8 pb-6 max-w-lg mx-auto"
        style={{ borderBottom: "1px solid rgba(200,165,107,0.12)" }}
      >
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.55)" }}>
          Diagnóstico por eixos
        </p>
        <h1 className="font-tan-mon-cheri text-2xl mb-2" style={{ color: "#f7f2ec" }}>
          20 perguntas
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
          Escala 1 (discordo totalmente) a 5 (concordo totalmente). Uma pergunta por ecrã. Os dados combinam com a análise por fotos ao gravar o traço.
        </p>
        <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((index + 1) / 20) * 100}%`,
              background: "linear-gradient(90deg, #7a9e6a, #c8a56b)",
            }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: "rgba(200,165,107,0.45)" }}>
          {index + 1} / 20 · {answered} respondidas
        </p>
      </section>

      <div className="px-4 max-w-lg mx-auto pt-6">
        {!isComplete && pergunta && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "rgba(30,24,18,0.55)", border: "1px solid rgba(200,165,107,0.12)" }}
          >
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(247,242,236,0.78)" }}>
              {pergunta.texto}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setValor(v)}
                  className="py-3 rounded-xl text-sm font-semibold transition-transform active:scale-95"
                  style={{
                    background: respostas[index] === v ? "rgba(200,165,107,0.25)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${respostas[index] === v ? "rgba(200,165,107,0.45)" : "rgba(255,255,255,0.08)"}`,
                    color: respostas[index] === v ? "#c8a56b" : "rgba(247,242,236,0.55)",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="text-[10px] mt-3 text-center" style={{ color: "rgba(247,242,236,0.35)" }}>
              1 = mínimo · 5 = máximo
            </p>
          </div>
        )}

        {isComplete && (
          <div
            className="rounded-2xl p-6 text-center mb-6"
            style={{ background: "rgba(109,185,109,0.08)", border: "1px solid rgba(109,185,109,0.25)" }}
          >
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: "rgba(109,185,109,0.85)" }} />
            <p className="text-sm mb-4" style={{ color: "rgba(247,242,236,0.75)" }}>
              Questionário completo. Ao analisar o traço no próximo passo, estes dados serão enviados à API para o modelo multimodal.
            </p>
            <button
              type="button"
              onClick={handleConcluir}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1510" }}
            >
              Ir para análise de traço
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleReiniciar}
              className="block w-full mt-3 text-xs underline"
              style={{ color: "rgba(200,165,107,0.5)" }}
            >
              Refazer questionário
            </button>
          </div>
        )}

        <div className="flex gap-2 justify-between">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="text-xs px-3 py-2 rounded-lg disabled:opacity-30"
            style={{ color: "rgba(200,165,107,0.7)", border: "1px solid rgba(200,165,107,0.2)" }}
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setLocation("/traco-de-carater")}
            className="text-xs px-3 py-2 rounded-lg"
            style={{ color: "rgba(247,242,236,0.45)" }}
          >
            Saltar por agora
          </button>
        </div>
      </div>
    </div>
  );
}
