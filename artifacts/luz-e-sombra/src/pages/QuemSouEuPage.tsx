import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import {
  calcularNumerodeVida,
  calcularNumerodeExpressao,
  calcularNumerodaAlma,
  calcularNumerodaPersonalidade,
  formatarDataBrasileira,
} from "@/lib/numerologia-utils";
import { NUMEROS_DE_VIDA } from "@/lib/numerologia-data";
import { Loader2, ChevronLeft, Sparkles, Heart, Star, Compass, Zap, Shield } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface TracoResultado {
  estruturaPrincipal: string;
  estruturaSecundaria: string;
  estruturas: Record<string, number>;
  mensagemTerapeutica?: string;
  fraseIdentidade?: string;
  pontosFortes?: string[];
  interpretacao?: string;
  centroEnergetico?: string;
}

interface Avaliacao {
  plenitudeFelicidade: number;
  espiritualidade: number;
  saudeDisposicao: number;
  desenvolvimentoIntelectual: number;
  equilibrioEmocional: number;
  familia: number;
  desenvolvimentoAmoroso: number;
  vidaSocial: number;
  realizacaoProposito: number;
  recursosFinanceiros: number;
  contribuicaoSocial: number;
  criatividadeHobbyDiversao: number;
}

// ── Config ─────────────────────────────────────────────────────────────────────

const AREAS_LABELS: Record<keyof Avaliacao, string> = {
  plenitudeFelicidade: "Felicidade",
  espiritualidade: "Espiritualidade",
  saudeDisposicao: "Saúde",
  desenvolvimentoIntelectual: "Intelecto",
  equilibrioEmocional: "Equilíbrio Emocional",
  familia: "Família",
  desenvolvimentoAmoroso: "Amor",
  vidaSocial: "Vida Social",
  realizacaoProposito: "Propósito",
  recursosFinanceiros: "Finanças",
  contribuicaoSocial: "Contribuição",
  criatividadeHobbyDiversao: "Criatividade",
};

const ESTRUTURAS: Record<string, { nome: string; cor: string; corBg: string; icon: string; essencia: string; dom: string }> = {
  esquizoide: {
    nome: "Esquizóide",
    cor: "#9b8fde",
    corBg: "rgba(155,143,222,0.1)",
    icon: "✦",
    essencia: "Você habita o universo das ideias com profundidade rara. Sua inteligência singular e criatividade profunda são dons que poucos possuem.",
    dom: "Pensar além, criar mundos e encontrar conexões invisíveis",
  },
  oral: {
    nome: "Oral",
    cor: "#5b9bd5",
    corBg: "rgba(91,155,213,0.1)",
    icon: "♡",
    essencia: "Você tem uma capacidade extraordinária de sentir o outro de verdade. Nutre, conecta e cria vínculos de calor genuíno onde quer que vá.",
    dom: "Sentir profundamente, cuidar com autenticidade e criar pertencimento",
  },
  psicopata: {
    nome: "Psicopata / Narcisista",
    cor: "#e07b39",
    corBg: "rgba(224,123,57,0.1)",
    icon: "⚡",
    essencia: "Você possui magnetismo natural e uma capacidade de liderança que as pessoas percebem imediatamente. Estratégico, persuasivo e focado.",
    dom: "Liderar, influenciar e abrir caminhos onde outros veem obstáculos",
  },
  masoquista: {
    nome: "Masoquista",
    cor: "#6db96d",
    corBg: "rgba(109,185,109,0.1)",
    icon: "⚓",
    essencia: "Você carrega uma força silenciosa e uma lealdade que inspira. Suporta e resiste com uma profundidade emocional que é verdadeiramente impressionante.",
    dom: "Persistir com dignidade, ser presença certa nas horas difíceis",
  },
  rigido: {
    nome: "Rígido",
    cor: "#c8a56b",
    corBg: "rgba(200,165,107,0.1)",
    icon: "◈",
    essencia: "Você constrói com disciplina, comprometimento e busca genuína por excelência. Sua presença é impactante e sua entrega inspira os que estão ao redor.",
    dom: "Realizar com qualidade, estruturar e ser referência de integridade",
  },
};

