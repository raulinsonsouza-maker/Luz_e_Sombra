import { useCallback, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Leaf } from "lucide-react";
import MobileTopBar from "@/components/MobileTopBar";
import PageIntroHeader from "@/components/PageIntroHeader";
import { PausaDoDiaModal } from "@/components/PausaDoDiaModal";
import {
  dateKeyPercepcao,
  formatarDataPercepcao,
  listarPercepcoes,
  rotuloMood,
  type Percepcao,
} from "@/lib/percepcoes";
import { listarFrasesGuardadas } from "@/lib/frasesGuardadas";

export default function AcompanhamentoPage() {
  const [, navigate] = useLocation();
  const [entradas, setEntradas] = useState<Percepcao[]>([]);
  const [frasesCount, setFrasesCount] = useState(0);
  const [pausaAberta, setPausaAberta] = useState(false);
  const hoje = dateKeyPercepcao();

  const recarregar = useCallback(() => {
    setEntradas(listarPercepcoes());
  }, []);

  useEffect(() => {
    recarregar();
    void listarFrasesGuardadas()
      .then((itens) => setFrasesCount(itens.length))
      .catch(() => setFrasesCount(0));
  }, [recarregar]);

  return (
    <div className="min-h-screen journey-forest-bg pb-28">
      <MobileTopBar titulo="Acompanhamento" voltar="/dashboard" />

      <div className="max-w-lg mx-auto px-4 pt-4">
        <PageIntroHeader
          eyebrow="No seu tempo"
          titulo="Seu caminho, de dentro para fora."
          subtitulo="Um espaço para revisitar suas percepções e reconhecer o que muda com você."
        />

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(200,165,107,0.16)",
            }}
          >
            <p className="font-tan-mon-cheri text-3xl leading-none" style={{ color: "#c8a56b" }}>
              {entradas.length}
            </p>
            <p className="text-xs mt-2" style={{ color: "rgba(247,242,236,0.45)" }}>
              {entradas.length === 1 ? "momento registrado" : "momentos registrados"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/frases-guardadas")}
            className="rounded-2xl p-4 text-left transition-all active:scale-[0.99]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(200,165,107,0.16)",
            }}
          >
            <p className="font-tan-mon-cheri text-3xl leading-none" style={{ color: "#c8a56b" }}>
              {frasesCount}
            </p>
            <p className="text-xs mt-2" style={{ color: "rgba(247,242,236,0.45)" }}>
              {frasesCount === 1 ? "frase guardada" : "frases guardadas"}
            </p>
            <p className="text-[11px] font-semibold mt-2" style={{ color: "rgba(200,165,107,0.75)" }}>
              Revisitar →
            </p>
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "#f7f2ec" }}>
            Minhas percepções
          </h2>
          <button
            type="button"
            onClick={() => setPausaAberta(true)}
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: "#c8a56b" }}
          >
            Registrar hoje
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {entradas.length === 0 ? (
          <div
            className="rounded-3xl p-6 text-center mb-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(200,165,107,0.16)",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "rgba(200,165,107,0.1)" }}
            >
              <Leaf className="w-6 h-6" style={{ color: "#c8a56b" }} />
            </div>
            <h3 className="font-tan-mon-cheri text-xl mb-2" style={{ color: "#f7f2ec" }}>
              Todo caminho tem um começo.
            </h3>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(247,242,236,0.5)" }}>
              Registre como você está hoje. Suas próprias palavras ajudam a perceber o caminho que vem
              construindo.
            </p>
            <button
              type="button"
              onClick={() => setPausaAberta(true)}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #c8a56b, #9c7742)",
                color: "#1a1208",
              }}
            >
              <Leaf className="w-4 h-4" />
              Meu primeiro registro
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {entradas.map((entry) => (
              <article
                key={entry.date}
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(200,165,107,0.14)",
                }}
              >
                <time
                  dateTime={entry.date}
                  className="text-[11px] font-semibold tracking-[0.12em] uppercase"
                  style={{ color: "rgba(200,165,107,0.65)" }}
                >
                  {formatarDataPercepcao(entry.date)}
                </time>
                <h3 className="text-sm font-semibold mt-1.5" style={{ color: "#f7f2ec" }}>
                  {rotuloMood(entry.mood)}
                </h3>
                {entry.text ? (
                  <p className="text-sm leading-relaxed mt-2" style={{ color: "rgba(247,242,236,0.55)" }}>
                    {entry.text}
                  </p>
                ) : null}
                {entry.date === hoje ? (
                  <button
                    type="button"
                    onClick={() => setPausaAberta(true)}
                    className="text-xs font-semibold mt-3 flex items-center gap-1"
                    style={{ color: "#c8a56b" }}
                  >
                    Revisitar meu registro de hoje
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        )}

        <p className="text-[11px] text-center leading-relaxed px-2" style={{ color: "rgba(247,242,236,0.3)" }}>
          Seus registros ficam apenas neste navegador. Resultados dos testes e acompanhamento com Letícia
          serão conectados em uma próxima etapa.
        </p>
      </div>

      <PausaDoDiaModal
        open={pausaAberta}
        onClose={() => setPausaAberta(false)}
        onSaved={recarregar}
      />
    </div>
  );
}
