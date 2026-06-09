import { useMemo, useState, type ReactNode } from "react";
import { RefreshCw, ChevronDown, ChevronUp, Info } from "lucide-react";
import { sanitizarResultadoLegado, isResultadoLegado } from "@workspace/traco-narrativa";
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
  dominanteApelido?: string;
  fraseIdentidade?: string;
  pontosFortes?: string[];
  pontosAtencao?: string[];
  ferida?: string;
  dorLivro?: string;
  perguntaTransformacao?: string;
  leituraEmocionalDeclarada?: string;
  contrasteFotosFormulario?: string;
  couracaCorporal?: string;
  pontosCuidadoPrioritarios?: string[];
  recurso?: string;
  recomendacoesPraticas?: string[];
  confiancaAnalise?: number;
  estruturasSomenteFotos?: EstruturasPct;
  sinteseIntegradaFotosQuestionario?: string;
  sinteseHumana?: string;
  fusaoDiagnosticoEmocional?: FusaoDiagnosticoEmocionalResposta;
  perfilFisicoNarrado?: string;
  estiloComunicacao?: EstiloComunicacao;
  perfilUnico?: string;
  dinamicaFuncional?: DinamicaFuncional;
  evidenciasMotor?: Array<{ estrutura: string; peso: number; descricao: string }>;
  marcadoresPorFoto?: Array<{
    tipo: string;
    poseDetectada: boolean;
    qualidadeFoto: number;
    shr: number | null;
    ulr: number | null;
    simetria: number | null;
    projecaoCraniana?: number | null;
    ombrosAdiantados?: number | null;
    colapsoToracico?: number | null;
    erroProcessamento?: string;
  }>;
  marcadoresAgregados?: Record<string, number | null>;
  eixosReich?: {
    indiceExpansao: number;
    indiceRetracao: number;
    indiceContencao: number;
    indiceCompressao: number;
    indiceFragmentacao: number;
  };
  segmentosReich?: Record<string, number>;
  metadata?: {
    analysisVersion?: string;
    eixosReich?: ResultadoAnalise["eixosReich"];
    segmentosReich?: Record<string, number>;
    versaoEixos?: string;
  };
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
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.12)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        style={{ background: "rgba(30,24,18,0.55)" }}
      >
        <div>
          <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>
            Capítulo {numero}
          </p>
          <h3 className="font-tan-mon-cheri text-base" style={{ color: "#c8a56b" }}>
            {titulo}
          </h3>
          {subtitulo && (
            <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.35)" }}>
              {subtitulo}
            </p>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
      </button>
      {open && (
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
  const [expandedDistrib, setExpandedDistrib] = useState(false);
  const dataAnalise = new Date(criadoEm ?? analise.criadoEm).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const alvoAnalise = pessoaNome?.trim() ? pessoaNome.trim() : "Você";
  const terceiraPessoa = !!pessoaNome?.trim();
  const temFusao = !!resultado.fusaoDiagnosticoEmocional;
  const alinhamento = resultado.fusaoDiagnosticoEmocional?.alinhamentoFotosFormulario;
  const baixaConcordancia = alinhamento != null && alinhamento < 55;
  const sinaisConvergentes = resultado.fusaoDiagnosticoEmocional?.sinaisConvergentes?.slice(0, 2) ?? [];
  const showAuditUi =
    import.meta.env.DEV || import.meta.env.VITE_TRACO_AUDIT_UI === "1";
  const [expandedAuditoria, setExpandedAuditoria] = useState(false);
  const segmentos = resultado.segmentosReich ?? resultado.metadata?.segmentosReich;
  const sinteseHumana = resultado.sinteseHumana;
  const recomendacoes = resultado.recomendacoesPraticas?.slice(0, 5) ?? [];
  const interpretacaoLegado =
    legado && resultado.interpretacao?.trim()
      ? resultado.interpretacao.split(/\n+/).filter(Boolean)
      : [];

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
          Este resultado foi gerado com uma versão anterior do motor. Use <strong>Reanalisar</strong> para
          desbloquear a leitura completa (cruzamentos, cuidados prioritários e menos repetição).
        </p>
      )}

      {/* Capítulo 1 — Quem é */}
      {configPrincipal && estruturaPrincipal && (
        <Capitulo
          numero={1}
          titulo="Quem é"
          subtitulo={`Resultado de ${alvoAnalise} · ${dataAnalise}`}
        >
          <div
            className="rounded-xl p-5"
            style={{
              background: `linear-gradient(135deg, ${configPrincipal.corBg} 0%, rgba(30,24,18,0.4) 100%)`,
              border: `1px solid ${configPrincipal.corBorder}`,
            }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {resultado.dominanteApelido && (
                <span
                  className="text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full"
                  style={{
                    background: configPrincipal.corBg,
                    color: configPrincipal.cor,
                    border: `1px solid ${configPrincipal.corBorder}`,
                  }}
                >
                  O {resultado.dominanteApelido}
                </span>
              )}
              {temFusao && alinhamento != null && (
                <span
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    background: baixaConcordancia ? "rgba(224,123,57,0.1)" : "rgba(109,185,109,0.1)",
                    color: baixaConcordancia ? "rgba(224,123,57,0.9)" : "rgba(109,185,109,0.85)",
                    border: baixaConcordancia
                      ? "1px solid rgba(224,123,57,0.25)"
                      : "1px solid rgba(109,185,109,0.25)",
                  }}
                >
                  {alinhamento}% convergência
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>
                  Estrutura Principal
                </p>
                <h2 className="font-tan-mon-cheri text-2xl md:text-3xl" style={{ color: configPrincipal.cor }}>
                  {configPrincipal.nome}
                </h2>
              </div>
              <div
                className="text-3xl font-bold font-tan-mon-cheri flex-shrink-0"
                style={{ color: configPrincipal.cor, opacity: 0.9 }}
              >
                {resultado.estruturas[estruturaPrincipal]}%
              </div>
            </div>

            {resultado.fraseIdentidade && (
              <p className="text-sm leading-relaxed mb-3 italic" style={{ color: "rgba(247,242,236,0.7)" }}>
                {resultado.fraseIdentidade}
              </p>
            )}

            {resultado.estruturaSecundaria && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
                  Secundária:
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

            <details className="group mb-3">
              <summary
                className="text-xs flex items-center gap-1.5 cursor-pointer list-none"
                style={{ color: "rgba(200,165,107,0.55)" }}
              >
                <Info className="w-3.5 h-3.5" />
                Saber mais sobre {configPrincipal.nome}
              </summary>
              <p className="text-sm leading-relaxed mt-2 pl-5" style={{ color: "rgba(247,242,236,0.45)" }}>
                {configPrincipal.descricaoLonga}
              </p>
            </details>
          </div>

          {temFusao && sinteseHumana && (
            <div
              className="rounded-xl p-4"
              style={{
                background: baixaConcordancia
                  ? "rgba(224,123,57,0.05)"
                  : "rgba(109,185,109,0.05)",
                border: baixaConcordancia
                  ? "1px solid rgba(224,123,57,0.18)"
                  : "1px solid rgba(109,185,109,0.18)",
              }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(109,185,109,0.6)" }}>
                {terceiraPessoa ? "Fotos e questionário" : "Suas fotos e respostas"}
              </p>
              {baixaConcordancia && (
                <p className="text-xs mb-2" style={{ color: "rgba(224,123,57,0.85)" }}>
                  Parte das leituras aponta em direções diferentes — o perfil integrado equilibra as duas fontes.
                </p>
              )}
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.72)" }}>
                {sinteseHumana}
              </p>
              {sinaisConvergentes.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {sinaisConvergentes.map((s, i) => (
                    <li key={i} className="text-xs flex gap-2" style={{ color: "rgba(247,242,236,0.5)" }}>
                      <span style={{ color: "rgba(109,185,109,0.6)" }}>·</span>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

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

          <button
            type="button"
            onClick={() => setExpandedDistrib((v) => !v)}
            className="text-xs flex items-center gap-1"
            style={{ color: "rgba(200,165,107,0.5)" }}
          >
            {expandedDistrib ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Ver distribuição completa
          </button>
          {expandedDistrib && (
            <div className="space-y-3 pt-1">
              {(Object.entries(resultado.estruturas) as [keyof EstruturasPct, number][])
                .sort(([, a], [, b]) => b - a)
                .map(([key, pct]) => {
                  const cfg = ESTRUTURAS_CONFIG[key];
                  const isPrimary = key === resultado.estruturaPrincipal;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: isPrimary ? cfg.cor : "rgba(247,242,236,0.45)" }}>{cfg.nome}</span>
                        <span style={{ color: isPrimary ? cfg.cor : "rgba(247,242,236,0.4)" }}>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: isPrimary ? cfg.cor : `${cfg.cor}66` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Capitulo>
      )}

      {/* Capítulo 2 — O que dói e o que cura */}
      {(resultado.ferida ||
        resultado.dorLivro ||
        resultado.recurso ||
        (resultado.pontosCuidadoPrioritarios?.length ?? 0) > 0 ||
        resultado.perguntaTransformacao) && (
        <Capitulo numero={2} titulo="O que dói e o que cura" defaultOpen>
          <div className="grid md:grid-cols-2 gap-4">
            {resultado.ferida && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(155,143,222,0.05)", border: "1px solid rgba(155,143,222,0.18)" }}
              >
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(155,143,222,0.6)" }}>
                  Ferida central
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)" }}>
                  {resultado.ferida}
                </p>
              </div>
            )}
            {resultado.recurso && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.18)" }}
              >
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.6)" }}>
                  Recurso / dom
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)" }}>
                  {resultado.recurso}
                </p>
              </div>
            )}
          </div>

          {resultado.dorLivro && (
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.58)", lineHeight: 1.8 }}>
              {resultado.dorLivro}
            </p>
          )}

          {(resultado.pontosCuidadoPrioritarios?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(224,123,57,0.55)" }}>
                Cuidados prioritários
              </p>
              <ul className="space-y-2">
                {resultado.pontosCuidadoPrioritarios!.map((item, i) => (
                  <li key={i} className="text-sm flex gap-2" style={{ color: "rgba(247,242,236,0.6)" }}>
                    <span style={{ color: "#c8a56b" }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resultado.perguntaTransformacao && (
            <div
              className="rounded-xl p-5 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(200,165,107,0.08) 0%, rgba(30,24,18,0.4) 100%)",
                border: "1px solid rgba(200,165,107,0.2)",
              }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
                Pergunta de transformação
              </p>
              <p className="text-sm italic font-tan-mon-cheri" style={{ color: "rgba(247,242,236,0.78)" }}>
                {resultado.perguntaTransformacao}
              </p>
            </div>
          )}
        </Capitulo>
      )}

      {/* Capítulo 3 — Cruza mente e corpo */}
      {(resultado.leituraEmocionalDeclarada ||
        resultado.contrasteFotosFormulario ||
        resultado.perfilUnico ||
        interpretacaoLegado.length > 0) && (
        <Capitulo numero={3} titulo="Cruza mente e corpo" defaultOpen>
          {resultado.leituraEmocionalDeclarada && (
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
                Emocional declarado
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
                {resultado.leituraEmocionalDeclarada}
              </p>
            </div>
          )}

          {resultado.contrasteFotosFormulario && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(224,123,57,0.04)", border: "1px solid rgba(224,123,57,0.15)" }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(224,123,57,0.55)" }}>
                Fotos vs. questionário
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)" }}>
                {resultado.contrasteFotosFormulario}
              </p>
            </div>
          )}

          {resultado.perfilUnico && (
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
                O que torna este perfil único
              </p>
              {resultado.estruturaPrincipal && resultado.estruturaSecundaria && (
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      background: configPrincipal?.corBg,
                      color: configPrincipal?.cor,
                      border: `1px solid ${configPrincipal?.corBorder}`,
                    }}
                  >
                    {ESTRUTURAS_CONFIG[resultado.estruturaPrincipal].nome}
                  </span>
                  <span className="text-xs self-center" style={{ color: "rgba(200,165,107,0.4)" }}>
                    +
                  </span>
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      background: ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].corBg,
                      color: ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].cor,
                      border: `1px solid ${ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].corBorder}`,
                    }}
                  >
                    {ESTRUTURAS_CONFIG[resultado.estruturaSecundaria].nome}
                  </span>
                </div>
              )}
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)", lineHeight: 1.8 }}>
                {resultado.perfilUnico}
              </p>
            </div>
          )}

          {interpretacaoLegado.length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(247,242,236,0.35)" }}>
                Contexto (versão anterior)
              </p>
              {interpretacaoLegado.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed mb-2" style={{ color: "rgba(247,242,236,0.5)" }}>
                  {p}
                </p>
              ))}
            </div>
          )}
        </Capitulo>
      )}

      {/* Capítulo 4 — No dia a dia */}
      {resultado.dinamicaFuncional && (
        <Capitulo numero={4} titulo="No dia a dia" subtitulo="Como as estruturas operam no cotidiano" defaultOpen={false}>
          <div className="divide-y" style={{ borderColor: "rgba(200,165,107,0.07)" }}>
            {[
              { area: "Trabalho & desempenho", texto: resultado.dinamicaFuncional.trabalho },
              { area: "Relacionamentos", texto: resultado.dinamicaFuncional.relacoes },
              { area: "Gestão do estresse", texto: resultado.dinamicaFuncional.estresse },
              { area: "Tomada de decisão", texto: resultado.dinamicaFuncional.decisoes },
              { area: "Padrão de energia", texto: resultado.dinamicaFuncional.energia },
              { area: "Zona de sombra", texto: resultado.dinamicaFuncional.sombra },
            ].map(({ area, texto }) => (
              <div key={area} className="py-4 first:pt-0">
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.55)" }}>
                  {area}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)", lineHeight: 1.75 }}>
                  {texto}
                </p>
              </div>
            ))}
          </div>

          {resultado.estiloComunicacao && (
            <div
              className="rounded-xl p-4 mt-2"
              style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.1)" }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
                  Comunicação
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(200,165,107,0.1)",
                    color: "#c8a56b",
                    border: "1px solid rgba(200,165,107,0.2)",
                  }}
                >
                  {resultado.estiloComunicacao.tipo}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(247,242,236,0.62)" }}>
                {resultado.estiloComunicacao.descricao}
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { label: "Em grupos", texto: resultado.estiloComunicacao.emGrupos },
                  { label: "Nas relações", texto: resultado.estiloComunicacao.emRelacoes },
                  { label: "No conflito", texto: resultado.estiloComunicacao.emConflito },
                  { label: "Sob tensão", texto: resultado.estiloComunicacao.emTensao },
                ].map(({ label, texto }) => (
                  <div key={label} className="rounded-lg p-3" style={{ background: "rgba(30,24,18,0.4)" }}>
                    <p className="text-xs mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>
                      {label}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.52)" }}>
                      {texto}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Capitulo>
      )}

      {/* Capítulo 5 — O corpo fala */}
      {(resultado.caracteristicasFisicasObservadas?.length ||
        resultado.perfilFisicoNarrado ||
        resultado.couracaCorporal ||
        resultado.padraoPostural ||
        (resultado.observacoesPorFoto && Object.keys(resultado.observacoesPorFoto).length > 0)) && (
        <Capitulo numero={5} titulo="O corpo fala" defaultOpen={false}>
          {resultado.caracteristicasFisicasObservadas &&
            resultado.caracteristicasFisicasObservadas.length > 0 && (
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
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.62)", lineHeight: 1.8 }}>
              {resultado.perfilFisicoNarrado}
            </p>
          )}

          {resultado.couracaCorporal && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(155,143,222,0.04)", border: "1px solid rgba(155,143,222,0.15)" }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(155,143,222,0.55)" }}>
                Couraça corporal
              </p>
              <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(247,242,236,0.6)" }}>
                {resultado.couracaCorporal}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.42)" }}>
                <span style={{ color: "rgba(200,165,107,0.6)" }}>Centro energético: </span>
                {resultado.centroEnergetico}
                {" · "}
                {resultado.padraoEnergetico}
              </p>
            </div>
          )}

          {resultado.padraoPostural && (
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
                Padrão postural
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
                {resultado.padraoPostural}
              </p>
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
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
                        {obs}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Capitulo>
      )}

      {/* Capítulo 6 — Próximos passos */}
      {(recomendacoes.length > 0 || resultado.mensagemTerapeutica) && (
        <Capitulo numero={6} titulo="Próximos passos" defaultOpen>
          {recomendacoes.length > 0 && (
            <div className="space-y-3">
              {recomendacoes.map((rec, i) => (
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
          )}

          {resultado.mensagemTerapeutica && (
            <div
              className="rounded-xl p-5 text-center mt-2"
              style={{
                background: "linear-gradient(135deg, rgba(200,165,107,0.07) 0%, rgba(156,119,66,0.04) 100%)",
                border: "1px solid rgba(200,165,107,0.2)",
              }}
            >
              <p className="text-sm leading-relaxed italic font-tan-mon-cheri" style={{ color: "rgba(247,242,236,0.75)" }}>
                {resultado.mensagemTerapeutica}
              </p>
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
            <div
              className="px-6 py-5 space-y-5"
              style={{ background: "rgba(30,24,18,0.3)", borderTop: "1px solid rgba(200,165,107,0.08)" }}
            >
              {resultado.metadata?.analysisVersion && (
                <p className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
                  Motor: {resultado.metadata.analysisVersion}
                  {resultado.confiancaAnalise != null ? ` · Confiança ${resultado.confiancaAnalise}%` : ""}
                  {resultado.versaoNarrativa ? ` · Narrativa ${resultado.versaoNarrativa}` : ""}
                </p>
              )}
              {resultado.estruturasSomenteFotos && (
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.45)" }}>
                    Só fotos (antes da fusão)
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
                    {Object.entries(resultado.estruturasSomenteFotos)
                      .map(([k, v]) => `${k}: ${v}%`)
                      .join(" · ")}
                  </p>
                </div>
              )}
              {resultado.marcadoresPorFoto && resultado.marcadoresPorFoto.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>
                    Marcadores por foto
                  </p>
                  {resultado.marcadoresPorFoto.map((m) => (
                    <div key={m.tipo} className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
                      <span style={{ color: "rgba(200,165,107,0.6)" }}>{m.tipo}</span>
                      {m.shr != null ? ` · OMR ${m.shr.toFixed(2)}` : ""}
                      {m.ulr != null ? ` · ULR ${m.ulr.toFixed(2)}` : ""}
                      {m.simetria != null ? ` · sim ${m.simetria.toFixed(2)}` : ""}
                    </div>
                  ))}
                </div>
              )}
              {segmentos && (
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.45)" }}>
                    Proteção corporal por segmento
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                    {Object.entries(segmentos)
                      .map(([k, v]) => `${k}: ${(v as number).toFixed(2)}`)
                      .join(" · ")}
                  </p>
                </div>
              )}
              {resultado.evidenciasMotor && resultado.evidenciasMotor.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>
                    Regras acionadas
                  </p>
                  {resultado.evidenciasMotor.map((ev, i) => (
                    <p key={i} className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                      <span style={{ color: "rgba(200,165,107,0.55)" }}>
                        {ev.estrutura} ({ev.peso > 0 ? "+" : ""}
                        {ev.peso.toFixed(2)})
                      </span>
                      {","}
                      {ev.descricao}
                    </p>
                  ))}
                </div>
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
