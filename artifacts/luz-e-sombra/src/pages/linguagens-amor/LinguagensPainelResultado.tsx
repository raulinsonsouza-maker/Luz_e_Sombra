import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Droplets, Sparkles, Users } from "lucide-react";
import { LABEL_LINGUAGEM, type LinguagemAmor } from "@workspace/cinco-linguagens-amor";
import { LINGUAGEM_VISUAL } from "./linguagensConfig";
import { enriquecerResultado, isV2, type ResultadoLinguagensUi } from "./enriquecerResultado";

export type { ResultadoLinguagensUi };

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

function Tag({ children, cor, corBg, corBorder }: { children: ReactNode; cor: string; corBg: string; corBorder: string }) {
  return (
    <span
      className="text-xs px-3 py-1.5 rounded-full font-medium"
      style={{ color: cor, background: corBg, border: `1px solid ${corBorder}` }}
    >
      {children}
    </span>
  );
}

function BarrasRanking({
  ranking,
  destaque,
  compact,
}: {
  ranking: { linguagem?: string; pontos?: number; pct?: number }[];
  destaque?: LinguagemAmor;
  compact?: boolean;
}) {
  return (
    <ul className={compact ? "space-y-2" : "space-y-3"}>
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

function HeroLinguagem({
  principal,
  secundaria,
  pctPrincipal,
  pctSecundaria,
  perfilEquilibrado,
  nomePessoa,
}: {
  principal: LinguagemAmor;
  secundaria?: LinguagemAmor;
  pctPrincipal?: number;
  pctSecundaria?: number;
  perfilEquilibrado?: boolean;
  nomePessoa?: string | null;
}) {
  const vis = LINGUAGEM_VISUAL[principal];
  const Icon = vis.icon;
  const labelP = LABEL_LINGUAGEM[principal];
  const labelS = secundaria ? LABEL_LINGUAGEM[secundaria] : null;

  return (
    <div
      className="rounded-2xl p-6 md:p-7 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${vis.corBg} 0%, rgba(30,24,18,0.65) 55%, rgba(20,16,12,0.9) 100%)`,
        border: `1px solid ${vis.corBorder}`,
      }}
    >
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ background: vis.cor }}
      />
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4 relative">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: vis.corBg, border: `1px solid ${vis.corBorder}` }}
          >
            <Icon className="w-6 h-6" style={{ color: vis.cor }} />
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.5)" }}>
              {nomePessoa ? `Perfil de ${nomePessoa}` : "Sua linguagem principal"}
            </p>
            <p className="text-xs italic" style={{ color: vis.cor }}>
              {vis.apelido}
            </p>
          </div>
        </div>
        {pctPrincipal != null && (
          <div className="text-right">
            <p className="text-3xl font-bold font-tan-mon-cheri tabular-nums" style={{ color: vis.cor }}>
              {pctPrincipal}%
            </p>
            <p className="text-[10px] uppercase tracking-wide" style={{ color: "rgba(247,242,236,0.35)" }}>
              ao receber
            </p>
          </div>
        )}
      </div>

      <h1 className="font-tan-mon-cheri text-2xl md:text-3xl mb-3 relative" style={{ color: "#f7f2ec" }}>
        {labelP}
      </h1>

      {secundaria && principal !== secundaria && labelS && (
        <div className="flex flex-wrap items-center gap-2 mb-4 relative">
          <Tag cor={vis.cor} corBg={vis.corBg} corBorder={vis.corBorder}>
            Principal
          </Tag>
          <span className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
            +
          </span>
          <Tag
            cor={LINGUAGEM_VISUAL[secundaria].cor}
            corBg={LINGUAGEM_VISUAL[secundaria].corBg}
            corBorder={LINGUAGEM_VISUAL[secundaria].corBorder}
          >
            {labelS}
            {pctSecundaria != null ? ` · ${pctSecundaria}%` : ""}
          </Tag>
          {perfilEquilibrado && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: "rgba(155,143,222,0.12)", color: "rgba(155,143,222,0.85)", border: "1px solid rgba(155,143,222,0.25)" }}
            >
              Perfil bilíngue
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function LinguagensPainelResultado({
  resultado: raw,
  nomePessoa,
  onRefazer,
}: {
  resultado: ResultadoLinguagensUi;
  nomePessoa?: string | null;
  onRefazer?: () => void;
}) {
  const resultado = useMemo(() => enriquecerResultado(raw, nomePessoa), [raw, nomePessoa]);
  const v2 = isV2(resultado);
  const principal = (v2 ? resultado.receber?.principal : resultado.principal) as LinguagemAmor;
  const sec = (v2 ? resultado.receber?.secundaria : resultado.secundaria) as LinguagemAmor | undefined;
  const expressarPrincipal = resultado.expressar?.principal as LinguagemAmor | undefined;
  const rankingReceber = v2 ? resultado.receber?.ranking ?? [] : resultado.ranking ?? [];
  const rankingExpressar = v2 ? resultado.expressar?.ranking ?? [] : [];
  const pctP = rankingReceber[0]?.pct;
  const pctS = rankingReceber[1]?.pct;
  const descompasso =
    v2 && expressarPrincipal && principal && expressarPrincipal !== principal;

  return (
    <div className="space-y-5">
      {!v2 && (
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(224,123,57,0.1) 0%, rgba(30,24,18,0.5) 100%)",
            border: "1px solid rgba(224,123,57,0.28)",
          }}
        >
          <div className="flex-1">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(224,123,57,0.8)" }}>
              Resultado anterior (v1)
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
              Este perfil foi gerado com o questionário antigo. Refaça a análise para ver{" "}
              <strong style={{ color: GOLD }}>receber</strong> e <strong style={{ color: GOLD }}>expressar</strong>{" "}
              separados, com cruzamento e mais profundidade.
            </p>
          </div>
          {onRefazer && (
            <button
              type="button"
              onClick={onRefazer}
              className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-semibold"
              style={{ background: GOLD, color: "#1a1208" }}
            >
              Atualizar para v2
            </button>
          )}
        </div>
      )}

      {/* Capítulo 1 — Mapa afetivo */}
      <Capitulo numero={1} titulo="Seu mapa afetivo" subtitulo="O tanque emocional de Gary Chapman">
        {principal && (
          <HeroLinguagem
            principal={principal}
            secundaria={sec}
            pctPrincipal={pctP}
            pctSecundaria={pctS}
            perfilEquilibrado={resultado.perfilEquilibrado}
            nomePessoa={nomePessoa}
          />
        )}

        {resultado.sinteseHumana && (
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.78)", lineHeight: 1.85 }}>
            {resultado.sinteseHumana}
          </p>
        )}

        {resultado.tanqueEmocional && (
          <div
            className="rounded-xl p-4 flex gap-3"
            style={{ background: "rgba(107,159,212,0.06)", border: "1px solid rgba(107,159,212,0.18)" }}
          >
            <Droplets className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#6b9fd4" }} />
            <div>
              <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(107,159,212,0.65)" }}>
                Tanque emocional
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)" }}>
                {resultado.tanqueEmocional}
              </p>
            </div>
          </div>
        )}

        {v2 && descompasso && (
          <div className="flex flex-wrap gap-2">
            <Tag
              cor={LINGUAGEM_VISUAL[principal].cor}
              corBg={LINGUAGEM_VISUAL[principal].corBg}
              corBorder={LINGUAGEM_VISUAL[principal].corBorder}
            >
              Recebe: {LABEL_LINGUAGEM[principal]}
            </Tag>
            <Tag
              cor={LINGUAGEM_VISUAL[expressarPrincipal!].cor}
              corBg={LINGUAGEM_VISUAL[expressarPrincipal!].corBg}
              corBorder={LINGUAGEM_VISUAL[expressarPrincipal!].corBorder}
            >
              Expressa: {LABEL_LINGUAGEM[expressarPrincipal!]}
            </Tag>
          </div>
        )}
      </Capitulo>

      {/* Capítulo 2 — Receber */}
      {resultado.perfilPrincipal && (
        <Capitulo numero={2} titulo="Como você se sente amado(a)" defaultOpen>
          <p className="text-sm leading-relaxed italic" style={{ color: "rgba(247,242,236,0.55)" }}>
            {resultado.perfilPrincipal.essencia}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.7)", lineHeight: 1.85 }}>
            {resultado.perfilPrincipal.comoSeSenteAmado}
          </p>
          {resultado.perfilPrincipal.dialetos.length > 0 && (
            <div>
              <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.45)" }}>
                Formas que mais enchem seu tanque
              </p>
              <div className="flex flex-wrap gap-2">
                {resultado.perfilPrincipal.dialetos.map((d) => (
                  <span
                    key={d}
                    className="text-xs px-3 py-2 rounded-xl leading-snug max-w-full"
                    style={{
                      background: "rgba(200,165,107,0.06)",
                      border: "1px solid rgba(200,165,107,0.12)",
                      color: "rgba(247,242,236,0.58)",
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Capitulo>
      )}

      {/* Capítulo 3 — Expressar (v2) */}
      {v2 && resultado.perfilExpressar && (
        <Capitulo
          numero={3}
          titulo="Como você demonstra amor"
          subtitulo={
            descompasso
              ? "Sua forma natural de dar pode ser diferente da forma como precisa receber"
              : "Receber e expressar na mesma linguagem"
          }
          defaultOpen={descompasso}
        >
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.68)", lineHeight: 1.85 }}>
            {resultado.perfilExpressar.comoExpressa || resultado.perfilExpressar.essencia}
          </p>
          {resultado.desalinhamento?.ativo && resultado.desalinhamento.texto && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(155,143,222,0.06)", border: "1px solid rgba(155,143,222,0.2)" }}
            >
              <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(155,143,222,0.6)" }}>
                Receber vs expressar
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)" }}>
                {resultado.desalinhamento.texto}
              </p>
            </div>
          )}
        </Capitulo>
      )}

      {/* Capítulo 4 — Combinação */}
      {(resultado.combinacao || (resultado.perfilSecundario && sec && sec !== principal)) && (
        <Capitulo numero={v2 ? 4 : 3} titulo="As duas linguagens juntas" defaultOpen={false}>
          {resultado.combinacao && (
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)", lineHeight: 1.85 }}>
              {resultado.combinacao}
            </p>
          )}
          {resultado.perfilSecundario && sec && sec !== principal && (
            <div
              className="rounded-xl p-4 mt-2"
              style={{
                background: LINGUAGEM_VISUAL[sec].corBg,
                border: `1px solid ${LINGUAGEM_VISUAL[sec].corBorder}`,
              }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: LINGUAGEM_VISUAL[sec].cor }}>
                Segunda linguagem: {LABEL_LINGUAGEM[sec]}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.58)" }}>
                {resultado.perfilSecundario.comoSeSenteAmado}
              </p>
            </div>
          )}
        </Capitulo>
      )}

      {/* Capítulo 5 — Relacionamento */}
      {((resultado.evitar?.length ?? 0) > 0 || resultado.paraQuemTeAma) && (
        <Capitulo numero={v2 ? 5 : 4} titulo="No relacionamento" defaultOpen>
          {resultado.evitar && resultado.evitar.length > 0 && (
            <div>
              <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(224,123,57,0.55)" }}>
                O que mais esvazia o tanque
              </p>
              <ul className="space-y-2">
                {resultado.evitar.map((item) => (
                  <li key={item} className="text-sm flex gap-2 leading-relaxed" style={{ color: "rgba(247,242,236,0.58)" }}>
                    <span style={{ color: "rgba(224,123,57,0.6)" }}>✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {resultado.paraQuemTeAma && (
            <div
              className="rounded-xl p-4 flex gap-3"
              style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.15)" }}
            >
              <Users className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
              <div>
                <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
                  Para quem te ama
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)" }}>
                  {resultado.paraQuemTeAma}
                </p>
              </div>
            </div>
          )}
        </Capitulo>
      )}

      {/* Capítulo 6 — Rankings */}
      {rankingReceber.length > 0 && (
        <Capitulo
          numero={v2 ? 6 : 5}
          titulo="Distribuição completa"
          subtitulo={v2 ? "Receber e expressar lado a lado" : "As cinco linguagens no seu perfil"}
          defaultOpen={false}
        >
          <div className={v2 && rankingExpressar.length > 0 ? "grid md:grid-cols-2 gap-5" : ""}>
            <div>
              <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.45)" }}>
                {v2 ? "Como você recebe" : "Seu perfil"}
              </p>
              <BarrasRanking ranking={rankingReceber} destaque={principal} />
            </div>
            {v2 && rankingExpressar.length > 0 && (
              <div>
                <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.45)" }}>
                  Como você demonstra
                </p>
                <BarrasRanking
                  ranking={rankingExpressar}
                  destaque={expressarPrincipal}
                />
              </div>
            )}
          </div>
        </Capitulo>
      )}

      {/* Capítulo 7 — Próximos passos */}
      {((resultado.recomendacoes?.length ?? 0) > 0 || resultado.reflexaoAmor) && (
        <Capitulo numero={v2 ? 7 : 6} titulo="Próximos passos" defaultOpen>
          {resultado.recomendacoes && resultado.recomendacoes.length > 0 && (
            <ul className="space-y-3">
              {resultado.recomendacoes.map((rec, i) => (
                <li key={rec} className="flex gap-3 items-start">
                  <div
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(200,165,107,0.15)", color: GOLD }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
                    {rec}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {resultado.reflexaoAmor && (
            <div
              className="rounded-xl p-5 text-center flex flex-col items-center gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(200,165,107,0.08) 0%, rgba(30,24,18,0.4) 100%)",
                border: "1px solid rgba(200,165,107,0.18)",
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: GOLD }} />
              <p className="text-sm italic font-tan-mon-cheri leading-relaxed" style={{ color: "rgba(247,242,236,0.72)" }}>
                {resultado.reflexaoAmor}
              </p>
            </div>
          )}
        </Capitulo>
      )}

      {resultado.metricas?.confianca !== undefined && resultado.metricas.confianca < 80 && (
        <p className="text-xs text-center px-2" style={{ color: "rgba(247,242,236,0.38)" }}>
          Confiança do perfil: {resultado.metricas.confianca}%. Refaça com calma se quiser mais precisão.
        </p>
      )}
    </div>
  );
}
