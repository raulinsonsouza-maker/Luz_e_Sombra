import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowRight, Heart, Loader2, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { storageKeyLinguagensAmorDraft, parsePessoaIdFromSearch } from "@/lib/tracoFormStorage";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import PageIntroHeader from "@/components/PageIntroHeader";
import { JORNADA_MODULE_NAV } from "@/lib/jornadaHubConfig";
import {
  PARES_RECEBER,
  PARES_EXPRESSAR,
  entradaLinguagensAmorSchema,
  tituloBloco,
  type ParForcado,
} from "@workspace/cinco-linguagens-amor";
import LinguagensPainelResultado, { type ResultadoLinguagensUi } from "./linguagens-amor/LinguagensPainelResultado";
import LinguagensSeletorPessoa, { type PessoaAnalise } from "./linguagens-amor/LinguagensSeletorPessoa";
import LinguagensCruzamento from "./linguagens-amor/LinguagensCruzamento";

const TOTAL = 30;
const BLOCO1 = 15;
const LING_NAV = JORNADA_MODULE_NAV["linguagens-amor"];

type Fase = "intro" | "perguntas" | "enviando" | "resultado";

type DraftPersist = {
  pessoaId: number | null;
  bloco: 0 | 1;
  qIndex: number;
  answers: Record<string, "a" | "b">;
  startedAt: number;
};

function resetEstadoPerfil(): {
  answers: Record<string, "a" | "b">;
  bloco: 0 | 1;
  qIndex: number;
  startedAt: number;
} {
  return { answers: {}, bloco: 0, qIndex: 0, startedAt: Date.now() };
}

