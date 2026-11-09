import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar, TrendingUp, Heart, Briefcase, DollarSign, Activity,
  AlertCircle, Brain, Lightbulb, ChevronDown, ChevronRight,
  User, Star, Zap, Shield, Hash, BookOpen, Compass, Lock,
} from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { useJornadaModulo } from "@/hooks/useJornadaModulo";

import { ANOS_UNIVERSAIS, ANOS_PESSOAIS, COMBINACOES, NUMEROS_DE_VIDA, type AnaliseNumero } from "@/lib/numerologia-data";
import LeituraBlocos from "@/components/LeituraBlocos";
import { ListaItens, TextoFormatado } from "@/components/TextoLeitura";
import { leituraDoMes, leituraNumerologia } from "@/lib/leiturasPortal";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import PageIntroHeader from "@/components/PageIntroHeader";
import AppPageShell from "@/components/AppPageShell";
import { JORNADA_MODULE_NAV, JORNADA_ROOT } from "@/lib/jornadaHubConfig";
import {
  MesPessoal,
  anoCivilDoAnoPessoalVigente,
  calcularAnoPessoal,
  calcularAnoUniversal,
  calcularMesesPessoais,
  calcularNumerodeVida,
  calcularNumerodeExpressao,
  calcularNumerodaAlma,
  calcularNumerodaPersonalidade,
  formatarDataBrasileira,
} from "@/lib/numerologia-utils";
import {
  sinteseCaminhoAno,
  sinteseTriangulo,
} from "@/lib/numerologia/sinteseNumerologica";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function perfilDoAno(interp: AnaliseNumero) {
  return {
    essencia: interp.essencia,
    descricao: interp.descricao,
    missao: interp.detalhado,
    carreira: interp.temas.carreira,
    relacionamentos: interp.temas.relacionamentos,
    desafios: interp.desafios,
    praticas: interp.praticasSugeridas,
  };
}

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
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-brand-gold" />
        <h3 className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: "#c8a56b" }}>{label}</h3>
      </div>
      {typeof children === "string" ? <TextoFormatado texto={children} /> : <div className="text-[15px] leading-relaxed" style={{ color: "rgba(247,242,236,0.78)", lineHeight: 1.8 }}>{children}</div>}
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

  const ANOS_DISPONIVEIS = [2025, 2026, 2027];
  const anoCivilHoje = new Date().getFullYear();
  const mesCivilHoje = new Date().getMonth() + 1;
  const anoDefault = ANOS_DISPONIVEIS.includes(anoCivilHoje) ? anoCivilHoje : ANOS_DISPONIVEIS[0];
  const [anoAnalise, setAnoAnalise] = useState(anoDefault);
  const [anoInicializado, setAnoInicializado] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<ReturnType<typeof calcular> | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"perfil" | "ano" | "meses">("perfil");
  const [mesAberto, setMesAberto] = useState<number | null>(mesCivilHoje);
  const marcouConclusao = useRef(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { navigate("/login"); return; }
  }, [status, user]);

  useEffect(() => {
    if (anoInicializado || !user?.dataNascimento) return;
    const fmt = formatarDataBrasileira(user.dataNascimento);
    const vigente = anoCivilDoAnoPessoalVigente(fmt);
    if (vigente != null) {
      setAnoAnalise(ANOS_DISPONIVEIS.includes(vigente) ? vigente : anoDefault);
    }
    setAnoInicializado(true);
  }, [user?.dataNascimento, anoInicializado, anoDefault]);

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

  useEffect(() => {
    if (status !== "authenticated" || bloqueado) return;
    const dataNasc = user?.dataNascimento ?? "";
    const nomeUser = user?.nome ?? "";
    if (!dataNasc) {
      setErro("Data de nascimento não encontrada. Acesse seu perfil para cadastrar.");
      setResultado(null);
      return;
    }
    const r = calcular(dataNasc, nomeUser, anoAnalise);
    if (!r) {
      setErro("Não foi possível ler a data de nascimento.");
      setResultado(null);
      return;
    }
    setErro("");
    setResultado(r);
    if (!marcouConclusao.current) {
      marcouConclusao.current = true;
      apiFetch("/modulos-jornada/numerologia/concluir-analise", { method: "POST" }).catch(() => {
        marcouConclusao.current = false;
      });
    }
  }, [status, bloqueado, user?.dataNascimento, user?.nome, anoAnalise]);

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

            {leituraNumerologia(numerodeVidaInfo) && (
              <div className="mb-6">
                <LeituraBlocos fluida leitura={leituraNumerologia(numerodeVidaInfo)!} />
              </div>
            )}

            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-2" style={{ color: "#c8a56b" }}>Saúde e corpo</p>
                <TextoFormatado texto={numerodeVidaInfo.saude} />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-2" style={{ color: "#c8a56b" }}>Espiritualidade</p>
                <TextoFormatado texto={numerodeVidaInfo.espiritualidade} />
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-3" style={{ color: "#c8a56b" }}>Talentos naturais</p>
              <ListaItens itens={numerodeVidaInfo.talentos} />
            </div>

            <div className="flex flex-wrap gap-2 mt-8 pt-5" style={{ borderTop: "1px solid rgba(200,165,107,0.15)" }}>
              {numerodeVidaInfo.palavrasChave.map((p, i) => <Tag key={i}>{p}</Tag>)}
            </div>
          </div>
        )}

        {/* Expression */}
        {expressaoVal && expressaoInfo && (
          <div className="num-panel p-6 md:p-8">
            <SectionLabel>Número de Expressão</SectionLabel>
            <div className="flex items-start gap-4 md:gap-6 mb-5">
              <NumBadge n={expressaoVal} size="md" />
              <div>
                <h3 className="font-tan-mon-cheri text-2xl md:text-3xl text-on-dark mb-1">
                  {expressaoInfo.arquetipo}
                </h3>
                <p className="text-xs text-on-dark-soft">
                  Do nome completo — como você se expressa e os talentos que manifesta no mundo
                </p>
              </div>
            </div>
            {leituraNumerologia(expressaoInfo) && (
              <div className="mb-5">
                <LeituraBlocos fluida leitura={leituraNumerologia(expressaoInfo)!} />
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid rgba(200,165,107,0.15)" }}>
              {expressaoInfo.palavrasChave.map((p, i) => <Tag key={i}>{p}</Tag>)}
            </div>
          </div>
        )}

        {/* Soul */}
        {almaVal && almaInfo && (
          <div className="num-panel p-6 md:p-8">
            <SectionLabel>Número da Alma</SectionLabel>
            <div className="flex items-start gap-4 md:gap-6 mb-5">
              <NumBadge n={almaVal} size="md" />
              <div>
                <h3 className="font-tan-mon-cheri text-2xl md:text-3xl text-on-dark mb-1">
                  {almaInfo.arquetipo}
                </h3>
                <p className="text-xs text-on-dark-soft">
                  Das vogais do nome — o desejo íntimo, a motivação que move você por dentro
                </p>
              </div>
            </div>
            {leituraNumerologia(almaInfo) && (
              <div className="mb-5">
                <LeituraBlocos fluida leitura={leituraNumerologia(almaInfo)!} />
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid rgba(200,165,107,0.15)" }}>
              {almaInfo.palavrasChave.map((p, i) => <Tag key={i}>{p}</Tag>)}
            </div>
          </div>
        )}

        {/* Personality number */}
        {persVal && NUMEROS_DE_VIDA[persVal] && (() => {
          const persInfo = NUMEROS_DE_VIDA[persVal];
          const leituraPers = leituraNumerologia(persInfo);
          return (
            <div className="num-panel p-6 md:p-8">
              <SectionLabel>Número da Personalidade</SectionLabel>
              <div className="flex items-start gap-4 md:gap-6 mb-5">
                <NumBadge n={persVal} size="md" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-tan-mon-cheri text-2xl md:text-3xl text-on-dark mb-1">
                    {persInfo.arquetipo}
                  </h3>
                  <p className="text-xs text-on-dark-soft mb-1">
                    Das consoantes do nome — a imagem que você projeta e como os outros te percebem
                  </p>
                  {resultado.nomeCompleto?.trim() ? (
                    <p className="text-[11px] text-on-dark-soft/70">
                      A partir do nome: {resultado.nomeCompleto.trim()}
                    </p>
                  ) : null}
                </div>
              </div>

              <p className="text-sm text-on-dark-muted leading-relaxed mb-5">
                Enquanto o Caminho de Vida fala da essência e a Alma dos desejos íntimos,
                a Personalidade revela a primeira impressão: o que você transmite sem precisar explicar.
              </p>

              {leituraPers ? (
                <div className="mb-5">
                  <LeituraBlocos fluida leitura={leituraPers} />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid rgba(200,165,107,0.15)" }}>
                {persInfo.palavrasChave.map((p, i) => (
                  <Tag key={i}>{p}</Tag>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Triangle synthesis */}
        {numerodeVida && expressaoVal && almaVal && (() => {
          const s = sinteseTriangulo(numerodeVida, expressaoVal, almaVal, persVal);
          return (
            <div
              className="num-panel p-6 md:p-8"
              style={{ background: "linear-gradient(160deg, #1e1812 0%, #2f251b 60%, #3d2f1f 100%)" }}
            >
              <SectionLabel>
                <span style={{ color: "rgba(200,165,107,0.9)" }}>Síntese personalizada</span>
              </SectionLabel>
              <h3 className="font-tan-mon-cheri text-2xl mb-2" style={{ color: "#f7f2ec" }}>
                {s.titulo}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(247,242,236,0.82)" }}>
                {s.leitura}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {s.chips.map((c) => (
                  <span
                    key={c.label}
                    className="text-[11px] px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(200,165,107,0.1)",
                      border: "1px solid rgba(200,165,107,0.25)",
                      color: "#e8d5b0",
                    }}
                  >
                    <span style={{ color: "rgba(200,165,107,0.7)" }}>{c.label}: </span>
                    {c.valor}
                  </span>
                ))}
              </div>

              <div className="grid gap-3">
                {[
                  { rotulo: "Onde flui", texto: s.alinhamento },
                  { rotulo: "Onde trava", texto: s.tensao },
                  { rotulo: "Foco agora", texto: s.foco },
                ].map((bloco) => (
                  <div
                    key={bloco.rotulo}
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(200,165,107,0.07)",
                      border: "1px solid rgba(200,165,107,0.2)",
                    }}
                  >
                    <p
                      className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5"
                      style={{ color: "#c8a56b" }}
                    >
                      {bloco.rotulo}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.85)" }}>
                      {bloco.texto}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
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
              {interp && leituraNumerologia(perfilDoAno(interp)) && (
                <div className="mb-2">
                  <LeituraBlocos fluida leitura={leituraNumerologia(perfilDoAno(interp))!} />
                </div>
              )}
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
              {univ && <TextoFormatado texto={univ.climaColetivo} />}
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
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <InfoCard icon={DollarSign} label="Finanças">{interp.temas.financas}</InfoCard>
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
              {interp.areasDeAtencao && interp.areasDeAtencao.length > 0 && (
                <div className="p-5 rounded-xl" style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                  <h3 className="font-semibold text-on-dark text-sm mb-3">Áreas de Atenção</h3>
                  <ListaItens itens={interp.areasDeAtencao} />
                </div>
              )}
            </div>
            {interp.afirmacoes && interp.afirmacoes.length > 0 && (
              <div className="p-5 rounded-xl" style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.25)" }}>
                <h3 className="font-semibold text-on-dark text-sm mb-3">Afirmações do Ano</h3>
                <div className="space-y-3">
                  {interp.afirmacoes.map((a, i) => (
                    <TextoFormatado key={i} texto={a.startsWith('"') ? a : `"${a}"`} />
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
                  <TextoFormatado texto={val} />
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl" style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.3)" }}>
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4 text-brand-gold" />
                <h3 className="font-semibold text-sm" style={{ color: "#f7f2ec" }}>Recomendações Práticas</h3>
              </div>
              <TextoFormatado texto={combinacao.recomendacoes} />
            </div>
          </div>
        )}

        {/* Life path × personal year synthesis */}
        {resultado.numerodeVida && (() => {
          const s = sinteseCaminhoAno(
            resultado.numerodeVida,
            anoPessoal.reduzido,
            anoUniversal.reduzido,
            resultado.ano,
          );
          return (
            <div
              className="num-panel p-6 md:p-8"
              style={{
                background: combinacao
                  ? undefined
                  : "linear-gradient(160deg, #1e1812 0%, #2f251b 60%, #3d2f1f 100%)",
              }}
            >
              <SectionLabel>
                <span style={{ color: "rgba(200,165,107,0.9)" }}>Síntese personalizada</span>
              </SectionLabel>
              <h3 className="font-tan-mon-cheri text-2xl mb-2" style={{ color: "#f7f2ec" }}>
                {s.titulo}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(247,242,236,0.82)" }}>
                {s.leitura}
              </p>
              <div className="grid gap-3">
                {[
                  { rotulo: "O que amplifica", texto: s.amplifica },
                  { rotulo: "O que cuidar", texto: s.cuidado },
                  { rotulo: "Um gesto concreto", texto: s.gesto },
                ].map((bloco) => (
                  <div
                    key={bloco.rotulo}
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(200,165,107,0.07)",
                      border: "1px solid rgba(200,165,107,0.2)",
                    }}
                  >
                    <p
                      className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5"
                      style={{ color: "#c8a56b" }}
                    >
                      {bloco.rotulo}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.85)" }}>
                      {bloco.texto}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
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
            Cada mês deste ano pede uma coisa diferente. Leia como um convite para o momento, não como uma regra.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
          {resultado.meses.map((mes: MesPessoal) => {
            const aberto = mesAberto === mes.mesNumero;
            const leitura = leituraDoMes(mes);
            const ehMesAtual = resultado.ano === anoCivilHoje && mes.mesNumero === mesCivilHoje;
            return (
              <div
                key={mes.mesNumero}
                className="num-panel overflow-hidden"
                style={{
                  border: ehMesAtual ? "1px solid rgba(200,165,107,0.55)" : "1px solid rgba(200,165,107,0.18)",
                  background: ehMesAtual ? "rgba(200,165,107,0.08)" : undefined,
                  boxShadow: ehMesAtual ? "0 0 0 1px rgba(200,165,107,0.12)" : undefined,
                }}
              >
                <button
                  type="button"
                  aria-expanded={aberto}
                  onClick={() => setMesAberto(aberto ? null : mes.mesNumero)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left md:p-5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg text-on-dark">{mes.mesNome}</h3>
                      {ehMesAtual && (
                        <span
                          className="text-[10px] font-semibold tracking-[0.14em] uppercase px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(200,165,107,0.2)",
                            color: "#c8a56b",
                            border: "1px solid rgba(200,165,107,0.35)",
                          }}
                        >
                          Mês atual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-gold mt-0.5 font-semibold tracking-wide uppercase">{mes.energia}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <NumBadge n={mes.reduzido} size="sm" />
                    <ChevronDown
                      className="h-5 w-5 transition-transform"
                      style={{ color: "#c8a56b", transform: aberto ? "rotate(180deg)" : "none" }}
                    />
                  </div>
                </button>
                {aberto && leitura && (
                  <div className="px-4 pb-5 md:px-6 md:pb-6" style={{ borderTop: "1px solid rgba(200,165,107,0.15)" }}>
                    <div className="pt-4">
                      <LeituraBlocos fluida leitura={leitura} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (bloqueado) {
    return (
      <div className="min-h-screen app-dark-shell px-4 pt-6 pb-28">
        <MobileTopBar titulo="Numerologia" voltar={JORNADA_ROOT} />
        <div className="max-w-lg mx-auto">
          <NavBackButton to={JORNADA_ROOT} label="Jornada" className="hidden md:flex" />
          <div
            className="rounded-2xl p-8 text-center mt-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: "#f7f2ec" }} />
            <h1 className="font-tan-mon-cheri text-xl mb-2" style={{ color: "#f7f2ec" }}>
              Numerologia bloqueada
            </h1>
            <p className="text-sm mb-6" style={{ color: "rgba(247,242,236,0.45)" }}>
              A Numerologia é o primeiro passo da jornada. Cadastre sua data de nascimento no perfil para liberar a leitura.
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
      <MobileTopBar titulo="Numerologia" voltar={JORNADA_MODULE_NAV.numerologia.hub} />
      <AppPageShell width="wide" contentClassName="space-y-5 md:space-y-6">
        <NavBackButton to={JORNADA_MODULE_NAV.numerologia.hub} label={JORNADA_MODULE_NAV.numerologia.backLabel} className="mb-0 hidden md:flex" />
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
              </div>
            </div>

            {/* Year selection */}
            <div className="mb-1">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-center mb-2"
                style={{ color: "rgba(200,165,107,0.9)" }}>
                Selecione o ano de análise
              </p>
              <p className="text-[11px] text-center mb-4" style={{ color: "rgba(247,242,236,0.45)" }}>
                O Ano Pessoal vira no seu aniversário.
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
