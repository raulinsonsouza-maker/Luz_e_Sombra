import type { ItemLeitura, LeituraPortal, SecaoLeitura } from "@workspace/copy-voz";
import type { ReactNode } from "react";
import { ConteudoGrupo, TextoFormatado } from "@/components/TextoLeitura";
import { pontuar } from "@/lib/formatarLeitura";

const COR_TEXTO = "rgba(247,242,236,0.78)";
const COR_FORTE = "rgba(247,242,236,0.94)";
const OURO = "#c8a56b";
const LIMITE_PASSO = 280;

/** Cartão padrão das leituras. O título quebra no celular e não vaza para fora. */
export function CartaoPadrao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section
      className="rounded-2xl p-4 sm:p-5 min-w-0"
      style={{
        background: "rgba(200,165,107,0.06)",
        border: "1px solid rgba(200,165,107,0.16)",
      }}
    >
      <h3 className="font-tan-mon-cheri text-base md:text-lg leading-snug min-w-0 break-words mb-4" style={{ color: "#e8d5b0" }}>
        {titulo}
      </h3>
      {children}
    </section>
  );
}

/** Parágrafos, pergunta e passos no mesmo cartão das outras leituras. */
export function CorpoCartao({
  paragrafos,
  perguntas = [],
  passos = [],
}: {
  paragrafos: string[];
  perguntas?: string[];
  passos?: string[];
}) {
  return (
    <div className="space-y-3 min-w-0">
      <ConteudoGrupo textos={paragrafos} fluido={false} />
      {passos.length > 0 && (
        <ol className="list-none space-y-2.5">
          {passos.map((texto, i) => (
            <li key={texto} className="flex gap-3 min-w-0">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5"
                style={{ background: "rgba(200,165,107,0.16)", color: "#e8d5b0" }}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed break-words min-w-0" style={{ color: COR_TEXTO, lineHeight: 1.7 }}>
                {pontuar(texto)}
              </p>
            </li>
          ))}
        </ol>
      )}
      {perguntas.map((texto) => (
        <div
          key={texto}
          className="rounded-xl px-4 py-3 min-w-0"
          style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.22)" }}
        >
          <p className="text-[11px] font-semibold tracking-[0.04em] sm:tracking-[0.14em] uppercase mb-1.5 break-words" style={{ color: OURO }}>
            Para pensar
          </p>
          <p className="text-sm leading-relaxed break-words font-medium" style={{ color: COR_FORTE, lineHeight: 1.7 }}>
            {texto}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Desenha a leitura a partir da moldura. O título de cada bloco vem do copy-voz. */
export default function LeituraBlocos({ leitura, fluida = false }: { leitura: LeituraPortal; fluida?: boolean }) {
  if (fluida) return <LeituraFluida leitura={leitura} />;
  return (
    <div className="space-y-4">
      {leitura.secoes.map((secao) => (
        <CartaoPadrao key={secao.id} titulo={secao.titulo}>
          {secao.id === "oQueFazer" ? <Passos secao={secao} /> : <Paragrafos secao={secao} />}
        </CartaoPadrao>
      ))}
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
  const partes = grupos(corpo);
  const soTextoCorrido = partes.length > 0 && partes.every((grupo) => !grupo.rotulo);

  return (
    <div className="space-y-3">
      {faixa && <Faixa texto={faixa} />}
      {soTextoCorrido ? (
        <ConteudoGrupo textos={partes.flatMap((grupo) => grupo.textos)} fluido={false} />
      ) : (
        partes.map((grupo, i) => (
          <div
            key={i}
            className="rounded-xl px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.025)",
              borderLeft: "2px solid rgba(200,165,107,0.55)",
            }}
          >
            {grupo.rotulo && (
              <p className="text-[11px] font-semibold tracking-[0.04em] sm:tracking-[0.14em] uppercase mb-1.5 break-words" style={{ color: OURO }}>
                {grupo.rotulo}
              </p>
            )}
            <ConteudoGrupo textos={grupo.textos} fluido={false} />
          </div>
        ))
      )}
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
      <p className="text-sm leading-relaxed break-words" style={{ color: COR_FORTE, lineHeight: 1.7 }}>
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

function LeituraFluida({ leitura }: { leitura: LeituraPortal }) {
  return (
    <div className="space-y-7">
      {leitura.secoes.map((secao, indice) => (
        <section key={secao.id} className={indice > 0 ? "pt-8" : undefined} style={indice > 0 ? { borderTop: "1px solid rgba(200,165,107,0.16)" } : undefined}>
          <h3 className="font-tan-mon-cheri text-2xl leading-none mb-4" style={{ color: "#e8d5b0" }}>
            {secao.titulo}
          </h3>
          {secao.id === "oQueFazer" ? <PassosFluidos secao={secao} /> : <ParagrafosFluidos secao={secao} />}
        </section>
      ))}
    </div>
  );
}

function ParagrafosFluidos({ secao }: { secao: SecaoLeitura }) {
  const itens = itensDa(secao);
  const abreComFaixa =
    secao.id === "quemVoceE" &&
    itens.length > 1 &&
    !itens[0]?.rotulo &&
    (itens[0]?.texto.length ?? 0) <= 180;
  const faixa = abreComFaixa ? itens[0]?.texto : undefined;
  const corpo = abreComFaixa ? itens.slice(1) : itens;

  return (
    <div className="space-y-5">
      {faixa ? <Faixa texto={faixa} /> : null}
      {grupos(corpo).map((grupo, i) => (
        <div key={i}>
          {grupo.rotulo && (
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-1.5" style={{ color: OURO }}>
              {grupo.rotulo}
            </p>
          )}
          <ConteudoGrupo textos={grupo.textos} />
        </div>
      ))}
    </div>
  );
}

function PassosFluidos({ secao }: { secao: SecaoLeitura }) {
  const itens = itensDa(secao);
  const ultimo = itens[itens.length - 1];
  const temPergunta = itens.length > 1 && !!ultimo?.texto.trim().endsWith("?");
  const corpo = temPergunta ? itens.slice(0, -1) : itens;
  const passos = corpo.filter((item) => item.texto.length <= LIMITE_PASSO);
  const intros = corpo.filter((item) => item.texto.length > LIMITE_PASSO);
  const lista = passos.length > 1 || (passos.length === 1 && intros.length > 0) ? passos : [];
  const soltos = lista.length ? intros : corpo;

  return (
    <div className="space-y-4">
      {soltos.map((item, i) => (
        <TextoFormatado key={i} texto={item.texto} />
      ))}
      {lista.length > 0 && (
        <ol className="space-y-3">
          {lista.map((item, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: COR_TEXTO, lineHeight: 1.75 }}>
              <span className="font-semibold shrink-0" style={{ color: OURO }}>{i + 1}.</span>
              <span>{pontuar(item.texto)}</span>
            </li>
          ))}
        </ol>
      )}
      {temPergunta && ultimo && (
        <p className="text-[15px] leading-relaxed italic pt-2" style={{ color: COR_FORTE, lineHeight: 1.75 }}>
          {ultimo.texto}
        </p>
      )}
    </div>
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
            <p className="text-[11px] font-semibold tracking-[0.04em] sm:tracking-[0.14em] uppercase mb-1.5 break-words" style={{ color: OURO }}>
              {item.rotulo}
            </p>
          )}
          <TextoFormatado texto={item.texto} fluido={false} />
        </div>
      ))}
      {lista.length > 0 && (
        <ol className="list-none space-y-2.5">
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
                  <p className="text-[11px] font-semibold tracking-[0.04em] sm:tracking-[0.14em] uppercase mb-0.5 break-words" style={{ color: OURO }}>
                    {item.rotulo}
                  </p>
                )}
                <p className="text-sm leading-relaxed break-words" style={{ color: COR_TEXTO, lineHeight: 1.7 }}>
                  {pontuar(item.texto)}
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
          <p className="text-[11px] font-semibold tracking-[0.04em] sm:tracking-[0.14em] uppercase mb-1.5 break-words" style={{ color: OURO }}>
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
