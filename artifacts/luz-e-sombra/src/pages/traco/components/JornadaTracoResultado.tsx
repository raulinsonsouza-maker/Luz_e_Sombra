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
    <div className="space-y-6">
      {mostrarAviso && (
        <div
          className="rounded-2xl px-5 py-4"
          style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.2)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: FORTE, lineHeight: 1.75 }}>
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
      <div className="px-5 py-6 space-y-7">
        {etapa.blocos.map((bloco, i) => (
          <Bloco key={i} bloco={bloco} />
        ))}
      </div>
    </section>
  );
}

function Rotulo({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-2" style={{ color: OURO }}>
      {children}
    </p>
  );
}

function Bloco({ bloco }: { bloco: BlocoJornada }) {
  if (bloco.tipo === "texto") {
    return (
      <div>
        {bloco.rotulo && <Rotulo>{bloco.rotulo}</Rotulo>}
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
        <p className="text-sm leading-relaxed font-medium" style={{ color: FORTE, lineHeight: 1.75 }}>
          {bloco.texto}
        </p>
      </div>
    );
  }

  if (bloco.tipo === "lista") {
    return (
      <div>
        {bloco.rotulo && <Rotulo>{bloco.rotulo}</Rotulo>}
        <ul className="space-y-2">
          {bloco.itens.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm" style={{ color: TEXTO, lineHeight: 1.65 }}>
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
        {bloco.rotulo && <Rotulo>{bloco.rotulo}</Rotulo>}
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

  // Cena: prosa aberta no card da etapa — sem caixinha interna.
  if (bloco.tipo === "cena") {
    const linhas = [
      { rotulo: "O que acontece", texto: bloco.oQue },
      { rotulo: "Como você pode reagir", texto: bloco.reacao },
      { rotulo: "O que pode estar tentando proteger", texto: bloco.protege },
      { rotulo: "Possível consequência", texto: bloco.consequencia },
    ];
    return (
      <div>
        {bloco.rotulo && <Rotulo>{bloco.rotulo}</Rotulo>}
        <div className="space-y-2.5">
          {linhas.map((l) => (
            <p key={l.rotulo} className="text-[15px] leading-relaxed" style={{ color: TEXTO, lineHeight: 1.8 }}>
              <span className="font-medium" style={{ color: "rgba(232,213,176,0.85)" }}>
                {l.rotulo}.{" "}
              </span>
              {l.texto}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (bloco.tipo !== "tabela") return null;

  const cols = bloco.cabecalhos.length;

  // Tabela de recursos: um painel só, linhas com respiro (sem grade apertada em 3 colunas no mobile).
  if (cols >= 3) {
    return (
      <div>
        {bloco.rotulo && <Rotulo>{bloco.rotulo}</Rotulo>}
        <div className="space-y-5">
          {bloco.linhas.map((linha, i) => {
            const [recurso, equilibrio, excesso, expansao] = linha;
            return (
              <div
                key={i}
                className="pt-4 first:pt-0"
                style={{ borderTop: i === 0 ? undefined : "1px solid rgba(200,165,107,0.12)" }}
              >
                <p className="text-sm font-medium mb-2" style={{ color: FORTE }}>
                  {recurso}
                </p>
                <div className="space-y-1.5 text-sm leading-relaxed" style={{ color: TEXTO, lineHeight: 1.65 }}>
                  <p>
                    <span style={{ color: "rgba(109,185,109,0.85)" }}>Em equilíbrio: </span>
                    {equilibrio}
                  </p>
                  <p>
                    <span style={{ color: "rgba(224,123,57,0.9)" }}>Em excesso: </span>
                    {excesso}
                  </p>
                  {cols >= 4 && expansao ? (
                    <p>
                      <span style={{ color: "rgba(200,165,107,0.85)" }}>Potencial: </span>
                      {expansao}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2 colunas: contraste lado a lado sem caixa extra por linha
  return (
    <div>
      {bloco.rotulo && <Rotulo>{bloco.rotulo}</Rotulo>}
      <div className="space-y-4">
        {bloco.linhas.map((linha, i) => {
          const [esquerda, direita] = linha;
          return (
            <div
              key={i}
              className="grid sm:grid-cols-2 gap-3 pt-4 first:pt-0"
              style={{ borderTop: i === 0 ? undefined : "1px solid rgba(200,165,107,0.12)" }}
            >
              <div>
                <p className="text-[10px] tracking-wider uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
                  {bloco.cabecalhos[0] ?? ""}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: FORTE, lineHeight: 1.6 }}>
                  {esquerda}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
                  {bloco.cabecalhos[1] ?? ""}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: TEXTO, lineHeight: 1.6 }}>
                  {direita}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
