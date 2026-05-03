import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Upload, X, Camera, User, ArrowRight, Loader2, RefreshCw, ChevronDown, ChevronUp, AlertCircle, ImageIcon, Plus, Users, Trash2 } from "lucide-react";
import { analyzeTracoDeCarater } from "@/lib/tracoAnalysis";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Payload opcional para fusão na API; preenchido pelo módulo de diagnóstico quando existir (ou testes via localStorage). */
function readOptionalDiagnosticoFusao(): Record<string, unknown> | undefined {
  try {
    const raw = localStorage.getItem("luz_diagnostico_emocional_fusao");
    if (!raw?.trim()) return undefined;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return undefined;
    return parsed as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

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

/** Metadados devolvidos pela API quando `diagnosticoEmocional` é enviado em `POST /traco/analisar`. */
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
  observacoesPorFoto: Record<TipoFoto, string>;
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
  /** Snapshot das percentagens só pelas fotos, quando houve fusão com questionário. */
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

interface Pessoa {
  id: number;
  nome: string;
  relacao: string | null;
  ordem: number;
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
  const [fotoFiles, setFotoFiles] = useState<Partial<Record<TipoFoto, File>>>({}); // local File objects for analysis
  const [previews, setPreviews] = useState<Partial<Record<TipoFoto, string>>>({});
  const [uploading, setUploading] = useState<Partial<Record<TipoFoto, boolean>>>({});
  const [analise, setAnalise] = useState<AnaliseTraco | null>(null);
  const [analisando, setAnalisando] = useState(false);
  const [analisandoEtapa, setAnalisandoEtapa] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [expandedObs, setExpandedObs] = useState(false);
  const [expandedCaract, setExpandedCaract] = useState(false);

  const fileInputs = useRef<Partial<Record<TipoFoto, HTMLInputElement | null>>>({});
  const cameraInputs = useRef<Partial<Record<TipoFoto, HTMLInputElement | null>>>({});

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [selectedPessoaId, setSelectedPessoaId] = useState<number | null>(null);
  const [showAddPessoa, setShowAddPessoa] = useState(false);
  const [novaNome, setNovaNome] = useState("");
  const [novaRelacao, setNovaRelacao] = useState("parceiro/a");
  const [addingPessoa, setAddingPessoa] = useState(false);

  async function carregarDados(pessoaId: number | null) {
    try {
      const q = pessoaId !== null ? `?pessoaId=${pessoaId}` : "";
      const [fotosRes, analiseRes] = await Promise.all([
        apiFetch(`/traco/fotos${q}`),
        apiFetch(`/traco/analise${q}`),
      ]);
      if (fotosRes.ok) {
        const lista: FotoTraco[] = await fotosRes.json();
        const map: Partial<Record<TipoFoto, FotoTraco>> = {};
        const prevMap: Partial<Record<TipoFoto, string>> = {};
        const token = localStorage.getItem("luz_e_sombra_token") ?? "";
        await Promise.all(lista.map(async (f) => {
          map[f.tipo as TipoFoto] = f;
          try {
            const imgRes = await fetch(`${API_BASE}/api/traco/fotos/${f.id}/view`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (imgRes.ok) {
              const blob = await imgRes.blob();
              prevMap[f.tipo as TipoFoto] = URL.createObjectURL(blob);
            }
          } catch { /* keep no preview */ }
        }));
        setFotos(map);
        setPreviews(prevMap);
      }
      if (analiseRes.ok) {
        const data = await analiseRes.json();
        setAnalise(data);
      } else {
        setAnalise(null);
      }
    } catch { /* silently ignore */ }
  }

  useEffect(() => {
    carregarDados(null);
    apiFetch("/traco/pessoas").then(r => r.ok ? r.json() : []).then(setPessoas).catch(() => {});
  }, []);

  useEffect(() => {
    setFotos({});
    setPreviews({});
    setFotoFiles({});
    setAnalise(null);
    carregarDados(selectedPessoaId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPessoaId]);

  const handleFileSelect = useCallback(
    async (tipo: TipoFoto, file: File) => {
      // Show local preview immediately
      const localURL = URL.createObjectURL(file);
      setPreviews((p) => ({ ...p, [tipo]: localURL }));
      setUploading((u) => ({ ...u, [tipo]: true }));
      setErro(null);

      // Store file locally for analysis (no API credits needed)
      setFotoFiles((ff) => ({ ...ff, [tipo]: file }));

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
          body: JSON.stringify({ tipo, objectPath, pessoaId: selectedPessoaId }),
        });
        if (!saveRes.ok) throw new Error("Erro ao salvar foto");
        const savedFoto: FotoTraco = await saveRes.json();

        setFotos((f) => ({ ...f, [tipo]: savedFoto }));
        // Keep local preview (avoids auth-gated reload)
        setPreviews((p) => ({ ...p, [tipo]: localURL }));
      } catch (e: unknown) {
        setErro(e instanceof Error ? e.message : "Erro ao fazer upload da foto");
        setPreviews((p) => ({ ...p, [tipo]: undefined }));
        setFotos((f) => { const n = { ...f }; delete n[tipo]; return n; });
        setFotoFiles((ff) => { const n = { ...ff }; delete n[tipo]; return n; });
      } finally {
        setUploading((u) => ({ ...u, [tipo]: false }));
      }
    },
    [selectedPessoaId]
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
    setFotoFiles((ff) => { const n = { ...ff }; delete n[tipo]; return n; });
  }, [fotos]);

  const handleAnalisar = async () => {
    const fotosDisponiveis = Object.keys(fotos) as TipoFoto[];
    if (fotosDisponiveis.length === 0) return;

    setAnalisando(true);
    setAnalisandoEtapa("Carregando fotos...");
    setErro(null);

    try {
      const token = localStorage.getItem("luz_e_sombra_token") ?? "";

      // Build photo sources: prefer local File, fall back to server URL
      setAnalisandoEtapa("Lendo marcadores corporais...");
      const photoSources: Array<{ tipo: TipoFoto; source: File | string }> = [];
      for (const tipo of fotosDisponiveis) {
        const localFile = fotoFiles[tipo];
        if (localFile) {
          photoSources.push({ tipo, source: localFile });
        } else if (fotos[tipo]) {
          const fotoId = fotos[tipo]!.id;
          const serverUrl = `${API_BASE}/api/traco/fotos/${fotoId}/view`;
          photoSources.push({ tipo, source: serverUrl });
        }
      }

      setAnalisandoEtapa("Calculando estruturas biomecânicas...");
      const resultado = await analyzeTracoDeCarater(photoSources, token);

      setAnalisandoEtapa("Gerando análise completa...");

      // Save computed result to backend
      const optionalDiag = readOptionalDiagnosticoFusao();
      const saveRes = await apiFetch("/traco/analisar", {
        method: "POST",
        body: JSON.stringify({
          resultado,
          pessoaId: selectedPessoaId,
          ...(optionalDiag ? { diagnosticoEmocional: optionalDiag } : {}),
        }),
      });
      if (!saveRes.ok) {
        const errData = await saveRes.json().catch(() => ({}));
        throw new Error((errData as { error?: string }).error ?? "Erro ao salvar análise");
      }
      const data: AnaliseTraco = await saveRes.json();
      setAnalise(data);
      setTimeout(() => {
        document.getElementById("resultado-traco")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao analisar. Tente novamente.");
    } finally {
      setAnalisando(false);
      setAnalisandoEtapa("");
    }
  };

  async function handleAdicionarPessoa(e: React.FormEvent) {
    e.preventDefault();
    if (!novaNome.trim()) return;
    setAddingPessoa(true);
    try {
      const res = await apiFetch("/traco/pessoas", {
        method: "POST",
        body: JSON.stringify({ nome: novaNome.trim(), relacao: novaRelacao }),
      });
      if (res.ok) {
        const pessoa: Pessoa = await res.json();
        setPessoas(prev => [...prev, pessoa]);
        setShowAddPessoa(false);
        setNovaNome("");
        setSelectedPessoaId(pessoa.id);
      }
    } catch { /* silent */ }
    setAddingPessoa(false);
  }

  async function handleRemoverPessoa(id: number) {
    if (!confirm("Remover esta pessoa e todos os dados de análise dela?")) return;
    try {
      const res = await apiFetch(`/traco/pessoas/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPessoas(prev => prev.filter(p => p.id !== id));
        setSelectedPessoaId(null);
      }
    } catch { /* silent */ }
  }

  const fotosCount = Object.keys(fotos).length;
  const resultado = analise?.resultado;
  const estruturaPrincipal = resultado?.estruturaPrincipal;
  const configPrincipal = estruturaPrincipal ? ESTRUTURAS_CONFIG[estruturaPrincipal] : null;
  const pessoaSelecionada = selectedPessoaId !== null ? pessoas.find(p => p.id === selectedPessoaId) : null;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #1e1812 0%, #2a1f14 50%, #2f251b 100%)" }}>
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
            Inspirada na Bioenergética de Alexander Lowen e na Análise do Caráter de Wilhelm Reich, esta jornada
            revela, com gentileza e profundidade, os padrões que seu corpo carrega — e que contam a história de
            quem você é, de onde você veio, e do quanto você já cresceu.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* ── Seletor de pessoas ── */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase mb-3 flex items-center gap-2" style={{ color: "rgba(200,165,107,0.5)" }}>
            <Users className="w-3.5 h-3.5" /> Analisando
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {/* Me */}
            <button
              onClick={() => setSelectedPessoaId(null)}
              className="flex-shrink-0 px-4 py-3 rounded-2xl flex flex-col items-center gap-1 min-w-[78px] transition-all"
              style={selectedPessoaId === null
                ? { background: "rgba(200,165,107,0.15)", border: "1.5px solid rgba(200,165,107,0.5)", color: "#c8a56b" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)", color: "rgba(247,242,236,0.4)" }}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Eu</span>
            </button>

            {/* Other people */}
            {pessoas.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPessoaId(p.id)}
                className="flex-shrink-0 px-4 py-3 rounded-2xl flex flex-col items-center gap-1 min-w-[78px] transition-all"
                style={selectedPessoaId === p.id
                  ? { background: "rgba(200,165,107,0.15)", border: "1.5px solid rgba(200,165,107,0.5)", color: "#c8a56b" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)", color: "rgba(247,242,236,0.4)" }}
              >
                <Users className="w-5 h-5" />
                <span className="text-xs font-medium truncate max-w-[66px]">{p.nome.split(" ")[0]}</span>
                <span className="text-[10px] opacity-60 truncate max-w-[66px]">{p.relacao || "outro"}</span>
              </button>
            ))}

            {/* Add button */}
            {pessoas.length < 2 && (
              <button
                onClick={() => setShowAddPessoa(s => !s)}
                className="flex-shrink-0 px-4 py-3 rounded-2xl flex flex-col items-center gap-1 min-w-[78px] transition-all"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(200,165,107,0.25)", color: "rgba(200,165,107,0.4)" }}
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs">Adicionar</span>
              </button>
            )}
          </div>

          {/* Add form */}
          {showAddPessoa && (
            <form
              onSubmit={handleAdicionarPessoa}
              className="mt-3 p-4 rounded-2xl space-y-3"
              style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}
            >
              <p className="text-xs font-semibold" style={{ color: "rgba(200,165,107,0.7)" }}>Adicionar pessoa para analisar</p>
              <input
                type="text" value={novaNome} onChange={e => setNovaNome(e.target.value)}
                placeholder="Nome da pessoa" required
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.2)", color: "#f7f2ec" }}
              />
              <select
                value={novaRelacao} onChange={e => setNovaRelacao(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "rgba(30,24,18,0.9)", border: "1px solid rgba(200,165,107,0.2)", color: "#f7f2ec" }}
              >
                {["parceiro/a", "cônjuge", "filho/a", "pai", "mãe", "irmão/irmã", "familiar", "amigo/a", "outro"].map(r => (
                  <option key={r} value={r} style={{ background: "#2f251b" }}>{r}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setShowAddPessoa(false); setNovaNome(""); }}
                  className="flex-1 py-2 rounded-xl text-sm" style={{ border: "1px solid rgba(200,165,107,0.2)", color: "rgba(247,242,236,0.5)" }}>
                  Cancelar
                </button>
                <button type="submit" disabled={addingPessoa}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
                  {addingPessoa ? "Adicionando..." : "Adicionar"}
                </button>
              </div>
            </form>
          )}

          {/* Context: who we're analysing + remove option */}
          {pessoaSelecionada && (
            <div className="mt-3 flex items-center justify-between px-1">
              <p className="text-xs" style={{ color: "rgba(200,165,107,0.6)" }}>
                Analisando <strong style={{ color: "#c8a56b" }}>{pessoaSelecionada.nome}</strong>
                {pessoaSelecionada.relacao && ` · ${pessoaSelecionada.relacao}`}
              </p>
              <button
                onClick={() => handleRemoverPessoa(pessoaSelecionada.id)}
                className="flex items-center gap-1 text-xs transition-opacity hover:opacity-80"
                style={{ color: "rgba(220,38,38,0.5)" }}
              >
                <Trash2 className="w-3 h-3" /> Remover
              </button>
            </div>
          )}
        </div>

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
                    /* ── Photo preview with swap options ── */
                    <div className="w-full space-y-2">
                      <div className="relative w-full h-36 rounded-xl overflow-hidden group">
                        <img
                          src={preview}
                          alt={config.label}
                          className="w-full h-full object-cover"
                          style={{ filter: "brightness(0.85)" }}
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: "rgba(0,0,0,0.55)" }}
                        >
                          <span className="text-xs" style={{ color: "#c8a56b" }}>Trocar foto</span>
                        </div>
                      </div>
                      {/* Swap buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => cameraInputs.current[tipo]?.click()}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all"
                          style={{ color: "rgba(200,165,107,0.6)", border: "1px solid rgba(200,165,107,0.18)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c8a56b"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.4)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(200,165,107,0.6)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.18)"; }}
                        >
                          <Camera className="w-3.5 h-3.5" /> Câmera
                        </button>
                        <button
                          onClick={() => fileInputs.current[tipo]?.click()}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all"
                          style={{ color: "rgba(200,165,107,0.6)", border: "1px solid rgba(200,165,107,0.18)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c8a56b"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.4)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(200,165,107,0.6)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.18)"; }}
                        >
                          <ImageIcon className="w-3.5 h-3.5" /> Galeria
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Empty state: camera + gallery buttons ── */
                    <div className="w-full space-y-2">
                      {/* Camera button — opens camera directly on mobile */}
                      <button
                        onClick={() => cameraInputs.current[tipo]?.click()}
                        className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl border-2 transition-all"
                        style={{ borderColor: "rgba(200,165,107,0.3)", color: "rgba(247,242,236,0.55)", background: "rgba(200,165,107,0.04)" }}
                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(200,165,107,0.6)"; el.style.color = "rgba(247,242,236,0.85)"; el.style.background = "rgba(200,165,107,0.08)"; }}
                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(200,165,107,0.3)"; el.style.color = "rgba(247,242,236,0.55)"; el.style.background = "rgba(200,165,107,0.04)"; }}
                      >
                        <Camera className="w-5 h-5" />
                        <span className="text-sm font-medium">Tirar foto agora</span>
                      </button>
                      {/* Gallery / file button */}
                      <button
                        onClick={() => fileInputs.current[tipo]?.click()}
                        className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl border border-dashed transition-all"
                        style={{ borderColor: "rgba(200,165,107,0.18)", color: "rgba(247,242,236,0.3)" }}
                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(200,165,107,0.4)"; el.style.color = "rgba(247,242,236,0.55)"; }}
                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(200,165,107,0.18)"; el.style.color = "rgba(247,242,236,0.3)"; }}
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-xs">Escolher da galeria</span>
                      </button>
                    </div>
                  )}

                  {/* Hidden inputs */}
                  {/* Camera input — capture attribute opens camera directly */}
                  <input
                    type="file"
                    accept="image/*"
                    capture={tipo === "rosto" ? "user" : "environment"}
                    ref={(el) => { cameraInputs.current[tipo] = el; }}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(tipo, file);
                      e.target.value = "";
                    }}
                  />
                  {/* Gallery input — no capture, opens file picker */}
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
                <span>{analisandoEtapa || "Analisando..."}</span>
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
                  {resultado.confiancaAnalise !== undefined && (
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-xs" style={{ color: "rgba(247,242,236,0.3)" }}>
                        Confiança
                      </span>
                      <div
                        className="relative h-1.5 rounded-full overflow-hidden"
                        style={{ width: 60, background: "rgba(255,255,255,0.08)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${resultado.confiancaAnalise}%`,
                            background: resultado.confiancaAnalise >= 60
                              ? "linear-gradient(to right, #6db96d, #4a9e4a)"
                              : "linear-gradient(to right, #c8a56b, #9c7742)",
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: resultado.confiancaAnalise >= 60
                            ? "rgba(109,185,109,0.7)"
                            : "rgba(200,165,107,0.6)",
                        }}
                      >
                        {resultado.confiancaAnalise}%
                      </span>
                    </div>
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
                {resultado.fusaoDiagnosticoEmocional && (
                  <div className="flex flex-wrap gap-3 text-xs mb-4">
                    <span
                      className="px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,165,107,0.2)", color: "rgba(247,242,236,0.75)" }}
                    >
                      Alinhamento fotos / formulário:{" "}
                      <strong>{resultado.fusaoDiagnosticoEmocional.alinhamentoFotosFormulario}%</strong>
                    </span>
                    <span
                      className="px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(109,185,109,0.25)", color: "rgba(109,185,109,0.9)" }}
                    >
                      Assertividade da leitura:{" "}
                      <strong>{resultado.fusaoDiagnosticoEmocional.assertividadeLeitura}%</strong>
                    </span>
                    <span
                      className="px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(247,242,236,0.5)" }}
                    >
                      Peso do formulário na fusão: {Math.round(resultado.fusaoDiagnosticoEmocional.pesoFormulario * 100)}%
                    </span>
                  </div>
                )}
                {resultado.fusaoDiagnosticoEmocional?.sinaisConvergentes &&
                  resultado.fusaoDiagnosticoEmocional.sinaisConvergentes.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1.5 text-sm" style={{ color: "rgba(247,242,236,0.58)" }}>
                      {resultado.fusaoDiagnosticoEmocional.sinaisConvergentes.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}
                {resultado.estruturasSomenteFotos && (
                  <p className="text-xs mt-4" style={{ color: "rgba(200,165,107,0.45)" }}>
                    As barras abaixo refletem a leitura já integrada; o perfil só-fotos fica guardado nos dados para transparência.
                  </p>
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
        )}
      </div>
    </div>
  );
}
