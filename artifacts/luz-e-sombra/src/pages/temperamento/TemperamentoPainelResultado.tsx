import { useMemo } from "react";
import type { TemperamentoCodigo } from "@workspace/temperamento-v1";
import { NOME_TEMPERAMENTO } from "@workspace/temperamento-v1";
import { labelTipoPerfil, TEMPERAMENTO_VISUAL } from "./temperamentoConfig";
import LeituraBlocos from "@/components/LeituraBlocos";
import { leituraTemperamento } from "@/lib/leiturasPortal";
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

  const tituloPerfil = primario && secundario && perfil?.tipo ? perfil.arquetipo : perfil?.arquetipo ?? "";
  const mostraCombo = Boolean(r.combo || r.comboNarrativa) && primario !== secundario;

  const leitura = leituraTemperamento(r);

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

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.14)" }}>
        <div className="px-5 py-4" style={{ background: "rgba(30,24,18,0.55)" }}>
          <h2 className="font-tan-mon-cheri text-base" style={{ color: GOLD }}>
            Seu perfil
          </h2>
          <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.35)" }}>
            Nome e eixos
          </p>
        </div>
        <div
          className="px-5 py-5 space-y-4"
          style={{ background: "rgba(30,24,18,0.35)", borderTop: "1px solid rgba(200,165,107,0.08)" }}
        >
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
          </div>
        )}

        <div className="space-y-3 pt-1">
          <BarraEixo label="Energia social" valor={Math.round(scoreE)} cor={visP?.cor ?? GOLD} />
          <BarraEixo label="Estabilidade emocional" valor={Math.round(scoreEstab)} cor="#6db96d" />
        </div>

        {pct && primario && (
          <div className="space-y-3 pt-2">
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
      </div>

      {leitura && <LeituraBlocos leitura={leitura} />}
    </div>
  );
}
