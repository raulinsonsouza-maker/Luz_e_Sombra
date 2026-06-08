import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Sparkles,
  Target,
  TrendingUp,
  AlertCircle,
  User,
} from "lucide-react";
import type { TemperamentoCodigo } from "@workspace/temperamento-v1";
import { labelTipoPerfil, TEMPERAMENTO_VISUAL } from "./temperamentoConfig";
import { enriquecerResultadoTemperamento, type ResultadoTemperamentoUi } from "./enriquecerResultado";

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

  const [detalhesAbertos, setDetalhesAbertos] = useState(false);

  return (
    <div className="space-y-5">
      {/* Capítulo 1 — Quem você é */}
      <Capitulo numero={1} titulo="Quem você é" subtitulo="Sua essência temperamental">
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
            <div className="flex items-start gap-3 mb-4 relative">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
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
                {primario && secundario && visS && pct && primario !== secundario && (
                  <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.45)" }}>
                    {visP.nome} + {visS.nome}
                  </p>
                )}
              </div>
            </div>

            {perfil.frase_sintese && (
              <p className="text-base italic font-tan-mon-cheri mb-4 relative" style={{ color: "rgba(247,242,236,0.85)" }}>
                «{perfil.frase_sintese}»
              </p>
            )}

            {r.sinteseHumana && (
              <p className="text-sm leading-relaxed mb-4 relative font-medium" style={{ color: "rgba(247,242,236,0.78)", lineHeight: 1.85 }}>
                {r.sinteseHumana}
              </p>
            )}

            {r.portraitIdentidade && (
              <p className="text-sm leading-relaxed relative" style={{ color: "rgba(247,242,236,0.68)", lineHeight: 1.9 }}>
                {r.portraitIdentidade}
              </p>
            )}
          </div>
        )}

        {(r.tracosMarcantes?.length ?? 0) > 0 && (
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.45)" }}>
              O que mais te define
            </p>
            <ul className="space-y-2">
              {r.tracosMarcantes!.map((t) => (
                <li
                  key={t}
                  className="flex gap-2 text-sm leading-relaxed rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.03)", color: "rgba(247,242,236,0.65)" }}
                >
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: visP?.cor ?? GOLD }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {r.empateProximo && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ color: "rgba(155,143,222,0.85)", background: "rgba(155,143,222,0.08)" }}>
            Seus dois temperamentos principais estão bem próximos — você alterna entre essas forças conforme a situação.
          </p>
        )}
      </Capitulo>

      {/* Capítulo 2 — No dia a dia */}
      {r.noDiaADia && (
        <Capitulo numero={2} titulo="Como você funciona no dia a dia" subtitulo="Pensamento e ação">
          <div className="flex gap-3">
            <User className="w-5 h-5 shrink-0 mt-0.5" style={{ color: visP?.cor ?? GOLD }} />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.72)", lineHeight: 1.9 }}>
              {r.noDiaADia}
            </p>
          </div>
        </Capitulo>
      )}

      {/* Capítulo 3 — Dom e ponto cego */}
      {(r.seuDom || r.pontoCego) && (
        <Capitulo numero={3} titulo="Seu dom e seu ponto cego" defaultOpen>
          <div className="grid md:grid-cols-2 gap-3">
            {r.seuDom && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(109,185,109,0.06)", border: "1px solid rgba(109,185,109,0.2)" }}
              >
                <p className="text-[10px] tracking-widest uppercase mb-2 flex items-center gap-1.5" style={{ color: "rgba(109,185,109,0.65)" }}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  Seu dom
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.68)", lineHeight: 1.85 }}>
                  {r.seuDom}
                </p>
              </div>
            )}
            {r.pontoCego && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(224,123,57,0.06)", border: "1px solid rgba(224,123,57,0.2)" }}
              >
                <p className="text-[10px] tracking-widest uppercase mb-2 flex items-center gap-1.5" style={{ color: "rgba(224,123,57,0.65)" }}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  Onde você pode tropeçar
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.68)", lineHeight: 1.85 }}>
                  {r.pontoCego}
                </p>
              </div>
            )}
          </div>
        </Capitulo>
      )}

      {/* Capítulo 4 — Combinação (duplo) */}
      {r.combo && (r.comboNarrativa || r.combo.forca) && (
        <Capitulo
          numero={4}
          titulo="Sua combinação única"
          subtitulo={visP && visS ? `${visP.nome} + ${visS.nome}` : undefined}
          defaultOpen
        >
          {r.comboNarrativa && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.72)", lineHeight: 1.9 }}>
              {r.comboNarrativa}
            </p>
          )}
          <div className="space-y-3">
            <div className="rounded-xl p-4" style={{ background: "rgba(109,185,109,0.05)", border: "1px solid rgba(109,185,109,0.15)" }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "rgba(109,185,109,0.6)" }}>
                O que isso te dá de força
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.68)" }}>{r.combo.forca}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(224,123,57,0.05)", border: "1px solid rgba(224,123,57,0.15)" }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "rgba(224,123,57,0.6)" }}>
                O que pede atenção
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.68)" }}>{r.combo.tensao}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.12)" }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "rgba(200,165,107,0.55)" }}>
                Onde você brilha
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.68)" }}>{r.combo.contexto}</p>
            </div>
          </div>
        </Capitulo>
      )}

      {/* Capítulo 5 — Crescimento */}
      {(r.passoPratico || r.perguntaCrescimento) && (
        <Capitulo numero={r.combo ? 5 : 4} titulo="Para crescer a partir daqui" defaultOpen>
          {r.passoPratico && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.68)", lineHeight: 1.85 }}>
              {r.passoPratico}
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
                Pergunta para refletir
              </p>
              <p className="text-sm italic font-tan-mon-cheri" style={{ color: "rgba(247,242,236,0.82)" }}>
                {r.perguntaCrescimento}
              </p>
            </div>
          )}
        </Capitulo>
      )}

      {/* Detalhes opcionais — percentuais */}
      {pct && primario && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.1)" }}>
          <button
            type="button"
            onClick={() => setDetalhesAbertos((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-left text-xs"
            style={{ background: "rgba(30,24,18,0.4)", color: "rgba(247,242,236,0.4)" }}
          >
            <span>Ver distribuição detalhada dos temperamentos</span>
            {detalhesAbertos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {detalhesAbertos && (
            <div className="px-5 py-4 space-y-3" style={{ borderTop: "1px solid rgba(200,165,107,0.08)" }}>
              {(Object.entries(pct) as [TemperamentoCodigo, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([cod, val]) => {
                  const vis = TEMPERAMENTO_VISUAL[cod];
                  const destaque = cod === primario || cod === secundario;
                  return (
                    <div key={cod}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: destaque ? vis.cor : "rgba(247,242,236,0.4)" }}>{vis.nome}</span>
                        <span className="tabular-nums" style={{ color: destaque ? vis.cor : "rgba(247,242,236,0.35)" }}>
                          {val}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${val}%`,
                            background: destaque ? vis.cor : "rgba(200,165,107,0.25)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              <p className="text-[10px] pt-2 flex items-center gap-1.5" style={{ color: "rgba(247,242,236,0.3)" }}>
                <Heart className="w-3 h-3" />
                Os percentuais apoiam a leitura — o foco está em quem você é, não nos números.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
