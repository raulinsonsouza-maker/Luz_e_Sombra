import type { ItemLeitura, LeituraPortal, SecaoLeitura, SlotId } from "@workspace/copy-voz";
import { ListChecks, Moon, Sparkles, SunMedium } from "lucide-react";

const COR_TEXTO = "rgba(247,242,236,0.78)";
const COR_FORTE = "rgba(247,242,236,0.94)";
const OURO = "#c8a56b";
const LIMITE_PASSO = 280;

const SECAO_ICONE: Record<SlotId, typeof Sparkles> = {
  quemVoceE: Sparkles,
  noDiaADia: SunMedium,
  sombra: Moon,
  oQueFazer: ListChecks,
};

/** Desenha a leitura a partir da moldura. O título de cada bloco vem do copy-voz. */
export default function LeituraBlocos({ leitura }: { leitura: LeituraPortal }) {
  return (
    <div className="space-y-4">
      {leitura.secoes.map((secao) => {
        const Icone = SECAO_ICONE[secao.id];
        return (
          <section
            key={secao.id}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(200,165,107,0.06)",
              border: "1px solid rgba(200,165,107,0.16)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(200,165,107,0.14)", border: "1px solid rgba(200,165,107,0.28)" }}
              >
                <Icone className="w-3.5 h-3.5" style={{ color: OURO }} />
              </span>
              <h3 className="font-tan-mon-cheri text-lg leading-none" style={{ color: "#e8d5b0" }}>
                {secao.titulo}
              </h3>
            </div>
            {secao.id === "oQueFazer" ? <Passos secao={secao} /> : <Paragrafos secao={secao} />}
          </section>
        );
      })}
    </div>
  );
}

function itensDa(secao: SecaoLeitura): ItemLeitura[] {
  if (secao.itens?.length) return secao.itens;
  return (secao.paragrafos?.length ? secao.paragrafos : [secao.texto]).map((texto) => ({ texto }));
}

function grupos(itens: ItemLeitura[]): Array<{ rotulo?: string; textos: string[] }> {
  const saida: Array<{ rotulo?: string; textos: string[] }> = [];
  for (const item of itens) {
    const aberto = saida[saida.length - 1];
    if (item.rotulo || !aberto) {
      saida.push({ rotulo: item.rotulo, textos: [item.texto] });
    } else {
      aberto.textos.push(item.texto);
    }
  }
  return saida;
}

function Paragrafos({ secao }: { secao: SecaoLeitura }) {
  const itens = itensDa(secao);
  const abreComFaixa =
    secao.id === "quemVoceE" &&
    itens.length > 1 &&
    !itens[0]?.rotulo &&
    (itens[0]?.texto.length ?? 0) <= 180;
  const faixa = abreComFaixa ? itens[0]?.texto : undefined;
  const corpo = abreComFaixa ? itens.slice(1) : itens;

  return (
    <div className="space-y-3">
      {faixa && <Faixa texto={faixa} />}
      {grupos(corpo).map((grupo, i) => (
        <div
          key={i}
          className="rounded-xl px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.025)",
            borderLeft: "2px solid rgba(200,165,107,0.55)",
          }}
        >
          {grupo.rotulo && (
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: OURO }}>
              {grupo.rotulo}
            </p>
          )}
          <div className="space-y-2.5">
            {grupo.textos.map((texto, j) => (
              <p key={j} className="text-sm leading-relaxed" style={{ lineHeight: 1.75 }}>
                <Frase texto={texto} />
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Faixa({ texto }: { texto: string }) {
  const corte = texto.match(/^(.*?\bé\s+)([^.!?]+)([.!?]?)$/);
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{ background: "rgba(200,165,107,0.12)", border: "1px solid rgba(200,165,107,0.28)" }}
    >
      <p className="text-sm leading-relaxed" style={{ color: COR_FORTE, lineHeight: 1.7 }}>
        {corte ? (
          <>
            {corte[1]}
            <span className="font-semibold" style={{ color: "#e8d5b0" }}>
              {corte[2]}
            </span>
            {corte[3]}
          </>
        ) : (
          <span className="font-semibold">{texto}</span>
        )}
      </p>
    </div>
  );
}

function Frase({ texto }: { texto: string }) {
  const corte = texto.match(/^(.+?[.!?])\s+([\s\S]+)$/);
  if (!corte || corte[1].length > 220) {
    return <span style={{ color: COR_TEXTO }}>{texto}</span>;
  }
  return (
    <>
      <span className="font-semibold" style={{ color: COR_FORTE }}>
        {corte[1]}
      </span>{" "}
      <span style={{ color: COR_TEXTO }}>{corte[2]}</span>
    </>
  );
}

function Passos({ secao }: { secao: SecaoLeitura }) {
  const itens = itensDa(secao);
  const ultimo = itens[itens.length - 1];
  const temPergunta = itens.length > 1 && !!ultimo?.texto.trim().endsWith("?");
  const corpo = temPergunta ? itens.slice(0, -1) : itens;
  const passos = corpo.filter((item) => item.texto.length <= LIMITE_PASSO);
  const intros = corpo.filter((item) => item.texto.length > LIMITE_PASSO);
  const lista = passos.length > 1 || (passos.length === 1 && intros.length > 0) ? passos : [];
  const soltos = lista.length ? intros : corpo;

  return (
    <div className="space-y-3">
      {soltos.map((item, i) => (
        <div
          key={i}
          className="rounded-xl px-4 py-3"
          style={{ background: "rgba(255,255,255,0.025)", borderLeft: "2px solid rgba(200,165,107,0.55)" }}
        >
          {item.rotulo && (
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: OURO }}>
              {item.rotulo}
            </p>
          )}
          <p className="text-sm leading-relaxed" style={{ lineHeight: 1.75 }}>
            <Frase texto={item.texto} />
          </p>
        </div>
      ))}
      {lista.length > 0 && (
        <ol className="space-y-2.5">
          {lista.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5"
                style={{ background: "rgba(200,165,107,0.16)", color: "#e8d5b0" }}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                {item.rotulo && (
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-0.5" style={{ color: OURO }}>
                    {item.rotulo}
                  </p>
                )}
                <p className="text-sm leading-relaxed" style={{ color: COR_TEXTO, lineHeight: 1.7 }}>
                  {item.texto}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {temPergunta && ultimo && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.22)" }}
        >
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: OURO }}>
            {ultimo.rotulo || "Para pensar"}
          </p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: COR_FORTE, lineHeight: 1.7 }}>
            {ultimo.texto}
          </p>
        </div>
      )}
    </div>
  );
}
