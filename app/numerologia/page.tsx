'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Sparkles, Calendar, TrendingUp, Heart, Briefcase, DollarSign, Home, Activity, Users, AlertCircle, Brain, Lightbulb, Zap } from 'lucide-react'
import { ANOS_UNIVERSAIS, ANOS_PESSOAIS, COMBINACOES } from '@/lib/numerologia-data'
import { 
  TRES_EUS, 
  TRES_PLANOS, 
  INTERPRETACOES_NUMEROS_TABELA,
  calcularPlanoDominante,
  calcularEuDominante,
  SIGNIFICADOS_METAFISICOS
} from '@/lib/tabela-nascimento-data'
import {
  MesPessoal,
  calcularAnoPessoal,
  calcularAnoUniversal,
  calcularMesesPessoais,
  construirTabelaNascimento,
  formatarDataBrasileira,
  reduzirNumeroForcando
} from '@/lib/numerologia-utils'

export default function NumerologiaPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [dataNascimento, setDataNascimento] = useState('') // Formato YYYY-MM-DD do banco
  const [anoAnalise, setAnoAnalise] = useState(new Date().getFullYear())
  const [mostrarMestres, setMostrarMestres] = useState(true)
  const [resultado, setResultado] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const [erroTela, setErroTela] = useState('')

  // Buscar data de nascimento da sessão do usuário
  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'authenticated' && session?.user) {
      const userData = session.user as any
      if (userData.dataNascimento) {
        setDataNascimento(userData.dataNascimento)
      }
    }
    setCarregando(false)
  }, [status, session])

  function handleCalcular() {
    setErroTela('')
    if (!dataNascimento) {
      setErroTela('Data de nascimento não encontrada. Entre em contato com o administrador para cadastrar sua data de nascimento.')
      return
    }

    console.log('📊 Iniciando cálculo...')
    console.log('Data de nascimento:', dataNascimento)
    console.log('Ano de análise:', anoAnalise)

    // Converter data para formato DD/MM/YYYY para os cálculos
    const dataFormatada = formatarDataBrasileira(dataNascimento)
    console.log('Data formatada para cálculo:', dataFormatada)

    const anoUniversal = calcularAnoUniversal(anoAnalise)
    const anoPessoalObj = calcularAnoPessoal(dataFormatada, anoAnalise)
    
    if (!anoPessoalObj) return

    let numeroFinal = anoPessoalObj.reduzido
    if ((anoPessoalObj.reduzido === 11 || anoPessoalObj.reduzido === 22) && !mostrarMestres) {
      numeroFinal = reduzirNumeroForcando(anoPessoalObj.somaTotal)
    }

    const interpretacaoNumero = ANOS_PESSOAIS[numeroFinal]
    const analiseUniversal = ANOS_UNIVERSAIS[anoUniversal.reduzido]
    const chaveCombinacao = `${anoUniversal.reduzido}-${numeroFinal}`
    const combinacao = COMBINACOES[chaveCombinacao]

    const anoPessoalNumerico = numeroFinal
    const mesesPessoais = calcularMesesPessoais(anoPessoalNumerico, anoAnalise)
    
    // Calcular Tabela de Nascimento de Pitágoras (usar data formatada)
    const tabelaNascimento = construirTabelaNascimento(dataFormatada)
    const planoDominante = calcularPlanoDominante(tabelaNascimento)
    const euDominante = calcularEuDominante(tabelaNascimento)

    setResultado({ 
      anoUniversal, 
      anoPessoalObj, 
      interpretacaoNumero, 
      analiseUniversal,
      combinacao,
      mesesPessoais,
      tabelaNascimento,
      planoDominante,
      euDominante
    })

    setTimeout(() => {
      const el = document.getElementById('resultado-numerologia')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="luxury-shell py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-bronze to-brand-gold rounded-full mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="font-tan-mon-cheri text-5xl md:text-6xl text-brand-dark mb-4">
            Análise do Ano Pessoal
          </h1>
          
          <p className="text-lg text-brand-darker/80 leading-relaxed max-w-3xl mx-auto">
            Descubra a energia numerológica que rege seu ano pessoal com base na sua data de nascimento cadastrada.
            Receba uma análise completa com orientações para trabalho, amor, finanças e espiritualidade.
          </p>
        </div>

        {/* Formulário */}
        <div className="luxury-card-strong p-8 mb-8">
          {carregando ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-bronze"></div>
              <p className="mt-4 text-brand-darker">Carregando...</p>
            </div>
          ) : !dataNascimento ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">
                Data de Nascimento Não Cadastrada
              </h3>
              <div className="text-brand-darker mb-6 max-w-2xl mx-auto space-y-4">
                <p className="font-semibold">
                  Para acessar a análise numerológica, você precisa ter uma data de nascimento cadastrada.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                  <p className="font-semibold text-blue-900 mb-2">💡 Solução Rápida:</p>
                  <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                    <li><strong>Fazer Logout</strong> da sua conta</li>
                    <li><strong>Fazer Login</strong> novamente</li>
                    <li><strong>Voltar</strong> para Numerologia</li>
                  </ol>
                  <p className="text-xs text-blue-700 mt-3">
                    ⚠️ Se já tem data cadastrada, precisa fazer logout/login para atualizar a sessão.
                  </p>
                </div>

                <p className="text-sm">
                  Se ainda não funcionar, peça ao administrador para cadastrar/verificar sua data de nascimento.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 border-2 border-brand-gold text-brand-dark font-semibold rounded-xl hover:bg-brand-gold/10 transition-all"
                >
                  Voltar ao Início
                </button>
                <button
                  onClick={() => {
                    // Fazer logout
                    fetch('/api/auth/signout', { method: 'POST' })
                      .then(() => router.push('/login'))
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-brand-bronze to-brand-gold text-white font-semibold rounded-xl hover:from-brand-dark hover:to-brand-medium transition-all"
                >
                  Fazer Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              {erroTela && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                  {erroTela}
                </div>
              )}
              <div className="mb-6 p-4 bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-xl border border-brand-gold/30">
                <div className="flex items-center gap-2 text-sm text-brand-dark mb-1">
                  <Calendar className="w-4 h-4 text-brand-bronze" />
                  <span className="font-semibold">Data de Nascimento Cadastrada:</span>
                </div>
                <div className="text-2xl font-bold text-brand-dark">
                  {formatarDataBrasileira(dataNascimento)}
                </div>
                <p className="text-xs text-brand-medium mt-2">
                  Esta data foi coletada do seu cadastro. Para alterá-la, entre em contato com o administrador.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-brand-dark mb-2 gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-bronze" />
                    Ano para Análise
                  </label>
                  <input
                    type="number"
                    value={anoAnalise}
                    onChange={(e) => setAnoAnalise(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-brand-gold/50 rounded-xl focus:ring-2 focus:ring-brand-bronze focus:border-brand-gold transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-brand-dark mb-2 gap-2">
                    <Sparkles className="w-4 h-4 text-brand-bronze" />
                    Números Mestres
                  </label>
                  <div className="flex items-center h-[52px] px-4 bg-brand-gold/5 rounded-xl border-2 border-brand-gold/30">
                    <input
                      type="checkbox"
                      checked={mostrarMestres}
                      onChange={(e) => setMostrarMestres(e.target.checked)}
                      className="w-5 h-5 text-brand-bronze focus:ring-brand-gold rounded"
                    />
                    <span className="ml-2 text-sm text-brand-dark">Mostrar 11 e 22</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCalcular}
                  className="flex-1 bg-gradient-to-r from-brand-bronze to-brand-gold hover:from-brand-dark hover:to-brand-medium text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-5 h-5" />
                  Calcular Ano Pessoal
                </button>
                
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-4 border-2 border-brand-gold/50 text-brand-dark font-semibold rounded-xl hover:bg-brand-gold/10 transition-all"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Resultado */}
        {resultado && (
          <div id="resultado-numerologia" className="space-y-6">
            {/* Resumo Rápido */}
            <div className="luxury-card-strong p-8">
              <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-brand-gold" />
                Resumo Rápido
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                  <p className="text-sm text-brand-medium mb-2">Ano Universal ({resultado.anoUniversal.ano})</p>
                  <p className="text-5xl font-bold text-brand-dark mb-2">{resultado.anoUniversal.reduzido}</p>
                  <p className="text-sm text-brand-medium">Passos: {resultado.anoUniversal.passos}</p>
                </div>
                
                <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                  <p className="text-sm text-brand-medium mb-2">Seu Ano Pessoal</p>
                  <p className="text-5xl font-bold text-brand-bronze mb-2">{resultado.anoPessoalObj.reduzido}</p>
                  <p className="text-sm text-brand-medium">Passos: {resultado.anoPessoalObj.passos}</p>
                </div>
              </div>
            </div>

            {/* Interpretação */}
            {resultado.interpretacaoNumero && (
              <div className="luxury-card-strong p-8">
                <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-4">
                  {resultado.interpretacaoNumero.titulo}
                </h2>
                
                <p className="text-brand-darker text-lg mb-6 leading-relaxed">
                  {resultado.interpretacaoNumero.descricao}
                </p>
                
                <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                  <pre className="text-brand-darker leading-relaxed whitespace-pre-line font-sans">
                    {resultado.interpretacaoNumero.detalhado}
                  </pre>
                </div>

                {/* Temas Principais */}
                {resultado.interpretacaoNumero.temas && (
                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="bg-brand-gold/5 rounded-xl p-4">
                      <h3 className="font-semibold text-brand-dark mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Carreira
                      </h3>
                      <p className="text-sm text-brand-darker">{resultado.interpretacaoNumero.temas.carreira}</p>
                    </div>
                    <div className="bg-brand-gold/5 rounded-xl p-4">
                      <h3 className="font-semibold text-brand-dark mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Relacionamentos
                      </h3>
                      <p className="text-sm text-brand-darker">{resultado.interpretacaoNumero.temas.relacionamentos}</p>
                    </div>
                    <div className="bg-brand-gold/5 rounded-xl p-4">
                      <h3 className="font-semibold text-brand-dark mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Finanças
                      </h3>
                      <p className="text-sm text-brand-darker">{resultado.interpretacaoNumero.temas.financas}</p>
                    </div>
                    <div className="bg-brand-gold/5 rounded-xl p-4">
                      <h3 className="font-semibold text-brand-dark mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Saúde
                      </h3>
                      <p className="text-sm text-brand-darker">{resultado.interpretacaoNumero.temas.saude}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tabela de Nascimento de Pitágoras */}
            {resultado.tabelaNascimento && (
              <div className="luxury-card-strong p-8">
                <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-4 flex items-center gap-3">
                  <Brain className="w-8 h-8 text-brand-gold" />
                  Tabela de Nascimento de Pitágoras
                </h2>
                
                <p className="text-brand-darker mb-6 leading-relaxed">
                  A Tabela de Nascimento revela a fórmula das suas forças e fraquezas, mostrando os três planos da sua expressão humana.
                </p>

                {/* Visualização da Tabela 3x3 */}
                <div className="mb-8">
                  <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                    {/* Linha 3 (Plano Mental: 3, 6, 9) */}
                    {[3, 6, 9].map(num => (
                      <div key={num} className="aspect-square border-2 border-brand-gold/40 rounded-xl bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 flex flex-col items-center justify-center p-4">
                        <div className="text-3xl font-bold text-brand-dark mb-1">{num}</div>
                        {resultado.tabelaNascimento[num] > 0 && (
                          <div className="flex gap-1">
                            {Array.from({ length: resultado.tabelaNascimento[num] }).map((_, idx) => (
                              <div key={idx} className="w-2 h-2 rounded-full bg-brand-bronze"></div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Linha 2 (Plano da Alma: 2, 5, 8) */}
                    {[2, 5, 8].map(num => (
                      <div key={num} className="aspect-square border-2 border-brand-gold/40 rounded-xl bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 flex flex-col items-center justify-center p-4">
                        <div className="text-3xl font-bold text-brand-dark mb-1">{num}</div>
                        {resultado.tabelaNascimento[num] > 0 && (
                          <div className="flex gap-1">
                            {Array.from({ length: resultado.tabelaNascimento[num] }).map((_, idx) => (
                              <div key={idx} className="w-2 h-2 rounded-full bg-brand-bronze"></div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Linha 1 (Plano Físico: 1, 4, 7) */}
                    {[1, 4, 7].map(num => (
                      <div key={num} className="aspect-square border-2 border-brand-gold/40 rounded-xl bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 flex flex-col items-center justify-center p-4">
                        <div className="text-3xl font-bold text-brand-dark mb-1">{num}</div>
                        {resultado.tabelaNascimento[num] > 0 && (
                          <div className="flex gap-1">
                            {Array.from({ length: resultado.tabelaNascimento[num] }).map((_, idx) => (
                              <div key={idx} className="w-2 h-2 rounded-full bg-brand-bronze"></div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Legenda dos Planos */}
                  <div className="mt-6 grid md:grid-cols-3 gap-4 text-center text-sm">
                    <div className="p-3 bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-xl border border-brand-gold/30">
                      <div className="font-semibold text-brand-dark mb-1">Plano Mental (3, 6, 9)</div>
                      <div className="text-xs text-brand-darker">Memória, Raciocínio, Criatividade</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-xl border border-brand-gold/30">
                      <div className="font-semibold text-brand-dark mb-1">Plano da Alma (2, 5, 8)</div>
                      <div className="text-xs text-brand-darker">Intuição, Amor, Sabedoria</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-xl border border-brand-gold/30">
                      <div className="font-semibold text-brand-dark mb-1">Plano Físico (1, 4, 7)</div>
                      <div className="text-xs text-brand-darker">Expressão, Organização, Ação</div>
                    </div>
                  </div>
                </div>

                {/* Análise do Plano e Eu Dominante */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                    <h3 className="font-semibold text-brand-dark mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-brand-bronze" />
                      Seu Plano Dominante
                    </h3>
                    <div className="text-2xl font-bold text-brand-dark mb-2">
                      {TRES_PLANOS[resultado.planoDominante as keyof typeof TRES_PLANOS].titulo}
                    </div>
                    <p className="text-sm text-brand-darker mb-3">
                      Posição: {TRES_PLANOS[resultado.planoDominante as keyof typeof TRES_PLANOS].posicao}
                    </p>
                    <div className="space-y-1">
                      {TRES_PLANOS[resultado.planoDominante as keyof typeof TRES_PLANOS].aspectos.slice(0, 4).map((aspeto: string, idx: number) => (
                        <div key={idx} className="text-sm text-brand-darker flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-brand-bronze"></span>
                          {aspeto}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                    <h3 className="font-semibold text-brand-dark mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-brand-bronze" />
                      Seu Eu Dominante
                    </h3>
                    <div className="text-2xl font-bold text-brand-dark mb-2">
                      {TRES_EUS[resultado.euDominante as keyof typeof TRES_EUS].titulo}
                    </div>
                    <p className="text-sm text-brand-darker mb-3">
                      {TRES_EUS[resultado.euDominante as keyof typeof TRES_EUS].descricao}
                    </p>
                    <div className="bg-white/50 rounded-lg p-3 mt-3">
                      <div className="text-xs font-semibold text-brand-dark mb-2">Quando Equilibrado:</div>
                      <div className="text-xs text-brand-darker">
                        {TRES_EUS[resultado.euDominante as keyof typeof TRES_EUS].equilibrado}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Análise Detalhada dos Números Presentes */}
                <div>
                  <h3 className="font-semibold text-brand-dark mb-4 text-lg">Análise Detalhada dos Seus Números</h3>
                  <div className="space-y-4">
                    {Object.entries(resultado.tabelaNascimento)
                      .filter(([_, count]) => (count as number) > 0)
                      .map(([numStr, count]) => {
                        const num = parseInt(numStr)
                        const countNum = count as number
                        const interpretacao = INTERPRETACOES_NUMEROS_TABELA[num]
                        const ocorrencia = interpretacao?.ocorrencias[countNum] || interpretacao?.ocorrencias[Math.min(countNum, 5)]
                        
                        if (!ocorrencia) return null
                        
                        return (
                          <div key={num} className="bg-brand-gold/5 rounded-xl p-4 border border-brand-gold/30">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="text-3xl font-bold text-brand-bronze">{num}</div>
                              <div className="flex-1">
                                <div className="font-semibold text-brand-dark mb-1">
                                  {ocorrencia.interpretacao}
                                </div>
                                <div className="text-sm text-brand-darker leading-relaxed">
                                  {ocorrencia.descricao}
                                </div>
                              </div>
                            </div>
                            
                            {ocorrencia.pontoForte && (
                              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="text-xs font-semibold text-green-800 mb-1">✓ Ponto Forte:</div>
                                <div className="text-xs text-green-700">{ocorrencia.pontoForte}</div>
                              </div>
                            )}
                            
                            {ocorrencia.alerta && (
                              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <div className="text-xs font-semibold text-amber-800 mb-1">⚠ Alerta:</div>
                                <div className="text-xs text-amber-700">{ocorrencia.alerta}</div>
                              </div>
                            )}
                            
                            {ocorrencia.recomendacao && (
                              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="text-xs font-semibold text-blue-800 mb-1">💡 Recomendação:</div>
                                <div className="text-xs text-blue-700">{ocorrencia.recomendacao}</div>
                              </div>
                            )}
                            
                            {ocorrencia.desafios && ocorrencia.desafios.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {ocorrencia.desafios.map((desafio: string, idx: number) => (
                                  <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                    {desafio}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Análise do Ano Universal */}
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
                  
                  <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                    <h3 className="font-semibold text-brand-dark mb-2">Como Aproveitar</h3>
                    <p className="text-brand-darker leading-relaxed">{resultado.analiseUniversal.comoAproveitar}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Combinação Ano Universal x Ano Pessoal */}
            {resultado.combinacao && (
              <div className="luxury-card-strong p-8">
                <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-4 flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-brand-bronze" />
                  Combinação de Energias
                </h2>
                
                <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30 mb-6">
                  <p className="text-lg font-semibold text-brand-dark mb-3">{resultado.combinacao.tema}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-brand-gold/5 rounded-xl p-6 border border-brand-gold/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Briefcase className="w-6 h-6 text-brand-bronze" />
                      <h3 className="font-semibold text-brand-dark text-lg">Carreira</h3>
                    </div>
                    <p className="text-brand-darker leading-relaxed">{resultado.combinacao.carreira}</p>
                  </div>
                  
                  <div className="bg-brand-gold/5 rounded-xl p-6 border border-brand-gold/30">
                    <div className="flex items-center gap-3 mb-4">
                      <DollarSign className="w-6 h-6 text-brand-bronze" />
                      <h3 className="font-semibold text-brand-dark text-lg">Finanças</h3>
                    </div>
                    <p className="text-brand-darker leading-relaxed">{resultado.combinacao.financas}</p>
                  </div>
                  
                  <div className="bg-brand-gold/5 rounded-xl p-6 border border-brand-gold/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="w-6 h-6 text-brand-bronze" />
                      <h3 className="font-semibold text-brand-dark text-lg">Relações</h3>
                    </div>
                    <p className="text-brand-darker leading-relaxed">{resultado.combinacao.relacoes}</p>
                  </div>
                  
                  <div className="bg-brand-gold/5 rounded-xl p-6 border border-brand-gold/30">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-brand-bronze" />
                      <h3 className="font-semibold text-brand-dark text-lg">Desafios</h3>
                    </div>
                    <p className="text-brand-darker leading-relaxed">{resultado.combinacao.desafios}</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                  <h3 className="font-semibold text-brand-dark mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-bronze" />
                    Recomendações Práticas
                  </h3>
                  <p className="text-brand-darker leading-relaxed">{resultado.combinacao.recomendacoes}</p>
                </div>
              </div>
            )}

            {/* Análise por Áreas */}
            <div className="luxury-card-strong p-8">
              <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-6">
                Orientações Detalhadas por Área da Vida
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-brand-gold/5 rounded-xl p-6 border border-brand-gold/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="w-6 h-6 text-brand-bronze" />
                    <h3 className="font-semibold text-brand-dark text-lg">Trabalho & Carreira</h3>
                  </div>
                  <p className="text-brand-darker leading-relaxed">{resultado.interpretacaoNumero.temas.carreira}</p>
                </div>
                
                <div className="bg-brand-gold/5 rounded-xl p-6 border border-brand-gold/30">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-6 h-6 text-brand-bronze" />
                    <h3 className="font-semibold text-brand-dark text-lg">Finanças</h3>
                  </div>
                  <p className="text-brand-darker leading-relaxed">{resultado.interpretacaoNumero.temas.financas}</p>
                </div>
                
                <div className="bg-brand-gold/5 rounded-xl p-6 border border-brand-gold/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-brand-bronze" />
                    <h3 className="font-semibold text-brand-dark text-lg">Relacionamentos</h3>
                  </div>
                  <p className="text-brand-darker leading-relaxed">{resultado.interpretacaoNumero.temas.relacionamentos}</p>
                </div>
                
                <div className="bg-brand-gold/5 rounded-xl p-6 border border-brand-gold/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-6 h-6 text-brand-bronze" />
                    <h3 className="font-semibold text-brand-dark text-lg">Saúde</h3>
                  </div>
                  <p className="text-brand-darker leading-relaxed">{resultado.interpretacaoNumero.temas.saude}</p>
                </div>
              </div>
              
              {/* Desafios e Palavras-Chave */}
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                  <h3 className="font-semibold text-brand-dark mb-3">Desafios a Superar</h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.interpretacaoNumero.desafios.map((desafio: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-brand-gold/20 text-brand-dark text-sm rounded-full border border-brand-gold/40">
                        {desafio}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                  <h3 className="font-semibold text-brand-dark mb-3">Palavras-Chave do Ano</h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.interpretacaoNumero.palavrasChave.map((palavra: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-brand-bronze/20 text-brand-dark text-sm rounded-full border border-brand-bronze/40">
                        {palavra}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Meses Pessoais */}
            <div className="luxury-card-strong p-8">
              <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-4">
                📅 Mapa dos 12 Meses
              </h2>
              
              <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-xl p-6 mb-8 border border-brand-gold/30">
                <p className="text-brand-darker leading-relaxed mb-3">
                  <strong>Cada mês do ano recebe uma energia numerológica específica.</strong> Use este mapa detalhado para planejar suas ações mensais, entender os momentos mais favoráveis para cada tipo de atividade e navegar o ano com sabedoria.
                </p>
                <p className="text-sm text-brand-medium">
                  ✨ A energia do mês combina-se com sua energia pessoal, criando oportunidades únicas em cada período.
                </p>
              </div>
              
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {resultado.mesesPessoais.map((mes: MesPessoal, idx: number) => (
                  <div key={idx} className="bg-gradient-to-br from-brand-gold/5 to-brand-bronze/5 rounded-2xl p-6 border-2 border-brand-gold/20 hover:border-brand-gold/40 transition-all hover:shadow-lg">
                    {/* Cabeçalho do Mês */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-brand-gold/20">
                      <div>
                        <h3 className="text-xl font-bold text-brand-dark">{mes.mesNome}</h3>
                        <p className="text-sm text-brand-medium">{mes.energia}</p>
                      </div>
                      <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-bronze to-brand-gold rounded-xl shadow-md">
                        <span className="text-2xl font-bold text-white">{mes.reduzido}</span>
                      </div>
                    </div>
                    
                    {/* Descrição */}
                    <p className="text-sm text-brand-darker leading-relaxed mb-4 italic">
                      {mes.descricao}
                    </p>
                    
                    {/* Áreas Favoráveis */}
                    {mes.areas && mes.areas.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-brand-bronze mb-2 flex items-center gap-2">
                          <span className="text-lg">🎯</span>
                          Áreas Favoráveis
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {mes.areas.map((area, i) => (
                            <span key={i} className="text-xs px-3 py-1 bg-brand-gold/20 text-brand-dark rounded-full border border-brand-gold/30">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Ações Recomendadas */}
                    {mes.acoes && mes.acoes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-brand-bronze mb-2 flex items-center gap-2">
                          <span className="text-lg">✅</span>
                          Ações Recomendadas
                        </h4>
                        <ul className="space-y-1.5">
                          {mes.acoes.slice(0, 4).map((acao, i) => (
                            <li key={i} className="text-xs text-brand-darker flex items-start gap-2">
                              <span className="text-brand-bronze mt-0.5">•</span>
                              <span>{acao}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* O que Evitar */}
                    {mes.evitar && mes.evitar.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-brand-bronze mb-2 flex items-center gap-2">
                          <span className="text-lg">⚠️</span>
                          O que Evitar
                        </h4>
                        <ul className="space-y-1.5">
                          {mes.evitar.slice(0, 3).map((item, i) => (
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
              
              {/* Dica Final */}
              <div className="mt-8 bg-brand-gold/10 rounded-xl p-6 border border-brand-gold/30">
                <h4 className="text-lg font-semibold text-brand-dark mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-brand-bronze" />
                  💡 Como Usar Este Mapa
                </h4>
                <div className="space-y-2 text-sm text-brand-darker">
                  <p>
                    <strong>1. Planejamento Mensal:</strong> No início de cada mês, revise a energia correspondente e ajuste suas prioridades.
                  </p>
                  <p>
                    <strong>2. Ações Estratégicas:</strong> Agende atividades importantes nos meses mais favoráveis para aquele tipo de ação.
                  </p>
                  <p>
                    <strong>3. Autocuidado:</strong> Nos meses de energia mais desafiadora, reforce práticas de autocuidado e paciência.
                  </p>
                  <p>
                    <strong>4. Flexibilidade:</strong> Use como guia, não como regra rígida. Sua intuição e circunstâncias também importam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
