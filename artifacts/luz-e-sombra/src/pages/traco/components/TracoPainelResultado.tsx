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

  const demaisTracos = useMemo(() => {
    const principal = resultado.estruturaPrincipal;
    const secundaria = resultado.estruturaSecundaria;
    return (Object.entries(resultado.estruturas) as [keyof EstruturasPct, number][])
      .filter(([key]) => key !== principal && key !== secundaria)
      .sort(([, a], [, b]) => b - a);
  }, [resultado.estruturas, resultado.estruturaPrincipal, resultado.estruturaSecundaria]);

  return (
    <div id="resultado-traco" className="space-y-5">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 h-px" style={{ background: "rgba(200,165,107,0.15)" }} />
        <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.4)" }}>
          Resultado da Análise
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(200,165,107,0.15)" }} />
      </div>

      {legado && (
        <p
          className="text-xs px-4 py-3 rounded-xl"
          style={{
            color: "rgba(224,123,57,0.9)",
            background: "rgba(224,123,57,0.08)",
            border: "1px solid rgba(224,123,57,0.2)",
          }}
        >
          Este resultado foi gerado com uma versão anterior. Use <strong>Reanalisar</strong> para
          atualizar a leitura completa.
        </p>
      )}

      {configPrincipal && estruturaPrincipal && jornada && (
        <Capitulo
          titulo="Seu mapa de personalidade"
          subtitulo={`Resultado de ${alvoAnalise} · ${dataAnalise}`}
          recolhivel={false}
        >
          <div
            className="rounded-xl p-5"
            style={{
              background: `linear-gradient(135deg, ${configPrincipal.corBg} 0%, rgba(30,24,18,0.4) 100%)`,
              border: `1px solid ${configPrincipal.corBorder}`,
            }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full"
                style={{
                  background: configPrincipal.corBg,
                  color: configPrincipal.cor,
                  border: `1px solid ${configPrincipal.corBorder}`,
                }}
              >
                Traço {configPrincipal.nome}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>
                  O que mais aparece em você
                </p>
                <h2 className="font-tan-mon-cheri text-2xl md:text-3xl" style={{ color: configPrincipal.cor }}>
                  {configPrincipal.nome}
                </h2>
              </div>
              <div className="text-3xl font-bold font-tan-mon-cheri flex-shrink-0" style={{ color: configPrincipal.cor, opacity: 0.9 }}>
                {resultado.estruturas[estruturaPrincipal]}%
              </div>
            </div>

            {resultado.estruturaSecundaria && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
                  Também presente:
                </span>
                <span
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    color: ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].cor,
                    background: ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].corBg,
                    border: `1px solid ${ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].corBorder}`,
                  }}
                >
                  {ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].nome}{" "}
                  ({resultado.estruturas[resultado.estruturaSecundaria]}%)
                </span>
              </div>
            )}

            {demaisTracos.length > 0 && (
              <div className="mb-3 pt-3" style={{ borderTop: "1px solid rgba(200,165,107,0.12)" }}>
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.4)" }}>
                  Demais traços
                </p>
                <div className="flex flex-wrap gap-2">
                  {demaisTracos.map(([key, pct]) => {
                    const cfg = ESTRUTURAS_CONFIG[key];
                    return (
                      <span
                        key={key}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          color: cfg.cor,
                          background: cfg.corBg,
                          border: `1px solid ${cfg.corBorder}`,
                          opacity: 0.92,
                        }}
                      >
                        {cfg.nome} <span style={{ opacity: 0.85 }}>({pct}%)</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-3">
              <TextoFormatado texto={jornada.mapa.significado} fluido />
            </div>

            <details className="group mb-1">
              <summary
                className="text-xs flex items-center gap-1.5 cursor-pointer list-none"
                style={{ color: "rgba(200,165,107,0.55)" }}
              >
                <Info className="w-3.5 h-3.5" />
                Saber mais sobre {configPrincipal.nome}
              </summary>
              <div className="mt-2 pl-5">
                <TextoFormatado texto={configPrincipal.descricaoLonga} fluido={false} />
              </div>
            </details>
          </div>

          {((resultado.pontosFortes?.length ?? 0) > 0 || (resultado.pontosAtencao?.length ?? 0) > 0) && (
            <div className="grid md:grid-cols-2 gap-3">
              {resultado.pontosFortes && resultado.pontosFortes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs w-full tracking-widest uppercase" style={{ color: "rgba(109,185,109,0.6)" }}>
                    Pontos fortes
                  </span>
                  {resultado.pontosFortes.map((p, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(109,185,109,0.08)",
                        border: "1px solid rgba(109,185,109,0.22)",
                        color: "rgba(109,185,109,0.85)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
              {resultado.pontosAtencao && resultado.pontosAtencao.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs w-full tracking-widest uppercase" style={{ color: "rgba(224,123,57,0.6)" }}>
                    Pontos de atenção
                  </span>
                  {resultado.pontosAtencao.map((p, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(224,123,57,0.08)",
                        border: "1px solid rgba(224,123,57,0.22)",
                        color: "rgba(224,123,57,0.85)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3 pt-1">
            <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>
              Quanto cada traço aparece no seu perfil
            </p>
            {(Object.entries(resultado.estruturas) as [keyof EstruturasPct, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([key, pct]) => {
                const cfg = ESTRUTURAS_CONFIG[key];
                const isPrincipal = key === resultado.estruturaPrincipal;
                const isSecundaria = key === resultado.estruturaSecundaria;
                const isDestaque = isPrincipal || isSecundaria;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: isDestaque ? cfg.cor : "rgba(247,242,236,0.45)" }}>
                        {cfg.nome}
                        {isPrincipal && <span className="ml-1.5 opacity-70">· principal</span>}
                        {isSecundaria && <span className="ml-1.5 opacity-70">· também presente</span>}
                      </span>
                      <span style={{ color: isDestaque ? cfg.cor : "rgba(247,242,236,0.4)" }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: isDestaque ? cfg.cor : `${cfg.cor}66`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </Capitulo>
      )}

      {jornada && <JornadaTracoResultado jornada={jornada} />}

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
