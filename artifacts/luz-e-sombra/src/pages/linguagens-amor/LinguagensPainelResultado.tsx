import { useMemo, useState, type ReactNode } from "react";
import { Copy, Check, Heart, Sparkles } from "lucide-react";
import { LABEL_LINGUAGEM, type LinguagemAmor } from "@workspace/cinco-linguagens-amor";
import { LINGUAGEM_VISUAL } from "./linguagensConfig";
import { enriquecerResultado, isV2, isV3, type ResultadoLinguagensUi } from "./enriquecerResultado";

export type { ResultadoLinguagensUi };

const GOLD = "#c8a56b";

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-tan-mon-cheri text-lg" style={{ color: GOLD }}>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Prosa({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.72)", lineHeight: 1.85 }}>
      {children}
    </p>
  );
}

function BarrasRanking({
  ranking,
  destaque,
}: {
  ranking: { linguagem?: string; pontos?: number; pct?: number }[];
  destaque?: LinguagemAmor;
}) {
  return (
    <ul className="space-y-3">
      {ranking.map((row, i) => {
        const lang = (row.linguagem ?? "") as LinguagemAmor;
        const vis = LINGUAGEM_VISUAL[lang];
        const label = LABEL_LINGUAGEM[lang] ?? row.linguagem;
        const pct = Math.min(100, Math.max(0, row.pct ?? 0));
        const isTop = lang === destaque || i === 0;
        return (
          <li key={String(row.linguagem)}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: isTop && vis ? vis.cor : "rgba(247,242,236,0.5)" }}>{label}</span>
              <span className="tabular-nums" style={{ color: isTop ? GOLD : "rgba(247,242,236,0.4)" }}>
                {pct}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: isTop && vis
                    ? `linear-gradient(90deg, ${vis.cor}88, ${vis.cor})`
                    : "rgba(200,165,107,0.3)",
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Badge({ children, cor }: { children: ReactNode; cor: string }) {
  return (
    <span
      className="text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide font-medium"
      style={{ background: `${cor}18`, color: cor, border: `1px solid ${cor}40` }}
    >
      {children}
    </span>
  );
}

function PainelV3({
  resultado,
  nomePessoa,
  onIniciarExpressar,
}: {
  resultado: ResultadoLinguagensUi;
  nomePessoa?: string | null;
  onIniciarExpressar?: () => void;
}) {
  const narr = resultado.narrativa!;
  const principal = resultado.principal as LinguagemAmor;
  const sec = resultado.secundaria as LinguagemAmor | undefined;
  const vis = LINGUAGEM_VISUAL[principal];
  const Icon = vis.icon;
  const ranking = resultado.distribuicao ?? resultado.receber?.ranking ?? [];
  const [copiado, setCopiado] = useState(false);

  const intensidade = resultado.metricas?.intensidade;
  const confLabel = resultado.metricas?.confiancaLabel;

  function copiarCarta() {
    void navigator.clipboard.writeText(narr.cartaParceiro).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <article className="space-y-8">
      {/* Hero */}
      <header
        className="rounded-2xl p-6 md:p-7 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${vis.corBg} 0%, rgba(30,24,18,0.65) 55%, rgba(20,16,12,0.9) 100%)`,
          border: `1px solid ${vis.corBorder}`,
        }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: vis.corBg, border: `1px solid ${vis.corBorder}` }}
          >
            <Icon className="w-5 h-5" style={{ color: vis.cor }} />
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
              {nomePessoa ? `Perfil de ${nomePessoa}` : "Sua linguagem principal"}
            </p>
            <h1 className="font-tan-mon-cheri text-xl md:text-2xl" style={{ color: "#f7f2ec" }}>
              {narr.veredito}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {intensidade && (
            <Badge cor={vis.cor}>
              Intensidade {intensidade === "forte" ? "forte" : intensidade === "moderada" ? "moderada" : "equilibrada"}
            </Badge>
          )}
          {confLabel && (
            <Badge cor="#6b9fd4">
              Confiança {confLabel === "alta" ? "alta" : confLabel === "media" ? "média" : "baixa"}
            </Badge>
          )}
          {sec && principal !== sec && (
            <Badge cor={LINGUAGEM_VISUAL[sec].cor}>+ {LABEL_LINGUAGEM[sec]}</Badge>
          )}
        </div>
        <Prosa>{narr.abertura}</Prosa>
      </header>

      {/* Distribuição */}
      {ranking.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(30,24,18,0.45)", border: "1px solid rgba(200,165,107,0.12)" }}
        >
          <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.45)" }}>
            Distribuição do seu perfil
          </p>
          <BarrasRanking ranking={ranking} destaque={principal} />
        </div>
      )}

      {/* Corpo narrativo */}
      <div className="space-y-8 px-0.5">
        <Secao titulo="Por que você é assim">
          <Prosa>{narr.mecanismo}</Prosa>
        </Secao>

        <Secao titulo="Como isso aparece no seu dia a dia">
          <ul className="space-y-3">
            {narr.cenas.map((cena) => (
              <li
                key={cena.slice(0, 40)}
                className="text-sm pl-4 border-l-2 leading-relaxed"
                style={{ borderColor: "rgba(200,165,107,0.25)", color: "rgba(247,242,236,0.65)" }}
              >
                {cena}
              </li>
            ))}
          </ul>
        </Secao>

        <Secao titulo="Quando o amor falta">
          <Prosa>{narr.feridaPadrao}</Prosa>
        </Secao>

        {principal !== sec && sec && (
          <Secao titulo="Suas duas linguagens juntas">
            <Prosa>{narr.dinamicaPar}</Prosa>
          </Secao>
        )}

        <Secao titulo="Carta para quem te ama">
          <div
            className="rounded-xl p-5 relative"
            style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.15)" }}
          >
            <Prosa>{narr.cartaParceiro}</Prosa>
            <button
              type="button"
              onClick={copiarCarta}
              className="mt-4 flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg"
              style={{ background: "rgba(200,165,107,0.12)", color: GOLD }}
            >
              {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiado ? "Copiado!" : "Copiar carta"}
            </button>
          </div>
        </Secao>

        <Secao titulo="Plano de 7 dias">
          <ul className="space-y-3">
            {narr.planoSeteDias.map((dia, i) => (
              <li key={dia} className="flex gap-3 items-start">
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(200,165,107,0.15)", color: GOLD }}
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
                  {dia}
                </p>
              </li>
            ))}
          </ul>
        </Secao>

        <Secao titulo="Sua linguagem menos natural">
          <Prosa>{narr.linguagemAnti}</Prosa>
        </Secao>

        {narr.espelhoExpressar && (
          <Secao titulo="O espelho: como você demonstra amor">
            <Prosa>{narr.espelhoExpressar}</Prosa>
            {narr.ponteComunicacao && <Prosa>{narr.ponteComunicacao}</Prosa>}
          </Secao>
        )}

        {!resultado.expressarCompleto && onIniciarExpressar && (
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: "rgba(155,143,222,0.06)", border: "1px solid rgba(155,143,222,0.2)" }}
          >
            <Heart className="w-5 h-5 mx-auto mb-2" style={{ color: "rgba(155,143,222,0.8)" }} />
            <p className="text-sm mb-3" style={{ color: "rgba(247,242,236,0.6)" }}>
              Quer descobrir como você demonstra amor? Mais 5 perguntas rápidas.
            </p>
            <button
              type="button"
              onClick={onIniciarExpressar}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(155,143,222,0.2)", color: "rgba(200,190,255,0.95)" }}
            >
              Aprofundar perfil
            </button>
          </div>
        )}

        <div
          className="rounded-xl p-4 flex gap-3"
          style={{ background: "rgba(107,159,212,0.06)", border: "1px solid rgba(107,159,212,0.18)" }}
        >
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#6b9fd4" }} />
          <Prosa>{narr.confiancaNarrativa}</Prosa>
        </div>
      </div>
    </article>
  );
}

