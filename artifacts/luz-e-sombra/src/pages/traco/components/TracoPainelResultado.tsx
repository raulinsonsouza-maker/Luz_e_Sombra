import { useMemo, useState, type ReactNode } from "react";
import { RefreshCw, ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  sanitizarResultadoLegado,
  isResultadoLegado,
  comporJornadaTraco,
} from "@workspace/traco-narrativa";
import { limparJargao } from "@workspace/copy-voz";
import JornadaTracoResultado from "@/pages/traco/components/JornadaTracoResultado";
import { TextoFormatado } from "@/components/TextoLeitura";
import {
  ESTRUTURAS_CONFIG,
  FOTOS_CONFIG,
  type EstruturasPct,
  type TipoFoto,
} from "@/pages/traco/tracoConfig";

interface ResultadoAnalise {
  versaoNarrativa?: string;
  estruturas: EstruturasPct;
  estruturaPrincipal: keyof EstruturasPct;
  estruturaSecundaria: keyof EstruturasPct;
  observacoesPorFoto: Partial<Record<TipoFoto, string>>;
  padraoPostural: string;
  caracteristicasFisicasObservadas: string[];
  interpretacao: string;
  centroEnergetico: string;
  padraoEnergetico: string;
  mensagemTerapeutica: string;
  fraseIdentidade?: string;
  pontosFortes?: string[];
  pontosAtencao?: string[];
  ferida?: string;
  dorLivro?: string;
  perguntaTransformacao?: string;
  couracaCorporal?: string;
  recurso?: string;
  recomendacoesPraticas?: string[];
  sinteseHumana?: string;
  perfilFisicoNarrado?: string;
  estiloComunicacao?: {
    tipo: string;
    descricao: string;
    emGrupos: string;
    emRelacoes: string;
    emConflito: string;
    emTensao: string;
  };
  perfilUnico?: string;
  dinamicaFuncional?: {
    trabalho: string;
    relacoes: string;
    estresse: string;
    decisoes: string;
    energia: string;
    sombra: string;
  };
  evidenciasMotor?: Array<{ estrutura: string; peso: number; descricao: string }>;
  marcadoresPorFoto?: Array<{
    tipo: string;
    poseDetectada: boolean;
    qualidadeFoto: number;
    shr: number | null;
    ulr: number | null;
    simetria: number | null;
  }>;
  segmentosReich?: Record<string, number>;
  metadata?: {
    analysisVersion?: string;
    segmentosReich?: Record<string, number>;
  };
  confiancaAnalise?: number;
  estruturasSomenteFotos?: EstruturasPct;
}

interface AnaliseTraco {
  id: number;
  resultado: ResultadoAnalise;
  criadoEm: string;
}

export interface TracoPainelResultadoProps {
  analise: AnaliseTraco;
  onReanalisar: () => void | Promise<void>;
  analisando: boolean;
  fotosCount: number;
  pessoaNome?: string | null;
  criadoEm?: string;
}

function lugarDoCentro(centro: string): string {
  const lugar = centro.split(",")[0]?.trim();
  return lugar || centro.trim();
}

