import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import {
  ChevronLeft,
  Lock,
  Loader2,
  CheckCircle2,
  Sparkles,
  Plus,
  Eye,
  PlayCircle,
  Clock,
} from "lucide-react";
import { LABEL_LINGUAGEM, type LinguagemAmor } from "@workspace/cinco-linguagens-amor";
import MobileTopBar from "@/components/MobileTopBar";
import { getVideoEmbedUrl } from "@/lib/mediaEmbed";
import { MinicursoEmbedido } from "@/components/MinicursoEmbedido";
import {
  JORNADA_HUB_COPY,
  hrefNovaAnalise,
  hrefVerResultado,
} from "@/lib/jornadaHubConfig";

interface ModuloApi {
  slug: string;
  tituloIntro: string;
  descricaoIntro: string;
  videoIntroUrl: string | null;
  cursoVinculadoId: number | null;
  ordem: number;
  hrefAnalise: string;
  hubHref: string;
  analiseConcluida: boolean;
  minicursoDisponivel?: boolean;
  minicursoConcluido: boolean;
  minicursoProgresso: { total: number; concluidas: number } | null;
  status: "done" | "active" | "locked";
}

interface PreviewAnalise {
  titulo: string;
  linha?: string;
  badge?: string;
  chips?: { label: string; valor: string }[];
}

const NOME_ESTRUTURA: Record<string, string> = {
  esquizoide: "Esquizóide",
  oral: "Oral",
  psicopata: "Estratégico",
  masoquista: "Masoquista",
  rigido: "Sustentador",
};

