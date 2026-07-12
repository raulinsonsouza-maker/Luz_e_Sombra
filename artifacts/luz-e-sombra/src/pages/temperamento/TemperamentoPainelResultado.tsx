import { useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Zap,
} from "lucide-react";
import type { TemperamentoCodigo } from "@workspace/temperamento-v1";
import { NOME_TEMPERAMENTO } from "@workspace/temperamento-v1";
import { labelTipoPerfil, TEMPERAMENTO_VISUAL } from "./temperamentoConfig";
import {
  enriquecerResultadoTemperamento,
  isResultadoLegado,
  type ResultadoTemperamentoUi,
} from "./enriquecerResultado";

const GOLD = "#c8a56b";

function BarraEixo({ label, valor, cor }: { label: string; valor: number; cor: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: "rgba(247,242,236,0.65)" }}>{label}</span>
        <span className="tabular-nums" style={{ color: cor }}>
          {valor}%
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${valor}%`, background: cor }} />
      </div>
    </div>
  );
}

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
  onRefazer,
}: {
  resultado: ResultadoTemperamentoUi;
  onRefazer?: () => void;
}) {
  const r = useMemo(() => enriquecerResultadoTemperamento(raw), [raw]);
  const perfil = r.perfil;
  const primario = perfil?.primario as TemperamentoCodigo | undefined;
  const secundario = perfil?.secundario as TemperamentoCodigo | undefined;
  const pct = r.scores?.temperamentos_percentuais;
  const visP = primario ? TEMPERAMENTO_VISUAL[primario] : null;
  const IconP = visP?.icon;
  const legado = isResultadoLegado(r);

  const scoreE = r.scores?.scoreE ?? Math.round((r.scores?.dimensoes?.ENG?.bruto ?? 50));
  const scoreEstab = r.scores?.estabilidadeEmocional ?? Math.round(100 - (r.scores?.scoreN ?? 50));

  const [detalhesAbertos, setDetalhesAbertos] = useState(false);

  const tituloPerfil = primario && secundario && perfil?.tipo ? perfil.arquetipo : perfil?.arquetipo ?? "";
  const mostraCombo = Boolean(r.combo || r.comboNarrativa) && primario !== secundario;

  return (
    <div className="space-y-5">
      {legado && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(155,143,222,0.08)", border: "1px solid rgba(155,143,222,0.2)" }}
        >
          <p style={{ color: "rgba(247,242,236,0.78)" }}>
            Atualizámos o teste: versão mais curta e análise mais profunda. Refazer leva cerca de 3 minutos.
          </p>
          {onRefazer && (
            <button
              type="button"
              className="mt-2 text-xs font-semibold underline"
              style={{ color: "#c8a56b" }}
              onClick={onRefazer}
            >
              Refazer questionário
            </button>
          )}
        </div>
      )}

      <Capitulo numero={1} titulo="Quem você é" subtitulo="Sua essência temperamental">
        {visP && IconP && perfil && (
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${visP.corBg} 0%, rgba(30,24,18,0.6) 100%)`,
              border: `1px solid ${visP.corBorder}`,
            }}
          >
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
                  {tituloPerfil}
                </h1>
                {secundario && primario !== secundario && (
                  <span
                    className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(200,165,107,0.12)", color: "rgba(200,165,107,0.85)" }}
                  >
                    com traço {NOME_TEMPERAMENTO[secundario]}
                  </span>
                )}
              </div>
            </div>

            {perfil.frase_sintese && (
              <p className="text-base italic font-tan-mon-cheri mb-4" style={{ color: "rgba(247,242,236,0.85)" }}>
                «{perfil.frase_sintese}»
              </p>
            )}

            {r.sinteseHumana && (
              <p className="text-sm leading-relaxed mb-4 font-medium" style={{ color: "rgba(247,242,236,0.78)", lineHeight: 1.85 }}>
                {r.sinteseHumana}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3 pt-1">
          <BarraEixo label="Energia social" valor={Math.round(scoreE)} cor={visP?.cor ?? GOLD} />
          <BarraEixo label="Estabilidade emocional" valor={Math.round(scoreEstab)} cor="#6db96d" />
        </div>

        {(r.tracosMarcantes?.length ?? 0) > 0 && (
          <ul className="space-y-2 pt-2">
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
        )}
      </Capitulo>

      {mostraCombo && (
        <Capitulo numero={2} titulo="A dinâmica do seu perfil" subtitulo="Primário e secundário">
          {r.comboNarrativa && (
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.72)", lineHeight: 1.9 }}>
              {r.comboNarrativa}
            </p>
          )}
          {r.combo && (
            <div className="grid gap-3">
              <div className="rounded-xl p-4" style={{ background: "rgba(109,185,109,0.06)", border: "1px solid rgba(109,185,109,0.2)" }}>
                <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(109,185,109,0.65)" }}>
                  Força da combinação
                </p>
                <p className="text-sm" style={{ color: "rgba(247,242,236,0.68)", lineHeight: 1.85 }}>
                  {r.combo.forca}
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(224,123,57,0.06)", border: "1px solid rgba(224,123,57,0.2)" }}>
                <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(224,123,57,0.65)" }}>
                  Tensão interna
                </p>
                <p className="text-sm" style={{ color: "rgba(247,242,236,0.68)", lineHeight: 1.85 }}>
                  {r.combo.tensao}
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.15)" }}>
                <p className="text-[10px] tracking-widest uppercase mb-1 flex items-center gap-1" style={{ color: "rgba(200,165,107,0.55)" }}>
                  <Zap className="w-3 h-3" />
                  Onde isso brilha
                </p>
                <p className="text-sm" style={{ color: "rgba(247,242,236,0.68)", lineHeight: 1.85 }}>
                  {r.combo.contexto}
                </p>
              </div>
            </div>
          )}
        </Capitulo>
      )}

      {(r.analiseAprofundada?.length ?? 0) > 0 && (
        <Capitulo numero={mostraCombo ? 3 : 2} titulo="Análise aprofundada" subtitulo="Leitura profissional do seu perfil">
          <div className="space-y-8">
            {r.analiseAprofundada!.map((sec) => (
              <section key={sec.id}>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: GOLD }}>
                  <BookOpen className="w-4 h-4 shrink-0 opacity-70" />
                  {sec.titulo}
                </h3>
                <div className="space-y-3">
                  {sec.paragrafos.map((p, i) => (
                    <p
                      key={`${sec.id}-${i}`}
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(247,242,236,0.72)", lineHeight: 1.9 }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Capitulo>
      )}

      {(r.seuDom || r.pontoCego) && (
        <Capitulo
          numero={(r.analiseAprofundada?.length ? (mostraCombo ? 4 : 3) : mostraCombo ? 3 : 2) as number}
          titulo="Resumo: dom e ponto cego"
          defaultOpen={false}
        >
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

      {(r.passoPratico || r.perguntaCrescimento) && (
        <Capitulo
          numero={5}
          titulo="Para crescer a partir daqui"
          defaultOpen={false}
        >
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

      {pct && primario && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.1)" }}>
          <button
            type="button"
            onClick={() => setDetalhesAbertos((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-left text-xs"
            style={{ background: "rgba(30,24,18,0.4)", color: "rgba(247,242,236,0.4)" }}
          >
            <span>Ver percentuais dos 4 temperamentos</span>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
