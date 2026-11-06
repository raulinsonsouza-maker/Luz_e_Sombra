import type { BlocoJornada, EtapaJornada, JornadaTraco } from "@workspace/traco-narrativa";
import { TextoFormatado } from "@/components/TextoLeitura";
import { pontuar } from "@/lib/formatarLeitura";

const OURO = "#c8a56b";
const TEXTO = "rgba(247,242,236,0.78)";
const FORTE = "rgba(247,242,236,0.94)";

export default function JornadaTracoResultado({
  jornada,
  etapasAposMapa = true,
}: {
  jornada: JornadaTraco;
  /** Quando false, renderiza só o aviso (mapa fica no painel). */
  etapasAposMapa?: boolean;
}) {
  const etapas = etapasAposMapa
    ? jornada.etapas.filter((e) => e.id !== "mapa")
    : jornada.etapas;

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl px-5 py-4"
        style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.2)" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: FORTE, lineHeight: 1.7 }}>
          {jornada.aviso}
        </p>
      </div>

      {etapas.map((etapa) => (
        <EtapaCard key={etapa.id} etapa={etapa} />
      ))}
    </div>
  );
}

function EtapaCard({ etapa }: { etapa: EtapaJornada }) {
  return (
    <section
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(200,165,107,0.14)", background: "rgba(30,24,18,0.4)" }}
    >
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
        <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(200,165,107,0.55)" }}>
          Etapa {String(etapa.numero).padStart(2, "0")}
        </p>
        <h3 className="font-tan-mon-cheri text-lg" style={{ color: "#e8d5b0" }}>
          {etapa.titulo}
        </h3>
        <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.4)" }}>
          {etapa.subtitulo}
        </p>
      </div>
      <div className="px-5 py-5 space-y-4">
        {etapa.blocos.map((bloco, i) => (
          <Bloco key={i} bloco={bloco} />
        ))}
      </div>
    </section>
  );
}

function Bloco({ bloco }: { bloco: BlocoJornada }) {
  if (bloco.tipo === "texto") {
    return (
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "rgba(255,255,255,0.025)", borderLeft: `2px solid ${OURO}` }}
      >
        {bloco.rotulo && (
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: OURO }}>
            {bloco.rotulo}
          </p>
        )}
        <TextoFormatado texto={bloco.texto} fluido={false} />
      </div>
    );
  }

  if (bloco.tipo === "destaque") {
    return (
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "rgba(200,165,107,0.12)", border: "1px solid rgba(200,165,107,0.28)" }}
      >
        {bloco.rotulo && (
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: OURO }}>
            {bloco.rotulo}
          </p>
        )}
        <p className="text-sm leading-relaxed font-medium" style={{ color: FORTE, lineHeight: 1.7 }}>
          {bloco.texto}
        </p>
      </div>
    );
  }

  if (bloco.tipo === "lista") {
    return (
      <div>
        {bloco.rotulo && (
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-2" style={{ color: OURO }}>
            {bloco.rotulo}
          </p>
        )}
        <ul className="space-y-2">
          {bloco.itens.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm" style={{ color: TEXTO, lineHeight: 1.6 }}>
              <span style={{ color: OURO }}>·</span>
              <span>{pontuar(item)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (bloco.tipo === "passos") {
    return (
      <div>
        {bloco.rotulo && (
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: OURO }}>
            {bloco.rotulo}
          </p>
        )}
        <ol className="space-y-3">
          {bloco.itens.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5"
                style={{ background: "rgba(200,165,107,0.16)", color: "#e8d5b0" }}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: TEXTO, lineHeight: 1.7 }}>
                {pontuar(item)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // tabela
  return (
    <div>
      {bloco.rotulo && (
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: OURO }}>
          {bloco.rotulo}
        </p>
      )}
      <div className="space-y-2">
        {bloco.linhas.map((linha, i) => (
          <div
            key={i}
            className="rounded-xl px-4 py-3 grid gap-2"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(200,165,107,0.1)",
              gridTemplateColumns: linha.length === 3 ? "1fr 1.2fr 1.2fr" : "1fr 1.4fr",
            }}
          >
            {linha.map((celula, j) => (
              <div key={j}>
                {bloco.cabecalhos[j] && (
                  <p className="text-[10px] tracking-wider uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
                    {bloco.cabecalhos[j]}
                  </p>
                )}
                <p className="text-sm leading-relaxed" style={{ color: j === 0 ? FORTE : TEXTO, lineHeight: 1.55 }}>
                  {celula}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

