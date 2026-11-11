import { useMemo } from "react";
import type { RespostaSimNao, TemperamentoCodigo } from "@workspace/temperamento-v1";
import { montarLeituraConversa, NOME_TEMPERAMENTO } from "@workspace/temperamento-v1";
import { labelTipoPerfil, TEMPERAMENTO_VISUAL } from "./temperamentoConfig";
import LeituraBlocos, { CartaoPadrao, CorpoCartao } from "@/components/LeituraBlocos";
import { leituraTemperamento } from "@/lib/leiturasPortal";
import {
  enriquecerResultadoTemperamento,
  type ResultadoTemperamentoUi,
} from "./enriquecerResultado";

const GOLD = "#c8a56b";

export default function TemperamentoPainelResultado({
  resultado: raw,
  respostas,
}: {
  resultado: ResultadoTemperamentoUi;
  respostas?: Record<string, RespostaSimNao> | null;
}) {
  const r = useMemo(() => enriquecerResultadoTemperamento(raw), [raw]);
  const perfil = r.perfil;
  const primario = perfil?.primario as TemperamentoCodigo | undefined;
  const secundario = perfil?.secundario as TemperamentoCodigo | undefined;
  const pct = r.scores?.temperamentos_percentuais;
  const visP = primario ? TEMPERAMENTO_VISUAL[primario] : null;
  const IconP = visP?.icon;

  const tituloPerfil = primario && secundario && perfil?.tipo ? perfil.arquetipo : perfil?.arquetipo ?? "";

  const leitura = leituraTemperamento(r);
  const cartoes = useMemo(() => {
    if (!primario || !secundario || !pct) return null;
    return montarLeituraConversa({
      primario,
      secundario,
      percentuais: {
        COLERICO: pct.COLERICO ?? 0,
        SANGUINEO: pct.SANGUINEO ?? 0,
        MELANCOLICO: pct.MELANCOLICO ?? 0,
        FLEUMATICO: pct.FLEUMATICO ?? 0,
      },
      respostas: respostas ?? undefined,
      questionarioClaro: r.questionario === "claro",
    });
  }, [primario, secundario, pct, respostas, r.questionario]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.14)" }}>
        <div className="px-5 py-4" style={{ background: "rgba(30,24,18,0.55)" }}>
          <h2 className="font-tan-mon-cheri text-base" style={{ color: GOLD }}>
            Seu temperamento
          </h2>
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
              <div className="min-w-0">
                <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
                  {labelTipoPerfil(perfil.tipo)}
                </p>
                <h1 className="font-tan-mon-cheri text-xl md:text-2xl leading-snug break-words" style={{ color: "#f7f2ec" }}>
                  {tituloPerfil}
                </h1>
                {secundario && primario !== secundario && (
                  <span
                    className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(200,165,107,0.12)", color: "rgba(200,165,107,0.85)" }}
                  >
                    com características de {NOME_TEMPERAMENTO[secundario]}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {pct && primario && (
          <div className="space-y-3 pt-2">
            <p className="text-xs" style={{ color: "rgba(247,242,236,0.4)" }}>
              A intensidade de cada temperamento nas suas respostas.
            </p>
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

      {cartoes ? (
        <div className="space-y-4">
          {cartoes.map((cartao) => (
            <CartaoPadrao key={cartao.id} titulo={cartao.titulo}>
              <CorpoCartao paragrafos={cartao.paragrafos} perguntas={cartao.perguntas} passos={cartao.passos} />
            </CartaoPadrao>
          ))}
        </div>
      ) : (
        leitura && <LeituraBlocos leitura={leitura} />
      )}
    </div>
  );
}
