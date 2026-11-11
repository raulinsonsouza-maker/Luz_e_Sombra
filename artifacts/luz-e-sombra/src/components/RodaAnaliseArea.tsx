import { ROTULO_LINGUAGEM, type AnaliseAreaRoda, type NivelArea } from "@/lib/rodaCruzada";

const COR_TEXTO = "rgba(247,242,236,0.78)";
const COR_FORTE = "rgba(247,242,236,0.94)";
const OURO = "#c8a56b";

const NIVEL_VISUAL: Record<
  NivelArea,
  { cor: string; bg: string; border: string }
> = {
  urgente: {
    cor: "#ef4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.22)",
  },
  atencao: {
    cor: "#f97316",
    bg: "rgba(249,115,22,0.06)",
    border: "rgba(249,115,22,0.22)",
  },
  desenvolvimento: {
    cor: "#eab308",
    bg: "rgba(234,179,8,0.06)",
    border: "rgba(234,179,8,0.22)",
  },
  excelencia: {
    cor: "#c8a56b",
    bg: "rgba(200,165,107,0.06)",
    border: "rgba(200,165,107,0.22)",
  },
};

function Bloco({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="space-y-1.5 min-w-0">
      <p
        className="text-[11px] font-semibold tracking-[0.08em] uppercase break-words"
        style={{ color: OURO }}
      >
        {titulo}
      </p>
      <p className="text-sm leading-relaxed break-words" style={{ color: COR_TEXTO, lineHeight: 1.7 }}>
        {texto}
      </p>
    </div>
  );
}

export default function RodaAnaliseArea({ analise }: { analise: AnaliseAreaRoda }) {
  const visual = NIVEL_VISUAL[analise.nivel];
  const pct = (analise.valor / 10) * 100;

  return (
    <section
      className="rounded-2xl p-4 sm:p-5 md:p-6 min-w-0 space-y-4"
      style={{ background: visual.bg, border: `1px solid ${visual.border}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-tan-mon-cheri text-lg md:text-xl leading-snug break-words" style={{ color: "#f7f2ec" }}>
            {analise.titulo}
          </h3>
          <p className="text-xs font-semibold tracking-wider mt-1" style={{ color: visual.cor }}>
            {analise.labelNivel}
          </p>
        </div>
        <p className="font-tan-mon-cheri text-4xl leading-none shrink-0" style={{ color: visual.cor }}>
          {analise.valor}
        </p>
      </div>

      <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: visual.cor }} />
      </div>

      <Bloco titulo="O que acontece aqui" texto={analise.oQueAcontece} />

      {analise.comoTemperamentoEntra && (
        <Bloco titulo="Como o temperamento aparece aqui" texto={analise.comoTemperamentoEntra} />
      )}
      {analise.comoTracoEntra && (
        <Bloco titulo="O que o traço revela" texto={analise.comoTracoEntra} />
      )}
      {analise.comoLinguagensEntram && (
        <Bloco
          titulo={ROTULO_LINGUAGEM[analise.id] ?? "No jeito de receber carinho"}
          texto={analise.comoLinguagensEntram}
        />
      )}

      {analise.comoMelhorar.length > 0 && (
        <div className="space-y-2">
          <p
            className="text-[11px] font-semibold tracking-[0.08em] uppercase"
            style={{ color: OURO }}
          >
            Para cuidar
          </p>
          <ol className="list-none space-y-2">
            {analise.comoMelhorar.map((passo, i) => (
              <li key={passo} className="flex gap-3 min-w-0">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5"
                  style={{ background: "rgba(200,165,107,0.16)", color: "#e8d5b0" }}
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed break-words" style={{ color: COR_TEXTO, lineHeight: 1.7 }}>
                  {passo}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div
        className="rounded-xl px-4 py-3 min-w-0"
        style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.22)" }}
      >
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase mb-1.5" style={{ color: OURO }}>
          Para pensar
        </p>
        <p className="text-sm leading-relaxed font-medium break-words" style={{ color: COR_FORTE, lineHeight: 1.7 }}>
          {analise.pergunta}
        </p>
      </div>
    </section>
  );
}
