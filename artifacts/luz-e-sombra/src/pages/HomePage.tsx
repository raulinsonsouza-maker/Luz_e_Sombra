import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Target, TrendingUp, Hash, ArrowRight, ChevronRight, Sparkles, BookOpen, TrendingDown } from "lucide-react";
import { apiFetch } from "@/lib/auth";

interface Avaliacao {
  id: number;
  dataAvaliacao: string;
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

const AREAS = [
  { key: "plenitudeFelicidade",      nome: "Plenitude",      nomeCompleto: "Plenitude e Felicidade" },
  { key: "espiritualidade",          nome: "Espiritualidade", nomeCompleto: "Espiritualidade" },
  { key: "saudeDisposicao",          nome: "Saúde",           nomeCompleto: "Saúde e Disposição" },
  { key: "desenvolvimentoIntelectual", nome: "Intelecto",     nomeCompleto: "Desenvolvimento Intelectual" },
  { key: "equilibrioEmocional",      nome: "Emoções",         nomeCompleto: "Equilíbrio Emocional" },
  { key: "familia",                  nome: "Família",         nomeCompleto: "Família" },
  { key: "desenvolvimentoAmoroso",   nome: "Amor",            nomeCompleto: "Desenvolvimento Amoroso" },
  { key: "vidaSocial",               nome: "Social",          nomeCompleto: "Vida Social" },
  { key: "realizacaoProposito",      nome: "Propósito",       nomeCompleto: "Realização e Propósito" },
  { key: "recursosFinanceiros",      nome: "Finanças",        nomeCompleto: "Recursos Financeiros" },
  { key: "contribuicaoSocial",       nome: "Contribuição",    nomeCompleto: "Contribuição Social" },
  { key: "criatividadeHobbyDiversao", nome: "Criatividade",   nomeCompleto: "Criatividade e Hobbies" },
];

function calcularMedia(a: Avaliacao): number {
  return AREAS.reduce((sum, { key }) => sum + (a[key as keyof Avaliacao] as number), 0) / AREAS.length;
}

function nivelMedia(m: number) {
  if (m >= 8.5) return { label: "Florescimento", desc: "Você está em plena expansão.", cor: "#c8a56b", corBg: "rgba(200,165,107,0.12)", corBorder: "rgba(200,165,107,0.3)" };
  if (m >= 7)   return { label: "Equilíbrio",    desc: "Sua jornada está em harmonia.",  cor: "#5db97a", corBg: "rgba(93,185,122,0.1)",  corBorder: "rgba(93,185,122,0.3)" };
  if (m >= 5.5) return { label: "Construção",    desc: "Cada passo conta. Continue.",    cor: "#5b9bd5", corBg: "rgba(91,155,213,0.1)",  corBorder: "rgba(91,155,213,0.3)" };
  return             { label: "Atenção",         desc: "Hora de olhar com cuidado.",     cor: "#c06fbf", corBg: "rgba(192,111,191,0.1)", corBorder: "rgba(192,111,191,0.3)" };
}

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

// SVG Semicircle Gauge
function Gauge({ score, cor }: { score: number; cor: string }) {
  const r = 58;
  const cx = 80;
  const cy = 78;
  const circSemi = Math.PI * r;
  const offset = circSemi * (1 - score / 10);
  const pathD = `M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`;

  return (
    <svg width="160" height="90" viewBox="0 0 160 90" className="overflow-visible">
      {/* Track */}
      <path d={pathD} fill="none" stroke="rgba(200,165,107,0.12)" strokeWidth={10} strokeLinecap="round" />
      {/* Value */}
      <path d={pathD} fill="none" stroke={cor} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={`${circSemi}`} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

// Mini horizontal bar
function MiniBar({ value, cor }: { value: number; cor: string }) {
  return (
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(200,165,107,0.1)" }}>
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value * 10}%`, background: cor }} />
    </div>
  );
}

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [ultimaAvaliacao, setUltimaAvaliacao] = useState<Avaliacao | null>(null);
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { navigate("/login"); return; }
    if (status === "loading") return;
    if (user?.primeiroAcesso) { navigate("/avaliacao?primeiro=true"); return; }
    buscarDados();
  }, [status, user]);

  async function buscarDados() {
    try {
      const res = await apiFetch("/avaliacoes");
      if (res.ok) {
        const lista: Avaliacao[] = await res.json();
        setTotalAvaliacoes(lista.length);
        if (lista.length > 0) {
          const sorted = [...lista].sort(
            (a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
          );
          setUltimaAvaliacao(sorted[0]);
        }
      }
    } catch {}
    setCarregando(false);
  }

  if (status === "loading") {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-transparent" />
      </div>
    );
  }

  const primeiroNome = (user?.nome || "").split(" ")[0] || "Usuário";
  const media = ultimaAvaliacao ? calcularMedia(ultimaAvaliacao) : null;
  const nivel = media !== null ? nivelMedia(media) : null;

  // Area insights
  const areaData = ultimaAvaliacao
    ? AREAS.map(a => ({ ...a, valor: ultimaAvaliacao[a.key as keyof Avaliacao] as number }))
        .sort((a, b) => b.valor - a.valor)
    : [];
  const top3 = areaData.slice(0, 3);
  const bottom3 = [...areaData].reverse().slice(0, 3);

  return (
    <div className="luxury-shell">

      {/* ── HERO BANNER ───────────────────────────────────────── */}
      <div className="relative overflow-hidden px-5 py-10 sm:py-14"
        style={{ background: "linear-gradient(135deg, #1e1812 0%, #2f251b 60%, #1a1208 100%)" }}>
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 800px 400px at 60% 50%, rgba(200,165,107,0.08), transparent)" }} />

        <div className="max-w-5xl mx-auto relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3"
                style={{ color: "rgba(200,165,107,0.55)" }}>
                {saudacao()}
              </p>
              <h1 className="font-tan-mon-cheri mb-3"
                style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#f7f2ec", lineHeight: 1.1 }}>
                {primeiroNome}
              </h1>
              {nivel ? (
                <p className="text-sm" style={{ color: "rgba(247,242,236,0.5)" }}>
                  {nivel.desc}
                </p>
              ) : (
                <p className="text-sm" style={{ color: "rgba(247,242,236,0.5)" }}>
                  Sua jornada de autoconhecimento começa aqui.
                </p>
              )}
            </div>

            {/* Stats strip */}
            <div className="flex gap-6 sm:gap-8">
              {totalAvaliacoes > 0 && (
                <div>
                  <p className="font-tan-mon-cheri text-3xl sm:text-4xl" style={{ color: "#c8a56b", lineHeight: 1 }}>
                    {totalAvaliacoes}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.4)", letterSpacing: "0.05em" }}>
                    {totalAvaliacoes === 1 ? "avaliação" : "avaliações"}
                  </p>
                </div>
              )}
              {media !== null && (
                <div>
                  <p className="font-tan-mon-cheri text-3xl sm:text-4xl" style={{ color: "#c8a56b", lineHeight: 1 }}>
                    {media.toFixed(1)}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.4)", letterSpacing: "0.05em" }}>
                    média atual
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-5">

        {carregando ? (
          <div className="luxury-card-strong p-10 flex items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-gold border-t-transparent" />
            <span className="text-brand-medium text-sm">Carregando seu progresso...</span>
          </div>

        ) : ultimaAvaliacao && media !== null && nivel ? (
          <>
            {/* ── ROW 1: Score card + Quick action ───────────── */}
            <div className="grid md:grid-cols-5 gap-5">

              {/* Score card */}
              <div className="md:col-span-3 luxury-card-strong p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-5">
                  Seu momento atual
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">

                  {/* Gauge + number */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative">
                      <Gauge score={media} cor={nivel.cor} />
                      <div className="absolute bottom-0 left-0 right-0 text-center">
                        <span className="font-tan-mon-cheri" style={{ fontSize: "2.4rem", color: nivel.cor, lineHeight: 1 }}>
                          {media.toFixed(1)}
                        </span>
                        <span className="text-brand-medium text-sm ml-1">/10</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mt-2"
                      style={{ background: nivel.corBg, color: nivel.cor, border: `1px solid ${nivel.corBorder}` }}>
                      {nivel.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-brand-medium mb-5">
                      Avaliação de {formatarData(ultimaAvaliacao.dataAvaliacao)}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => navigate(`/resultado/${ultimaAvaliacao.id}`)}
                        className="luxury-btn-primary text-sm py-2.5 px-5">
                        Ver análise completa
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate("/avaliacao?novo=true")}
                        className="luxury-btn-secondary text-sm py-2.5 px-5">
                        Nova avaliação
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick action cards */}
              <div className="md:col-span-2 flex flex-col sm:flex-row md:flex-col gap-4">
                <button onClick={() => navigate("/numerologia")}
                  className="flex-1 luxury-card p-5 text-left group hover:shadow-xl transition-all"
                  style={{ borderColor: "rgba(200,165,107,0.3)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.2)" }}>
                      <Hash className="w-5 h-5 text-brand-bronze" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-gold/40 group-hover:text-brand-bronze group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="font-semibold text-brand-dark text-sm mb-1">Numerologia</p>
                  <p className="text-xs text-brand-medium leading-relaxed">Descubra as energias do seu ano {new Date().getFullYear()}</p>
                </button>

                <button onClick={() => navigate("/historico")}
                  className="flex-1 luxury-card p-5 text-left group hover:shadow-xl transition-all"
                  style={{ borderColor: "rgba(200,165,107,0.3)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.2)" }}>
                      <TrendingUp className="w-5 h-5 text-brand-bronze" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-gold/40 group-hover:text-brand-bronze group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="font-semibold text-brand-dark text-sm mb-1">Histórico</p>
                  <p className="text-xs text-brand-medium leading-relaxed">
                    {totalAvaliacoes > 1 ? `${totalAvaliacoes} avaliações registradas` : "Acompanhe sua evolução"}
                  </p>
                </button>
              </div>
            </div>

            {/* ── ÁREA INSIGHTS ──────────────────────────────── */}
            <div className="luxury-card-strong p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-6">
                Sua Roda da Vida — Destaques
              </p>
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-10">

                {/* Pontos fortes */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(93,185,122,0.15)" }}>
                      <TrendingUp className="w-3 h-3" style={{ color: "#5db97a" }} />
                    </div>
                    <p className="text-xs font-bold tracking-wider uppercase" style={{ color: "#5db97a" }}>
                      Pontos fortes
                    </p>
                  </div>
                  <div className="space-y-3.5">
                    {top3.map(({ nome, nomeCompleto, valor }) => (
                      <div key={nome}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-brand-dark font-medium">{nomeCompleto}</span>
                          <span className="text-sm font-bold text-brand-bronze ml-3 flex-shrink-0">{valor}</span>
                        </div>
                        <MiniBar value={valor} cor="#5db97a" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Em crescimento */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(200,165,107,0.15)" }}>
                      <Sparkles className="w-3 h-3 text-brand-bronze" />
                    </div>
                    <p className="text-xs font-bold tracking-wider uppercase text-brand-bronze">
                      Maior oportunidade
                    </p>
                  </div>
                  <div className="space-y-3.5">
                    {bottom3.map(({ nome, nomeCompleto, valor }) => (
                      <div key={nome}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-brand-dark font-medium">{nomeCompleto}</span>
                          <span className="text-sm font-bold text-brand-medium ml-3 flex-shrink-0">{valor}</span>
                        </div>
                        <MiniBar value={valor} cor="#c8a56b" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(200,165,107,0.15)" }}>
                <button onClick={() => navigate(`/resultado/${ultimaAvaliacao.id}`)}
                  className="text-xs font-semibold text-brand-bronze hover:text-brand-gold transition-colors flex items-center gap-1.5">
                  Ver análise completa de todas as 12 áreas
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>

        ) : (
          /* ── SEM AVALIAÇÕES ──────────────────────────────────── */
          <div className="luxury-card-strong p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.25)" }}>
              <Target className="w-8 h-8 text-brand-bronze" />
            </div>
            <h2 className="font-tan-mon-cheri text-2xl sm:text-3xl text-brand-dark mb-3">
              Sua jornada começa aqui
            </h2>
            <p className="text-brand-medium text-sm leading-relaxed max-w-sm mx-auto mb-8">
              Faça sua primeira avaliação da Roda da Vida e descubra, com clareza, onde está sua energia hoje — e onde focar para crescer.
            </p>
            <button onClick={() => navigate("/avaliacao")} className="luxury-btn-primary px-8 py-3.5 text-base">
              Iniciar minha avaliação
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── MÓDULOS ───────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-4">
            Explorar
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Target,
                titulo: "Roda da Vida",
                descricao: "Avalie as 12 áreas e veja um diagnóstico personalizado por área.",
                href: ultimaAvaliacao ? "/avaliacao?novo=true" : "/avaliacao",
                badge: ultimaAvaliacao ? `Média ${media?.toFixed(1)}` : "Começar",
                badgeColor: nivel?.cor || "#9c7742",
              },
              {
                icon: BookOpen,
                titulo: "Numerologia",
                descricao: "Descubra as energias numerológicas que guiam sua jornada pessoal.",
                href: "/numerologia",
                badge: `Ano ${new Date().getFullYear()}`,
                badgeColor: "#c8a56b",
              },
              {
                icon: TrendingUp,
                titulo: "Histórico",
                descricao: "Acompanhe sua evolução e compare avaliações ao longo do tempo.",
                href: "/historico",
                badge: totalAvaliacoes > 0 ? `${totalAvaliacoes} ${totalAvaliacoes === 1 ? "avaliação" : "avaliações"}` : "Em breve",
                badgeColor: "#9c7742",
              },
            ].map(({ icon: Icon, titulo, descricao, href, badge, badgeColor }) => (
              <button key={href} onClick={() => navigate(href)}
                className="luxury-card-strong p-6 text-left group hover:border-brand-gold/50 transition-all hover:shadow-xl hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.18)" }}>
                    <Icon className="w-5 h-5 text-brand-bronze" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: badgeColor + "18", color: badgeColor }}>
                    {badge}
                  </span>
                </div>
                <h3 className="font-tan-mon-cheri text-lg text-brand-dark mb-1.5">{titulo}</h3>
                <p className="text-brand-medium text-xs leading-relaxed">{descricao}</p>
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-brand-bronze group-hover:gap-2 transition-all">
                  Acessar <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
