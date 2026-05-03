import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Upload, X, Camera, User, ArrowRight, Loader2, RefreshCw, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("luz_e_sombra_token");
  return fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
}

// ── Types ──────────────────────────────────────────────────────────────────────
type TipoFoto = "rosto" | "corpo-frente" | "corpo-lado";

interface FotoTraco {
  id: number;
  tipo: TipoFoto;
  objectPath: string;
  criadoEm: string;
}

interface EstruturasPct {
  esquizoide: number;
  oral: number;
  psicopata: number;
  masoquista: number;
  rigido: number;
}

interface ResultadoAnalise {
  estruturas: EstruturasPct;
  estruturaPrincipal: keyof EstruturasPct;
  estruturaSecundaria: keyof EstruturasPct;
  observacoesPorFoto: Record<TipoFoto, string>;
  padraoPostural: string;
  caracteristicasFisicasObservadas: string[];
  interpretacao: string;
  centroEnergetico: string;
  padraoEnergetico: string;
  mensagemTerapeutica: string;
}

interface AnaliseTraco {
  id: number;
  resultado: ResultadoAnalise;
  criadoEm: string;
}

// ── Estrutura config ───────────────────────────────────────────────────────────
const ESTRUTURAS_CONFIG: Record<
  keyof EstruturasPct,
  { nome: string; descricaoCurta: string; descricaoLonga: string; cor: string; corBg: string; corBorder: string }
> = {
  esquizoide: {
    nome: "Esquizóide",
    descricaoCurta: "Vive no reino das ideias. Criativo, sensível e profundamente introspectivo.",
    descricaoLonga:
      "A estrutura Esquizóide carrega uma inteligência singular e uma visão de mundo única. Estas pessoas habitam o universo das ideias com brilhantismo, possuem profundidade filosófica e uma criatividade que nasce da solidão como fonte. O desafio está em trazer essa riqueza interior para o contato real com o mundo.",
    cor: "#9b8fde",
    corBg: "rgba(155,143,222,0.08)",
    corBorder: "rgba(155,143,222,0.3)",
  },
  oral: {
    nome: "Oral",
    descricaoCurta: "Profundamente humano. Sente, conecta e nutre com o coração aberto.",
    descricaoLonga:
      "A estrutura Oral tem uma capacidade extraordinária de sentir o outro. São pessoas que nutrem, que se importam genuinamente, que constroem vínculos de calor real. A saudade, a melancolia e o desejo de pertencer fazem parte de uma riqueza emocional sem igual. O caminho é aprender a receber tanto quanto oferecem.",
    cor: "#5b9bd5",
    corBg: "rgba(91,155,213,0.08)",
    corBorder: "rgba(91,155,213,0.3)",
  },
  psicopata: {
    nome: "Psicopata/Narcisista",
    descricaoCurta: "Natural na liderança. Estratégico, persuasivo e orientado ao poder.",
    descricaoLonga:
      "A estrutura Psicopata/Narcisista possui um magnetismo e uma capacidade de influência raros. São líderes natos, estrategistas brilhantes, com uma visão clara do que querem. O desafio está em abrir o coração para a vulnerabilidade e descobrir que a força real não precisa de controle.",
    cor: "#e07b39",
    corBg: "rgba(224,123,57,0.08)",
    corBorder: "rgba(224,123,57,0.3)",
  },
  masoquista: {
    nome: "Masoquista",
    descricaoCurta: "Resiliente e leal. Suporta tudo com uma força interna impressionante.",
    descricaoLonga:
      "A estrutura Masoquista carrega uma lealdade, uma resistência e uma capacidade de suportar que poucos possuem. Estas pessoas são presença certa nas horas difíceis, têm profundidade emocional e uma força que nasce da dor transformada. O caminho é aprender que podem expansão — que a vida não precisa ser apenas resistência.",
    cor: "#6db96d",
    corBg: "rgba(109,185,109,0.08)",
    corBorder: "rgba(109,185,109,0.3)",
  },
  rigido: {
    nome: "Rígido",
    descricaoCurta: "Estruturado e realizador. Busca excelência com disciplina e presença.",
    descricaoLonga:
      "A estrutura Rígida possui organização, comprometimento e uma capacidade de realizar que inspira. São pessoas confiáveis, prezam a qualidade em tudo que fazem e têm uma presença impactante. O caminho é abrir espaço para o coração — deixar o controle de lado e permitir ser tocado pela vida.",
    cor: "#c8a56b",
    corBg: "rgba(200,165,107,0.08)",
    corBorder: "rgba(200,165,107,0.3)",
  },
};

