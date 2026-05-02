import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Calendar, TrendingUp, Heart, Briefcase, DollarSign, Activity, AlertCircle, Brain, Lightbulb, ChevronRight, Target } from "lucide-react";
import { ANOS_UNIVERSAIS, ANOS_PESSOAIS, COMBINACOES } from "@/lib/numerologia-data";
import {
  MesPessoal,
  calcularAnoPessoal,
  calcularAnoUniversal,
  calcularMesesPessoais,
  formatarDataBrasileira,
  reduzirNumeroForcando,
} from "@/lib/numerologia-utils";

export default function NumerologiaPage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [dataNascimento, setDataNascimento] = useState("");
  const [anoAnalise, setAnoAnalise] = useState(new Date().getFullYear());
  const [mostrarMestres, setMostrarMestres] = useState(true);
  const [resultado, setResultado] = useState<ReturnType<typeof calcularResultado> | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroTela, setErroTela] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { navigate("/login"); return; }
    if (status === "authenticated" && user?.dataNascimento) {
      setDataNascimento(user.dataNascimento);
    }
    setCarregando(false);
  }, [status, user]);

  function calcularResultado(data: string, ano: number, mestres: boolean) {
    const dataFormatada = formatarDataBrasileira(data);
    const anoUniversal = calcularAnoUniversal(ano);
    const anoPessoalObj = calcularAnoPessoal(dataFormatada, ano);
    if (!anoPessoalObj) return null;
    let numeroFinal = anoPessoalObj.reduzido;
    if ((anoPessoalObj.reduzido === 11 || anoPessoalObj.reduzido === 22) && !mestres) {
      numeroFinal = reduzirNumeroForcando(anoPessoalObj.somaTotal);
    }
    return {
      dataNascimento: data,
      anoAnalise: ano,
      anoUniversal,
      anoPessoal: { ...anoPessoalObj, reduzido: numeroFinal },
      interpretacaoNumero: ANOS_PESSOAIS[numeroFinal],
      analiseUniversal: ANOS_UNIVERSAIS[anoUniversal.reduzido],
      combinacao: COMBINACOES[`${anoUniversal.reduzido}-${numeroFinal}`],
      mesesPessoais: calcularMesesPessoais(numeroFinal, ano),
    };
  }

  function handleCalcular() {
    setErroTela("");
    if (!dataNascimento) {
      setErroTela("Data de nascimento não encontrada. Entre em contato com o administrador para cadastrar sua data de nascimento.");
      return;
    }
    const r = calcularResultado(dataNascimento, anoAnalise, mostrarMestres);
    if (r) setResultado(r);
  }

  if (carregando) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="luxury-shell py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Input card */}
        <div className="luxury-card-strong p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-2">Análise</p>
          <h1 className="font-tan-mon-cheri text-4xl md:text-5xl text-brand-dark mb-8">
            Numerologia
          </h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-2">
                Data de Nascimento
              </label>
              <input type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} className="luxury-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-2">
                Ano de Análise
              </label>
              <input type="number" value={anoAnalise} onChange={e => setAnoAnalise(parseInt(e.target.value))} min={2020} max={2050} className="luxury-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-2">
                Números Mestres
              </label>
              <div className="flex items-center gap-4 h-[46px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={mostrarMestres} onChange={() => setMostrarMestres(true)} className="w-4 h-4 accent-brand-bronze" />
                  <span className="text-sm text-brand-dark">Preservar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={!mostrarMestres} onChange={() => setMostrarMestres(false)} className="w-4 h-4 accent-brand-bronze" />
                  <span className="text-sm text-brand-dark">Reduzir</span>
                </label>
              </div>
            </div>
          </div>

          {erroTela && (
            <div className="flex items-start gap-3 p-4 rounded-xl mb-6"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{erroTela}</p>
            </div>
          )}

          <button onClick={handleCalcular} className="w-full luxury-btn-primary py-3.5">
            <Calendar className="w-4 h-4" />
            Calcular Análise do Ano {anoAnalise}
          </button>
        </div>

        {resultado && (
          <div className="space-y-6 animate-fadeIn">

            {/* Numbers summary */}
            <div className="luxury-card-strong p-8">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-6">Seus Números</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl"
                  style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.3)" }}>
                  <p className="text-xs tracking-widest uppercase text-brand-medium mb-3">Ano Pessoal</p>
                  <div className="flex items-end gap-4">
                    <span className="font-tan-mon-cheri text-8xl text-brand-bronze leading-none">{resultado.anoPessoal.reduzido}</span>
                    <div className="mb-2">
                      <p className="text-xs text-brand-medium">Ciclo pessoal de {resultado.anoAnalise}</p>
                      <p className="text-sm text-brand-dark font-medium mt-1">Soma: {resultado.anoPessoal.somaTotal}</p>
                    </div>
                  </div>
                  {resultado.interpretacaoNumero && (
                    <p className="text-brand-medium text-sm mt-4 leading-relaxed">{resultado.interpretacaoNumero.descricao}</p>
                  )}
                </div>
                <div className="p-6 rounded-2xl"
                  style={{ background: "rgba(156,119,66,0.05)", border: "1px solid rgba(156,119,66,0.2)" }}>
                  <p className="text-xs tracking-widest uppercase text-brand-medium mb-3">Ano Universal {resultado.anoAnalise}</p>
                  <div className="flex items-end gap-4">
                    <span className="font-tan-mon-cheri text-8xl text-brand-dark leading-none opacity-60">{resultado.anoUniversal.reduzido}</span>
                    <div className="mb-2">
                      <p className="text-xs text-brand-medium">Energia coletiva global</p>
                      <p className="text-sm text-brand-dark font-medium mt-1">Soma: {resultado.anoUniversal.somaTotal}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal year interpretation */}
            {resultado.interpretacaoNumero && (
              <div className="luxury-card-strong p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-5 h-5 text-brand-bronze" />
                  <div>
                    <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium">Interpretação</p>
                    <p className="text-brand-dark font-medium">{resultado.interpretacaoNumero.titulo}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl mb-6"
                  style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}>
                  <p className="text-brand-darker leading-relaxed whitespace-pre-line text-sm">{resultado.interpretacaoNumero.detalhado}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: Briefcase, label: "Carreira", key: "carreira" },
                    { icon: DollarSign, label: "Finanças", key: "financas" },
                    { icon: Heart, label: "Relacionamentos", key: "relacionamentos" },
                    { icon: Activity, label: "Saúde", key: "saude" },
                  ].map(({ icon: Icon, label, key }) => (
                    <div key={key} className="p-5 rounded-xl"
                      style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-4 h-4 text-brand-bronze" />
                        <h3 className="font-semibold text-brand-dark text-sm">{label}</h3>
                      </div>
                      <p className="text-brand-medium text-sm leading-relaxed">
                        {resultado.interpretacaoNumero!.temas[key as keyof typeof resultado.interpretacaoNumero.temas]}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl"
                    style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}>
                    <h3 className="font-semibold text-brand-dark text-sm mb-3">Desafios a Superar</h3>
                    <div className="flex flex-wrap gap-2">
                      {resultado.interpretacaoNumero.desafios.map((d: string, i: number) => (
                        <span key={i} className="px-3 py-1 text-xs rounded-full text-brand-dark"
                          style={{ background: "rgba(200,165,107,0.12)", border: "1px solid rgba(200,165,107,0.3)" }}>{d}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 rounded-xl"
                    style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}>
                    <h3 className="font-semibold text-brand-dark text-sm mb-3">Palavras-Chave</h3>
                    <div className="flex flex-wrap gap-2">
                      {resultado.interpretacaoNumero.palavrasChave.map((p: string, i: number) => (
                        <span key={i} className="px-3 py-1 text-xs rounded-full text-brand-dark"
                          style={{ background: "rgba(156,119,66,0.12)", border: "1px solid rgba(156,119,66,0.3)" }}>{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Universal year */}
            {resultado.analiseUniversal && (
              <div className="luxury-card-strong p-8">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-brand-bronze" />
                  <div>
                    <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium">Ano Universal</p>
                    <p className="text-brand-dark font-medium">{resultado.analiseUniversal.titulo}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl mb-4"
                  style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}>
                  <p className="text-xs tracking-widest uppercase text-brand-medium mb-2">Clima Coletivo</p>
                  <p className="text-brand-darker leading-relaxed text-sm">{resultado.analiseUniversal.climaColetivo}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl"
                    style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                    <h3 className="font-semibold text-brand-dark text-sm mb-2">Oportunidades</h3>
                    <p className="text-sm text-brand-medium leading-relaxed">{resultado.analiseUniversal.oportunidades}</p>
                  </div>
                  <div className="p-5 rounded-xl"
                    style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                    <h3 className="font-semibold text-brand-dark text-sm mb-2">Desafios</h3>
                    <p className="text-sm text-brand-medium leading-relaxed">{resultado.analiseUniversal.desafios}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Combination */}
            {resultado.combinacao && (
              <div className="luxury-card-strong p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-5 h-5 text-brand-bronze" />
                  <div>
                    <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium">Combinação de Energias</p>
                    <p className="text-brand-dark font-medium">{resultado.combinacao.tema}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {[
                    { icon: Briefcase, label: "Carreira", val: resultado.combinacao.carreira },
                    { icon: DollarSign, label: "Finanças", val: resultado.combinacao.financas },
                    { icon: Heart, label: "Relações", val: resultado.combinacao.relacoes },
                    { icon: AlertCircle, label: "Desafios", val: resultado.combinacao.desafios },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="p-5 rounded-xl"
                      style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-brand-bronze" />
                        <h3 className="font-semibold text-brand-dark text-sm">{label}</h3>
                      </div>
                      <p className="text-brand-medium text-sm leading-relaxed">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="p-6 rounded-2xl"
                  style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.25)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight className="w-4 h-4 text-brand-bronze" />
                    <h3 className="font-semibold text-brand-dark text-sm">Recomendações Práticas</h3>
                  </div>
                  <p className="text-brand-darker leading-relaxed text-sm">{resultado.combinacao.recomendacoes}</p>
                </div>
              </div>
            )}

            {/* Monthly map */}
            {resultado.mesesPessoais && resultado.mesesPessoais.length > 0 && (
              <div className="luxury-card-strong p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-5 h-5 text-brand-bronze" />
                  <div>
                    <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium">Mapa Mensal</p>
                    <p className="text-brand-dark font-medium">Os 12 Meses de {resultado.anoAnalise}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-5">
                  {resultado.mesesPessoais.map((mes: MesPessoal, idx: number) => (
                    <div key={idx} className="rounded-2xl p-6 transition-all hover:shadow-lg"
                      style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.18)" }}>
                      <div className="flex items-center justify-between mb-4 pb-4"
                        style={{ borderBottom: "1px solid rgba(200,165,107,0.15)" }}>
                        <div>
                          <h3 className="font-semibold text-brand-dark">{mes.mesNome}</h3>
                          <p className="text-xs text-brand-medium mt-0.5">{mes.energia}</p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl shadow-md"
                          style={{ background: "linear-gradient(135deg, #9c7742, #c8a56b)" }}>
                          <span className="font-tan-mon-cheri text-xl text-white">{mes.reduzido}</span>
                        </div>
                      </div>
                      <p className="text-sm text-brand-darker leading-relaxed mb-4 italic">{mes.descricao}</p>
                      {mes.areas && mes.areas.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-3 h-3 text-brand-bronze" />
                            <h4 className="text-xs font-semibold text-brand-bronze tracking-wider uppercase">Áreas Favoráveis</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {mes.areas.map((area: string, i: number) => (
                              <span key={i} className="text-xs px-2.5 py-1 rounded-full text-brand-dark"
                                style={{ background: "rgba(200,165,107,0.12)", border: "1px solid rgba(200,165,107,0.25)" }}>{area}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {mes.acoes && mes.acoes.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <ChevronRight className="w-3 h-3 text-brand-bronze" />
                            <h4 className="text-xs font-semibold text-brand-bronze tracking-wider uppercase">Ações Recomendadas</h4>
                          </div>
                          <ul className="space-y-1">
                            {mes.acoes.slice(0, 4).map((acao: string, i: number) => (
                              <li key={i} className="text-xs text-brand-darker flex items-start gap-2">
                                <span className="text-brand-bronze mt-0.5 flex-shrink-0">—</span>
                                <span>{acao}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {mes.evitar && mes.evitar.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-3 h-3 text-brand-medium" />
                            <h4 className="text-xs font-semibold text-brand-medium tracking-wider uppercase">O que Evitar</h4>
                          </div>
                          <ul className="space-y-1">
                            {mes.evitar.slice(0, 3).map((item: string, i: number) => (
                              <li key={i} className="text-xs text-brand-medium flex items-start gap-2">
                                <span className="text-brand-medium mt-0.5 flex-shrink-0">—</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
