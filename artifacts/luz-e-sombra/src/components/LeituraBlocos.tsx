import type { LeituraPortal } from "@workspace/copy-voz";

/** Desenha a leitura a partir da moldura. O título de cada bloco vem do copy-voz. */
export default function LeituraBlocos({ leitura }: { leitura: LeituraPortal }) {
  return (
    <div className="space-y-4">
      {leitura.secoes.map((secao) => (
        <section
          key={secao.id}
          className="rounded-2xl p-5"
          style={{
            background: "rgba(200,165,107,0.06)",
            border: "1px solid rgba(200,165,107,0.16)",
          }}
        >
          <h3
            className="text-xs font-semibold tracking-[0.18em] uppercase mb-2"
            style={{ color: "rgba(200,165,107,0.75)" }}
          >
            {secao.titulo}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.78)", lineHeight: 1.75 }}>
            {secao.texto}
          </p>
        </section>
      ))}
    </div>
  );
}
