import { useState } from "react";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import {
  ESTRUTURAS_CONFIG,
  FOTOS_CONFIG,
  type EstruturasPct,
  type TipoFoto,
} from "@/pages/traco/tracoConfig";

interface EstiloComunicacao {
  tipo: string;
  descricao: string;
  emGrupos: string;
  emRelacoes: string;
  emConflito: string;
  emTensao: string;
}

interface DinamicaFuncional {
  trabalho: string;
  relacoes: string;
  estresse: string;
  decisoes: string;
  energia: string;
  sombra: string;
}

interface FusaoDiagnosticoEmocionalResposta {
  versaoMatriz: string;
  alinhamentoFotosFormulario: number;
  assertividadeLeitura: number;
  pesoFormulario: number;
  padroesEmocionaisNormalizados: Record<string, number>;
  vetorFormularioEstruturas: Record<string, number>;
  sinaisConvergentes: string[];
  entradaDiagnostico: unknown;
}

interface ResultadoAnalise {
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
  dominanteApelido?: string;
  fraseIdentidade?: string;
  pontosFortes?: string[];
  pontosAtencao?: string[];
  ferida?: string;
  recurso?: string;
  recomendacoesPraticas?: string[];
  confiancaAnalise?: number;
  estruturasSomenteFotos?: EstruturasPct;
  sinteseIntegradaFotosQuestionario?: string;
  fusaoDiagnosticoEmocional?: FusaoDiagnosticoEmocionalResposta;
  perfilFisicoNarrado?: string;
  estiloComunicacao?: EstiloComunicacao;
  perfilUnico?: string;
  dinamicaFuncional?: DinamicaFuncional;
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
}

