import type { LeituraPortal, SecaoLeitura } from "@workspace/copy-voz";

const COR_TEXTO = "rgba(247,242,236,0.78)";
const LIMITE_PASSO = 280;

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
            className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
            style={{ color: "rgba(200,165,107,0.75)" }}
          >
            {secao.titulo}
          </h3>
          {secao.id === "oQueFazer" ? <Passos secao={secao} /> : <Paragrafos secao={secao} />}
        </section>
      ))}
    </div>
  );
}

function textos(secao: SecaoLeitura): string[] {
  return secao.paragrafos?.length ? secao.paragrafos : [secao.texto];
}

function Paragrafos({ secao }: { secao: SecaoLeitura }) {
  return (
    <div className="space-y-3">
      {textos(secao).map((parte, i) => (
        <p key={i} className="text-sm leading-relaxed" style={{ color: COR_TEXTO, lineHeight: 1.75 }}>
          {parte}
        </p>
      ))}
    </div>
  );
}

function Passos({ secao }: { secao: SecaoLeitura }) {
  const partes = textos(secao);
  const ultimo = partes[partes.length - 1];
  const temPergunta = partes.length > 1 && !!ultimo?.trim().endsWith("?");
  const corpo = temPergunta ? partes.slice(0, -1) : partes;
  const blocos: Array<{ tipo: "texto"; texto: string } | { tipo: "lista"; itens: string[] }> = [];

  for (const parte of corpo) {
    const curto = parte.length <= LIMITE_PASSO;
    const aberto = blocos[blocos.length - 1];
    if (curto && aberto?.tipo === "lista") {
      aberto.itens.push(parte);
    } else if (curto && corpo.length > 1) {
      blocos.push({ tipo: "lista", itens: [parte] });
    } else {
      blocos.push({ tipo: "texto", texto: parte });
    }
  }

  return (
    <div className="space-y-3">
      {blocos.map((bloco, i) =>
        bloco.tipo === "texto" ? (
          <p key={i} className="text-sm leading-relaxed" style={{ color: COR_TEXTO, lineHeight: 1.75 }}>
            {bloco.texto}
          </p>
        ) : (
          <ol key={i} className="space-y-2 list-decimal pl-5">
            {bloco.itens.map((item, j) => (
              <li key={j} className="text-sm leading-relaxed pl-1" style={{ color: COR_TEXTO, lineHeight: 1.7 }}>
                {item}
              </li>
            ))}
          </ol>
        ),
      )}
      {temPergunta && ultimo && (
        <p
          className="text-sm leading-relaxed rounded-xl px-4 py-3"
          style={{
            color: "rgba(247,242,236,0.9)",
            background: "rgba(200,165,107,0.1)",
            border: "1px solid rgba(200,165,107,0.22)",
            lineHeight: 1.7,
          }}
        >
          {ultimo}
        </p>
      )}
    </div>
  );
}