export default function LinguagensPainelResultado({
  resultado: raw,
  nomePessoa,
  onRefazer,
  onIniciarExpressar,
}: {
  resultado: ResultadoLinguagensUi;
  nomePessoa?: string | null;
  onRefazer?: () => void;
  onIniciarExpressar?: () => void;
}) {
  const resultado = useMemo(() => enriquecerResultado(raw, nomePessoa), [raw, nomePessoa]);
  const v3 = isV3(resultado);

  if (v3 && resultado.narrativa) {
    return (
      <PainelV3
        resultado={resultado}
        nomePessoa={nomePessoa}
        onIniciarExpressar={onIniciarExpressar}
      />
    );
  }

  // Fallback v2 legado — banner + campos antigos simplificados
  const v2 = isV2(resultado);
  const principal = (v2 ? resultado.receber?.principal : resultado.principal) as LinguagemAmor;
  const sintese = resultado.sinteseHumana ?? resultado.interpretacaoPar;

  return (
    <div className="space-y-5">
      {!v3 && (
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(224,123,57,0.1) 0%, rgba(30,24,18,0.5) 100%)",
            border: "1px solid rgba(224,123,57,0.28)",
          }}
        >
          <div className="flex-1">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(224,123,57,0.8)" }}>
              Resultado anterior
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
              Este perfil foi gerado com o questionário antigo. Refaça para ver o resultado atualizado.
            </p>
          </div>
          {onRefazer && (
            <button
              type="button"
              onClick={onRefazer}
              className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-semibold"
              style={{ background: GOLD, color: "#1a1208" }}
            >
              Atualizar
            </button>
          )}
        </div>
      )}
      {principal && sintese && (
        <div className="rounded-2xl p-6" style={{ border: "1px solid rgba(200,165,107,0.14)" }}>
          <h1 className="font-tan-mon-cheri text-xl mb-3" style={{ color: "#f7f2ec" }}>
            {LABEL_LINGUAGEM[principal]}
          </h1>
          <Prosa>{sintese}</Prosa>
        </div>
      )}
    </div>
  );
}