async function carregarPreviewAnalise(slug: string): Promise<PreviewAnalise | null> {
  try {
    switch (slug) {
      case "temperamento": {
        const res = await apiFetch("/temperamento/ultimo");
        if (!res.ok) return null;
        const row = await res.json();
        const p = row?.resultado?.perfil;
        if (!p?.arquetipo) return null;
        return {
          titulo: p.arquetipo as string,
          linha: p.frase_sintese as string | undefined,
          badge: p.primario ? String(p.primario).replace("_", " ") : undefined,
        };
      }
      case "traco": {
        const res = await apiFetch("/traco/analise");
        if (!res.ok) return null;
        const row = await res.json();
        const r = row?.resultado;
        if (!r?.estruturaPrincipal) return null;
        const nome = NOME_ESTRUTURA[r.estruturaPrincipal] ?? r.estruturaPrincipal;
        return {
          titulo: r.dominanteApelido ?? nome,
          linha: r.fraseIdentidade ?? r.mensagemTerapeutica,
          badge: `${nome} · ${r.estruturas?.[r.estruturaPrincipal] ?? ""}%`.replace(" · %", ""),
        };
      }
      case "linguagens-amor": {
        const res = await apiFetch("/linguagens-amor/ultimo");
        if (!res.ok) return null;
        const row = await res.json();
        const resultado = row?.resultado as {
          receber?: { principal?: LinguagemAmor };
          expressar?: { principal?: LinguagemAmor };
          principal?: LinguagemAmor;
          combinacao?: string;
          sinteseHumana?: string;
          desalinhamento?: { ativo?: boolean };
        } | undefined;
        const receber = resultado?.receber?.principal ?? resultado?.principal;
        const expressar = resultado?.expressar?.principal ?? receber;
        if (!receber) return null;
        return {
          titulo: "Seu mapa afetivo",
          linha:
            resultado?.combinacao?.slice(0, 150) ??
            resultado?.sinteseHumana?.slice(0, 150),
          badge: resultado?.desalinhamento?.ativo ? "Receber e expressar diferem" : undefined,
          chips: [
            { label: "Você recebe amor por", valor: LABEL_LINGUAGEM[receber] ?? receber },
            ...(expressar
              ? [{ label: "Você expressa amor por", valor: LABEL_LINGUAGEM[expressar] ?? expressar }]
              : []),
          ],
        };
      }
      case "roda": {
        const res = await apiFetch("/avaliacoes");
        if (!res.ok) return null;
        const lista = await res.json();
        if (!Array.isArray(lista) || lista.length === 0) return null;
        const a = lista[0] as Record<string, number>;
        const vals = Object.values(a).filter((v) => typeof v === "number") as number[];
        const media = vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : 0;
        return {
          titulo: "Roda da Vida",
          linha: `Média geral ${media}/10 nas 12 áreas da sua última avaliação.`,
          badge: "12 dimensões",
        };
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

function PassoBadge({
  numero,
  titulo,
  concluido,
  bloqueado,
}: {
  numero: number;
  titulo: string;
  concluido?: boolean;
  bloqueado?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{
          background: concluido
            ? "rgba(93,185,122,0.15)"
            : bloqueado
              ? "rgba(255,255,255,0.04)"
              : "rgba(200,165,107,0.15)",
          color: concluido ? "#5db97a" : bloqueado ? "rgba(247,242,236,0.25)" : "#c8a56b",
          border: `1px solid ${concluido ? "rgba(93,185,122,0.3)" : bloqueado ? "rgba(255,255,255,0.06)" : "rgba(200,165,107,0.25)"}`,
        }}
      >
        {concluido ? <CheckCircle2 className="w-4 h-4" /> : bloqueado ? <Lock className="w-3.5 h-3.5" /> : numero}
      </span>
      <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.65)" }}>
        {titulo}
      </h2>
    </div>
  );
}

export default function JornadaHubPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { status } = useAuth();
  const [lista, setLista] = useState<ModuloApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<PreviewAnalise | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/modulos-jornada");
      if (res.ok) setLista(await res.json());
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
  }, [status, navigate]);

  useEffect(() => {
    void buscar();
  }, [buscar]);

  const modulo = useMemo(() => lista.find((m) => m.slug === slug), [lista, slug]);
  const copy = slug ? JORNADA_HUB_COPY[slug] : undefined;

  useEffect(() => {
    if (!modulo?.analiseConcluida || !slug) {
      setPreview(null);
      return;
    }
    setPreviewLoading(true);
    void carregarPreviewAnalise(slug).then((p) => {
      setPreview(p);
      setPreviewLoading(false);
    });
  }, [slug, modulo?.analiseConcluida]);

  const proximoHub = useMemo(() => {
    if (!modulo || lista.length === 0) return null;
    const ordenados = [...lista].sort((a, b) => a.ordem - b.ordem);
    const i = ordenados.findIndex((m) => m.slug === modulo.slug);
    if (i < 0 || i >= ordenados.length - 1) return null;
    return ordenados[i + 1].hubHref;
  }, [lista, modulo]);

  const minicursoDisponivel =
    modulo?.minicursoDisponivel ??
    (modulo?.cursoVinculadoId != null && (modulo?.minicursoProgresso?.total ?? 0) > 0);

  const moduloTotalmenteConcluido =
    modulo?.analiseConcluida && minicursoDisponivel && modulo.minicursoConcluido;

  const podeSeguirJornada =
    modulo?.analiseConcluida && (!minicursoDisponivel || modulo.minicursoConcluido);

  const embedIntro = modulo?.videoIntroUrl ? getVideoEmbedUrl(modulo.videoIntroUrl) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center journey-forest-bg">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  if (!modulo) {
    return (
      <div className="min-h-screen px-4 pt-8 journey-forest-bg">
        <MobileTopBar titulo="Jornada" subtitulo="Módulo não encontrado" />
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm mb-4" style={{ color: "rgba(247,242,236,0.5)" }}>
            Módulo não encontrado.
          </p>
          <button type="button" onClick={() => navigate("/jornada")} className="text-sm underline" style={{ color: "#c8a56b" }}>
            Voltar à jornada
          </button>
        </div>
      </div>
    );
  }

  if (modulo.status === "locked") {
    return (
      <div className="min-h-screen px-4 pt-6 pb-28 journey-forest-bg">
        <MobileTopBar titulo={modulo.tituloIntro} subtitulo="Módulo bloqueado" />
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => navigate("/jornada")}
            className="flex items-center gap-2 text-sm mb-6"
            style={{ color: "rgba(200,165,107,0.65)" }}
          >
            <ChevronLeft className="w-4 h-4" />
            Jornada
          </button>
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: "#f7f2ec" }} />
            <h1 className="font-tan-mon-cheri text-xl mb-2" style={{ color: "#f7f2ec" }}>
              Módulo bloqueado
            </h1>
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.45)" }}>
              Complete o módulo anterior na jornada para desbloquear este passo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 journey-forest-bg">
      <MobileTopBar titulo={modulo.tituloIntro} subtitulo="Módulo da jornada" />
      <div className="max-w-lg mx-auto px-4 pt-6">
        <button
          type="button"
          onClick={() => navigate("/jornada")}
          className="flex items-center gap-2 text-sm mb-6"
          style={{ color: "rgba(200,165,107,0.65)" }}
        >
          <ChevronLeft className="w-4 h-4" />
          Jornada
        </button>

        <div className="mb-8">
          <h1 className="font-tan-mon-cheri text-2xl mb-2 hidden md:block" style={{ color: "#f7f2ec" }}>
            {modulo.tituloIntro}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
            {copy?.introFallback ?? modulo.descricaoIntro}
          </p>
        </div>

        {/* 1 — Introdução */}
        <section className="mb-8">
          <PassoBadge numero={1} titulo="Introdução" concluido={!!embedIntro} />
          {embedIntro ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe
                src={embedIntro}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Introdução ao módulo"
              />
            </div>
          ) : (
            <div
              className="rounded-xl p-5 flex gap-3 items-start"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.1)" }}
            >
              <PlayCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "rgba(200,165,107,0.4)" }} />
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: "rgba(247,242,236,0.65)" }}>
                  Vídeo em breve
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.38)" }}>
                  {copy?.introFallback ??
                    "Enquanto o vídeo não é publicado, você já pode fazer a análise abaixo e ver seu resultado."}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* 2 — Análise */}
        <section className="mb-8">
          <PassoBadge numero={2} titulo="Sua análise" concluido={modulo.analiseConcluida} />
          <div
            className="rounded-2xl p-5"
            style={{
              background: modulo.analiseConcluida
                ? "linear-gradient(135deg, rgba(93,185,122,0.06) 0%, rgba(30,24,18,0.5) 100%)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${modulo.analiseConcluida ? "rgba(93,185,122,0.2)" : "rgba(200,165,107,0.14)"}`,
            }}
          >
            <p className="font-semibold text-sm mb-1" style={{ color: "#f7f2ec" }}>
              {copy?.analiseTitulo ?? "Questionário / análise"}
            </p>

            {modulo.analiseConcluida ? (
              <>
                {previewLoading ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#c8a56b" }} />
                    <span className="text-xs" style={{ color: "rgba(247,242,236,0.4)" }}>
                      Carregando seu resultado…
                    </span>
                  </div>
                ) : preview ? (
                  <div
                    className="rounded-xl p-4 my-4"
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(200,165,107,0.12)" }}
                  >
                    {preview.badge && (
                      <span
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-2"
                        style={{ background: "rgba(200,165,107,0.12)", color: "rgba(200,165,107,0.75)" }}
                      >
                        {preview.badge}
                      </span>
                    )}
                    <p className="font-tan-mon-cheri text-lg mb-1" style={{ color: "#f7f2ec" }}>
                      {preview.titulo}
                    </p>
                    {preview.chips && preview.chips.length > 0 && (
                      <div className="grid gap-2 mb-2">
                        {preview.chips.map((c) => (
                          <div
                            key={c.label}
                            className="rounded-lg px-3 py-2"
                            style={{ background: "rgba(224,123,57,0.06)", border: "1px solid rgba(224,123,57,0.12)" }}
                          >
                            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(224,123,57,0.55)" }}>
                              {c.label}
                            </p>
                            <p className="text-sm font-medium" style={{ color: "rgba(247,242,236,0.78)" }}>
                              {c.valor}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    {preview.linha && (
                      <p className="text-xs leading-relaxed italic" style={{ color: "rgba(247,242,236,0.5)" }}>
                        {preview.linha.length > 160 ? `${preview.linha.slice(0, 160)}…` : preview.linha}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs my-3" style={{ color: "rgba(247,242,236,0.45)" }}>
                    {copy?.analiseDescricaoCom ?? "Análise concluída na sua conta."}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => navigate(hrefVerResultado(modulo.slug, modulo.hrefAnalise))}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #c8a56b, #9c7742)",
                      color: "#1a1208",
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    {copy?.verResultadoLabel ?? "Ver meu resultado"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(hrefNovaAnalise(modulo.slug, modulo.hrefAnalise))}
                    className="py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                    style={{
                      background: "rgba(200,165,107,0.1)",
                      color: "#c8a56b",
                      border: "1px solid rgba(200,165,107,0.25)",
                    }}
                    title={copy?.novaAnaliseLabel ?? "Nova análise"}
                  >
                    <Plus className="w-4 h-4" />
                    {copy?.novaAnaliseLabel ?? "Nova análise"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs mb-4" style={{ color: "rgba(247,242,236,0.45)" }}>
                  {copy?.analiseDescricaoSem ??
                    "Reserve alguns minutos em um lugar calmo. Ao terminar, seu resultado fica guardado aqui."}
                </p>
                <button
                  type="button"
                  onClick={() => navigate(modulo.hrefAnalise)}
                  className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #c8a56b, #9c7742)",
                    color: "#1a1208",
                  }}
                >
                  Iniciar análise
                </button>
              </>
            )}
          </div>
        </section>

        {/* 3 — Minicurso */}
        <section className="mb-8">
          <PassoBadge
            numero={3}
            titulo="Minicurso"
            concluido={minicursoDisponivel && modulo.minicursoConcluido}
            bloqueado={!modulo.analiseConcluida || !minicursoDisponivel}
          />
          {!modulo.analiseConcluida ? (
            <div
              className="rounded-2xl p-6 flex flex-col items-center text-center gap-3"
              style={{ background: "rgba(0,0,0,0.2)", border: "1px dashed rgba(200,165,107,0.2)" }}
            >
              <Lock className="w-8 h-8 opacity-50" style={{ color: "#c8a56b" }} />
              <p className="text-sm font-medium" style={{ color: "rgba(247,242,236,0.55)" }}>
                Complete a análise primeiro
              </p>
              <p className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
                O minicurso aprofunda o que você descobriu no questionário.
              </p>
            </div>
          ) : !minicursoDisponivel ? (
            <div
              className="rounded-2xl p-6 flex flex-col items-center text-center gap-3"
              style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(200,165,107,0.12)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.2)" }}
              >
                <Lock className="w-6 h-6" style={{ color: "rgba(200,165,107,0.55)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "rgba(247,242,236,0.6)" }}>
                Minicurso em breve
              </p>
              <p className="text-xs leading-relaxed max-w-xs" style={{ color: "rgba(247,242,236,0.38)" }}>
                Estamos preparando um percurso guiado para aprofundar este módulo. Sua análise já está pronta — volte
                aqui quando o curso for liberado.
              </p>
              <span
                className="text-[10px] uppercase tracking-widest flex items-center gap-1.5 mt-1"
                style={{ color: "rgba(200,165,107,0.45)" }}
              >
                <Clock className="w-3 h-3" />
                Em desenvolvimento
              </span>
            </div>
          ) : (
            <MinicursoEmbedido
              cursoId={modulo.cursoVinculadoId!}
              tituloExtra="Aprofunde o que você descobriu neste módulo."
              onTodasAulasConcluidas={buscar}
            />
          )}
        </section>

        {/* Próximo passo — só quando faz sentido */}
        {moduloTotalmenteConcluido && proximoHub && (
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(200,165,107,0.15), rgba(60,42,28,0.35))",
              border: "1px solid rgba(200,165,107,0.28)",
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: "#c8a56b" }} />
              <p className="font-semibold text-sm" style={{ color: "#f7f2ec" }}>
                Módulo concluído — análise e minicurso feitos.
              </p>
            </div>
            <p className="text-xs" style={{ color: "rgba(247,242,236,0.55)" }}>
              Quando quiser, siga para o próximo passo da sua jornada.
            </p>
            <button
              type="button"
              onClick={() => navigate(proximoHub)}
              className="py-3 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            >
              Próximo módulo
            </button>
          </div>
        )}

        {podeSeguirJornada && !moduloTotalmenteConcluido && proximoHub && modulo.analiseConcluida && (
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}
          >
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.6)" }}>
              Sua análise está pronta
              {!minicursoDisponivel ? " — o minicurso será liberado em breve." : " — falta concluir o minicurso acima."}
            </p>
            {!minicursoDisponivel && (
              <button
                type="button"
                onClick={() => navigate(proximoHub)}
                className="py-2.5 rounded-xl text-sm font-medium"
                style={{ color: "#c8a56b", border: "1px solid rgba(200,165,107,0.25)" }}
              >
                Continuar jornada →
              </button>
            )}
          </div>
        )}

        {moduloTotalmenteConcluido && !proximoHub && (
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: "rgba(93,185,122,0.08)", border: "1px solid rgba(93,185,122,0.25)" }}
          >
            <p className="font-semibold text-sm mb-1" style={{ color: "#6ecf8f" }}>
              Você concluiu este módulo da jornada iniciante.
            </p>
            <p className="text-xs" style={{ color: "rgba(247,242,236,0.5)" }}>
              Volte à Jornada para ver o quadro geral ou explore a comunidade e os cursos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