const VIDA_ESSENCIA: Record<number, { curta: string; profunda: string }> = {
  1: { curta: "O Pioneiro", profunda: "Você nasceu para criar caminhos onde não havia nenhum. Liderança, iniciativa e coragem de ser o primeiro fazem parte da sua missão mais profunda." },
  2: { curta: "O Diplomata", profunda: "Você encontra força genuína na colaboração e na sensibilidade ao outro. Equilíbrio, parceria e escuta são seus dons naturais para o mundo." },
  3: { curta: "O Criador", profunda: "Criação e expressão fluem naturalmente em você. Seu dom é comunicar, inspirar e trazer leveza e alegria onde quer que chegue." },
  4: { curta: "O Construtor", profunda: "Você tem o dom de transformar sonhos em realidade concreta. Disciplina, consistência e construção com fundação sólida são o seu caminho." },
  5: { curta: "O Aventureiro", profunda: "Você aprende vivendo intensamente cada momento. Liberdade, experiência, mudança e adaptação são as marcas vivas da sua jornada." },
  6: { curta: "O Guardião", profunda: "Seu coração é naturalmente voltado para cuidar e harmonizar. Amor, responsabilidade e beleza nas relações são as forças que movem sua vida." },
  7: { curta: "O Sábio", profunda: "Você carrega uma profundidade filosófica que poucos alcançam. Sabedoria, introspecção e busca pela verdade mais profunda são o seu caminho." },
  8: { curta: "O Realizador", profunda: "Você tem a capacidade extraordinária de manifestar no mundo material com propósito. Poder consciente, abundância e realização são seus dons." },
  9: { curta: "O Humanista", profunda: "Você sente o chamamento de contribuir com algo muito maior do que si mesmo. Completude, compaixão universal e serviço são a essência da sua alma." },
  11: { curta: "O Iluminado", profunda: "Você carrega o Número Mestre — uma sensibilidade espiritual elevada e uma capacidade de inspirar e elevar as pessoas que vai além do comum." },
  22: { curta: "O Grande Construtor", profunda: "Você é o Número Mestre do Grande Construtor — com potencial de criar algo que transforma o coletivo inteiro com sabedoria e visão." },
  33: { curta: "O Mestre do Amor", profunda: "Você expressa o Número Mestre do Amor — compaixão, cura e serviço de uma forma que poucos são capazes de oferecer ao mundo." },
};

// ── Synthesis Generator ────────────────────────────────────────────────────────