const FOTOS_CONFIG: Record<TipoFoto, { label: string; instrucoes: string[]; icon: React.ReactNode }> = {
  rosto: {
    label: "Foto do Rosto",
    instrucoes: [
      "Fundo neutro (branco ou bege), boa iluminação frontal",
      "Expressão neutra e relaxada, olhando para a câmera",
      "Enquadre do pescoço até o topo da cabeça",
    ],
    icon: <User className="w-7 h-7" />,
  },
  "corpo-frente": {
    label: "Corpo — Vista Frontal",
    instrucoes: [
      "Em pé, corpo inteiro visível (cabeça a pés)",
      "Roupa justa ou mínima para permitir leitura corporal",
      "Posição natural — não force postura",
    ],
    icon: <Camera className="w-7 h-7" />,
  },
  "corpo-lado": {
    label: "Corpo — Vista Lateral",
    instrucoes: [
      "Perfil completo — cabeça até os pés",
      "Posição natural de pé, braços soltos ao lado",
      "Iluminação que destaque contorno e postura",
    ],
    icon: <ArrowRight className="w-7 h-7" />,
  },
};

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function TracodeCaraterPage() {
  const { user } = useAuth();
  const primeiroNome = (user?.nome || "").split(" ")[0];

  const [fotos, setFotos] = useState<Partial<Record<TipoFoto, FotoTraco>>>({});
  const [previews, setPreviews] = useState<Partial<Record<TipoFoto, string>>>({});
  const [uploading, setUploading] = useState<Partial<Record<TipoFoto, boolean>>>({});
  const [analise, setAnalise] = useState<AnaliseTraco | null>(null);
  const [analisando, setAnalisando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [expandedObs, setExpandedObs] = useState(false);
  const [expandedCaract, setExpandedCaract] = useState(false);

  const fileInputs = useRef<Partial<Record<TipoFoto, HTMLInputElement | null>>>({});

  // Load existing photos and analysis on mount
  useEffect(() => {
    (async () => {
      try {
        const [fotosRes, analiseRes] = await Promise.all([
          apiFetch("/traco/fotos"),
          apiFetch("/traco/analise"),
        ]);
        if (fotosRes.ok) {
          const lista: FotoTraco[] = await fotosRes.json();
          const map: Partial<Record<TipoFoto, FotoTraco>> = {};
          const prevMap: Partial<Record<TipoFoto, string>> = {};
          for (const f of lista) {
            map[f.tipo as TipoFoto] = f;
            prevMap[f.tipo as TipoFoto] = `${API_BASE}/api/traco/fotos/${f.id}/view`;
          }
          setFotos(map);
          setPreviews(prevMap);
        }
        if (analiseRes.ok) {
          const data = await analiseRes.json();
          setAnalise(data);
        }
      } catch {
        // silently ignore
      }
    })();
  }, []);

  const handleFileSelect = useCallback(
    async (tipo: TipoFoto, file: File) => {
      // Show local preview immediately
      const localURL = URL.createObjectURL(file);
      setPreviews((p) => ({ ...p, [tipo]: localURL }));
      setUploading((u) => ({ ...u, [tipo]: true }));
      setErro(null);

      try {
        // 1. Get presigned URL
        const urlRes = await apiFetch("/traco/fotos/upload-url", {
          method: "POST",
          body: JSON.stringify({ tipo }),
        });
        if (!urlRes.ok) throw new Error("Erro ao gerar URL de upload");
        const { uploadURL, objectPath } = await urlRes.json();

        // 2. Upload directly to GCS
        const uploadRes = await fetch(uploadURL, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "image/jpeg" },
        });
        if (!uploadRes.ok) throw new Error("Erro ao enviar foto");

        // 3. Save metadata
        const saveRes = await apiFetch("/traco/fotos", {
          method: "POST",
          body: JSON.stringify({ tipo, objectPath }),
        });
        if (!saveRes.ok) throw new Error("Erro ao salvar foto");
        const savedFoto: FotoTraco = await saveRes.json();

        setFotos((f) => ({ ...f, [tipo]: savedFoto }));
        // Switch to server preview URL
        setPreviews((p) => ({ ...p, [tipo]: `${API_BASE}/api/traco/fotos/${savedFoto.id}/view` }));
      } catch (e: unknown) {
        setErro(e instanceof Error ? e.message : "Erro ao fazer upload da foto");
        setPreviews((p) => ({ ...p, [tipo]: undefined }));
        setFotos((f) => { const n = { ...f }; delete n[tipo]; return n; });
      } finally {
        setUploading((u) => ({ ...u, [tipo]: false }));
      }
    },
    []
  );

  const handleDelete = useCallback(async (tipo: TipoFoto) => {
    const foto = fotos[tipo];
    if (!foto) return;
    try {
      await apiFetch(`/traco/fotos/${foto.id}`, { method: "DELETE" });
    } catch {
      // ignore
    }
    setFotos((f) => { const n = { ...f }; delete n[tipo]; return n; });
    setPreviews((p) => { const n = { ...p }; delete n[tipo]; return n; });
  }, [fotos]);

  const handleAnalisar = async () => {
    setAnalisando(true);
    setErro(null);
    try {
      const token = localStorage.getItem("luz_e_sombra_token");
      const res = await fetch(`${API_BASE}/api/traco/analisar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro na análise");
      }
      const data: AnaliseTraco = await res.json();
      setAnalise(data);
      setTimeout(() => {
        document.getElementById("resultado-traco")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao analisar. Tente novamente.");
    } finally {
      setAnalisando(false);
    }
  };

  const fotosCount = Object.keys(fotos).length;
  const resultado = analise?.resultado;
  const estruturaPrincipal = resultado?.estruturaPrincipal;
  const configPrincipal = estruturaPrincipal ? ESTRUTURAS_CONFIG[estruturaPrincipal] : null;

  return (
    <div className="luxury-shell min-h-screen">
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1e1812 0%, #2f251b 50%, #3d2f1f 100%)",
          borderBottom: "1px solid rgba(200,165,107,0.12)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #c8a56b 0%, transparent 60%), radial-gradient(circle at 80% 20%, #9c7742 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: "linear-gradient(to right, transparent, #c8a56b)" }} />
            <span className="text-xs tracking-[0.25em] uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>
              Auto-conhecimento corporal
            </span>
          </div>
          <h1
            className="font-tan-mon-cheri text-4xl md:text-5xl mb-4"
            style={{ color: "#f7f2ec", lineHeight: 1.2 }}
          >
            Traço de Caráter
          </h1>
          <p className="text-lg mb-2" style={{ color: "rgba(247,242,236,0.65)", maxWidth: 560 }}>
            Olá, <span style={{ color: "#c8a56b" }}>{primeiroNome}</span>.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "rgba(247,242,236,0.55)", maxWidth: 600 }}>
            Baseada na Bioenergética de Alexander Lowen e na Análise do Caráter de Wilhelm Reich, esta análise
            identifica nos marcadores físicos do seu corpo as cinco estruturas de caráter e como elas se expressam
            em você — com precisão, profundidade e compaixão.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* ── Photo guide ── */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: "rgba(200,165,107,0.04)",
            border: "1px solid rgba(200,165,107,0.12)",
          }}
        >
          <h2 className="font-tan-mon-cheri text-lg mb-4" style={{ color: "#c8a56b" }}>
            Como preparar as fotos
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {(Object.entries(FOTOS_CONFIG) as [TipoFoto, (typeof FOTOS_CONFIG)[TipoFoto]][]).map(([tipo, config]) => (
              <div key={tipo} className="space-y-2">
                <p className="text-sm font-medium" style={{ color: "rgba(247,242,236,0.8)" }}>
                  {config.label}
                </p>
                <ul className="space-y-1">
                  {config.instrucoes.map((ins, i) => (
                    <li key={i} className="flex gap-2 text-xs" style={{ color: "rgba(247,242,236,0.45)" }}>
                      <span style={{ color: "#c8a56b", flexShrink: 0 }}>{i + 1}.</span>
                      {ins}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upload zones ── */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {(Object.entries(FOTOS_CONFIG) as [TipoFoto, (typeof FOTOS_CONFIG)[TipoFoto]][]).map(([tipo, config]) => {
            const foto = fotos[tipo];
            const preview = previews[tipo];
            const isUploading = uploading[tipo];

            return (
              <div
                key={tipo}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "rgba(30,24,18,0.6)",
                  border: preview ? "1px solid rgba(200,165,107,0.3)" : "1px solid rgba(200,165,107,0.1)",
                  transition: "border-color 0.2s",
                }}
              >
                {/* Header */}
                <div
                  className="px-4 py-3 flex items-center gap-2"
                  style={{ borderBottom: "1px solid rgba(200,165,107,0.08)" }}
                >
                  <span style={{ color: preview ? "#c8a56b" : "rgba(200,165,107,0.4)" }}>{config.icon}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: preview ? "rgba(247,242,236,0.85)" : "rgba(247,242,236,0.45)" }}
                  >
                    {config.label}
                  </span>
                  {preview && !isUploading && (
                    <button
                      onClick={() => handleDelete(tipo)}
                      className="ml-auto p-1 rounded-lg transition-colors"
                      style={{ color: "rgba(247,242,236,0.35)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e07b39")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.35)")}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Upload area */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 relative" style={{ minHeight: 200 }}>
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#c8a56b" }} />
                      <span className="text-xs" style={{ color: "rgba(247,242,236,0.4)" }}>
                        Enviando...
                      </span>
                    </div>
                  ) : preview ? (
                    <div className="relative w-full h-44 rounded-xl overflow-hidden group">
                      <img
                        src={preview}
                        alt={config.label}
                        className="w-full h-full object-cover"
                        style={{ filter: "brightness(0.85)" }}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                        onClick={() => fileInputs.current[tipo]?.click()}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw className="w-5 h-5" style={{ color: "#c8a56b" }} />
                          <span className="text-xs" style={{ color: "#c8a56b" }}>
                            Trocar foto
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputs.current[tipo]?.click()}
                      className="flex flex-col items-center gap-3 w-full h-44 rounded-xl border-2 border-dashed transition-all"
                      style={{
                        borderColor: "rgba(200,165,107,0.2)",
                        color: "rgba(247,242,236,0.3)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "rgba(200,165,107,0.5)";
                        el.style.color = "rgba(247,242,236,0.6)";
                        el.style.background = "rgba(200,165,107,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "rgba(200,165,107,0.2)";
                        el.style.color = "rgba(247,242,236,0.3)";
                        el.style.background = "transparent";
                      }}
                    >
                      <Upload className="w-7 h-7" />
                      <span className="text-xs text-center px-4">
                        Clique para selecionar a foto
                      </span>
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { fileInputs.current[tipo] = el; }}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(tipo, file);
                      e.target.value = "";
                    }}
                  />
                </div>

                {/* Status */}
                <div
                  className="px-4 py-2 text-center text-xs"
                  style={{
                    color: foto ? "rgba(109,185,109,0.8)" : "rgba(247,242,236,0.25)",
                    borderTop: "1px solid rgba(200,165,107,0.06)",
                  }}
                >
                  {foto ? "✓ Foto carregada" : "Aguardando foto"}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Error ── */}
        {erro && (
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6"
            style={{ background: "rgba(224,123,57,0.1)", border: "1px solid rgba(224,123,57,0.3)" }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#e07b39" }} />
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.75)" }}>
              {erro}
            </p>
          </div>
        )}

        {/* ── Analyze button ── */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <button
            onClick={handleAnalisar}
            disabled={fotosCount === 0 || analisando}
            className="flex items-center gap-3 px-10 py-4 rounded-2xl font-medium transition-all text-base"
            style={{
              background:
                fotosCount === 0
                  ? "rgba(200,165,107,0.1)"
                  : "linear-gradient(135deg, #c8a56b 0%, #9c7742 100%)",
              color: fotosCount === 0 ? "rgba(200,165,107,0.3)" : "#1e1812",
              cursor: fotosCount === 0 || analisando ? "not-allowed" : "pointer",
              opacity: analisando ? 0.7 : 1,
              boxShadow: fotosCount > 0 && !analisando ? "0 4px 20px rgba(200,165,107,0.25)" : "none",
            }}
          >
            {analisando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analisando seu traço de caráter...
              </>
            ) : (
              <>
                Analisar Traço de Caráter
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          {fotosCount === 0 ? (
            <p className="text-xs" style={{ color: "rgba(247,242,236,0.3)" }}>
              Faça o upload de pelo menos uma foto para iniciar
            </p>
          ) : fotosCount < 3 ? (
            <p className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
              {fotosCount}/3 foto{fotosCount > 1 ? "s" : ""} — a análise fica mais precisa com as 3 fotos
            </p>
          ) : (
            <p className="text-xs" style={{ color: "rgba(109,185,109,0.6)" }}>
              ✓ As 3 fotos estão prontas — análise completa disponível
            </p>
          )}
        </div>

        {/* ── Results ── */}
        {resultado && (
          <div id="resultado-traco" className="space-y-6">
            {/* Separator */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-px" style={{ background: "rgba(200,165,107,0.15)" }} />
              <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.4)" }}>
                Resultado da Análise
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(200,165,107,0.15)" }} />
            </div>

            {/* Primary structure hero */}
            {configPrincipal && estruturaPrincipal && (
              <div
                className="rounded-2xl p-7"
                style={{
                  background: `linear-gradient(135deg, ${configPrincipal.corBg} 0%, rgba(30,24,18,0.4) 100%)`,
                  border: `1px solid ${configPrincipal.corBorder}`,
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
                      Estrutura Principal
                    </p>
                    <h2
                      className="font-tan-mon-cheri text-3xl"
                      style={{ color: configPrincipal.cor }}
                    >
                      {configPrincipal.nome}
                    </h2>
                  </div>
                  <div
                    className="text-4xl font-bold font-tan-mon-cheri flex-shrink-0"
                    style={{ color: configPrincipal.cor }}
                  >
                    {resultado.estruturas[estruturaPrincipal]}%
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.65)" }}>
                  {configPrincipal.descricaoCurta}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
                  {configPrincipal.descricaoLonga}
                </p>

                {resultado.estruturaSecundaria && (
                  <div
                    className="mt-4 pt-4 flex items-center gap-3"
                    style={{ borderTop: `1px solid ${configPrincipal.corBorder}` }}
                  >
                    <span className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
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
                      {" "}
                      ({resultado.estruturas[resultado.estruturaSecundaria]}%)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* All 5 structure bars */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(30,24,18,0.5)",
                border: "1px solid rgba(200,165,107,0.1)",
              }}
            >
              <h3
                className="font-tan-mon-cheri text-base mb-5"
                style={{ color: "rgba(247,242,236,0.75)" }}
              >
                Distribuição das Estruturas
              </h3>
              <div className="space-y-4">
                {(Object.entries(resultado.estruturas) as [keyof EstruturasPct, number][])
                  .sort(([, a], [, b]) => b - a)
                  .map(([key, pct]) => {
                    const cfg = ESTRUTURAS_CONFIG[key];
                    const isPrimary = key === resultado.estruturaPrincipal;
                    return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-sm font-medium"
                              style={{ color: isPrimary ? cfg.cor : "rgba(247,242,236,0.65)" }}
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
                          </div>
                          <span className="text-sm font-bold" style={{ color: cfg.cor }}>
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
                              background: `linear-gradient(to right, ${cfg.cor}99, ${cfg.cor})`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Interpretação */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(200,165,107,0.03)",
                border: "1px solid rgba(200,165,107,0.12)",
              }}
            >
              <h3 className="font-tan-mon-cheri text-base mb-4" style={{ color: "#c8a56b" }}>
                Interpretação
              </h3>
              <div className="space-y-3">
                {resultado.interpretacao.split(/\n+/).filter(Boolean).map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Postural pattern + energetic */}
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
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
                  <span style={{ color: "rgba(200,165,107,0.7)" }}>Centro: </span>
                  {resultado.centroEnergetico}
                </p>
                <p className="text-sm leading-relaxed mt-2" style={{ color: "rgba(247,242,236,0.55)" }}>
                  {resultado.padraoEnergetico}
                </p>
              </div>
            </div>

            {/* Physical characteristics — collapsible */}
            {resultado.caracteristicasFisicasObservadas?.length > 0 && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(200,165,107,0.1)" }}
              >
                <button
                  onClick={() => setExpandedCaract((v) => !v)}
                  className="w-full flex items-center justify-between px-6 py-4"
                  style={{ background: "rgba(30,24,18,0.5)", color: "rgba(247,242,236,0.65)" }}
                >
                  <span className="text-sm font-medium">Características Físicas Observadas</span>
                  {expandedCaract ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedCaract && (
                  <div
                    className="px-6 py-5"
                    style={{ background: "rgba(30,24,18,0.3)", borderTop: "1px solid rgba(200,165,107,0.08)" }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {resultado.caracteristicasFisicasObservadas.map((c, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1.5 rounded-full"
                          style={{
                            background: "rgba(200,165,107,0.06)",
                            border: "1px solid rgba(200,165,107,0.15)",
                            color: "rgba(247,242,236,0.55)",
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

            {/* Observations per photo — collapsible */}
            {resultado.observacoesPorFoto && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(200,165,107,0.1)" }}
              >
                <button
                  onClick={() => setExpandedObs((v) => !v)}
                  className="w-full flex items-center justify-between px-6 py-4"
                  style={{ background: "rgba(30,24,18,0.5)", color: "rgba(247,242,236,0.65)" }}
                >
                  <span className="text-sm font-medium">Observações por Foto</span>
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

            {/* Therapeutic message */}
            {resultado.mensagemTerapeutica && (
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: "linear-gradient(135deg, rgba(200,165,107,0.06) 0%, rgba(156,119,66,0.04) 100%)",
                  border: "1px solid rgba(200,165,107,0.18)",
                }}
              >
                <div className="w-8 h-px mx-auto mb-4" style={{ background: "#c8a56b" }} />
                <p
                  className="text-sm leading-relaxed italic"
                  style={{ color: "rgba(247,242,236,0.65)", maxWidth: 560, margin: "0 auto" }}
                >
                  {resultado.mensagemTerapeutica}
                </p>
                <div className="w-8 h-px mx-auto mt-4" style={{ background: "#c8a56b" }} />
              </div>
            )}

            {/* Date + re-analyze */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs" style={{ color: "rgba(247,242,236,0.25)" }}>
                Análise realizada em{" "}
                {new Date(analise!.criadoEm).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <button
                onClick={handleAnalisar}
                disabled={analisando || fotosCount === 0}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg transition-all"
                style={{
                  color: "rgba(200,165,107,0.6)",
                  border: "1px solid rgba(200,165,107,0.2)",
                }}
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
        )}
      </div>
    </div>
  );
}
