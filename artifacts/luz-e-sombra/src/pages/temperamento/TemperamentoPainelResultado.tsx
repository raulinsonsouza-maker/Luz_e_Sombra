import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { TemperamentoCodigo } from "@workspace/temperamento-v1";
import { labelTipoPerfil, TEMPERAMENTO_VISUAL } from "./temperamentoConfig";
import {
  enriquecerResultadoTemperamento,
  textoSecao,
  type ResultadoTemperamentoUi,
} from "./enriquecerResultado";

const GOLD = "#c8a56b";

function Capitulo({
  numero,
  titulo,
  subtitulo,
  defaultOpen = true,
  children,
}: {
  numero: number;
  titulo: string;
  subtitulo?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.14)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ background: "rgba(30,24,18,0.55)" }}
      >
        <div>
          <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>
            Capítulo {numero}
          </p>
          <h2 className="font-tan-mon-cheri text-base" style={{ color: GOLD }}>
            {titulo}
          </h2>
          {subtitulo && (
            <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.35)" }}>
              {subtitulo}
            </p>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      {open && (
        <div
          className="px-5 py-5 space-y-4"
          style={{ background: "rgba(30,24,18,0.35)", borderTop: "1px solid rgba(200,165,107,0.08)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function BarrasTemperamentos({
  pct,
  primario,
  secundario,
}: {
  pct: Record<string, number>;
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
}) {
  const ordem = (Object.entries(pct) as [TemperamentoCodigo, number][])
    .sort((a, b) => b[1] - a[1])
    .filter(([, v]) => v > 0);

  return (
    <ul className="space-y-3">
      {ordem.map(([cod, val]) => {
        const vis = TEMPERAMENTO_VISUAL[cod];
        const destaque = cod === primario || cod === secundario;
        return (
          <li key={cod}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: destaque ? vis.cor : "rgba(247,242,236,0.45)" }}>{vis.nome}</span>
              <span className="tabular-nums" style={{ color: destaque ? vis.cor : "rgba(247,242,236,0.4)" }}>
                {val}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${val}%`,
                  background: destaque
                    ? `linear-gradient(90deg, ${vis.cor}88, ${vis.cor})`
                    : "rgba(200,165,107,0.28)",
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function TemperamentoPainelResultado({
  resultado: raw,
}: {
  resultado: ResultadoTemperamentoUi;
}) {
  const r = useMemo(() => enriquecerResultadoTemperamento(raw), [raw]);
  const perfil = r.perfil;
  const primario = perfil?.primario as TemperamentoCodigo | undefined;
  const secundario = perfil?.secundario as TemperamentoCodigo | undefined;
  const pct = r.scores?.temperamentos_percentuais;
  const visP = primario ? TEMPERAMENTO_VISUAL[primario] : null;
  const visS = secundario ? TEMPERAMENTO_VISUAL[secundario] : null;
  const IconP = visP?.icon;

  const motor = textoSecao(r, "motor");
  const pensa = textoSecao(r, "pensa");
  const acao = textoSecao(r, "acao");
  const forca = textoSecao(r, "forca");
  const sabotagem = textoSecao(r, "sabotagem");
  const passo = textoSecao(r, "passo");
  const conf = typeof r.confiabilidade === "number" ? r.confiabilidade : null;

  return (
    <div className="space-y-5">
      {/* Capítulo 1 — Hero */}
      <Capitulo numero={1} titulo="O teu temperamento" subtitulo="Arquétipo e distribuição">
        {visP && IconP && perfil && (
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${visP.corBg} 0%, rgba(30,24,18,0.6) 100%)`,
              border: `1px solid ${visP.corBorder}`,
            }}
          >
            <div
              className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-20 blur-2xl pointer-events-none"
              style={{ background: visP.cor }}
            />
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4 relative">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: visP.corBg, border: `1px solid ${visP.corBorder}` }}
                >
                  <IconP className="w-6 h-6" style={{ color: visP.cor }} />
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
                    {labelTipoPerfil(perfil.tipo)}
                  </p>
                  <h1 className="font-tan-mon-cheri text-xl md:text-2xl" style={{ color: "#f7f2ec" }}>
                    {perfil.arquetipo}
                  </h1>
                </div>
              </div>
              {conf != null && (
                <span
                  className="text-xs px-3 py-1 rounded-full tabular-nums"
                  style={{
                    background: conf >= 80 ? "rgba(109,185,109,0.12)" : "rgba(224,123,57,0.1)",
                    color: conf >= 80 ? "rgba(109,185,109,0.85)" : "rgba(224,123,57,0.85)",
                    border: conf >= 80 ? "1px solid rgba(109,185,109,0.25)" : "1px solid rgba(224,123,57,0.25)",
                  }}
                >
                  {conf}% confiança
                </span>
              )}
            </div>

            {perfil.frase_sintese && (
              <p className="text-base italic font-tan-mon-cheri mb-4 relative" style={{ color: "rgba(247,242,236,0.82)" }}>
                «{perfil.frase_sintese}»
              </p>
            )}

            {primario && secundario && visS && pct && (
              <div className="flex flex-wrap gap-2 mb-4 relative">
                <span
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ color: visP.cor, background: visP.corBg, border: `1px solid ${visP.corBorder}` }}
                >
                  {visP.nome} · {pct[primario]}%
                </span>
                {primario !== secundario && (
                  <span
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ color: visS.cor, background: visS.corBg, border: `1px solid ${visS.corBorder}` }}
                  >
                    {visS.nome} · {pct[secundario]}%
                  </span>
                )}
              </div>
            )}

            {r.sinteseHumana && (
              <p className="text-sm leading-relaxed relative" style={{ color: "rgba(247,242,236,0.68)", lineHeight: 1.85 }}>
                {r.sinteseHumana}
              </p>
            )}
          </div>
        )}

        {pct && primario && secundario && (
          <BarrasTemperamentos pct={pct} primario={primario} secundario={secundario} />
        )}

        {r.empateProximo && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ color: "rgba(155,143,222,0.85)", background: "rgba(155,143,222,0.08)" }}>
            Os dois temperamentos de topo estão muito próximos — trata isto como zona de transição, não rótulo fixo.
          </p>
        )}
      </Capitulo>

      {/* Capítulo 2 — Motor */}
      {motor && (
        <Capitulo numero={2} titulo="O que te move por dentro" defaultOpen>
          <div className="flex gap-3">
            <Zap className="w-5 h-5 shrink-0 mt-0.5" style={{ color: visP?.cor ?? GOLD }} />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.7)", lineHeight: 1.85 }}>
              {motor}
            </p>
          </div>
        </Capitulo>
      )}

      {/* Capítulo 3 — Mente e ação */}
      {(pensa || acao) && (
        <Capitulo numero={3} titulo="Como pensas e como ages" defaultOpen={false}>
          {pensa && (
            <div>
              <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.45)" }}>
                Padrão de pensamento
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)", lineHeight: 1.85 }}>
                {pensa}
              </p>
            </div>
          )}
          {acao && (
            <div>
              <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.45)" }}>
                Padrão de ação
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)", lineHeight: 1.85 }}>
                {acao}
              </p>
            </div>
          )}
        </Capitulo>
      )}

      {/* Capítulo 4 — Força e sabotagem */}
      {(forca || sabotagem) && (
        <Capitulo numero={4} titulo="Força e padrão de sabotagem" defaultOpen>
          <div className="grid md:grid-cols-2 gap-3">
            {forca && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(109,185,109,0.06)", border: "1px solid rgba(109,185,109,0.2)" }}
              >
                <p className="text-[10px] tracking-widest uppercase mb-2 flex items-center gap-1.5" style={{ color: "rgba(109,185,109,0.65)" }}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  Força real
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)" }}>
                  {forca}
                </p>
              </div>
            )}
            {sabotagem && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(224,123,57,0.06)", border: "1px solid rgba(224,123,57,0.2)" }}
              >
                <p className="text-[10px] tracking-widest uppercase mb-2 flex items-center gap-1.5" style={{ color: "rgba(224,123,57,0.65)" }}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Onde te sabotas
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)" }}>
                  {sabotagem}
                </p>
              </div>
            )}
          </div>
        </Capitulo>
      )}

      {/* Capítulo 5 — Combo duplo */}
      {r.combo && (
        <Capitulo numero={5} titulo="A dupla dinâmica" subtitulo={`${visP?.nome} + ${visS?.nome}`} defaultOpen>
          <div className="space-y-3">
            <div className="rounded-xl p-4" style={{ background: "rgba(109,185,109,0.05)", border: "1px solid rgba(109,185,109,0.15)" }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "rgba(109,185,109,0.6)" }}>
                Força central
              </p>
              <p className="text-sm" style={{ color: "rgba(247,242,236,0.68)" }}>{r.combo.forca}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(224,123,57,0.05)", border: "1px solid rgba(224,123,57,0.15)" }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "rgba(224,123,57,0.6)" }}>
                Tensão interna
              </p>
              <p className="text-sm" style={{ color: "rgba(247,242,236,0.68)" }}>{r.combo.tensao}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.12)" }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "rgba(200,165,107,0.55)" }}>
                Onde brilhas
              </p>
              <p className="text-sm" style={{ color: "rgba(247,242,236,0.68)" }}>{r.combo.contexto}</p>
            </div>
          </div>
        </Capitulo>
      )}

      {/* Capítulo 6 — Eixos */}
      {r.dimensoesLegiveis && r.dimensoesLegiveis.length > 0 && (
        <Capitulo numero={r.combo ? 6 : 5} titulo="Os teus cinco eixos" defaultOpen={false}>
          <ul className="space-y-3">
            {r.dimensoesLegiveis.map((d) => (
              <li key={d.dimensao}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "rgba(247,242,236,0.55)" }}>{d.label}</span>
                  <span className="tabular-nums" style={{ color: GOLD }}>{d.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.pct}%`,
                      background: d.pct >= 70 ? `linear-gradient(90deg, ${GOLD}66, ${GOLD})` : "rgba(200,165,107,0.35)",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          {(r.insightsDimensao?.length ?? 0) > 0 && (
            <ul className="mt-3 space-y-2">
              {r.insightsDimensao!.map((ins) => (
                <li key={ins} className="text-xs leading-relaxed flex gap-2" style={{ color: "rgba(247,242,236,0.48)" }}>
                  <span style={{ color: GOLD }}>·</span>
                  {ins}
                </li>
              ))}
            </ul>
          )}
        </Capitulo>
      )}

      {/* Capítulo 7 — Próximo passo */}
      {(passo || r.perguntaCrescimento) && (
        <Capitulo numero={r.combo ? 7 : 6} titulo="Próximo passo" defaultOpen>
          {passo && (
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)", lineHeight: 1.85 }}>
              {passo.replace(/Pergunta prática:\s*«[^»]+»\.?\s*/g, "").trim()}
            </p>
          )}
          {r.perguntaCrescimento && (
            <div
              className="rounded-xl p-5 text-center flex flex-col items-center gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(200,165,107,0.08) 0%, rgba(30,24,18,0.4) 100%)",
                border: "1px solid rgba(200,165,107,0.2)",
              }}
            >
              <Target className="w-4 h-4" style={{ color: GOLD }} />
              <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
                Pergunta de crescimento
              </p>
              <p className="text-sm italic font-tan-mon-cheri" style={{ color: "rgba(247,242,236,0.78)" }}>
                {r.perguntaCrescimento}
              </p>
            </div>
          )}
        </Capitulo>
      )}
    </div>
  );
}