export default function LinguagensAmorPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { status, user } = useAuth();
  const [fase, setFase] = useState<Fase>("intro");
  const [bloco, setBloco] = useState<0 | 1>(0);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "a" | "b">>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [erro, setErro] = useState<string | null>(null);
  const [msgIntro, setMsgIntro] = useState<string | null>(null);
  const [carregandoUltimo, setCarregandoUltimo] = useState(false);
  const [resultadoApi, setResultadoApi] = useState<ResultadoLinguagensUi | null>(null);
  const [nomeResultado, setNomeResultado] = useState<string | null>(null);

  const [pessoas, setPessoas] = useState<PessoaAnalise[]>([]);
  const [selectedPessoaId, setSelectedPessoaId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addNome, setAddNome] = useState("");
  const [addRelacao, setAddRelacao] = useState("parceiro/a");
  const [addErro, setAddErro] = useState<string | null>(null);
  const [historicoIds, setHistoricoIds] = useState<Set<number>>(new Set());
  const [showCruzamento, setShowCruzamento] = useState(false);
  const pessoaSwitchGenRef = useRef(0);

  const draftKey = useCallback(
    (pessoaId: number | null) => storageKeyLinguagensAmorDraft(pessoaId, user?.id),
    [user?.id],
  );

  const resetPerfilAtivo = useCallback(() => {
    const next = resetEstadoPerfil();
    setResultadoApi(null);
    setNomeResultado(null);
    setShowCruzamento(false);
    setErro(null);
    setMsgIntro(null);
    setAnswers(next.answers);
    setBloco(next.bloco);
    setQIndex(next.qIndex);
    setStartedAt(next.startedAt);
    setFase("intro");
  }, []);

  const handleSelectPessoa = useCallback(
    (id: number | null) => {
      pessoaSwitchGenRef.current += 1;
      resetPerfilAtivo();
      setSelectedPessoaId(id);
    },
    [resetPerfilAtivo],
  );

  const pessoaIdFromUrl = useMemo(() => parsePessoaIdFromSearch(search), [search]);

  useEffect(() => {
    pessoaSwitchGenRef.current += 1;
    resetPerfilAtivo();
    setSelectedPessoaId(pessoaIdFromUrl);
  }, [pessoaIdFromUrl, resetPerfilAtivo]);

  const paresBloco: ParForcado[] = bloco === 0 ? PARES_RECEBER : PARES_EXPRESSAR;
  const parAtual = paresBloco[qIndex];
  const indiceGlobal = bloco === 0 ? qIndex + 1 : BLOCO1 + qIndex + 1;
  const progresso = fase === "perguntas" ? indiceGlobal / TOTAL : 0;

  useEffect(() => {
    if (status === "unauthenticated") navigate("/login");
  }, [status, navigate]);

  const carregarPessoas = useCallback(() => {
    apiFetch("/traco/pessoas")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: PessoaAnalise[]) => setPessoas(Array.isArray(list) ? list : []))
      .catch(() => {});
  }, []);

  const carregarHistorico = useCallback(() => {
    apiFetch("/linguagens-amor/historico")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { pessoaId?: number | null }[]) => {
        const ids = new Set<number>();
        for (const row of rows) {
          if (row.pessoaId) ids.add(row.pessoaId);
        }
        setHistoricoIds(ids);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    carregarPessoas();
    carregarHistorico();
  }, [carregarPessoas, carregarHistorico]);

  const carregarUltimoServidor = useCallback(async () => {
    const gen = pessoaSwitchGenRef.current;
    setMsgIntro(null);
    setCarregandoUltimo(true);
    try {
      const qs = selectedPessoaId !== null ? `?pessoaId=${selectedPessoaId}` : "";
      const res = await apiFetch(`/linguagens-amor/ultimo${qs}`);
      if (gen !== pessoaSwitchGenRef.current) return;
      if (!res.ok) {
        setMsgIntro("Não foi possível carregar agora. Tente de novo daqui a pouco.");
        return;
      }
      const row = (await res.json()) as { resultado?: ResultadoLinguagensUi; pessoaId?: number | null } | null;
      if (gen !== pessoaSwitchGenRef.current) return;
      if (row?.resultado) {
        const nome =
          selectedPessoaId !== null
            ? pessoas.find((p) => p.id === selectedPessoaId)?.nome ?? null
            : null;
        setNomeResultado(nome);
        setResultadoApi(row.resultado);
        setFase("resultado");
        return;
      }
      setMsgIntro("Ainda não há resultado guardado para este perfil. Complete o questionário uma vez.");
    } catch {
      if (gen === pessoaSwitchGenRef.current) {
        setMsgIntro("Não foi possível carregar. Verifique a ligação à internet.");
      }
    } finally {
      if (gen === pessoaSwitchGenRef.current) {
        setCarregandoUltimo(false);
      }
    }
  }, [selectedPessoaId, pessoas]);

  const iniciarOuRecuperar = useCallback(() => {
    try {
      const raw = localStorage.getItem(draftKey(selectedPessoaId));
      if (raw) {
        const d = JSON.parse(raw) as DraftPersist;
        if (d.pessoaId === selectedPessoaId && d.answers && typeof d.qIndex === "number") {
          setAnswers(typeof d.answers === "object" ? d.answers : {});
          setBloco(d.bloco === 1 ? 1 : 0);
          setQIndex(Math.min(BLOCO1 - 1, Math.max(0, d.qIndex)));
          setStartedAt(typeof d.startedAt === "number" ? d.startedAt : Date.now());
          setFase("perguntas");
          return;
        }
      }
    } catch {
      /* ignore */
    }
    const t = Date.now();
    setAnswers({});
    setBloco(0);
    setQIndex(0);
    setStartedAt(t);
    try {
      localStorage.setItem(
        draftKey(selectedPessoaId),
        JSON.stringify({ pessoaId: selectedPessoaId, bloco: 0, qIndex: 0, answers: {}, startedAt: t } satisfies DraftPersist),
      );
    } catch {
      /* ignore */
    }
    setFase("perguntas");
  }, [selectedPessoaId, draftKey]);

  const refazer = useCallback(() => {
    localStorage.removeItem(draftKey(selectedPessoaId));
    setResultadoApi(null);
    setShowCruzamento(false);
    iniciarOuRecuperar();
  }, [selectedPessoaId, draftKey, iniciarOuRecuperar]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.get("ver") === "resultado") {
      void carregarUltimoServidor();
      return;
    }
    if (params.get("nova") === "1") {
      localStorage.removeItem(draftKey(selectedPessoaId));
      const next = resetEstadoPerfil();
      setResultadoApi(null);
      setAnswers(next.answers);
      setBloco(next.bloco);
      setQIndex(next.qIndex);
      setStartedAt(next.startedAt);
      setFase("perguntas");
    }
  }, [status, search, selectedPessoaId, draftKey, carregarUltimoServidor]);

  useEffect(() => {
    if (fase !== "perguntas") return;
    const draft: DraftPersist = { pessoaId: selectedPessoaId, bloco, qIndex, answers, startedAt };
    try {
      localStorage.setItem(draftKey(selectedPessoaId), JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [fase, selectedPessoaId, bloco, qIndex, answers, startedAt, draftKey]);

  function escolher(lado: "a" | "b") {
    if (!parAtual) return;
    const novas = { ...answers, [parAtual.id]: lado };
    setAnswers(novas);

    if (qIndex < BLOCO1 - 1) {
      setQIndex((i) => i + 1);
      return;
    }
    if (bloco === 0) {
      setBloco(1);
      setQIndex(0);
      return;
    }
    void enviar(novas);
  }

  async function enviar(ans: Record<string, "a" | "b">) {
    const pessoaIdAtStart = selectedPessoaId;
    const parsed = entradaLinguagensAmorSchema.safeParse({
      answers: ans,
      metadata: {
        tempo_total_segundos: Math.max(0, Math.floor((Date.now() - startedAt) / 1000)),
        idioma: "pt-BR",
        versao_questionario: "2.0",
      },
    });
    if (!parsed.success) {
      setErro("Respostas incompletas.");
      return;
    }
    setErro(null);
    setFase("enviando");
    try {
      const res = await apiFetch("/linguagens-amor", {
        method: "POST",
        body: JSON.stringify({ ...parsed.data, pessoaId: pessoaIdAtStart }),
      });
      const data = await res.json().catch(() => ({}));
      if (selectedPessoaId !== pessoaIdAtStart) {
        setErro("A pessoa selecionada mudou durante o envio. Tente novamente.");
        setFase("perguntas");
        return;
      }
      if (!res.ok) {
        setErro((data as { error?: string }).error ?? "Erro ao enviar.");
        setFase("perguntas");
        return;
      }
      localStorage.removeItem(draftKey(pessoaIdAtStart));
      const nome =
        pessoaIdAtStart !== null
          ? pessoas.find((p) => p.id === pessoaIdAtStart)?.nome ?? null
          : null;
      setNomeResultado(nome);
      setResultadoApi(data as ResultadoLinguagensUi);
      setFase("resultado");
      carregarHistorico();
    } catch {
      if (selectedPessoaId === pessoaIdAtStart) {
        setErro("Falha de rede.");
        setFase("perguntas");
      }
    }
  }

  function voltar() {
    if (qIndex > 0) {
      setQIndex((i) => i - 1);
      return;
    }
    if (bloco === 1) {
      setBloco(0);
      setQIndex(BLOCO1 - 1);
      return;
    }
    setFase("intro");
  }

  async function adicionarPessoa() {
    setAddErro(null);
    if (!addNome.trim()) {
      setAddErro("Nome é obrigatório.");
      return;
    }
    const res = await apiFetch("/traco/pessoas", {
      method: "POST",
      body: JSON.stringify({ nome: addNome.trim(), relacao: addRelacao }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setAddErro((data as { error?: string }).error ?? "Erro ao adicionar.");
      return;
    }
    setAddNome("");
    setShowAdd(false);
    carregarPessoas();
    handleSelectPessoa((data as PessoaAnalise).id);
  }

  const subtituloPerguntas = useMemo(() => {
    const tit = tituloBloco(bloco === 0 ? "receber" : "expressar");
    return `${indiceGlobal} de ${TOTAL} · ${tit}`;
  }, [bloco, indiceGlobal]);

  const bg = "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)";

  if (fase === "resultado" && resultadoApi) {
    const subtituloResultado = nomeResultado
      ? `Perfil de ${nomeResultado}`
      : "Seu mapa de receber e expressar amor";
    return (
      <div className="min-h-screen pb-28 px-4 pt-6" style={{ background: bg }}>
        <MobileTopBar titulo="Linguagens do amor" subtitulo={subtituloResultado} />
        <div className="max-w-lg md:max-w-2xl mx-auto space-y-6">
          <NavBackButton to={LING_NAV.hub} label={LING_NAV.backLabel} />

          <PageIntroHeader
            hiddenOnMobile
            className="mb-2"
            eyebrow="5 Linguagens do Amor"
            titulo="Seu perfil afetivo"
            subtitulo={subtituloResultado}
          />

          <LinguagensPainelResultado
            resultado={resultadoApi}
            nomePessoa={nomeResultado}
            onRefazer={refazer}
          />

          <div
            className="rounded-2xl p-4 flex flex-col sm:flex-row gap-2"
            style={{ background: "rgba(30,24,18,0.45)", border: "1px solid rgba(200,165,107,0.12)" }}
          >
            <button
              type="button"
              onClick={refazer}
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            >
              <RotateCcw className="w-4 h-4" />
              Refazer questionário
            </button>
            {selectedPessoaId === null && (
              <button
                type="button"
                onClick={() => setShowCruzamento((s) => !s)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(247,242,236,0.75)", border: "1px solid rgba(200,165,107,0.18)" }}
              >
                {showCruzamento ? "Ocultar cruzamento" : "Cruzar com alguém"}
              </button>
            )}
          </div>

          {showCruzamento && selectedPessoaId === null && (
            <LinguagensCruzamento
              pessoas={pessoas}
              historicoIds={historicoIds}
              onFechar={() => setShowCruzamento(false)}
            />
          )}
        </div>
      </div>
    );
  }

  if (fase === "enviando") {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center px-4" style={{ background: bg }}>
        <div className="absolute top-0 left-0 right-0">
          <MobileTopBar titulo="Linguagens do amor" subtitulo="A guardar…" />
        </div>
        <div className="absolute top-24 left-0 right-0 px-4 max-w-lg mx-auto">
          <NavBackButton to={LING_NAV.hub} label={LING_NAV.backLabel} className="mb-0" />
        </div>
        <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: "#c8a56b" }} />
        <p className="text-sm" style={{ color: "rgba(247,242,236,0.5)" }}>
          A guardar sua análise…
        </p>
      </div>
    );
  }

  if (fase === "intro") {
    return (
      <div className="min-h-screen pb-28 px-4 pt-8" style={{ background: bg }}>
        <MobileTopBar titulo="5 Linguagens do Amor" subtitulo="Questionário v2" />
        <div className="max-w-lg mx-auto px-4">
          <NavBackButton to={LING_NAV.hub} label={LING_NAV.backLabel} />
          <Heart className="w-12 h-12 mb-6 hidden md:block" style={{ color: "#c8a56b" }} />
          <h1 className="font-tan-mon-cheri text-3xl mb-4 hidden md:block" style={{ color: "#f7f2ec" }}>
            5 Linguagens do Amor
          </h1>

          <LinguagensSeletorPessoa
            pessoas={pessoas}
            selectedPessoaId={selectedPessoaId}
            onSelect={handleSelectPessoa}
            showAdd={showAdd}
            onToggleAdd={() => setShowAdd((s) => !s)}
            addNome={addNome}
            onAddNome={setAddNome}
            addRelacao={addRelacao}
            onAddRelacao={setAddRelacao}
            onAdd={() => void adicionarPessoa()}
            addErro={addErro}
          />

          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.55)" }}>
            Cada pessoa sente e demonstra amor de um jeito diferente. Em dois blocos de 15 escolhas, você descobre
            como prefere <strong style={{ color: "rgba(200,165,107,0.8)" }}>receber</strong> e como costuma{" "}
            <strong style={{ color: "rgba(200,165,107,0.8)" }}>expressar</strong> afeto, o tanque emocional de Gary
            Chapman.
          </p>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(247,242,236,0.45)" }}>
            Em cada par, escolha a frase que mais combina com você. São {TOTAL} escolhas no total. Não há certo ou
            errado.
          </p>

          {msgIntro && (
            <p className="text-sm mb-4" style={{ color: "rgba(247,242,236,0.55)" }}>
              {msgIntro}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={iniciarOuRecuperar}
              className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            >
              Começar
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={carregandoUltimo}
              onClick={() => void carregarUltimoServidor()}
              className="w-full py-3 rounded-xl text-sm font-medium disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.04)", color: "#c8a56b", border: "1px solid rgba(200,165,107,0.2)" }}
            >
              {carregandoUltimo ? "A carregar…" : "Ver último resultado"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 px-4 pt-6" style={{ background: bg }}>
      <MobileTopBar titulo="Linguagens do amor" subtitulo={subtituloPerguntas} />
      <div className="max-w-lg mx-auto px-4">
        <NavBackButton to={LING_NAV.hub} label={LING_NAV.backLabel} />
        {bloco === 1 && qIndex === 0 && (
          <div
            className="mb-4 p-3 rounded-xl text-xs text-center"
            style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.2)", color: "rgba(247,242,236,0.6)" }}
          >
            Bloco 2 de 2. Agora: como você demonstra amor
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={voltar} className="text-xs" style={{ color: "rgba(200,165,107,0.65)" }}>
            Voltar
          </button>
          <span className="text-[11px] tabular-nums" style={{ color: "rgba(247,242,236,0.35)" }}>
            {indiceGlobal} / {TOTAL}
          </span>
        </div>
        <div className="h-2 rounded-full mb-8 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progresso * 100}%`,
              background: "linear-gradient(90deg, #8a6a3e, #c8a56b)",
            }}
          />
        </div>

        {erro && <p className="text-sm mb-4 text-red-400/90">{erro}</p>}

        {parAtual && (
          <div className="space-y-6">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>
              O que é mais verdadeiro para você?
            </p>
            <button
              type="button"
              onClick={() => escolher("a")}
              className="w-full text-left p-5 rounded-2xl text-sm leading-relaxed transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(200,165,107,0.18)",
                color: "#f7f2ec",
              }}
            >
              A — {parAtual.textoA}
            </button>
            <button
              type="button"
              onClick={() => escolher("b")}
              className="w-full text-left p-5 rounded-2xl text-sm leading-relaxed transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(200,165,107,0.18)",
                color: "#f7f2ec",
              }}
            >
              B — {parAtual.textoB}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
