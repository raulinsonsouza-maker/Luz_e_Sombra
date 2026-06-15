import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar, TrendingUp, Heart, Briefcase, DollarSign, Activity,
  AlertCircle, Brain, Lightbulb, ChevronRight, Sparkles,
  User, Star, Zap, Shield, Eye, Hash, BookOpen, Compass, Quote, ExternalLink, Lock,
} from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { useJornadaModulo } from "@/hooks/useJornadaModulo";

import { ANOS_UNIVERSAIS, ANOS_PESSOAIS, COMBINACOES, NUMEROS_DE_VIDA } from "@/lib/numerologia-data";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import PageIntroHeader from "@/components/PageIntroHeader";
import AppPageShell from "@/components/AppPageShell";
import { JORNADA_MODULE_NAV, JORNADA_ROOT } from "@/lib/jornadaHubConfig";
import {
  MesPessoal,
  calcularAnoPessoal,
  calcularAnoUniversal,
  calcularMesesPessoais,
  calcularNumerodeVida,
  calcularNumerodeExpressao,
  calcularNumerodaAlma,
  calcularNumerodaPersonalidade,
  formatarDataBrasileira,
} from "@/lib/numerologia-utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function NumBadge({ n, size = "lg" }: { n: number; size?: "sm" | "md" | "lg" | "xl" }) {
  const s = { sm: "w-10 h-10 text-lg", md: "w-14 h-14 text-2xl", lg: "w-20 h-20 text-4xl", xl: "w-28 h-28 text-6xl" }[size];
  const isMaster = n === 11 || n === 22 || n === 33;
  return (
    <div
      className={`${s} rounded-2xl flex items-center justify-center font-semibold tracking-tight flex-shrink-0`}
      style={isMaster
        ? { background: "linear-gradient(135deg, #1e1812, #2f251b)", border: "2px solid rgba(200,165,107,0.5)", color: "#c8a56b" }
        : { background: "linear-gradient(135deg, #9c7742, #c8a56b)", color: "#fff" }}
    >
      {n}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-on-dark-accent mb-2">
      {children}
    </p>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="px-3 py-1 text-xs rounded-full text-on-darker"
      style={{ background: "rgba(200,165,107,0.12)", border: "1px solid rgba(200,165,107,0.3)" }}
    >
      {children}
    </span>
  );
}

