import type { BlocoJornada, EtapaJornada, JornadaTraco } from "@workspace/traco-narrativa";
import { TextoFormatado } from "@/components/TextoLeitura";
import { pontuar } from "@/lib/formatarLeitura";

const OURO = "#c8a56b";
const TEXTO = "rgba(247,242,236,0.78)";
const FORTE = "rgba(247,242,236,0.94)";

export default function JornadaTracoResultado({
  jornada,
  etapasAposMapa = true,
  mostrarAviso = true,
}: {
  jornada: JornadaTraco;
  etapasAposMapa?: boolean;
  mostrarAviso?: boolean;
}) {
  const etapas = etapasAposMapa
    ? jornada.etapas.filter((e) => e.id !== "mapa")
    : jornada.etapas;

  return (
    <div className="space-y-5">
      {mostrarAviso && (
        <div
          className="rounded-2xl px-5 py-4"
          style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.2)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: FORTE, lineHeight: 1.7 }}>
            {jornada.aviso}
          </p>
        </div>
      )}

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
      <div className="px-5 py-5 space-y-5">
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
      <div className="space-y-2">
        {bloco.rotulo && (
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: OURO }}>
            {bloco.rotulo}
          </p>
        )}
        <TextoFormatado texto={bloco.texto} fluido />
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
      <div className="space-y-2">
        {bloco.rotulo && (
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: OURO }}>
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
      <div className="space-y-3">
        {bloco.rotulo && (
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: OURO }}>
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

  // Tabela 3 colunas: recurso / equilíbrio / excesso
  if (bloco.cabecalhos.length >= 3) {
    return (
      <div className="space-y-3">
        {bloco.rotulo && (
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: OURO }}>
            {bloco.rotulo}
          </p>
        )}
        <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.5)", lineHeight: 1.6 }}>
          O mesmo talento pode cuidar de você ou te cansar. Veja o limite entre usar bem e exagerar.
        </p>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(200,165,107,0.14)", background: "rgba(255,255,255,0.02)" }}
        >
          {bloco.linhas.map((linha, i) => {
            const [recurso, equilibrio, excesso] = linha;
            return (
              <div
                key={i}
                className="px-4 py-3.5 space-y-2"
                style={{
                  borderTop: i === 0 ? undefined : "1px solid rgba(200,165,107,0.1)",
                }}
              >
                <p className="text-sm font-medium" style={{ color: FORTE }}>
                  {recurso}
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <div>
                    <p className="text-[10px] tracking-wider uppercase mb-0.5" style={{ color: "rgba(109,185,109,0.75)" }}>
                      Em equilíbrio
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: TEXTO, lineHeight: 1.55 }}>
                      {equilibrio}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-wider uppercase mb-0.5" style={{ color: "rgba(224,123,57,0.8)" }}>
                      Em excesso
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: TEXTO, lineHeight: 1.55 }}>
                      {excesso}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Tabela 2 colunas: tenta / acaba · deixar / aprender
  return (
    <div className="space-y-3">
      {bloco.rotulo && (
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: OURO }}>
          {bloco.rotulo}
        </p>
      )}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(200,165,107,0.14)", background: "rgba(255,255,255,0.02)" }}
      >
        {bloco.linhas.map((linha, i) => {
          const [esquerda, direita] = linha;
          const rotuloEsq = bloco.cabecalhos[0] ?? "";
          const rotuloDir = bloco.cabecalhos[1] ?? "";
          return (
            <div
              key={i}
              className="px-4 py-3.5"
              style={{ borderTop: i === 0 ? undefined : "1px solid rgba(200,165,107,0.1)" }}
            >
              <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-2 sm:gap-3 items-start">
                <div>
                  <p className="text-[10px] tracking-wider uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.5)" }}>
                    {rotuloEsq}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: FORTE, lineHeight: 1.55 }}>
                    {esquerda}
                  </p>
                </div>
                <span
                  className="hidden sm:flex items-center justify-center text-xs mt-5"
                  style={{ color: "rgba(200,165,107,0.45)" }}
                  aria-hidden
                >
                  →
                </span>
                <div>
                  <p className="text-[10px] tracking-wider uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.5)" }}>
                    {rotuloDir}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: TEXTO, lineHeight: 1.55 }}>
                    {direita}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
