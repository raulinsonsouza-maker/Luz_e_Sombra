import { ehTopico, estruturarTexto, pontuar, type BlocoLeitura } from "@/lib/formatarLeitura";

const COR_TEXTO = "rgba(247,242,236,0.78)";
const COR_FORTE = "rgba(247,242,236,0.94)";
const OURO = "#c8a56b";

function classe(fluido: boolean): string {
  return fluido ? "text-[15px] leading-relaxed break-words" : "text-sm leading-relaxed break-words";
}

function estilo(fluido: boolean): { color: string; lineHeight: number } {
  return { color: COR_TEXTO, lineHeight: fluido ? 1.8 : 1.75 };
}

function Frase({ texto }: { texto: string }) {
  const corte = texto.match(/^(.+?[.!?])\s+([\s\S]+)$/);
  if (!corte || corte[1].length > 220) return <span style={{ color: COR_TEXTO }}>{texto}</span>;
  return (
    <>
      <span className="font-semibold" style={{ color: COR_FORTE }}>{corte[1]}</span>{" "}
      <span style={{ color: COR_TEXTO }}>{corte[2]}</span>
    </>
  );
}

function Rotulo({ texto }: { texto: string }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1.5 break-words" style={{ color: OURO }}>
      {texto}
    </p>
  );
}

function Lista({ itens, intro, fluido }: { itens: string[]; intro?: string; fluido: boolean }) {
  return (
    <div>
      {intro && <Rotulo texto={intro} />}
      <ul className="space-y-2">
        {itens.map((item, i) => (
          <li key={i} className="flex gap-2.5 min-w-0">
            <span className="mt-[0.55em] h-1.5 w-1.5 rounded-full shrink-0" style={{ background: OURO }} />
            <span className={`${classe(fluido)} min-w-0`} style={estilo(fluido)}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlocoView({ bloco, fluido }: { bloco: BlocoLeitura; fluido: boolean }) {
  if (bloco.tipo === "lista") return <Lista itens={bloco.itens} intro={bloco.intro} fluido={fluido} />;
  if (bloco.tipo === "rotulo") {
    return (
      <div>
        <Rotulo texto={bloco.rotulo} />
        <p className={classe(fluido)} style={estilo(fluido)}>{bloco.texto}</p>
      </div>
    );
  }
  if (bloco.tipo === "citacao") {
    return (
      <blockquote
        className={`${classe(fluido)} italic pl-4`}
        style={{ ...estilo(fluido), color: COR_FORTE, borderLeft: `2px solid ${OURO}` }}
      >
        {bloco.texto}
      </blockquote>
    );
  }
  return (
    <p className={classe(fluido)} style={estilo(fluido)}>
      {fluido ? bloco.texto : <Frase texto={bloco.texto} />}
    </p>
  );
}

export function TextoFormatado({ texto, fluido = true }: { texto: string; fluido?: boolean }) {
  const blocos = estruturarTexto(texto);
  return (
    <div className={fluido ? "space-y-3" : "space-y-2.5"}>
      {blocos.map((bloco, i) => <BlocoView key={i} bloco={bloco} fluido={fluido} />)}
    </div>
  );
}

export function ListaItens({ itens, fluido = true }: { itens: string[]; fluido?: boolean }) {
  return <Lista itens={itens.map((item) => pontuar(item))} fluido={fluido} />;
}

export function ConteudoGrupo({ textos, fluido = true }: { textos: string[]; fluido?: boolean }) {
  if (textos.length > 1 && textos.every(ehTopico)) return <ListaItens itens={textos} fluido={fluido} />;
  return (
    <div className={fluido ? "space-y-3" : "space-y-2.5"}>
      {textos.map((texto, i) => <TextoFormatado key={i} texto={texto} fluido={fluido} />)}
    </div>
  );
}
