import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Target, Calendar, ArrowRight, Heart, TrendingUp, Sun, Users, Compass, Brain, Mountain } from "lucide-react";
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
        const avaliacoes = await res.json();
        if (avaliacoes && avaliacoes.length > 0) {
          const sorted = [...avaliacoes].sort(
            (a: Avaliacao, b: Avaliacao) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
          );
          setUltimaAvaliacao(sorted[0]);
        }
      }
    } catch {}
    setCarregando(false);
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

  function gerarResumo(media: number): { mensagem: string; cor: string; Icon: any } {
    if (media >= 8.5) return { mensagem: "Você está em um momento de grande florescimento! Suas áreas da vida estão vibrando em harmonia.", cor: "from-yellow-400 to-orange-400", Icon: Sun };
    if (media >= 7) return { mensagem: "Você está em um bom caminho! Há equilíbrio e crescimento acontecendo na sua jornada.", cor: "from-green-400 to-emerald-400", Icon: TrendingUp };
    if (media >= 5.5) return { mensagem: "Você está em um momento de construção. Há áreas que pedem mais atenção e cuidado.", cor: "from-blue-400 to-cyan-400", Icon: Heart };
    return { mensagem: "É tempo de voltar-se para si com gentileza. Seu bem-estar merece atenção e cuidado especial.", cor: "from-purple-400 to-pink-400", Icon: Heart };
  }

  const primeiroNome = (user?.nome || "Usuário").split(" ")[0];
  const media = ultimaAvaliacao ? calcularMedia(ultimaAvaliacao) : null;
  const resumo = media !== null ? gerarResumo(media) : null;

  if (status === "loading") {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-bronze"></div>
      </div>
    );
  }

  return (
    <div className="luxury-shell py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header pessoal */}
        <div className="luxury-card-strong p-8 md:p-12 mb-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-brand-medium text-lg mb-1">Bem-vindo(a) de volta,</p>
              <h1 className="font-tan-mon-cheri text-5xl md:text-6xl text-brand-dark">{primeiroNome}</h1>
              <p className="text-brand-medium mt-2">Sua jornada de autoconhecimento continua aqui.</p>
            </div>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brand-gold/20 to-brand-bronze/20 rounded-2xl border-2 border-brand-gold/40">
              <img src="/logo-luxury.svg" alt="Da Sombra à Luz" width={60} height={60} />
            </div>
          </div>

          {carregando ? (
            <div className="flex items-center gap-3 text-brand-medium">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-bronze"></div>
              <span>Carregando seu progresso...</span>
            </div>
          ) : ultimaAvaliacao && resumo ? (
            <div className={`bg-gradient-to-r ${resumo.cor} p-0.5 rounded-2xl shadow-lg mb-6`}>
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${resumo.cor}`}>
                    <resumo.Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-brand-medium text-sm mb-1">Sua média atual</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-brand-dark">{media?.toFixed(1)}</span>
                      <span className="text-brand-medium">/10</span>
                    </div>
                  </div>
                  <div className="flex-1 ml-4 hidden md:block">
                    <p className="text-brand-darker leading-relaxed">{resumo.mensagem}</p>
                  </div>
                </div>
                <p className="text-brand-darker leading-relaxed mt-4 md:hidden">{resumo.mensagem}</p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30 mb-6">
              <p className="text-brand-darker font-medium mb-2">✨ Comece sua jornada!</p>
              <p className="text-brand-medium">Faça sua primeira avaliação da Roda da Vida para descobrir onde você está e traçar seu caminho de transformação.</p>
            </div>
          )}

          {ultimaAvaliacao ? (
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate(`/resultado/${ultimaAvaliacao.id}`)} className="luxury-btn-primary">
                <TrendingUp className="w-5 h-5" />
                Ver Último Resultado
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate("/avaliacao?novo=true")} className="luxury-btn-secondary">
                <Target className="w-5 h-5" />
                Nova Avaliação
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/avaliacao")} className="luxury-btn-primary">
              <Sparkles className="w-5 h-5" />
              Fazer Primeira Avaliação
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Cards de navegação */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: Target,
              titulo: "Roda da Vida",
              descricao: "Avalie as 12 áreas fundamentais da sua vida e descubra onde focar sua energia.",
              href: ultimaAvaliacao ? "/avaliacao?novo=true" : "/avaliacao",
              cor: "from-brand-bronze to-brand-gold",
            },
            {
              icon: Calendar,
              titulo: "Numerologia",
              descricao: "Descubra as energias numerológicas que guiam seu ano pessoal e meses.",
              href: "/numerologia",
              cor: "from-purple-500 to-violet-500",
            },
            {
              icon: TrendingUp,
              titulo: "Histórico",
              descricao: "Acompanhe sua evolução ao longo do tempo e veja como você cresceu.",
              href: "/historico",
              cor: "from-green-500 to-emerald-500",
            },
          ].map(({ icon: Icon, titulo, descricao, href, cor }) => (
            <button
              key={href}
              onClick={() => navigate(href)}
              className="luxury-card-strong p-6 text-left hover:border-brand-gold/50 transition-all group hover:shadow-xl"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${cor} rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-brand-dark mb-2">{titulo}</h3>
              <p className="text-brand-medium text-sm leading-relaxed mb-4">{descricao}</p>
              <div className="flex items-center gap-2 text-brand-bronze font-medium text-sm">
                Acessar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        {/* Citação inspiracional */}
        <div className="luxury-card-strong p-8 text-center animate-fadeIn">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-gold/20 to-brand-bronze/20 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-brand-bronze" />
          </div>
          <blockquote className="font-tan-mon-cheri text-2xl md:text-3xl text-brand-dark mb-4 leading-relaxed">
            "Da sombra nasce a luz, e da consciência nasce a transformação."
          </blockquote>
          <p className="text-brand-medium text-sm">— Plataforma Da Sombra à Luz</p>
        </div>
      </div>
    </div>
  );
}
