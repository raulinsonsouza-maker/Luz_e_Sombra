import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Calendar, TrendingUp, Heart, Briefcase, DollarSign, Home, Activity, AlertCircle, Brain, Lightbulb } from "lucide-react";
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
  const [resultado, setResultado] = useState<any>(null);
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

  function handleCalcular() {
    setErroTela("");
    if (!dataNascimento) {
      setErroTela("Data de nascimento não encontrada. Entre em contato com o administrador para cadastrar sua data de nascimento.");
      return;
    }

    const dataFormatada = formatarDataBrasileira(dataNascimento);
    const anoUniversal = calcularAnoUniversal(anoAnalise);
    const anoPessoalObj = calcularAnoPessoal(dataFormatada, anoAnalise);
    if (!anoPessoalObj) return;

    let numeroFinal = anoPessoalObj.reduzido;
    if ((anoPessoalObj.reduzido === 11 || anoPessoalObj.reduzido === 22) && !mostrarMestres) {
      numeroFinal = reduzirNumeroForcando(anoPessoalObj.somaTotal);
    }

    const interpretacaoNumero = ANOS_PESSOAIS[numeroFinal];
    const analiseUniversal = ANOS_UNIVERSAIS[anoUniversal.reduzido];
    const chaveCombinacao = `${anoUniversal.reduzido}-${numeroFinal}`;
    const combinacao = COMBINACOES[chaveCombinacao];
    const mesesPessoais = calcularMesesPessoais(numeroFinal, anoAnalise);

    setResultado({
      dataNascimento,
      anoAnalise,
      anoUniversal,
      anoPessoal: { ...anoPessoalObj, reduzido: numeroFinal },
      interpretacaoNumero,
      analiseUniversal,
      combinacao,
      mesesPessoais,
    });
  }

  if (carregando) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-bronze"></div>
      </div>
    );
  }

  return (
    <div className="luxury-shell py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="luxury-card-strong p-8 md:p-12 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-gold/20 to-brand-bronze/20 rounded-2xl border-2 border-brand-gold/40 mb-6">
              <Sparkles className="w-10 h-10 text-brand-bronze" strokeWidth={1.5} />
            </div>
            <h1 className="font-tan-mon-cheri text-5xl text-brand-dark mb-3">Análise Numerológica</h1>
            <p className="text-brand-medium text-lg">Descubra as energias que guiam seu {anoAnalise}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">
                <Calendar className="inline w-4 h-4 mr-2 text-brand-bronze" />
                Data de Nascimento
              </label>
              <input
                type="date"
                value={dataNascimento}
                onChange={e => setDataNascimento(e.target.value)}
                className="luxury-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Ano de Análise</label>
              <input
                type="number"
                value={anoAnalise}
                onChange={e => setAnoAnalise(parseInt(e.target.value))}
                min={2020}
                max={2050}
                className="luxury-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Números Mestres</label>
              <div className="flex items-center gap-3 h-[42px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={mostrarMestres} onChange={() => setMostrarMestres(true)} className="w-4 h-4" />
                  <span className="text-sm text-brand-dark">Preservar (11, 22)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={!mostrarMestres} onChange={() => setMostrarMestres(false)} className="w-4 h-4" />
                  <span className="text-sm text-brand-dark">Reduzir</span>
                </label>
              </div>
            </div>
          </div>

          {erroTela && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">{erroTela}</p>
            </div>
          )}

          <button
            onClick={handleCalcular}
            className="w-full luxury-btn-primary"
          >
            <Sparkles className="w-5 h-5" />
            Calcular Análise do Ano {anoAnalise}
          </button>
        </div>

        {resultado && (
          <div className="space-y-6 animate-fadeIn">
            {/* Resumo dos Números */}
            <div className="luxury-card-strong p-8">
              <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-6">Seus Números do Ano</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border-2 border-brand-gold/40">
                  <p className="text-sm text-brand-medium mb-2">Ano Pessoal</p>
                  <div className="flex items-end gap-4">
                    <span className="text-7xl font-bold text-brand-bronze">{resultado.anoPessoal.reduzido}</span>
                    <div className="mb-2">
                      <p className="text-xs text-brand-medium">Ciclo pessoal de {resultado.anoAnalise}</p>
                      <p className="text-sm text-brand-dark font-medium">Soma: {resultado.anoPessoal.somaTotal}</p>
                    </div>
                  </div>
                  {resultado.interpretacaoNumero && (
                    <p className="text-brand-darker text-sm mt-4 leading-relaxed">{resultado.interpretacaoNumero.descricao}</p>
                  )}
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border-2 border-purple-200">
                  <p className="text-sm text-purple-600 mb-2">Ano Universal {resultado.anoAnalise}</p>
                  <div className="flex items-end gap-4">
                    <span className="text-7xl font-bold text-purple-700">{resultado.anoUniversal.reduzido}</span>
                    <div className="mb-2">
                      <p className="text-xs text-purple-500">Energia coletiva global</p>
                      <p className="text-sm text-purple-700 font-medium">Soma: {resultado.anoUniversal.somaTotal}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interpretação do Ano Pessoal */}
            {resultado.interpretacaoNumero && (
              <div className="luxury-card-strong p-8">
                <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-4 flex items-center gap-3">
                  <Brain className="w-8 h-8 text-brand-gold" />
                  {resultado.interpretacaoNumero.titulo}
                </h2>
                <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30 mb-6">
                  <p className="text-brand-darker leading-relaxed whitespace-pre-line">{resultado.interpretacaoNumero.detalhado}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: Briefcase, label: "Carreira", key: "carreira" },
                    { icon: DollarSign, label: "Finanças", key: "financas" },
                    { icon: Heart, label: "Relacionamentos", key: "relacionamentos" },
                    { icon: Activity, label: "Saúde", key: "saude" },
                  ].map(({ icon: Icon, label, key }) => (
                    <div key={key} className="bg-brand-gold/5 rounded-xl p-6 border border-brand-gold/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-6 h-6 text-brand-bronze" />
                        <h3 className="font-semibold text-brand-dark">{label}</h3>
                      </div>
                      <p className="text-brand-darker text-sm leading-relaxed">
                        {resultado.interpretacaoNumero.temas[key]}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                    <h3 className="font-semibold text-brand-dark mb-3">Desafios a Superar</h3>
                    <div className="flex flex-wrap gap-2">
                      {resultado.interpretacaoNumero.desafios.map((d: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-brand-gold/20 text-brand-dark text-sm rounded-full border border-brand-gold/40">{d}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                    <h3 className="font-semibold text-brand-dark mb-3">Palavras-Chave</h3>
                    <div className="flex flex-wrap gap-2">
                      {resultado.interpretacaoNumero.palavrasChave.map((p: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-brand-bronze/20 text-brand-dark text-sm rounded-full border border-brand-bronze/40">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Análise Universal */}
            {resultado.analiseUniversal && (
              <div className="luxury-card-strong p-8">
                <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-4 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-brand-gold" />
                  {resultado.analiseUniversal.titulo}
                </h2>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                    <h3 className="font-semibold text-brand-dark mb-2">Clima Coletivo</h3>
                    <p className="text-brand-darker leading-relaxed">{resultado.analiseUniversal.climaColetivo}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-brand-gold/5 rounded-xl p-4 border border-brand-gold/30">
                      <h3 className="font-semibold text-brand-dark mb-2">Oportunidades</h3>
                      <p className="text-sm text-brand-darker">{resultado.analiseUniversal.oportunidades}</p>
                    </div>
                    <div className="bg-brand-gold/5 rounded-xl p-4 border border-brand-gold/30">
                      <h3 className="font-semibold text-brand-dark mb-2">Desafios</h3>
                      <p className="text-sm text-brand-darker">{resultado.analiseUniversal.desafios}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Combinação */}
            {resultado.combinacao && (
              <div className="luxury-card-strong p-8">
                <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-4 flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-brand-bronze" />
                  Combinação de Energias
                </h2>
                <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30 mb-6">
                  <p className="text-lg font-semibold text-brand-dark">{resultado.combinacao.tema}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: Briefcase, label: "Carreira", val: resultado.combinacao.carreira },
                    { icon: DollarSign, label: "Finanças", val: resultado.combinacao.financas },
                    { icon: Heart, label: "Relações", val: resultado.combinacao.relacoes },
                    { icon: AlertCircle, label: "Desafios", val: resultado.combinacao.desafios },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="bg-brand-gold/5 rounded-xl p-6 border border-brand-gold/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-6 h-6 text-brand-bronze" />
                        <h3 className="font-semibold text-brand-dark">{label}</h3>
                      </div>
                      <p className="text-brand-darker text-sm leading-relaxed">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                  <h3 className="font-semibold text-brand-dark mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-brand-bronze" />
                    Recomendações Práticas
                  </h3>
                  <p className="text-brand-darker leading-relaxed">{resultado.combinacao.recomendacoes}</p>
                </div>
              </div>
            )}

            {/* Meses Pessoais */}
            {resultado.mesesPessoais && resultado.mesesPessoais.length > 0 && (
              <div className="luxury-card-strong p-8">
                <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-6">📅 Mapa dos 12 Meses</h2>
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                  {resultado.mesesPessoais.map((mes: MesPessoal, idx: number) => (
                    <div key={idx} className="bg-gradient-to-br from-brand-gold/5 to-brand-bronze/5 rounded-2xl p-6 border-2 border-brand-gold/20 hover:border-brand-gold/40 transition-all hover:shadow-lg">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-brand-gold/20">
                        <div>
                          <h3 className="text-xl font-bold text-brand-dark">{mes.mesNome}</h3>
                          <p className="text-sm text-brand-medium">{mes.energia}</p>
                        </div>
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-bronze to-brand-gold rounded-xl shadow-md">
                          <span className="text-2xl font-bold text-white">{mes.reduzido}</span>
                        </div>
                      </div>
                      <p className="text-sm text-brand-darker leading-relaxed mb-4 italic">{mes.descricao}</p>
                      {mes.areas && mes.areas.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-brand-bronze mb-2">🎯 Áreas Favoráveis</h4>
                          <div className="flex flex-wrap gap-2">
                            {mes.areas.map((area: string, i: number) => (
                              <span key={i} className="text-xs px-3 py-1 bg-brand-gold/20 text-brand-dark rounded-full border border-brand-gold/30">{area}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {mes.acoes && mes.acoes.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-brand-bronze mb-2">✅ Ações Recomendadas</h4>
                          <ul className="space-y-1">
                            {mes.acoes.slice(0, 4).map((acao: string, i: number) => (
                              <li key={i} className="text-xs text-brand-darker flex items-start gap-2">
                                <span className="text-brand-bronze mt-0.5">•</span>
                                <span>{acao}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {mes.evitar && mes.evitar.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-brand-bronze mb-2">⚠️ O que Evitar</h4>
                          <ul className="space-y-1">
                            {mes.evitar.slice(0, 3).map((item: string, i: number) => (
                              <li key={i} className="text-xs text-brand-medium flex items-start gap-2">
                                <span className="text-brand-bronze mt-0.5">•</span>
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
