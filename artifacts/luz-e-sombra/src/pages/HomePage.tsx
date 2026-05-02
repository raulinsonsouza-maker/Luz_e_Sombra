import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Target, TrendingUp, Hash, ArrowRight, ChevronRight } from "lucide-react";
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

function calcularMedia(a: Avaliacao): number {
  const vals = [
    a.plenitudeFelicidade, a.espiritualidade, a.saudeDisposicao,
    a.desenvolvimentoIntelectual, a.equilibrioEmocional, a.familia,
    a.desenvolvimentoAmoroso, a.vidaSocial, a.realizacaoProposito,
    a.recursosFinanceiros, a.contribuicaoSocial, a.criatividadeHobbyDiversao,
  ];
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function nivelMedia(media: number): { label: string; cor: string; barra: string } {
  if (media >= 8.5) return { label: "Florescimento", cor: "#c8a56b", barra: "from-yellow-400 to-brand-gold" };
  if (media >= 7)   return { label: "Equilíbrio",    cor: "#6db96d", barra: "from-green-400 to-emerald-500" };
  if (media >= 5.5) return { label: "Construção",    cor: "#6d9eb9", barra: "from-blue-400 to-cyan-500" };
  return               { label: "Atenção",         cor: "#b96da0", barra: "from-purple-400 to-pink-500" };
}

function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

const navItems = [
  {
    icon: Target,
    titulo: "Roda da Vida",
    descricao: "Avalie as 12 áreas da sua vida e descubra onde focar sua energia.",
    href: "/avaliacao",
    hrefNova: "/avaliacao?novo=true",
  },
  {
    icon: Hash,
    titulo: "Numerologia",
    descricao: "Descubra as energias numerológicas que guiam seu ano pessoal.",
    href: "/numerologia",
    hrefNova: null,
  },
  {
    icon: TrendingUp,
    titulo: "Histórico",
    descricao: "Acompanhe sua evolução e veja como você cresceu ao longo do tempo.",
    href: "/historico",
    hrefNova: null,
  },
];

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [ultimaAvaliacao, setUltimaAvaliacao] = useState<Avaliacao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { navigate("/login"); return; }
    if (status === "loading") return;
    if (user?.primeiroAcesso) { navigate("/avaliacao?primeiro=true"); return; }
    buscarUltimaAvaliacao();
  }, [status, user]);

  async function buscarUltimaAvaliacao() {
    try {
      const res = await apiFetch("/avaliacoes");
      if (res.ok) {
        const avaliacoes: Avaliacao[] = await res.json();
        if (avaliacoes?.length > 0) {
          const sorted = [...avaliacoes].sort(
            (a, b) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
          );
          setUltimaAvaliacao(sorted[0]);
        }
      }
    } catch {}
    setCarregando(false);
  }

  const primeiroNome = (user?.nome || "Usuário").split(" ")[0];
  const media = ultimaAvaliacao ? calcularMedia(ultimaAvaliacao) : null;
  const nivel = media !== null ? nivelMedia(media) : null;

  if (status === "loading") {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="luxury-shell">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 space-y-8">

        {/* ── Saudação ─────────────────────────────────── */}
        <div className="animate-fadeIn">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-1">
            Sua jornada
          </p>
          <h1 className="font-tan-mon-cheri text-4xl md:text-5xl text-brand-dark leading-tight">
            Olá, {primeiroNome}
          </h1>
        </div>

        {/* ── Status da última avaliação ───────────────── */}
        {carregando ? (
          <div className="luxury-card-strong p-8 flex items-center gap-4">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-gold border-t-transparent" />
            <span className="text-brand-medium text-sm">Carregando seu progresso...</span>
          </div>
        ) : ultimaAvaliacao && media !== null && nivel ? (
          <div className="luxury-card-strong p-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* Score */}
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-medium mb-1">
                    Sua média atual
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-tan-mon-cheri text-6xl text-brand-dark leading-none">
                      {media.toFixed(1)}
                    </span>
                    <span className="text-brand-medium text-lg mb-1">/10</span>
                  </div>
                  <span
                    className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mt-2"
                    style={{ background: nivel.cor + "22", color: nivel.cor }}
                  >
                    {nivel.label}
                  </span>
                </div>
                {/* Barra de progresso vertical */}
                <div className="hidden sm:flex flex-col justify-end h-20 w-2 bg-brand-gold/10 rounded-full overflow-hidden">
                  <div
                    className={`w-full rounded-full bg-gradient-to-t ${nivel.barra} transition-all duration-700`}
                    style={{ height: `${(media / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Info + CTA */}
              <div className="flex flex-col gap-3 sm:items-end">
                <p className="text-xs text-brand-medium">
                  Avaliação de {formatarData(ultimaAvaliacao.dataAvaliacao)}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/resultado/${ultimaAvaliacao.id}`)}
                    className="luxury-btn-primary text-sm py-2.5 px-5"
                  >
                    Ver resultado
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate("/avaliacao?novo=true")}
                    className="luxury-btn-secondary text-sm py-2.5 px-5"
                  >
                    Nova avaliação
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Sem avaliações ainda */
          <div
            className="luxury-card-strong p-8 animate-fadeIn flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-medium mb-2">
                Primeiro passo
              </p>
              <h2 className="font-tan-mon-cheri text-2xl text-brand-dark mb-1">
                Conheça sua Roda da Vida
              </h2>
              <p className="text-brand-medium text-sm leading-relaxed max-w-sm">
                Avalie as 12 áreas da sua vida e descubra onde focar sua energia para crescer.
              </p>
            </div>
            <button
              onClick={() => navigate("/avaliacao")}
              className="luxury-btn-primary text-sm py-3 px-6 whitespace-nowrap"
            >
              Iniciar avaliação
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Navegação principal ──────────────────────── */}
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-4">
            Explorar
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {navItems.map(({ icon: Icon, titulo, descricao, href, hrefNova }) => {
              const destino = hrefNova && ultimaAvaliacao ? hrefNova : href;
              return (
                <button
                  key={href}
                  onClick={() => navigate(destino)}
                  className="luxury-card-strong p-6 text-left group hover:border-brand-gold/50 transition-all hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-gold/10">
                      <Icon className="w-5 h-5 text-brand-bronze" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-gold/40 group-hover:text-brand-bronze group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="font-semibold text-brand-dark mb-1">{titulo}</h3>
                  <p className="text-brand-medium text-sm leading-relaxed">{descricao}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Citação ──────────────────────────────────── */}
        <div className="text-center pt-4 pb-8 animate-fadeIn">
          <div className="w-8 h-px bg-brand-gold/30 mx-auto mb-6" />
          <blockquote className="font-tan-mon-cheri text-xl md:text-2xl text-brand-dark/50 leading-relaxed max-w-lg mx-auto">
            "Da sombra nasce a luz, e da consciência nasce a transformação."
          </blockquote>
        </div>

      </div>
    </div>
  );
}
