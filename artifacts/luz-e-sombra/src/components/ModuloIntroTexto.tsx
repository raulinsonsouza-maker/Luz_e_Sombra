import { Check } from "lucide-react";

interface Props {
  titulo?: string;
  paragrafos: string[];
  bullets?: string[];
  /** Substitui o marcador `__DATA__` por um botão clicável. */
  dataClicavel?: { texto: string; onClick: () => void } | null;
}

function ParagrafoComData({
  texto,
  dataClicavel,
}: {
  texto: string;
  dataClicavel?: { texto: string; onClick: () => void } | null;
}) {
  if (!dataClicavel || !texto.includes("__DATA__")) {
    return (
      <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.72)" }}>
        {texto}
      </p>
    );
  }

  const [antes, depois] = texto.split("__DATA__");
  return (
    <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.72)" }}>
      {antes}
      <button
        type="button"
        onClick={dataClicavel.onClick}
        className="font-semibold underline underline-offset-2 decoration-dotted mx-0.5"
        style={{ color: "#c8a56b" }}
        title="Alterar data de nascimento"
      >
        {dataClicavel.texto}
      </button>
      {depois}
    </p>
  );
}

export function ModuloIntroTexto({
  titulo = "Sobre esta análise",
  paragrafos,
  bullets,
  dataClicavel,
}: Props) {
  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{
        background: "linear-gradient(145deg, rgba(30,24,18,0.6) 0%, rgba(18,14,10,0.8) 100%)",
        border: "1px solid rgba(200,165,107,0.18)",
      }}
    >
      <p
        className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4"
        style={{ color: "rgba(200,165,107,0.55)" }}
      >
        {titulo}
      </p>

      <div className="space-y-3">
        {paragrafos.map((p) => (
          <ParagrafoComData key={p.slice(0, 48)} texto={p} dataClicavel={dataClicavel} />
        ))}
      </div>

      {bullets && bullets.length > 0 && (
        <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(200,165,107,0.1)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "rgba(200,165,107,0.7)" }}>
            O que você vai descobrir
          </p>
          <ul className="space-y-2">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(200,165,107,0.12)" }}
                >
                  <Check size={9} strokeWidth={3} style={{ color: "#c8a56b" }} />
                </div>
                <span className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.58)" }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