export function TracoPainelResultado({
  analise,
  onReanalisar,
  analisando,
  fotosCount,
}: TracoPainelResultadoProps) {
  const resultado = analise.resultado;
  const estruturaPrincipal = resultado.estruturaPrincipal;
  const configPrincipal = estruturaPrincipal ? ESTRUTURAS_CONFIG[estruturaPrincipal] : null;
  const [expandedObs, setExpandedObs] = useState(false);
  const [expandedCaract, setExpandedCaract] = useState(false);

  return (
          <div id="resultado-traco" className="space-y-5">
            {/* Separator */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-px" style={{ background: "rgba(200,165,107,0.15)" }} />
              <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.4)" }}>
                Resultado da Análise
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(200,165,107,0.15)" }} />
            </div>

            {/* ── Primary structure hero ── */}
            {configPrincipal && estruturaPrincipal && (
              <div
                className="rounded-2xl p-7"
                style={{
                  background: `linear-gradient(135deg, ${configPrincipal.corBg} 0%, rgba(30,24,18,0.5) 100%)`,
                  border: `1px solid ${configPrincipal.corBorder}`,
                }}
              >
                {/* Apelido badge + confidence */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  {resultado.dominanteApelido && (
                    <span
                      className="text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full"
                      style={{
                        background: configPrincipal.corBg,
                        color: configPrincipal.cor,
                        border: `1px solid ${configPrincipal.corBorder}`,
                        letterSpacing: "0.15em",
                      }}
                    >
                      O {resultado.dominanteApelido}
                    </span>
                  )}
                </div>

                {/* Name + % */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>
                      Estrutura Principal
                    </p>
                    <h2
                      className="font-tan-mon-cheri text-3xl md:text-4xl"
                      style={{ color: configPrincipal.cor }}
                    >
                      {configPrincipal.nome}
                    </h2>
                  </div>
                  <div
                    className="text-4xl font-bold font-tan-mon-cheri flex-shrink-0"
                    style={{ color: configPrincipal.cor, opacity: 0.9 }}
                  >
                    {resultado.estruturas[estruturaPrincipal]}%
                  </div>
                </div>

                {/* Frase identidade */}
                {resultado.fraseIdentidade && (
                  <p
                    className="text-sm leading-relaxed mb-4 italic"
                    style={{ color: "rgba(247,242,236,0.7)" }}
                  >
                    {resultado.fraseIdentidade}
                  </p>
                )}

                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
                  {configPrincipal.descricaoLonga}
                </p>

                {/* Secondary structure */}
                {resultado.estruturaSecundaria && (
                  <div
                    className="mt-5 pt-4 flex flex-wrap items-center gap-3"
                    style={{ borderTop: `1px solid ${configPrincipal.corBorder}` }}
                  >
                    <span className="text-xs" style={{ color: "rgba(247,242,236,0.3)" }}>
                      Estrutura secundária:
                    </span>
                    <span
                      className="text-sm font-medium px-3 py-1 rounded-full"
                      style={{
                        color: ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].cor,
                        background: ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].corBg,
                        border: `1px solid ${ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].corBorder}`,
                      }}
                    >
                      {ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].nome}
                      {" "}({resultado.estruturas[resultado.estruturaSecundaria]}%)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ── Pontos Fortes + Pontos de Atenção ── */}
            {((resultado.pontosFortes?.length ?? 0) > 0 || (resultado.pontosAtencao?.length ?? 0) > 0) && (
              <div className="grid md:grid-cols-2 gap-4">
                {resultado.pontosFortes && resultado.pontosFortes.length > 0 && (
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "rgba(109,185,109,0.05)", border: "1px solid rgba(109,185,109,0.18)" }}
                  >
                    <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(109,185,109,0.6)" }}>
                      Pontos Fortes
                    </p>
                    <div className="flex flex-wrap gap-2">
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
                  </div>
                )}
                {resultado.pontosAtencao && resultado.pontosAtencao.length > 0 && (
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "rgba(224,123,57,0.05)", border: "1px solid rgba(224,123,57,0.18)" }}
                  >
                    <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(224,123,57,0.6)" }}>
                      Pontos de Atenção
                    </p>
                    <div className="flex flex-wrap gap-2">
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
                  </div>
                )}
              </div>
            )}

            {/* ── Leitura integrada (API: fotos + questionário) ── */}
            {(resultado.sinteseIntegradaFotosQuestionario || resultado.fusaoDiagnosticoEmocional) && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(135deg, rgba(109,185,109,0.06) 0%, rgba(200,165,107,0.05) 100%)",
                  border: "1px solid rgba(109,185,109,0.22)",
                }}
              >
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(109,185,109,0.65)" }}>
                  Leitura integrada
                </p>
                <h3 className="font-tan-mon-cheri text-base mb-3" style={{ color: "rgba(247,242,236,0.9)" }}>
                  Fotos + diagnóstico emocional
                </h3>
                {resultado.sinteseIntegradaFotosQuestionario && (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.72)" }}>
                    {resultado.sinteseIntegradaFotosQuestionario}
                  </p>
                )}
                {resultado.fusaoDiagnosticoEmocional?.sinaisConvergentes &&
                  resultado.fusaoDiagnosticoEmocional.sinaisConvergentes.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1.5 text-sm" style={{ color: "rgba(247,242,236,0.58)" }}>
                      {resultado.fusaoDiagnosticoEmocional.sinaisConvergentes.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}
              </div>
            )}

            {/* ── Distribuição das Estruturas ── */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(30,24,18,0.5)", border: "1px solid rgba(200,165,107,0.1)" }}
            >
              <h3 className="font-tan-mon-cheri text-base mb-5" style={{ color: "rgba(247,242,236,0.75)" }}>
                Distribuição das Estruturas
              </h3>
              <div className="space-y-4">
                {(Object.entries(resultado.estruturas) as [keyof EstruturasPct, number][])
                  .sort(([, a], [, b]) => b - a)
                  .map(([key, pct]) => {
                    const cfg = ESTRUTURAS_CONFIG[key];
                    const isPrimary = key === resultado.estruturaPrincipal;
                    const isSecondary = key === resultado.estruturaSecundaria;
                    return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-sm font-medium"
                              style={{ color: isPrimary ? cfg.cor : isSecondary ? "rgba(247,242,236,0.7)" : "rgba(247,242,236,0.45)" }}
                            >
                              {cfg.nome}
                            </span>
                            {isPrimary && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: cfg.corBg, color: cfg.cor, border: `1px solid ${cfg.corBorder}` }}
                              >
                                principal
                              </span>
                            )}
                            {isSecondary && !isPrimary && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(247,242,236,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
                              >
                                secundária
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-bold" style={{ color: isPrimary ? cfg.cor : "rgba(247,242,236,0.5)" }}>
                            {pct}%
                          </span>
                        </div>
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: isPrimary
                                ? `linear-gradient(to right, ${cfg.cor}88, ${cfg.cor})`
                                : `linear-gradient(to right, ${cfg.cor}44, ${cfg.cor}66)`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* ── Interpretação ── */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(200,165,107,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}
            >
              <h3 className="font-tan-mon-cheri text-base mb-4" style={{ color: "#c8a56b" }}>
                Interpretação
              </h3>
              <div className="space-y-4">
                {resultado.interpretacao.split(/\n+/).filter(Boolean).map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)" }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* ── Perfil Único (Combinação) ── */}
            {resultado.perfilUnico && (
              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-px" style={{ background: "linear-gradient(to right, transparent, #c8a56b)" }} />
                  <h3 className="font-tan-mon-cheri text-base" style={{ color: "#c8a56b" }}>
                    O Que Te Torna Único
                  </h3>
                </div>
                {resultado.estruturaPrincipal && resultado.estruturaSecundaria && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: configPrincipal?.corBg,
                        color: configPrincipal?.cor,
                        border: `1px solid ${configPrincipal?.corBorder}`,
                      }}
                    >
                      {ESTRUTURAS_CONFIG[resultado.estruturaPrincipal].nome} {resultado.estruturas[resultado.estruturaPrincipal]}%
                    </span>
                    <span className="text-xs self-center" style={{ color: "rgba(200,165,107,0.4)" }}>+</span>
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].corBg,
                        color: ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].cor,
                        border: `1px solid ${ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].corBorder}`,
                      }}
                    >
                      {ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].nome} {resultado.estruturas[resultado.estruturaSecundaria]}%
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)", lineHeight: 1.8 }}>
                  {resultado.perfilUnico}
                </p>
              </div>
            )}

            {/* ── Estilo de Comunicação ── */}
            {resultado.estiloComunicacao && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(200,165,107,0.12)" }}
              >
                {/* Header */}
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ background: "rgba(200,165,107,0.06)", borderBottom: "1px solid rgba(200,165,107,0.1)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-px" style={{ background: "linear-gradient(to right, transparent, #c8a56b)" }} />
                    <h3 className="font-tan-mon-cheri text-base" style={{ color: "#c8a56b" }}>
                      Como Você Se Comunica
                    </h3>
                  </div>
                  <span
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{
                      background: "rgba(200,165,107,0.1)",
                      color: "#c8a56b",
                      border: "1px solid rgba(200,165,107,0.25)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {resultado.estiloComunicacao.tipo}
                  </span>
                </div>

                <div className="p-6 space-y-5" style={{ background: "rgba(30,24,18,0.4)" }}>
                  {/* Descrição geral */}
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.68)", lineHeight: 1.8 }}>
                    {resultado.estiloComunicacao.descricao}
                  </p>

                  {/* Grid contextual */}
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { label: "Em grupos", texto: resultado.estiloComunicacao.emGrupos },
                      { label: "Nas relações", texto: resultado.estiloComunicacao.emRelacoes },
                      { label: "No conflito", texto: resultado.estiloComunicacao.emConflito },
                      { label: "Sob tensão", texto: resultado.estiloComunicacao.emTensao },
                    ].map(({ label, texto }) => (
                      <div
                        key={label}
                        className="rounded-xl p-4"
                        style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.08)" }}
                      >
                        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
                          {label}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.55)", lineHeight: 1.75 }}>
                          {texto}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Dinâmica Funcional (Como você funciona) ── */}
            {resultado.dinamicaFuncional && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(200,165,107,0.12)" }}
              >
                {/* Header */}
                <div
                  className="px-6 py-5"
                  style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.08) 0%, rgba(30,24,18,0.6) 100%)", borderBottom: "1px solid rgba(200,165,107,0.1)" }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-6 h-px" style={{ background: "linear-gradient(to right, transparent, #c8a56b)" }} />
                    <h3 className="font-tan-mon-cheri text-base" style={{ color: "#c8a56b" }}>
                      Como Você Funciona
                    </h3>
                  </div>
                  <p className="text-xs ml-9" style={{ color: "rgba(247,242,236,0.35)" }}>
                    Uma leitura cruzada de como suas estruturas operam no dia a dia
                  </p>
                </div>

                <div className="divide-y" style={{ borderColor: "rgba(200,165,107,0.07)" }}>
                  {[
                    {
                      area: "Trabalho & Desempenho",
                      cor: "#c8a56b",
                      corBg: "rgba(200,165,107,0.08)",
                      texto: resultado.dinamicaFuncional.trabalho,
                    },
                    {
                      area: "Relacionamentos",
                      cor: "#5b9bd5",
                      corBg: "rgba(91,155,213,0.06)",
                      texto: resultado.dinamicaFuncional.relacoes,
                    },
                    {
                      area: "Gestão do Estresse",
                      cor: "#e07b39",
                      corBg: "rgba(224,123,57,0.06)",
                      texto: resultado.dinamicaFuncional.estresse,
                    },
                    {
                      area: "Tomada de Decisão",
                      cor: "#9b8fde",
                      corBg: "rgba(155,143,222,0.06)",
                      texto: resultado.dinamicaFuncional.decisoes,
                    },
                    {
                      area: "Padrão de Energia",
                      cor: "#6db96d",
                      corBg: "rgba(109,185,109,0.06)",
                      texto: resultado.dinamicaFuncional.energia,
                    },
                    {
                      area: "Zona de Sombra",
                      cor: "rgba(247,242,236,0.4)",
                      corBg: "rgba(255,255,255,0.02)",
                      texto: resultado.dinamicaFuncional.sombra,
                    },
                  ].map(({ area, cor, corBg, texto }) => (
                    <div
                      key={area}
                      className="px-6 py-5"
                      style={{ background: "rgba(30,24,18,0.35)" }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cor }} />
                        <p
                          className="text-xs font-medium tracking-widest uppercase"
                          style={{ color: cor }}
                        >
                          {area}
                        </p>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "rgba(247,242,236,0.6)", lineHeight: 1.8 }}
                      >
                        {texto}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Ferida + Recurso (Essência) ── */}
            {(resultado.ferida || resultado.recurso) && (
              <div className="grid md:grid-cols-2 gap-4">
                {resultado.ferida && (
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "rgba(155,143,222,0.05)", border: "1px solid rgba(155,143,222,0.18)" }}
                  >
                    <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(155,143,222,0.6)" }}>
                      Ferida Central
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
                      {resultado.ferida}
                    </p>
                  </div>
                )}
                {resultado.recurso && (
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.18)" }}
                  >
                    <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.6)" }}>
                      Recurso / Dom
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
                      {resultado.recurso}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Padrão Postural + Energético ── */}
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(30,24,18,0.5)", border: "1px solid rgba(200,165,107,0.1)" }}
              >
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.5)" }}>
                  Padrão Postural
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
                  {resultado.padraoPostural}
                </p>
              </div>
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(30,24,18,0.5)", border: "1px solid rgba(200,165,107,0.1)" }}
              >
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(200,165,107,0.5)" }}>
                  Padrão Energético
                </p>
                <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(247,242,236,0.6)" }}>
                  <span style={{ color: "rgba(200,165,107,0.7)" }}>Centro: </span>
                  {resultado.centroEnergetico}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
                  {resultado.padraoEnergetico}
                </p>
              </div>
            </div>

            {/* ── Recomendações Práticas ── */}
            {resultado.recomendacoesPraticas && resultado.recomendacoesPraticas.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(30,24,18,0.5)", border: "1px solid rgba(200,165,107,0.1)" }}
              >
                <h3 className="font-tan-mon-cheri text-base mb-4" style={{ color: "rgba(247,242,236,0.75)" }}>
                  Recomendações Práticas
                </h3>
                <div className="space-y-3">
                  {resultado.recomendacoesPraticas.map((rec, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 text-xs font-bold"
                        style={{ background: "rgba(200,165,107,0.12)", color: "#c8a56b" }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Características Físicas — collapsible ── */}
            {resultado.caracteristicasFisicasObservadas?.length > 0 && (
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.1)" }}>
                <button
                  onClick={() => setExpandedCaract((v) => !v)}
                  className="w-full flex items-center justify-between px-6 py-4"
                  style={{ background: "rgba(30,24,18,0.5)", color: "rgba(247,242,236,0.65)" }}
                >
                  <span className="text-sm font-medium">Marcadores Físicos Identificados</span>
                  {expandedCaract ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedCaract && (
                  <div
                    className="px-6 py-5"
                    style={{ background: "rgba(30,24,18,0.3)", borderTop: "1px solid rgba(200,165,107,0.08)" }}
                  >
                    {resultado.perfilFisicoNarrado && (
                      <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.5)" }}>
                        {resultado.perfilFisicoNarrado}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {resultado.caracteristicasFisicasObservadas.map((c, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1.5 rounded-full"
                          style={{
                            background: "rgba(200,165,107,0.06)",
                            border: "1px solid rgba(200,165,107,0.15)",
                            color: "rgba(247,242,236,0.5)",
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Observações por Foto — collapsible ── */}
            {resultado.observacoesPorFoto && Object.keys(resultado.observacoesPorFoto).length > 0 && (
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.1)" }}>
                <button
                  onClick={() => setExpandedObs((v) => !v)}
                  className="w-full flex items-center justify-between px-6 py-4"
                  style={{ background: "rgba(30,24,18,0.5)", color: "rgba(247,242,236,0.65)" }}
                >
                  <span className="text-sm font-medium">Leitura por Foto</span>
                  {expandedObs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedObs && (
                  <div
                    className="px-6 py-5 space-y-5"
                    style={{ background: "rgba(30,24,18,0.3)", borderTop: "1px solid rgba(200,165,107,0.08)" }}
                  >
                    {(Object.entries(resultado.observacoesPorFoto) as [TipoFoto, string][]).map(([tipo, obs]) => (
                      <div key={tipo}>
                        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.45)" }}>
                          {FOTOS_CONFIG[tipo]?.label ?? tipo}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
                          {obs}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Mensagem Terapêutica ── */}
            {resultado.mensagemTerapeutica && (
              <div
                className="rounded-2xl p-7 text-center"
                style={{
                  background: "linear-gradient(135deg, rgba(200,165,107,0.07) 0%, rgba(156,119,66,0.04) 100%)",
                  border: "1px solid rgba(200,165,107,0.2)",
                }}
              >
                <div className="w-10 h-px mx-auto mb-5" style={{ background: "linear-gradient(to right, transparent, #c8a56b, transparent)" }} />
                <p
                  className="text-base leading-relaxed italic font-tan-mon-cheri"
                  style={{ color: "rgba(247,242,236,0.75)", maxWidth: 560, margin: "0 auto" }}
                >
                  {resultado.mensagemTerapeutica}
                </p>
                <div className="w-10 h-px mx-auto mt-5" style={{ background: "linear-gradient(to right, transparent, #c8a56b, transparent)" }} />
              </div>
            )}

            {/* ── Date + re-analyze ── */}
            <div className="flex items-center justify-between pt-2 pb-4">
              <p className="text-xs" style={{ color: "rgba(247,242,236,0.22)" }}>
                Análise realizada em{" "}
                {new Date(analise.criadoEm).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <button
                onClick={() => void onReanalisar()}
                disabled={analisando || fotosCount === 0}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg transition-all"
                style={{ color: "rgba(200,165,107,0.6)", border: "1px solid rgba(200,165,107,0.2)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#c8a56b";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(200,165,107,0.6)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.2)";
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reanalisar
              </button>
            </div>
          </div>
  );
}