function gerarSintese(params: {
  primeiroNome: string;
  vidaNum: number | null;
  estruturaPrincipal: string | null;
  topAreas: string[];
  bottomAreas: string[];
  mensagemTerapeutica: string | null;
}): string {
  const { primeiroNome, vidaNum, estruturaPrincipal, topAreas, bottomAreas, mensagemTerapeutica } = params;
  const partes: string[] = [];

  if (vidaNum && VIDA_ESSENCIA[vidaNum]) {
    partes.push(`${primeiroNome}, os números da sua vida falam: você é ${VIDA_ESSENCIA[vidaNum].curta.toLowerCase()}. ${VIDA_ESSENCIA[vidaNum].profunda}`);
  }

  if (estruturaPrincipal && ESTRUTURAS[estruturaPrincipal]) {
    partes.push(ESTRUTURAS[estruturaPrincipal].essencia);
  }

  if (topAreas.length > 0) {
    const nomes = topAreas.slice(0, 2).map(k => AREAS_LABELS[k as keyof Avaliacao] || k).join(" e ");
    partes.push(`Sua Roda da Vida revela que ${nomes} ${topAreas.length > 1 ? "são áreas" : "é uma área"} que você cultiva com cuidado e consciência — isso diz muito sobre quem você é.`);
  }

  if (bottomAreas.length > 0) {
    const nome = AREAS_LABELS[bottomAreas[0] as keyof Avaliacao] || bottomAreas[0];
    partes.push(`${nome} surge como um convite gentil — não como uma falha, mas como a próxima fronteira do seu crescimento. Todo grande ser humano tem uma fronteira assim.`);
  }

  if (mensagemTerapeutica) {
    partes.push(mensagemTerapeutica);
  }

  return partes.join(" ") || `${primeiroNome}, você é um ser único e completo, em constante e bela expansão.`;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function QuemSouEuPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [traco, setTraco] = useState<TracoResultado | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    if (!user) return;
    buscarDados();
  }, [user]);

  async function buscarDados() {
    setLoading(true);
    try {
      const [tracoRes, avaliacaoRes, fotoRes] = await Promise.all([
        apiFetch("/traco/analise"),
        apiFetch("/avaliacoes"),
        fetch(`${API_BASE}/api/usuarios/me/foto-perfil/view`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("luz_e_sombra_token") ?? ""}` },
        }),
      ]);

      if (tracoRes.ok) {
        const data = await tracoRes.json();
        if (data) setTraco(data.resultado as TracoResultado);
      }

      if (avaliacaoRes.ok) {
        const lista = await avaliacaoRes.json();
        if (lista.length > 0) setAvaliacao(lista[0] as Avaliacao);
      }

      if (fotoRes.ok && fotoRes.headers.get("content-type")?.startsWith("image/")) {
        const blob = await fotoRes.blob();
        setFotoUrl(URL.createObjectURL(blob));
      }
    } catch { /* silent */ }
    setLoading(false);
  }

  if (!user) return null;

  const primeiroNome = user.nome.split(" ")[0];
  const dataNasc = user.dataNascimento;

  // Compute numerology client-side
  let vidaNum: number | null = null;
  let expressaoNum: number | null = null;
  let almaNum: number | null = null;
  let personalidadeNum: number | null = null;
  let vidaInfo: (typeof NUMEROS_DE_VIDA)[number] | null = null;

  if (dataNasc) {
    try {
      const dataFmt = formatarDataBrasileira(dataNasc);
      const v = calcularNumerodeVida(dataFmt);
      const e = user.nome.trim() ? calcularNumerodeExpressao(user.nome) : null;
      const a = user.nome.trim() ? calcularNumerodaAlma(user.nome) : null;
      const p = user.nome.trim() ? calcularNumerodaPersonalidade(user.nome) : null;
      vidaNum = v?.valor ?? null;
      expressaoNum = e?.valor ?? null;
      almaNum = a?.valor ?? null;
      personalidadeNum = p?.valor ?? null;
      if (vidaNum && NUMEROS_DE_VIDA[vidaNum]) vidaInfo = NUMEROS_DE_VIDA[vidaNum];
    } catch { /* ignore */ }
  }

  // Sort life areas
  const areasSorted = avaliacao
    ? (Object.entries(AREAS_LABELS) as [keyof Avaliacao, string][])
        .map(([key]) => ({ key, val: avaliacao[key] }))
        .sort((a, b) => b.val - a.val)
    : [];
  const topAreas = areasSorted.slice(0, 3).map(a => a.key as string);
  const bottomAreas = areasSorted.slice(-3).map(a => a.key as string);

  const estrutura = traco?.estruturaPrincipal ? ESTRUTURAS[traco.estruturaPrincipal] : null;
  const sintese = gerarSintese({
    primeiroNome,
    vidaNum,
    estruturaPrincipal: traco?.estruturaPrincipal ?? null,
    topAreas,
    bottomAreas,
    mensagemTerapeutica: traco?.mensagemTerapeutica ?? null,
  });

  const semDados = !traco && !avaliacao && !vidaNum;

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      {/* Nav */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-2" style={{ background: "rgba(19,15,9,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(200,165,107,0.08)" }}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/perfil")}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: "rgba(200,165,107,0.08)", color: "#c8a56b" }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-tan-mon-cheri text-lg" style={{ color: "#f7f2ec" }}>Quem Sou Eu</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#c8a56b" }} />
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.4)" }}>Reunindo quem você é...</p>
          </div>
        ) : (
          <>
            {/* ── Hero ── */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(200,165,107,0.12) 0%, rgba(156,119,66,0.06) 100%)",
                border: "1px solid rgba(200,165,107,0.2)",
              }}
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden mb-5 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(200,165,107,0.25), rgba(156,119,66,0.1))",
                    border: "2px solid rgba(200,165,107,0.4)",
                    boxShadow: "0 0 40px rgba(200,165,107,0.2)",
                  }}
                >
                  {fotoUrl ? (
                    <img src={fotoUrl} alt={primeiroNome} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-tan-mon-cheri text-3xl" style={{ color: "#c8a56b" }}>
                      {primeiroNome[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
                  Análise Integrada
                </p>
                <h2 className="font-tan-mon-cheri text-3xl mb-2" style={{ color: "#f7f2ec" }}>
                  {user.nome}
                </h2>
                {traco?.fraseIdentidade && (
                  <p className="text-sm italic mt-1" style={{ color: "rgba(200,165,107,0.7)" }}>
                    "{traco.fraseIdentidade}"
                  </p>
                )}
                {!traco?.fraseIdentidade && vidaNum && VIDA_ESSENCIA[vidaNum] && (
                  <p className="text-sm" style={{ color: "rgba(200,165,107,0.7)" }}>
                    {VIDA_ESSENCIA[vidaNum].curta} · Caminho {vidaNum}
                  </p>
                )}
              </div>
            </div>

            {/* ── Sem dados ── */}
            {semDados && (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,165,107,0.1)" }}
              >
                <Sparkles className="w-10 h-10 mx-auto mb-4" style={{ color: "rgba(200,165,107,0.3)" }} />
                <p className="font-tan-mon-cheri text-xl mb-2" style={{ color: "rgba(247,242,236,0.5)" }}>
                  Sua história ainda está sendo escrita
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.3)" }}>
                  Complete sua data de nascimento, realize a análise do Traço de Caráter e preencha sua Roda da Vida para ver sua síntese completa aqui.
                </p>
              </div>
            )}

            {/* ── Numerologia ── */}
            {vidaNum && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,165,107,0.12)" }}
              >
                <div className="px-6 pt-6 pb-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(200,165,107,0.08)" }}>
                  <Star className="w-4 h-4" style={{ color: "#c8a56b" }} />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>
                    Sua Alma Numerológica
                  </span>
                </div>

                <div className="p-6">
                  {/* Main number */}
                  <div className="flex items-center gap-5 mb-5">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 font-tan-mon-cheri text-4xl"
                      style={{
                        background: "linear-gradient(135deg, #9c7742, #c8a56b)",
                        color: "#fff",
                        boxShadow: "0 8px 24px rgba(200,165,107,0.25)",
                      }}
                    >
                      {vidaNum}
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
                        Caminho de Vida
                      </p>
                      <p className="font-semibold mb-1" style={{ color: "#f7f2ec" }}>
                        {vidaInfo?.titulo || VIDA_ESSENCIA[vidaNum]?.curta || `Número ${vidaNum}`}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                        {vidaInfo?.essencia || VIDA_ESSENCIA[vidaNum]?.curta}
                      </p>
                    </div>
                  </div>

                  {VIDA_ESSENCIA[vidaNum] && (
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(247,242,236,0.55)" }}>
                      {VIDA_ESSENCIA[vidaNum].profunda}
                    </p>
                  )}

                  {/* Secondary numbers */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Expressão", num: expressaoNum, icon: Zap },
                      { label: "Alma", num: almaNum, icon: Heart },
                      { label: "Personalidade", num: personalidadeNum, icon: Shield },
                    ].filter(n => n.num !== null).map(({ label, num, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-xl p-3 text-center"
                        style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.12)" }}
                      >
                        <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: "rgba(200,165,107,0.5)" }} />
                        <p className="font-tan-mon-cheri text-xl mb-0.5" style={{ color: "#c8a56b" }}>{num}</p>
                        <p className="text-[10px]" style={{ color: "rgba(247,242,236,0.35)" }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Traço de Caráter ── */}
            {traco && estrutura && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,165,107,0.12)" }}
              >
                <div className="px-6 pt-6 pb-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(200,165,107,0.08)" }}>
                  <Compass className="w-4 h-4" style={{ color: "#c8a56b" }} />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>
                    Sua Estrutura de Caráter
                  </span>
                </div>

                <div className="p-6">
                  {/* Dominant structure */}
                  <div
                    className="rounded-2xl p-5 mb-4"
                    style={{ background: estrutura.corBg, border: `1px solid ${estrutura.cor}33` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{estrutura.icon}</span>
                      <div>
                        <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: `${estrutura.cor}99` }}>
                          Estrutura Dominante
                        </p>
                        <p className="font-tan-mon-cheri text-xl" style={{ color: estrutura.cor }}>
                          {estrutura.nome}
                        </p>
                      </div>
                      <div
                        className="ml-auto font-tan-mon-cheri text-2xl"
                        style={{ color: estrutura.cor }}
                      >
                        {traco.estruturas[traco.estruturaPrincipal]}%
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
                      {estrutura.essencia}
                    </p>
                    <p className="text-xs mt-3 italic" style={{ color: `${estrutura.cor}80` }}>
                      Dom: {estrutura.dom}
                    </p>
                  </div>

                  {/* All structures bar */}
                  <div className="space-y-2">
                    {Object.entries(traco.estruturas)
                      .sort(([, a], [, b]) => b - a)
                      .map(([key, pct]) => {
                        const cfg = ESTRUTURAS[key];
                        if (!cfg) return null;
                        return (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs" style={{ color: "rgba(247,242,236,0.45)" }}>{cfg.nome}</span>
                              <span className="text-xs font-medium" style={{ color: cfg.cor }}>{pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, background: cfg.cor, opacity: 0.8 }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {traco.pontosFortes && traco.pontosFortes.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.4)" }}>
                        Seus pontos fortes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {traco.pontosFortes.slice(0, 4).map((p, i) => (
                          <span key={i} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(200,165,107,0.08)", color: "rgba(200,165,107,0.7)", border: "1px solid rgba(200,165,107,0.15)" }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Roda da Vida ── */}
            {avaliacao && areasSorted.length > 0 && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,165,107,0.12)" }}
              >
                <div className="px-6 pt-6 pb-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(200,165,107,0.08)" }}>
                  <Heart className="w-4 h-4" style={{ color: "#c8a56b" }} />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>
                    Sua Roda da Vida
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  {/* All areas as bars */}
                  <div className="space-y-3">
                    {areasSorted.map(({ key, val }) => {
                      const label = AREAS_LABELS[key as keyof Avaliacao];
                      const pct = (val / 10) * 100;
                      const color = val >= 7 ? "#5db97a" : val >= 4 ? "#c8a56b" : "#e07b39";
                      return (
                        <div key={key as string}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs" style={{ color: "rgba(247,242,236,0.5)" }}>{label}</span>
                            <span className="text-xs font-medium tabular-nums" style={{ color }}>{val}/10</span>
                          </div>
                          <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: color, opacity: 0.8 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="rounded-xl p-4" style={{ background: "rgba(93,185,122,0.07)", border: "1px solid rgba(93,185,122,0.2)" }}>
                      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(93,185,122,0.6)" }}>
                        Onde você brilha
                      </p>
                      {topAreas.slice(0, 2).map(k => (
                        <p key={k} className="text-xs mb-1" style={{ color: "#5db97a" }}>
                          ✓ {AREAS_LABELS[k as keyof Avaliacao]}
                        </p>
                      ))}
                    </div>
                    <div className="rounded-xl p-4" style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.2)" }}>
                      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(200,165,107,0.6)" }}>
                        Convite ao crescimento
                      </p>
                      {bottomAreas.slice(0, 2).map(k => (
                        <p key={k} className="text-xs mb-1" style={{ color: "#c8a56b" }}>
                          → {AREAS_LABELS[k as keyof Avaliacao]}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Síntese Integrada ── */}
            {!semDados && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(200,165,107,0.1) 0%, rgba(156,119,66,0.05) 100%)",
                  border: "1px solid rgba(200,165,107,0.25)",
                }}
              >
                <div className="px-6 pt-6 pb-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(200,165,107,0.12)" }}>
                  <Sparkles className="w-4 h-4" style={{ color: "#c8a56b" }} />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>
                    Quem Você É — Síntese
                  </span>
                </div>

                <div className="p-6">
                  <div
                    className="w-1 h-12 rounded-full mb-4"
                    style={{ background: "linear-gradient(to bottom, #c8a56b, transparent)" }}
                  />
                  <p className="text-base leading-relaxed" style={{ color: "rgba(247,242,236,0.75)" }}>
                    {sintese}
                  </p>
                  <div
                    className="mt-6 pt-4"
                    style={{ borderTop: "1px solid rgba(200,165,107,0.12)" }}
                  >
                    <p className="text-xs italic text-center" style={{ color: "rgba(200,165,107,0.4)" }}>
                      "Conhecer-se é o começo de toda sabedoria." — Aristóteles
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
