import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { X, Camera, User, ArrowRight, Loader2, AlertCircle, ImageIcon, Plus, Users, Trash2, Lock, CheckCircle2 } from "lucide-react";
import { analyzeTracoDeCarater } from "@/lib/tracoAnalysis";
import {
  purgeQuestionario20Storage,
  readDiagnosticoEmocional30Fusao,
  storageKeyDiagnostico30,
  clearPessoaLocalStorage,
  isDiagnostico30RespostasCompletas,
  readDiagnostico30RespostasEntrada,
  parsePessoaIdFromSearch,
} from "@/lib/tracoFormStorage";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import { JORNADA_MODULE_NAV } from "@/lib/jornadaHubConfig";
import Diagnostico30Form from "@/pages/traco/components/Diagnostico30Form";
import { FOTOS_CONFIG, type EstruturasPct, type TipoFoto } from "@/pages/traco/tracoConfig";
import { TracoPainelResultado } from "@/pages/traco/components/TracoPainelResultado";

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

interface FotoTraco {
  id: number;
  tipo: TipoFoto;
  objectPath: string;
  criadoEm: string;
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

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function TracodeCaraterPage() {
  const { user, status } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const selectedPessoaId = useMemo(() => parsePessoaIdFromSearch(search), [search]);

  const irParaTracoPessoa = useCallback(
    (pessoaId: number | null) => {
      const path = pessoaId === null ? "/traco-de-carater" : `/traco-de-carater?pessoaId=${pessoaId}`;
      setLocation(path, { replace: true } as { replace?: boolean });
    },
    [setLocation]
  );
  const primeiroNome = (user?.nome || "").split(" ")[0];

  const [fotos, setFotos] = useState<Partial<Record<TipoFoto, FotoTraco>>>({});
  const [fotoFiles, setFotoFiles] = useState<Partial<Record<TipoFoto, File>>>({}); // local File objects for analysis
  const [previews, setPreviews] = useState<Partial<Record<TipoFoto, string>>>({});
  const [uploading, setUploading] = useState<Partial<Record<TipoFoto, boolean>>>({});
  const [analise, setAnalise] = useState<AnaliseTraco | null>(null);
  const [analisando, setAnalisando] = useState(false);
  const [analisandoEtapa, setAnalisandoEtapa] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const fileInputs = useRef<Partial<Record<TipoFoto, HTMLInputElement | null>>>({});
  const cameraInputs = useRef<Partial<Record<TipoFoto, HTMLInputElement | null>>>({});
  const loadGenRef = useRef(0);
  const selectedPessoaIdRef = useRef(selectedPessoaId);
  selectedPessoaIdRef.current = selectedPessoaId;

  const revokePreviewUrls = useCallback((urls: Partial<Record<TipoFoto, string>>) => {
    for (const url of Object.values(urls)) {
      if (url?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [showAddPessoa, setShowAddPessoa] = useState(false);
  const [novaNome, setNovaNome] = useState("");
  const [novaRelacao, setNovaRelacao] = useState("parceiro/a");
  const [addingPessoa, setAddingPessoa] = useState(false);
  const [diagnosticoCompleto, setDiagnosticoCompleto] = useState(false);

  async function carregarDados(pessoaId: number | null) {
    const gen = ++loadGenRef.current;
    try {
      const q = pessoaId !== null ? `?pessoaId=${pessoaId}` : "";
      const [fotosRes, analiseRes] = await Promise.all([
        apiFetch(`/traco/fotos${q}`),
        apiFetch(`/traco/analise${q}`),
      ]);
      if (gen !== loadGenRef.current) return;

      if (fotosRes.ok) {
        const lista: FotoTraco[] = await fotosRes.json();
        const map: Partial<Record<TipoFoto, FotoTraco>> = {};
        const prevMap: Partial<Record<TipoFoto, string>> = {};
        const token = localStorage.getItem("luz_e_sombra_token") ?? "";
        await Promise.all(
          lista.map(async (f) => {
            map[f.tipo as TipoFoto] = f;
            try {
              const imgRes = await fetch(`${API_BASE}/api/traco/fotos/${f.id}/view`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (imgRes.ok) {
                const blob = await imgRes.blob();
                prevMap[f.tipo as TipoFoto] = URL.createObjectURL(blob);
              }
            } catch {
              /* keep no preview */
            }
          })
        );
        if (gen !== loadGenRef.current) {
          revokePreviewUrls(prevMap);
          return;
        }
        setFotos(map);
        setPreviews(prevMap);
      } else if (gen === loadGenRef.current) {
        setFotos({});
        setPreviews({});
      }

      if (gen !== loadGenRef.current) return;

      if (analiseRes.ok) {
        const data = await analiseRes.json();
        if (gen === loadGenRef.current) setAnalise(data);
      } else if (gen === loadGenRef.current) {
        setAnalise(null);
      }
    } catch {
      /* silently ignore */
    }
  }

  useEffect(() => {
    purgeQuestionario20Storage();
    apiFetch("/traco/pessoas").then(r => r.ok ? r.json() : []).then(setPessoas).catch(() => {});
  }, []);

  useEffect(() => {
    loadGenRef.current += 1;
    setPreviews((prev) => {
      revokePreviewUrls(prev);
      return {};
    });
    setFotos({});
    setFotoFiles({});
    setAnalise(null);
    setErro(null);
    setUploading({});
    setAnalisando(false);
    setAnalisandoEtapa("");
    carregarDados(selectedPessoaId);
    const ent = readDiagnostico30RespostasEntrada(selectedPessoaId);
    setDiagnosticoCompleto(ent !== null && isDiagnostico30RespostasCompletas(ent));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPessoaId]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.get("ver") === "resultado" && analise) {
      requestAnimationFrame(() => {
        document.getElementById("resultado-traco")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [status, search, analise]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.get("nova") !== "1") return;
    try {
      localStorage.removeItem(storageKeyDiagnostico30(selectedPessoaId, user?.id));
    } catch {
      /* ignore */
    }
    setDiagnosticoCompleto(false);
  }, [status, search, selectedPessoaId, user?.id]);

  const handleFileSelect = useCallback(
    async (tipo: TipoFoto, file: File) => {
      const pessoaNoUpload = selectedPessoaIdRef.current;
      const stillSamePessoa = () => selectedPessoaIdRef.current === pessoaNoUpload;

      const localURL = URL.createObjectURL(file);
      if (!stillSamePessoa()) {
        URL.revokeObjectURL(localURL);
        return;
      }
      setPreviews((p) => ({ ...p, [tipo]: localURL }));
      setUploading((u) => ({ ...u, [tipo]: true }));
      setErro(null);
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
          body: JSON.stringify({ tipo, objectPath, pessoaId: pessoaNoUpload }),
        });
        if (!saveRes.ok) throw new Error("Erro ao salvar foto");
        const savedFoto: FotoTraco = await saveRes.json();

        if (!stillSamePessoa()) return;

        setFotos((f) => ({ ...f, [tipo]: savedFoto }));
        setPreviews((p) => ({ ...p, [tipo]: localURL }));
      } catch (e: unknown) {
        if (!stillSamePessoa()) return;
        setErro(e instanceof Error ? e.message : "Erro ao fazer upload da foto");
        setPreviews((p) => ({ ...p, [tipo]: undefined }));
        setFotos((f) => {
          const n = { ...f };
          delete n[tipo];
          return n;
        });
        setFotoFiles((ff) => {
          const n = { ...ff };
          delete n[tipo];
          return n;
        });
      } finally {
        if (stillSamePessoa()) {
          setUploading((u) => ({ ...u, [tipo]: false }));
        }
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
    setFotoFiles((ff) => { const n = { ...ff }; delete n[tipo]; return n; });
  }, [fotos]);

  const handleAnalisar = async () => {
    const pessoaIdAtStart = selectedPessoaId;
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
      const diagnosticoEmocionalPayload = readDiagnosticoEmocional30Fusao(pessoaIdAtStart);
      const nomePessoa =
        pessoaIdAtStart === null
          ? user?.nome?.split(" ")[0] ?? "Você"
          : pessoas.find((p) => p.id === pessoaIdAtStart)?.nome ?? null;

      const resultado = await analyzeTracoDeCarater(photoSources, {
        token,
        pessoaId: pessoaIdAtStart,
        pessoaNome: nomePessoa,
        ...(diagnosticoEmocionalPayload ? { diagnosticoEmocional: diagnosticoEmocionalPayload } : {}),
      });

      const fotosComCorpo = resultado.marcadoresAgregados?.fotosComPoseCorpo ?? 0;
      const conf = resultado.confiancaAnalise ?? 0;
      if (fotosComCorpo === 0) {
        throw new Error(
          "Não foi possível detectar ombros e quadril em nenhuma foto de corpo. Refaça as fotos de corpo (frente e lado) com pose clara e fundo neutro."
        );
      }
      if (conf < 40) {
        throw new Error(
          `Confiança da análise muito baixa (${conf}%). Melhore o enquadramento, iluminação e pose antes de gerar o resultado.`
        );
      }

      setAnalisandoEtapa("Gerando análise completa...");

      if (selectedPessoaId !== pessoaIdAtStart) {
        throw new Error("A pessoa selecionada mudou durante a análise. Tente novamente.");
      }

      const saveRes = await apiFetch("/traco/analisar", {
        method: "POST",
        body: JSON.stringify({
          resultado,
          pessoaId: pessoaIdAtStart,
          snapshotPessoaId: pessoaIdAtStart,
          pessoaNome: nomePessoa,
          ...(diagnosticoEmocionalPayload ? { diagnosticoEmocional: diagnosticoEmocionalPayload } : {}),
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
        irParaTracoPessoa(pessoa.id);
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
        try {
          clearPessoaLocalStorage(id, user?.id);
        } catch {
          /* ignore */
        }
        if (selectedPessoaId === id) irParaTracoPessoa(null);
      }
    } catch { /* silent */ }
  }

  const fotosCount = Object.keys(fotos).length;
  const podeAnalisar = diagnosticoCompleto && fotosCount >= 1 && !analisando;

  const pessoaSelecionada = selectedPessoaId !== null ? pessoas.find(p => p.id === selectedPessoaId) : null;

  function refazerDiagnostico() {
    try {
      localStorage.removeItem(storageKeyDiagnostico30(selectedPessoaId));
    } catch {
      /* ignore */
    }
    setDiagnosticoCompleto(false);
  }

  const mensagemStatusAnalise = !diagnosticoCompleto
    ? "Conclua o diagnóstico emocional para liberar a análise."
    : fotosCount === 0
      ? "Envie ao menos uma foto para liberar a análise."
      : fotosCount < 3
        ? `${fotosCount}/3 fotos, a análise fica mais precisa com as 3.`
        : "Tudo pronto, análise completa disponível.";

  return (
    <div className="min-h-screen pb-28" style={{ background: "linear-gradient(160deg, #1e1812 0%, #2a1f14 50%, #2f251b 100%)" }}>
      <MobileTopBar />
      <div className="max-w-4xl mx-auto px-6 pt-4">
        <NavBackButton
          to={JORNADA_MODULE_NAV.traco.hub}
          label={JORNADA_MODULE_NAV.traco.backLabel}
        />
      </div>
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
          <p
            className="text-xs tracking-widest uppercase mb-3 inline-block px-3 py-1 rounded-full"
            style={{ color: "rgba(109,185,109,0.85)", border: "1px solid rgba(109,185,109,0.35)", background: "rgba(109,185,109,0.08)" }}
          >
            Diagnóstico emocional + fotos · 3 etapas
          </p>
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
            Ao cruzar suas fotos com o que você nos contou, esta jornada revela, com gentileza e profundidade,
            os padrões que seu corpo expressa e a história de quem você é, de onde você veio e do quanto você já
            cresceu.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* ── Seletor de pessoas ── */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase mb-1 flex items-center gap-2" style={{ color: "rgba(200,165,107,0.5)" }}>
            <Users className="w-3.5 h-3.5" /> Analisando
          </p>
          <p className="text-sm mb-3" style={{ color: "rgba(247,242,236,0.55)" }}>
            Perfil ativo:{" "}
            <span style={{ color: "#c8a56b" }}>
              {pessoaSelecionada ? pessoaSelecionada.nome : "Você"}
            </span>
            <span className="text-xs ml-2 opacity-60">(dados isolados por pessoa)</span>
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {/* Me */}
            <button
              onClick={() => irParaTracoPessoa(null)}
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
                onClick={() => irParaTracoPessoa(p.id)}
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
            {pessoas.length < 6 && (
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

        {/* ── Stepper (visão geral) ── */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
          {[
            { n: 1, label: "Diagnóstico", done: diagnosticoCompleto },
            { n: 2, label: "Fotos", done: fotosCount >= 1 },
            { n: 3, label: "Análise", done: !!analise },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl px-3 py-3 text-center"
              style={{
                background: s.done ? "rgba(93,185,122,0.08)" : "rgba(255,255,255,0.03)",
                border: s.done ? "1px solid rgba(93,185,122,0.28)" : "1px solid rgba(200,165,107,0.12)",
              }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {s.done ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#5db97a" }} />
                ) : (
                  <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ color: "#c8a56b", border: "1px solid rgba(200,165,107,0.35)" }}>
                    {s.n}
                  </span>
                )}
              </div>
              <p className="text-[10px] md:text-xs font-medium leading-tight" style={{ color: s.done ? "rgba(247,242,236,0.85)" : "rgba(247,242,236,0.45)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Etapa 1 · Diagnóstico ── */}
        <div
          className="rounded-2xl p-5 md:p-6 mb-8"
          style={{
            background: "rgba(200,165,107,0.05)",
            border: "1px solid rgba(200,165,107,0.15)",
          }}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(200,165,107,0.55)" }}>
                Etapa 1
              </p>
              <h2 className="font-tan-mon-cheri text-xl" style={{ color: "#f7f2ec" }}>
                Diagnóstico emocional
              </h2>
              <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.4)" }}>
                30 perguntas: contexto emocional antes das fotos (guardado por pessoa)
              </p>
            </div>
            {diagnosticoCompleto && <CheckCircle2 className="w-8 h-8 shrink-0" style={{ color: "#5db97a" }} />}
          </div>
          {!diagnosticoCompleto ? (
            <Diagnostico30Form
              key={storageKeyDiagnostico30(selectedPessoaId)}
              pessoaId={selectedPessoaId}
              variant="embedded"
              onConcluido={() => setDiagnosticoCompleto(true)}
            />
          ) : (
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(93,185,122,0.08)", border: "1px solid rgba(93,185,122,0.25)" }}
            >
              <p className="text-sm" style={{ color: "rgba(247,242,236,0.8)" }}>
                Diagnóstico concluído para{" "}
                <strong style={{ color: "#c8a56b" }}>{pessoaSelecionada ? pessoaSelecionada.nome.split(" ")[0] : "você"}</strong>.
              </p>
              <button
                type="button"
                onClick={refazerDiagnostico}
                className="text-xs font-semibold px-4 py-2 rounded-xl self-start sm:self-auto transition-opacity hover:opacity-90"
                style={{ border: "1px solid rgba(224,123,57,0.45)", color: "rgba(224,123,57,0.9)" }}
              >
                Refazer diagnóstico
              </button>
            </div>
          )}
        </div>

        {/* ── Etapa 2 · Fotos (bloqueada até Etapa 1) ── */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(200,165,107,0.55)" }}>
            Etapa 2
          </p>
          <h2 className="font-tan-mon-cheri text-xl mb-4" style={{ color: "#f7f2ec" }}>
            Enviar fotos
          </h2>
          <div className="relative rounded-2xl overflow-hidden">
            <div className={!diagnosticoCompleto ? "opacity-45 pointer-events-none select-none" : ""}>
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
            </div>
            {!diagnosticoCompleto && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10 rounded-2xl"
                style={{ background: "rgba(14,12,10,0.78)", backdropFilter: "blur(6px)" }}
              >
                <Lock className="w-10 h-10 mb-3" style={{ color: "#c8a56b" }} />
                <p className="text-sm font-medium max-w-xs" style={{ color: "#f7f2ec" }}>
                  Conclua a Etapa 1 para liberar o envio das fotos
                </p>
              </div>
            )}
          </div>
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

        {/* ── Etapa 3 · Analisar ── */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="w-full max-w-lg text-center mb-2">
            <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(200,165,107,0.55)" }}>
              Etapa 3
            </p>
            <h2 className="font-tan-mon-cheri text-xl" style={{ color: "#f7f2ec" }}>
              Gerar análise
            </h2>
          </div>
          <button
            onClick={handleAnalisar}
            disabled={!podeAnalisar}
            className="flex items-center gap-3 px-10 py-4 rounded-2xl font-medium transition-all text-base"
            style={{
              background:
                podeAnalisar
                  ? "linear-gradient(135deg, #c8a56b 0%, #9c7742 100%)"
                  : "rgba(200,165,107,0.1)",
              color: podeAnalisar ? "#1e1812" : "rgba(200,165,107,0.3)",
              cursor: podeAnalisar ? "pointer" : "not-allowed",
              opacity: analisando ? 0.7 : 1,
              boxShadow: podeAnalisar ? "0 4px 20px rgba(200,165,107,0.25)" : "none",
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
          <p className="text-xs text-center max-w-md px-2" style={{ color: "rgba(247,242,236,0.45)" }}>
            {mensagemStatusAnalise}
          </p>
        </div>

        {/* ── Results ── */}
        {analise && (
          <TracoPainelResultado
            analise={analise}
            onReanalisar={handleAnalisar}
            analisando={analisando}
            fotosCount={fotosCount}
            pessoaNome={pessoaSelecionada?.nome ?? null}
            criadoEm={analise.criadoEm}
          />
        )}
      </div>
    </div>
  );
}

