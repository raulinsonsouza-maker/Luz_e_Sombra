import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { PERGUNTAS_EIXOS_20 } from "@workspace/traco-eixos-multimodal";

const STORAGE_KEY = "luz_questionario_20_respostas";

function parseStored20(): number[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw?.trim()) return null;
    const a = JSON.parse(raw) as unknown;
    if (!Array.isArray(a) || a.length !== 20) return null;
    const ok = a.every((x) => typeof x === "number" && Number.isInteger(x) && x >= 1 && x <= 5);
    return ok ? (a as number[]) : null;
  } catch {
    return null;
  }
}

export default function DiagnosticoEixosPage() {
  const [, setLocation] = useLocation();
  const [index, setIndex] = useState(0);
  const [respostas, setRespostas] = useState<number[]>(() => Array(20).fill(0));

  useEffect(() => {
    const done = parseStored20();
    if (done) setLocation("/traco-de-carater");
  }, [setLocation]);

  const pergunta = PERGUNTAS_EIXOS_20[index];
  const answered = respostas.filter((r) => r >= 1 && r <= 5).length;

  const setValor = useCallback(
    (valor: number) => {
      setRespostas((prev) => {
        const n = [...prev];
        n[index] = valor;
        if (index === 19) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(n));
          } catch {
            // ignore
          }
          queueMicrotask(() => setLocation("/traco-de-carater"));
          return n;
        }
        return n;
      });
      if (index < 19) setIndex((i) => i + 1);
    },
    [index, setLocation]
  );

  const handleRecomeçar = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setRespostas(Array(20).fill(0));
    setIndex(0);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg, #1e1812 0%, #2a1f14 50%, #2f251b 100%)" }}>
      <section
        className="px-4 pt-8 pb-6 max-w-lg mx-auto"
        style={{ borderBottom: "1px solid rgba(200,165,107,0.12)" }}
      >
        <p
          className="text-xs tracking-widest uppercase mb-2 inline-block px-2 py-0.5 rounded"
          style={{ color: "rgba(200,165,107,0.75)", border: "1px solid rgba(200,165,107,0.25)" }}
        >
          Passo 1 de 2 · Traço de caráter
        </p>
        <h1 className="font-tan-mon-cheri text-2xl mb-2" style={{ color: "#f7f2ec" }}>
          Questionário de eixos
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
          20 perguntas (escala 1 a 5). Ao terminar a última pergunta, segues automaticamente para o passo das{" "}
          <strong style={{ color: "rgba(200,165,107,0.85)" }}>fotos</strong>.
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
        {pergunta && (
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

        <div className="flex flex-wrap items-center justify-between gap-3">
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
            onClick={handleRecomeçar}
            className="text-xs px-3 py-2 rounded-lg"
            style={{ color: "rgba(224,123,57,0.65)", border: "1px solid rgba(224,123,57,0.2)" }}
          >
            Recomeçar do início
          </button>
          <span className="text-[10px] flex items-center gap-1" style={{ color: "rgba(200,165,107,0.4)" }}>
            Depois: fotos
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