function InfoCard({ icon: Icon, label, children }: { icon: typeof Briefcase; label: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-xl num-panel">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-brand-gold" />
        <h3 className="font-semibold text-on-dark text-sm">{label}</h3>
      </div>
      <p className="text-on-darker text-sm leading-relaxed">{children}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function calcularIdade(dataNascimentoISO: string): number | null {
  const partes = dataNascimentoISO.split('-');
  if (partes.length !== 3) return null;
  const nascimento = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

export default function NumerologiaPage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const { bloqueado, carregando: carregandoJornada } = useJornadaModulo(
    "numerologia",
    status === "authenticated",
  );

  const ANOS_DISPONIVEIS = [2025, 2026];
  const anoAtual = new Date().getFullYear();
  const anoDefault = ANOS_DISPONIVEIS.includes(anoAtual) ? anoAtual : ANOS_DISPONIVEIS[0];
  const [anoAnalise, setAnoAnalise] = useState(anoDefault);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<ReturnType<typeof calcular> | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"perfil" | "ano" | "meses">("perfil");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { navigate("/login"); return; }
  }, [status, user]);

  // ── Calculation ──────────────────────────────────────────────────────────

  function calcular(data: string, nomeCompleto: string, ano: number) {
    const dataFormatada = formatarDataBrasileira(data);
    const partes = dataFormatada.split("/");
    if (partes.length !== 3) return null;

    const numerodeVida = calcularNumerodeVida(dataFormatada);
    const expressao = nomeCompleto.trim() ? calcularNumerodeExpressao(nomeCompleto) : null;
    const alma = nomeCompleto.trim() ? calcularNumerodaAlma(nomeCompleto) : null;
    const personalidade = nomeCompleto.trim() ? calcularNumerodaPersonalidade(nomeCompleto) : null;

    const vidaVal = numerodeVida?.valor ?? null;
    const exprVal = expressao?.valor ?? null;
    const almaVal = alma?.valor ?? null;
    const persVal = personalidade?.valor ?? null;

    const anoUniversal = calcularAnoUniversal(ano);
    const anoPessoalObj = calcularAnoPessoal(dataFormatada, ano);
    if (!anoPessoalObj) return null;
    const apVal = anoPessoalObj.reduzido;

    return {
      data, nomeCompleto, ano,
      numerodeVida: vidaVal,
      numerodeVidaRaw: numerodeVida,
      numerodeVidaInfo: vidaVal ? NUMEROS_DE_VIDA[vidaVal] : null,
      expressaoVal: exprVal,
      expressaoInfo: exprVal ? NUMEROS_DE_VIDA[exprVal] : null,
      almaVal,
      almaInfo: almaVal ? NUMEROS_DE_VIDA[almaVal] : null,
      persVal,
      anoUniversal,
      anoPessoal: { ...anoPessoalObj, reduzido: apVal },
      interpretacaoAnoPessoal: ANOS_PESSOAIS[apVal],
      analiseUniversal: ANOS_UNIVERSAIS[anoUniversal.reduzido],
      combinacao: COMBINACOES[`${anoUniversal.reduzido}-${apVal}`],
      meses: calcularMesesPessoais(apVal, ano),
    };
  }

  async function handleCalcular() {
    setErro("");
    const dataNasc = user?.dataNascimento ?? "";
    const nomeUser = user?.nome ?? "";
    if (!dataNasc) {
      setErro("Data de nascimento não encontrada. Acesse seu perfil para cadastrar.");
      return;
    }
    const r = calcular(dataNasc, nomeUser, anoAnalise);
    if (!r) return;
    setResultado(r);
    setAbaAtiva("perfil");
    try {
      await apiFetch("/modulos-jornada/numerologia/concluir-analise", { method: "POST" });
    } catch {
      /* resultado já exibido; conclusão na jornada pode ser repetida depois */
    }
  }

  if (status === "loading" || carregandoJornada) {
    return (
      <div className="min-h-screen app-dark-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-transparent" />
      </div>
    );
  }

  // ── Render helpers ───────────────────────────────────────────────────────

  const renderPerfilPermanente = () => {
    if (!resultado) return null;
    const { numerodeVida, numerodeVidaInfo, expressaoVal, expressaoInfo, almaVal, almaInfo, persVal } = resultado;

    return (
      <div className="space-y-5 md:space-y-6 animate-fadeIn">

        {/* Life Path — the most important */}
        {numerodeVida && numerodeVidaInfo && (
          <div className="num-panel p-6 md:p-8">
            <SectionLabel>Número mais importante</SectionLabel>
            <div className="flex items-start gap-4 md:gap-6 mb-6">
              <NumBadge n={numerodeVida} size="xl" />
              <div>
                <h2 className="font-tan-mon-cheri text-3xl md:text-4xl text-on-dark mb-1">
                  {numerodeVidaInfo.titulo}
                </h2>
                <p className="text-on-dark-muted text-sm">{numerodeVidaInfo.arquetipo}</p>
                {resultado.numerodeVidaRaw && (
                  <p className="text-xs text-on-dark-soft/60 mt-2 font-mono">
                    Cálculo: {resultado.numerodeVidaRaw.passos}
                  </p>
                )}
              </div>
            </div>

            {/* Essence */}
            <div className="p-6 rounded-2xl mb-6"
              style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.08), rgba(156,119,66,0.05))", border: "1px solid rgba(200,165,107,0.3)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-px bg-brand-gold" />
                <span className="text-xs tracking-widest uppercase text-brand-gold font-semibold">Essência</span>
              </div>
              <p className="text-on-darker leading-relaxed">{numerodeVidaInfo.essencia}</p>
            </div>

            {/* Mission */}
            <div className="p-5 rounded-xl mb-6"
              style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-brand-gold" />
                <span className="text-xs tracking-widest uppercase text-on-dark-soft font-semibold">Missão de Vida</span>
              </div>
              <p className="text-on-darker leading-relaxed text-sm">{numerodeVidaInfo.missao}</p>
            </div>

            <p className="text-on-darker text-sm leading-relaxed mb-6">{numerodeVidaInfo.descricao}</p>

            {/* 4 life areas */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <InfoCard icon={Briefcase} label="Carreira e Propósito">{numerodeVidaInfo.carreira}</InfoCard>
              <InfoCard icon={Heart} label="Relacionamentos">{numerodeVidaInfo.relacionamentos}</InfoCard>
              <InfoCard icon={Activity} label="Saúde e Corpo">{numerodeVidaInfo.saude}</InfoCard>
              <InfoCard icon={Star} label="Espiritualidade">{numerodeVidaInfo.espiritualidade}</InfoCard>
            </div>

            {/* Talents */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-5 rounded-xl" style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}>
                <h3 className="font-semibold text-on-dark text-sm mb-3">Talentos Naturais</h3>
                <ul className="space-y-2">
                  {numerodeVidaInfo.talentos.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-on-darker">
                      <span className="text-brand-gold mt-0.5 flex-shrink-0">·</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: "rgba(200,165,107,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}>
                <h3 className="font-semibold text-on-dark text-sm mb-3">Desafios de Crescimento</h3>
                <ul className="space-y-2">
                  {numerodeVidaInfo.desafios.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-on-darker">
                      <span className="text-on-dark-soft/50 mt-0.5 flex-shrink-0">·</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Shadow + Affirmation */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-5 rounded-xl" style={{ background: "rgba(200,165,107,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-3.5 h-3.5 text-on-dark-soft/60" />
                  <h3 className="font-semibold text-on-dark text-sm">Sombra</h3>
                </div>
                <p className="text-on-dark-muted text-xs leading-relaxed">{numerodeVidaInfo.sombra}</p>
              </div>
              <div className="p-5 rounded-xl" style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.25)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  <h3 className="font-semibold text-on-dark text-sm">Afirmação</h3>
                </div>
                <p className="text-on-darker text-sm leading-relaxed italic">{numerodeVidaInfo.afirmacao}</p>
              </div>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid rgba(200,165,107,0.15)" }}>
              {numerodeVidaInfo.palavrasChave.map((p, i) => <Tag key={i}>{p}</Tag>)}
            </div>
          </div>
        )}

        {/* Expression + Soul side by side */}
        {(expressaoVal || almaVal) && (
          <div className="grid md:grid-cols-2 gap-4">
            {expressaoVal && expressaoInfo && (
              <div className="num-panel p-6">
                <SectionLabel>Número de Expressão</SectionLabel>
                <div className="flex items-start gap-4 mb-4">
                  <NumBadge n={expressaoVal} size="md" />
                  <div>
                    <h3 className="font-semibold text-xl text-on-dark">{expressaoInfo.arquetipo}</h3>
                    <p className="text-xs text-on-dark-soft mt-0.5">Do nome completo</p>
                  </div>
                </div>
                <p className="text-sm text-on-dark-muted leading-relaxed mb-4">
                  Como você se expressa no mundo e os talentos que manifesta naturalmente, sua "máscara" mais elevada.
                </p>
                <p className="text-sm text-on-darker leading-relaxed">{expressaoInfo.essencia}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {expressaoInfo.palavrasChave.slice(0, 4).map((p, i) => <Tag key={i}>{p}</Tag>)}
                </div>
              </div>
            )}

            {almaVal && almaInfo && (
              <div className="num-panel p-6">
                <SectionLabel>Número da Alma</SectionLabel>
                <div className="flex items-start gap-4 mb-4">
                  <NumBadge n={almaVal} size="md" />
                  <div>
                    <h3 className="font-semibold text-xl text-on-dark">{almaInfo.arquetipo}</h3>
                    <p className="text-xs text-on-dark-soft mt-0.5">Das vogais do nome</p>
                  </div>
                </div>
                <p className="text-sm text-on-dark-muted leading-relaxed mb-4">
                  O que você deseja profundamente no íntimo, sua motivação mais oculta, o que move sua alma.
                </p>
                <p className="text-sm text-on-darker leading-relaxed">{almaInfo.essencia}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {almaInfo.palavrasChave.slice(0, 4).map((p, i) => <Tag key={i}>{p}</Tag>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Personality number */}
        {persVal && NUMEROS_DE_VIDA[persVal] && (
          <div className="num-panel p-6">
            <SectionLabel>Número da Personalidade</SectionLabel>
            <div className="flex items-start gap-4">
              <NumBadge n={persVal} size="sm" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-on-dark mb-1">
                  {NUMEROS_DE_VIDA[persVal].arquetipo}
                </h3>
                <p className="text-xs text-on-dark-soft mb-3">Das consoantes do nome, como os outros te percebem</p>
                <p className="text-sm text-on-darker leading-relaxed">{NUMEROS_DE_VIDA[persVal].missao}</p>
              </div>
            </div>
          </div>
        )}

        {/* Triangle synthesis */}
        {numerodeVida && expressaoVal && almaVal && (
          <div className="num-panel p-6 md:p-8"
            style={{ background: "linear-gradient(160deg, #1e1812 0%, #2f251b 60%, #3d2f1f 100%)" }}>
            <SectionLabel><span style={{ color: "rgba(200,165,107,0.9)" }}>Síntese do Perfil</span></SectionLabel>
            <h3 className="font-tan-mon-cheri text-2xl mb-6" style={{ color: "#f7f2ec" }}>
              O Triângulo Numerológico
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Caminho de Vida", desc: "Quem você é na essência e sua missão", n: numerodeVida },
                { label: "Expressão", desc: "Como você manifesta seus talentos no mundo", n: expressaoVal },
                { label: "Alma", desc: "O que motiva você no nível mais profundo", n: almaVal },
              ].map(({ label, desc, n }) => (
                <div key={label} className="text-center p-5 rounded-xl"
                  style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.2)" }}>
                  <div className="font-tan-mon-cheri text-5xl mb-3" style={{ color: "#c8a56b" }}>{n}</div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#f7f2ec" }}>{label}</p>
                  <p className="text-xs" style={{ color: "rgba(247,242,236,0.65)" }}>{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm mt-6 leading-relaxed" style={{ color: "rgba(247,242,236,0.88)" }}>
              Seu Caminho de Vida ({numerodeVida}) define sua jornada central.
              Seu número de Expressão ({expressaoVal}) mostra como você manifesta seus dons no mundo.
              Seu número da Alma ({almaVal}) revela o que sua essência mais profunda anseia viver.
              Quando esses três números trabalham em harmonia, sua vida flui com autenticidade e propósito.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderAnoPessoal = () => {
    if (!resultado) return null;
    const { anoPessoal, anoUniversal, interpretacaoAnoPessoal: interp, analiseUniversal: univ, combinacao } = resultado;

    return (
      <div className="space-y-5 md:space-y-6 animate-fadeIn">

        {/* Year numbers summary */}
        <div className="num-panel p-6 md:p-8">
          <SectionLabel>Contexto temporal de {resultado.ano}</SectionLabel>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl"
              style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.35)" }}>
              <p className="text-xs tracking-widest uppercase text-on-dark-soft mb-4">Seu Ano Pessoal</p>
              <div className="flex items-end gap-4 mb-4">
                <span className="font-tan-mon-cheri text-6xl md:text-8xl text-brand-gold leading-none">{anoPessoal.reduzido}</span>
                <div className="mb-3">
                  <p className="text-xs text-on-dark-soft">Ciclo pessoal</p>
                  <p className="text-xs font-mono text-on-dark-soft/60 mt-1">{anoPessoal.passos}</p>
                </div>
              </div>
              {interp && <p className="text-sm text-on-darker leading-relaxed">{interp.essencia || interp.descricao}</p>}
            </div>
            <div className="p-6 rounded-2xl"
              style={{ background: "rgba(200,165,107,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}>
              <p className="text-xs tracking-widest uppercase text-on-dark-soft mb-4">Ano Universal {resultado.ano}</p>
              <div className="flex items-end gap-4 mb-4">
                <span className="font-tan-mon-cheri text-6xl md:text-8xl text-on-dark leading-none" style={{ opacity: 0.65 }}>{anoUniversal.reduzido}</span>
                <div className="mb-3">
                  <p className="text-xs text-on-dark-soft">Energia coletiva global</p>
                </div>
              </div>
              {univ && <p className="text-sm text-on-dark-muted leading-relaxed">{univ.climaColetivo}</p>}
            </div>
          </div>
        </div>

        {/* Personal year full interpretation */}
        {interp && (
          <div className="num-panel p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-5 h-5 text-brand-gold" />
              <div>
                <SectionLabel>Interpretação Completa</SectionLabel>
                <p className="text-on-dark font-medium">{interp.titulo}</p>
              </div>
            </div>
            <div className="p-6 rounded-2xl mb-6"
              style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}>
              <p className="text-on-darker leading-relaxed text-sm whitespace-pre-line">{interp.detalhado}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <InfoCard icon={Briefcase} label="Carreira">{interp.temas.carreira}</InfoCard>
              <InfoCard icon={DollarSign} label="Finanças">{interp.temas.financas}</InfoCard>
              <InfoCard icon={Heart} label="Relacionamentos">{interp.temas.relacionamentos}</InfoCard>
              <InfoCard icon={Activity} label="Saúde">{interp.temas.saude}</InfoCard>
            </div>
            {interp.temas.desenvolvimento && (
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <InfoCard icon={BookOpen} label="Desenvolvimento">{interp.temas.desenvolvimento}</InfoCard>
                {interp.temas.espiritualidade && (
                  <InfoCard icon={Star} label="Espiritualidade">{interp.temas.espiritualidade}</InfoCard>
                )}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {interp.desafios.length > 0 && (
                <div className="p-5 rounded-xl" style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                  <h3 className="font-semibold text-on-dark text-sm mb-3">Desafios do Ano</h3>
                  <ul className="space-y-1.5">
                    {interp.desafios.map((d, i) => (
                      <li key={i} className="text-xs text-on-darker flex items-start gap-2">
                        <span className="text-brand-gold/60 mt-0.5">·</span><span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {interp.areasDeAtencao && interp.areasDeAtencao.length > 0 && (
                <div className="p-5 rounded-xl" style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                  <h3 className="font-semibold text-on-dark text-sm mb-3">Áreas de Atenção</h3>
                  <ul className="space-y-1.5">
                    {interp.areasDeAtencao.map((a, i) => (
                      <li key={i} className="text-xs text-on-darker flex items-start gap-2">
                        <span className="text-brand-gold/60 mt-0.5">·</span><span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {interp.praticasSugeridas && interp.praticasSugeridas.length > 0 && (
              <div className="p-5 rounded-xl mb-4" style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}>
                <h3 className="font-semibold text-on-dark text-sm mb-3">Práticas Recomendadas</h3>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-1.5">
                  {interp.praticasSugeridas.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-on-darker">
                      <span className="text-brand-gold mt-0.5 flex-shrink-0">·</span><span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {interp.afirmacoes && interp.afirmacoes.length > 0 && (
              <div className="p-5 rounded-xl" style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.25)" }}>
                <h3 className="font-semibold text-on-dark text-sm mb-3">Afirmações do Ano</h3>
                <div className="space-y-2">
                  {interp.afirmacoes.map((a, i) => (
                    <p key={i} className="text-sm text-on-darker italic">"{a}"</p>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid rgba(200,165,107,0.15)" }}>
              {interp.palavrasChave.map((p, i) => <Tag key={i}>{p}</Tag>)}
            </div>
          </div>
        )}

        {/* Universal year */}
        {univ && (
          <div className="num-panel p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-brand-gold" />
              <div>
                <SectionLabel>Contexto Coletivo</SectionLabel>
                <p className="text-on-dark font-medium">{univ.titulo}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoCard icon={Zap} label="Oportunidades Coletivas">{univ.oportunidades}</InfoCard>
              <InfoCard icon={AlertCircle} label="Desafios Coletivos">{univ.desafios}</InfoCard>
              <div className="md:col-span-2 p-5 rounded-xl" style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-brand-gold" />
                  <h3 className="font-semibold text-on-dark text-sm">Como Aproveitar o Contexto Coletivo</h3>
                </div>
                <p className="text-sm text-on-darker leading-relaxed">{univ.comoAproveitar}</p>
              </div>
            </div>
          </div>
        )}

        {/* Combination */}
        {combinacao && (
          <div className="num-panel p-6 md:p-8"
            style={{ background: "linear-gradient(160deg, #1e1812 0%, #2f251b 60%, #3d2f1f 100%)" }}>
            <div className="flex items-center gap-3 mb-6">
              <Hash className="w-5 h-5 text-brand-gold" />
              <div>
                <SectionLabel><span style={{ color: "rgba(200,165,107,0.9)" }}>Combinação Pessoal × Universal</span></SectionLabel>
                <p className="font-medium" style={{ color: "#f7f2ec" }}>{combinacao.tema}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {[
                { icon: Briefcase, label: "Carreira", val: combinacao.carreira },
                { icon: DollarSign, label: "Finanças", val: combinacao.financas },
                { icon: Heart, label: "Relações", val: combinacao.relacoes },
                { icon: Shield, label: "Desafios", val: combinacao.desafios },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="p-5 rounded-xl"
                  style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.2)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-brand-gold" />
                    <h3 className="font-semibold text-sm" style={{ color: "#f7f2ec" }}>{label}</h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.88)" }}>{val}</p>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl" style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.3)" }}>
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4 text-brand-gold" />
                <h3 className="font-semibold text-sm" style={{ color: "#f7f2ec" }}>Recomendações Práticas</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.92)" }}>{combinacao.recomendacoes}</p>
            </div>
          </div>
        )}

        {/* Life path × personal year synthesis when combination isn't in DB */}
        {!combinacao && resultado.numerodeVida && (
          <div className="num-panel p-6">
            <SectionLabel>Síntese Personalizada</SectionLabel>
            <p className="text-sm text-on-darker leading-relaxed">
              Seu Caminho de Vida <strong>{resultado.numerodeVida}</strong> encontra a energia do Ano Pessoal <strong>{anoPessoal.reduzido}</strong> e do Ano Universal <strong>{anoUniversal.reduzido}</strong>.
              Cada ciclo anual amplifica ou desafia aspectos específicos do seu Caminho de Vida.
              Considere como as qualidades do seu número <strong>{resultado.numerodeVida}</strong> ({resultado.numerodeVidaInfo?.arquetipo})
              podem ser expressas através da energia do ano: {interp?.descricao}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderMeses = () => {
    if (!resultado) return null;
    return (
      <div className="space-y-4 md:space-y-5 animate-fadeIn">
        <div className="num-panel p-6">
          <SectionLabel>Mapa Mensal</SectionLabel>
          <h2 className="font-tan-mon-cheri text-2xl text-on-dark mb-1">
            Os 12 Meses de {resultado.ano}
          </h2>
          <p className="text-on-dark-muted text-sm">
            Cada mês recebe uma energia específica baseada no seu Ano Pessoal {resultado.anoPessoal.reduzido}.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          {resultado.meses.map((mes: MesPessoal, idx: number) => (
            <div key={idx} className="num-panel p-5 md:p-6 transition-all hover:shadow-lg"
              style={{ border: "1px solid rgba(200,165,107,0.18)" }}>

              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-4"
                style={{ borderBottom: "1px solid rgba(200,165,107,0.15)" }}>
                <div>
                  <h3 className="font-semibold text-lg text-on-dark">{mes.mesNome}</h3>
                  <p className="text-xs text-brand-gold mt-0.5 font-semibold tracking-wide uppercase">{mes.energia}</p>
                </div>
                <NumBadge n={mes.reduzido} size="sm" />
              </div>

              {/* Short description */}
              <p className="text-sm text-on-darker leading-relaxed mb-4">{mes.descricao}</p>

              {/* Deep insight */}
              <div className="p-4 rounded-xl mb-4"
                style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.15)" }}>
                <p className="text-xs text-on-darker leading-relaxed">{mes.profundidade}</p>
              </div>

              {/* Reflection question */}
              <div className="flex items-start gap-3 p-4 rounded-xl mb-4"
                style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.25)" }}>
                <Quote className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs text-on-darker leading-relaxed italic">{mes.reflexao}</p>
              </div>

              {/* Areas */}
              {mes.areas.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold tracking-wider uppercase text-brand-gold mb-2">Áreas em destaque</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mes.areas.map((a, i) => <Tag key={i}>{a}</Tag>)}
                  </div>
                </div>
              )}

              {/* Actions */}
              {mes.acoes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold tracking-wider uppercase text-brand-gold mb-2">Ações recomendadas</p>
                  <ul className="space-y-1.5">
                    {mes.acoes.map((a, i) => (
                      <li key={i} className="text-xs text-on-darker flex items-start gap-2">
                        <span className="text-brand-gold mt-0.5 flex-shrink-0">·</span><span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Avoid */}
              {mes.evitar.length > 0 && (
                <div className="pt-3" style={{ borderTop: "1px solid rgba(200,165,107,0.1)" }}>
                  <p className="text-xs font-semibold tracking-wider uppercase text-on-dark-soft/60 mb-2">O que evitar</p>
                  <ul className="space-y-1.5">
                    {mes.evitar.map((e, i) => (
                      <li key={i} className="text-xs text-on-dark-muted flex items-start gap-2">
                        <span className="text-on-dark-soft mt-0.5 flex-shrink-0">·</span><span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (bloqueado) {
    return (
      <div className="min-h-screen app-dark-shell px-4 pt-6 pb-28">
        <MobileTopBar titulo="Numerologia" subtitulo="Módulo bloqueado" />
        <div className="max-w-lg mx-auto">
          <NavBackButton to={JORNADA_ROOT} label="Jornada" />
          <div
            className="rounded-2xl p-8 text-center mt-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: "#f7f2ec" }} />
            <h1 className="font-tan-mon-cheri text-xl mb-2" style={{ color: "#f7f2ec" }}>
              Numerologia bloqueada
            </h1>
            <p className="text-sm mb-6" style={{ color: "rgba(247,242,236,0.45)" }}>
              Conclua os quatro módulos anteriores da jornada (Traço, Temperamento, Linguagens do amor e Roda da Vida)
              para desbloquear este passo.
            </p>
            <button
              type="button"
              onClick={() => navigate(JORNADA_ROOT)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            >
              Ir para a Jornada
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Page ─────────────────────────────────────────────────────────────────

  return (
    <>
      <MobileTopBar titulo="Numerologia" subtitulo="Meus números e ciclos" />
      <AppPageShell width="wide" contentClassName="space-y-5 md:space-y-6">
        <NavBackButton to={JORNADA_MODULE_NAV.numerologia.hub} label={JORNADA_MODULE_NAV.numerologia.backLabel} className="mb-0" />
        <PageIntroHeader
          eyebrow="Análise numerológica"
          titulo="Numerologia"
          subtitulo="Decifre os padrões do seu destino"
          hiddenOnMobile
          className="mb-2"
        />

        {/* Hero card */}
        <div className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1e1812 0%, #2f251b 60%, #1e1812 100%)", border: "1px solid rgba(200,165,107,0.2)" }}>

          {/* Gold top bar */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #c8a56b 40%, #9c7742 60%, transparent)" }} />

          <div className="p-6 sm:p-8 md:p-10">
            {/* Header (título em mobile via MobileTopBar) */}
            <div className="text-center mb-8 md:mb-10">
              <p className="text-sm" style={{ color: "rgba(247,242,236,0.65)" }}>
                Seus números de vida, expressão, alma e ciclos anuais
              </p>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
              <div className="flex-1 h-px" style={{ background: "rgba(200,165,107,0.15)" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#c8a56b" }} />
              <div className="flex-1 h-px" style={{ background: "rgba(200,165,107,0.15)" }} />
            </div>

            {/* User identity block */}
            <div className="rounded-2xl p-4 sm:p-5 mb-7 md:mb-8 relative overflow-hidden"
              style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.18)" }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-4 min-w-0">
                  {/* Avatar circle */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.15), rgba(156,119,66,0.1))", border: "1px solid rgba(200,165,107,0.3)" }}>
                    <User className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#c8a56b" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-1"
                      style={{ color: "rgba(200,165,107,0.8)" }}>
                      Analisando o destino de
                    </p>
                    <p className="font-semibold text-xl sm:text-2xl md:text-3xl mb-1.5 leading-tight"
                      style={{ color: "#e8d5b0" }}>
                      {user?.nome || "Não informado"}
                    </p>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {user?.dataNascimento ? (
                        <>
                          <span className="flex items-center gap-1.5 text-xs sm:text-sm"
                            style={{ color: "rgba(247,242,236,0.75)" }}>
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                            {formatarDataBrasileira(user.dataNascimento)}
                          </span>
                          {calcularIdade(user.dataNascimento) !== null && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: "rgba(200,165,107,0.12)", color: "#c8a56b", border: "1px solid rgba(200,165,107,0.25)" }}>
                              {calcularIdade(user.dataNascimento)} anos
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm" style={{ color: "rgba(200,165,107,0.4)" }}>
                          Nascimento não cadastrado
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit profile link */}
                <a href="/perfil"
                  className="flex items-center gap-1.5 text-xs font-medium flex-shrink-0 self-start sm:mt-0 transition-opacity hover:opacity-80"
                  style={{ color: "rgba(200,165,107,0.75)" }}>
                  <ExternalLink className="w-3 h-3" />
                  Editar perfil
                </a>
              </div>
            </div>

            {/* Year selection */}
            <div className="mb-7 md:mb-8">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-center mb-4"
                style={{ color: "rgba(200,165,107,0.9)" }}>
                Selecione o ano de análise
              </p>
              <div className="flex gap-2.5 md:gap-3 justify-center max-w-xs mx-auto w-full">
                {ANOS_DISPONIVEIS.map(ano => (
                  <button
                    key={ano}
                    onClick={() => setAnoAnalise(ano)}
                    className="flex-1 py-3 rounded-xl font-semibold text-lg sm:text-xl transition-all"
                    style={anoAnalise === ano
                      ? { background: "linear-gradient(135deg, #9c7742, #c8a56b)", color: "#fff", boxShadow: "0 4px 20px rgba(200,165,107,0.3)" }
                      : { background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.25)", color: "rgba(247,242,236,0.7)" }}
                  >
                    {ano}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {erro && (
              <div className="flex items-start gap-3 p-4 rounded-xl mb-6"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm" style={{ color: "rgba(239,100,100,0.9)" }}>{erro}</p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleCalcular}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all hover:opacity-90 active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)", color: "#fff", boxShadow: "0 6px 30px rgba(200,165,107,0.25)", letterSpacing: "0.05em" }}>
              <Sparkles className="w-5 h-5" />
              Revelar Minha Análise
            </button>
          </div>

          {/* Gold bottom bar */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #c8a56b 40%, #9c7742 60%, transparent)" }} />
        </div>

        {/* Results */}
        {resultado && (
          <>
            {/* Tab navigation */}
            <div className="num-panel p-1.5 flex gap-1 items-stretch">
              {([
                { key: "perfil", label: "Perfil Permanente", icon: User },
                { key: "ano", label: `Análise ${resultado.ano}`, icon: TrendingUp },
                { key: "meses", label: "Mapa Mensal", icon: Calendar },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setAbaAtiva(key)}
                  className="flex-1 min-h-[46px] flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all text-center"
                  style={abaAtiva === key
                    ? { background: "linear-gradient(135deg, #9c7742, #c8a56b)", color: "#fff" }
                    : { color: "rgba(247,242,236,0.6)" }}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{key === "perfil" ? "Perfil" : key === "ano" ? "Ano" : "Meses"}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="text-on-darker">
              {abaAtiva === "perfil" && renderPerfilPermanente()}
              {abaAtiva === "ano" && renderAnoPessoal()}
              {abaAtiva === "meses" && renderMeses()}
            </div>
          </>
        )}
      </AppPageShell>
    </>
  );
}