function Capitulo({
  titulo,
  subtitulo,
  defaultOpen = true,
  recolhivel = true,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  defaultOpen?: boolean;
  recolhivel?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const visivel = !recolhivel || open;
  const cabecalho = (
    <div className="w-full flex items-center justify-between px-6 py-4 text-left">
      <div>
        <h3 className="font-tan-mon-cheri text-base" style={{ color: "#c8a56b" }}>
          {titulo}
        </h3>
        {subtitulo && (
          <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.35)" }}>
            {subtitulo}
          </p>
        )}
      </div>
      {recolhivel && (open ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />)}
    </div>
  );
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.12)" }}>
      {recolhivel ? (
        <button type="button" onClick={() => setOpen((v) => !v)} className="w-full" style={{ background: "rgba(30,24,18,0.55)" }}>
          {cabecalho}
        </button>
      ) : (
        <div style={{ background: "rgba(30,24,18,0.55)" }}>{cabecalho}</div>
      )}
      {visivel && (
        <div className="px-6 py-5 space-y-4" style={{ background: "rgba(30,24,18,0.35)", borderTop: "1px solid rgba(200,165,107,0.08)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export function TracoPainelResultado({
  analise,
  onReanalisar,
  analisando,
  fotosCount,
  pessoaNome = null,
  criadoEm,
}: TracoPainelResultadoProps) {
  const resultado = useMemo(
    () => sanitizarResultadoLegado(analise.resultado as Parameters<typeof sanitizarResultadoLegado>[0]),
    [analise.resultado],
  );
  const legado = isResultadoLegado(analise.resultado as Parameters<typeof isResultadoLegado>[0]);
  const estruturaPrincipal = resultado.estruturaPrincipal;
  const configPrincipal = estruturaPrincipal ? ESTRUTURAS_CONFIG[estruturaPrincipal] : null;
  const [expandedObs, setExpandedObs] = useState(false);
  const dataAnalise = new Date(criadoEm ?? analise.criadoEm).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const alvoAnalise = pessoaNome?.trim() ? pessoaNome.trim() : "Você";
  const showAuditUi = import.meta.env.DEV || import.meta.env.VITE_TRACO_AUDIT_UI === "1";
  const [expandedAuditoria, setExpandedAuditoria] = useState(false);
  const segmentos = resultado.segmentosReich ?? resultado.metadata?.segmentosReich;

  const jornada = useMemo(
    () =>
      estruturaPrincipal
        ? comporJornadaTraco({
            estruturas: resultado.estruturas,
            estruturaPrincipal: resultado.estruturaPrincipal,
            estruturaSecundaria: resultado.estruturaSecundaria,
            pontosFortes: resultado.pontosFortes,
            pontosAtencao: resultado.pontosAtencao,
            fraseIdentidade: resultado.fraseIdentidade,
            ferida: resultado.ferida,
            dorLivro: resultado.dorLivro,
            recurso: resultado.recurso,
            perfilUnico: resultado.perfilUnico,
            dinamicaFuncional: resultado.dinamicaFuncional,
            estiloComunicacao: resultado.estiloComunicacao,
            recomendacoesPraticas: resultado.recomendacoesPraticas,
            mensagemTerapeutica: resultado.mensagemTerapeutica,
            perguntaTransformacao: resultado.perguntaTransformacao,
          })
        : null,
    [estruturaPrincipal, resultado],
  );

  const rankingTracos = useMemo(() => {
    return (Object.entries(resultado.estruturas) as [keyof EstruturasPct, number][])
      .sort(([, a], [, b]) => b - a);
  }, [resultado.estruturas]);

  return (
    <div id="resultado-traco" className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: "rgba(200,165,107,0.15)" }} />
        <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.4)" }}>
          Resultado da Análise
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(200,165,107,0.15)" }} />
      </div>

      {legado && (
        <p className="text-sm leading-relaxed" style={{ color: "rgba(224,123,57,0.9)", lineHeight: 1.7 }}>
          Este resultado foi gerado com uma versão anterior. Use <strong>Reanalisar</strong> para
          atualizar a leitura completa.
        </p>
      )}

      {configPrincipal && estruturaPrincipal && jornada && (
        <section className="space-y-6">
          <header className="space-y-1.5">
            <p className="text-[10px] tracking-[0.22em] uppercase" style={{ color: "rgba(200,165,107,0.55)" }}>
              Etapa 01
            </p>
            <h2 className="font-tan-mon-cheri text-xl sm:text-2xl" style={{ color: "#e8d5b0" }}>
              Seu mapa de personalidade
            </h2>
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.45)", lineHeight: 1.5 }}>
              Resultado de {alvoAnalise} · {dataAnalise}
            </p>
            <div
              className="h-px w-16 mt-3"
              style={{ background: "linear-gradient(to right, rgba(200,165,107,0.45), transparent)" }}
            />
          </header>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "#c8a56b" }}>
              O que mais aparece em você
            </p>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-tan-mon-cheri text-3xl md:text-4xl" style={{ color: configPrincipal.cor }}>
                {configPrincipal.nome}
              </h3>
              <span
                className="font-tan-mon-cheri text-3xl md:text-4xl tabular-nums shrink-0"
                style={{ color: configPrincipal.cor }}
              >
                {resultado.estruturas[estruturaPrincipal]}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "#c8a56b" }}>
              Seu trio
            </p>
            <ol className="space-y-2.5">
              <li className="flex items-baseline justify-between gap-3 text-sm" style={{ color: "rgba(247,242,236,0.88)", lineHeight: 1.55 }}>
                <span>
                  <span style={{ color: configPrincipal.cor }}>{jornada.mapa.nomePrincipal}</span>
                  <span style={{ color: "rgba(247,242,236,0.4)" }}> · principal</span>
                </span>
                <span className="tabular-nums" style={{ color: configPrincipal.cor }}>
                  {resultado.estruturas[estruturaPrincipal]}%
                </span>
              </li>
              {resultado.estruturaSecundaria && (
                <li className="flex items-baseline justify-between gap-3 text-sm" style={{ color: "rgba(247,242,236,0.78)", lineHeight: 1.55 }}>
                  <span>
                    <span style={{ color: ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].cor }}>
                      {jornada.mapa.nomeSecundaria}
                    </span>
                    <span style={{ color: "rgba(247,242,236,0.4)" }}> · também presente</span>
                  </span>
                  <span className="tabular-nums" style={{ color: ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].cor }}>
                    {resultado.estruturas[resultado.estruturaSecundaria]}%
                  </span>
                </li>
              )}
              {jornada.mapa.terciaria !== estruturaPrincipal &&
                jornada.mapa.terciaria !== resultado.estruturaSecundaria && (
                  <li className="flex items-baseline justify-between gap-3 text-sm" style={{ color: "rgba(247,242,236,0.72)", lineHeight: 1.55 }}>
                    <span>
                      <span style={{ color: ESTRUTURAS_CONFIG[jornada.mapa.terciaria].cor }}>
                        {jornada.mapa.nomeTerciaria}
                      </span>
                      <span style={{ color: "rgba(247,242,236,0.4)" }}> · terceiro tom</span>
                    </span>
                    <span className="tabular-nums" style={{ color: ESTRUTURAS_CONFIG[jornada.mapa.terciaria].cor }}>
                      {resultado.estruturas[jornada.mapa.terciaria]}%
                    </span>
                  </li>
                )}
            </ol>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "#c8a56b" }}>
              O que isso significa
            </p>
            <TextoFormatado texto={jornada.mapa.significado} fluido />
          </div>

          <details className="group">
            <summary
              className="text-sm flex items-center gap-1.5 cursor-pointer list-none"
              style={{ color: "rgba(200,165,107,0.7)" }}
            >
              <Info className="w-3.5 h-3.5" />
              Saber mais sobre {configPrincipal.nome}
            </summary>
            <div className="mt-3">
              <TextoFormatado texto={configPrincipal.descricaoLonga} fluido />
            </div>
          </details>

          {((jornada.mapa.pontosFortes?.length ?? 0) > 0 || (jornada.mapa.pontosAtencao?.length ?? 0) > 0) && (
            <div className="grid md:grid-cols-2 gap-6">
              {jornada.mapa.pontosFortes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "rgba(109,185,109,0.75)" }}>
                    Pontos fortes
                  </p>
                  <ul className="space-y-1.5">
                    {jornada.mapa.pontosFortes.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm" style={{ color: "rgba(247,242,236,0.78)", lineHeight: 1.55 }}>
                        <span style={{ color: "rgba(109,185,109,0.7)" }}>·</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {jornada.mapa.pontosAtencao.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "rgba(224,123,57,0.75)" }}>
                    Pontos de atenção
                  </p>
                  <ul className="space-y-1.5">
                    {jornada.mapa.pontosAtencao.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm" style={{ color: "rgba(247,242,236,0.78)", lineHeight: 1.55 }}>
                        <span style={{ color: "rgba(224,123,57,0.7)" }}>·</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "#c8a56b" }}>
              Quanto cada traço aparece no seu perfil
            </p>
            {rankingTracos.map(([key, pct]) => {
              const cfg = ESTRUTURAS_CONFIG[key];
              const isPrincipal = key === resultado.estruturaPrincipal;
              const isSecundaria = key === resultado.estruturaSecundaria;
              const isTerciaria = key === jornada.mapa.terciaria;
              const isDestaque = isPrincipal || isSecundaria || isTerciaria;
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: isDestaque ? cfg.cor : "rgba(247,242,236,0.4)" }}>
                      {cfg.nome}
                      {isPrincipal && <span className="ml-1.5 opacity-60">· principal</span>}
                      {isSecundaria && <span className="ml-1.5 opacity-60">· também presente</span>}
                      {isTerciaria && !isPrincipal && !isSecundaria && (
                        <span className="ml-1.5 opacity-60">· terceiro tom</span>
                      )}
                    </span>
                    <span className="tabular-nums" style={{ color: isDestaque ? cfg.cor : "rgba(247,242,236,0.35)" }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: isDestaque ? cfg.cor : `${cfg.cor}55`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-sm leading-relaxed pt-1" style={{ color: "rgba(247,242,236,0.5)", lineHeight: 1.7 }}>
              Esta leitura é um caminho de autoconhecimento. Ela se apoia principalmente nas suas respostas. O corpo entra como apoio, com cuidado, e não como diagnóstico.
            </p>
          </div>
        </section>
      )}

      {jornada && <JornadaTracoResultado jornada={jornada} mostrarAviso={false} />}

      {(resultado.caracteristicasFisicasObservadas?.length ||
        resultado.perfilFisicoNarrado ||
        resultado.couracaCorporal ||
        resultado.padraoPostural ||
        (resultado.observacoesPorFoto && Object.keys(resultado.observacoesPorFoto).length > 0)) && (
        <Capitulo titulo="O corpo fala" defaultOpen={false} subtitulo="Um apoio à leitura, com cuidado">
          <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
            O que aparece abaixo é observação, não diagnóstico. O corpo acompanha a leitura; as respostas continuam sendo a base.
          </p>

          {resultado.caracteristicasFisicasObservadas && resultado.caracteristicasFisicasObservadas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resultado.caracteristicasFisicasObservadas.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(200,165,107,0.08)",
                    border: "1px solid rgba(200,165,107,0.18)",
                    color: "rgba(200,165,107,0.8)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {resultado.perfilFisicoNarrado && (
            <TextoFormatado texto={resultado.perfilFisicoNarrado} fluido={false} />
          )}

          {resultado.couracaCorporal && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(155,143,222,0.04)", border: "1px solid rgba(155,143,222,0.15)" }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(155,143,222,0.55)" }}>
                Como o corpo se protege
              </p>
              <TextoFormatado texto={limparJargao(resultado.couracaCorporal)} fluido={false} />
              {(resultado.centroEnergetico || resultado.padraoEnergetico) && (
                <div className="space-y-2 mt-3">
                  {resultado.centroEnergetico && (
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
                      <span style={{ color: "rgba(200,165,107,0.6)" }}>Onde isso se concentra: </span>
                      {lugarDoCentro(limparJargao(resultado.centroEnergetico))}
                    </p>
                  )}
                  {resultado.padraoEnergetico && (
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
                      <span style={{ color: "rgba(200,165,107,0.6)" }}>Como a energia circula: </span>
                      {limparJargao(resultado.padraoEnergetico)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {resultado.padraoPostural && (
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
                Padrão postural
              </p>
              <TextoFormatado texto={resultado.padraoPostural} fluido={false} />
            </div>
          )}

          {resultado.observacoesPorFoto && Object.keys(resultado.observacoesPorFoto).length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.1)" }}>
              <button
                type="button"
                onClick={() => setExpandedObs((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm"
                style={{ background: "rgba(30,24,18,0.45)", color: "rgba(247,242,236,0.6)" }}
              >
                Leitura por foto
                {expandedObs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedObs && (
                <div className="px-4 py-4 space-y-4" style={{ borderTop: "1px solid rgba(200,165,107,0.08)" }}>
                  {(Object.entries(resultado.observacoesPorFoto) as [TipoFoto, string][]).map(([tipo, obs]) => (
                    <div key={tipo}>
                      <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>
                        {FOTOS_CONFIG[tipo]?.label ?? tipo}
                      </p>
                      <TextoFormatado texto={limparJargao(obs)} fluido={false} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Capitulo>
      )}

      {showAuditUi && (resultado.evidenciasMotor?.length || resultado.marcadoresPorFoto?.length) && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.1)" }}>
          <button
            type="button"
            onClick={() => setExpandedAuditoria((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4"
            style={{ background: "rgba(30,24,18,0.5)", color: "rgba(247,242,236,0.65)" }}
          >
            <span className="text-sm font-medium">Detalhes técnicos da análise</span>
            {expandedAuditoria ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedAuditoria && (
            <div className="px-6 py-5 space-y-5" style={{ background: "rgba(30,24,18,0.3)", borderTop: "1px solid rgba(200,165,107,0.08)" }}>
              {resultado.metadata?.analysisVersion && (
                <p className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
                  Motor: {resultado.metadata.analysisVersion}
                  {resultado.confiancaAnalise != null ? ` · Confiança ${resultado.confiancaAnalise}%` : ""}
                </p>
              )}
              {resultado.estruturasSomenteFotos && (
                <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
                  {Object.entries(resultado.estruturasSomenteFotos)
                    .map(([k, v]) => `${k}: ${v}%`)
                    .join(" · ")}
                </p>
              )}
              {segmentos && (
                <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                  {Object.entries(segmentos)
                    .map(([k, v]) => `${k}: ${(v as number).toFixed(2)}`)
                    .join(" · ")}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 pb-4">
        <p className="text-xs" style={{ color: "rgba(247,242,236,0.22)" }}>
          Análise realizada em {dataAnalise}
        </p>
        <button
          type="button"
          onClick={() => void onReanalisar()}
          disabled={analisando || fotosCount === 0}
          className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg transition-all"
          style={{ color: "rgba(200,165,107,0.6)", border: "1px solid rgba(200,165,107,0.2)" }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reanalisar
        </button>
      </div>
    </div>
  );
}
