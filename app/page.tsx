'use client'

import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Sparkles, Target, Calendar, ArrowRight, Heart, TrendingUp, Sun, LogOut, Lock, Users, Compass, Brain, Mountain } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Avaliacao {
  id: number
  dataAvaliacao: string
  plenitudeFelicidade: number
  espiritualidade: number
  saudeDisposicao: number
  desenvolvimentoIntelectual: number
  equilibrioEmocional: number
  familia: number
  desenvolvimentoAmoroso: number
  vidaSocial: number
  realizacaoProposito: number
  recursosFinanceiros: number
  contribuicaoSocial: number
  criatividadeHobbyDiversao: number
  usuario?: {
    id: number
    nome: string
    username: string
  }
}

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [ultimaAvaliacao, setUltimaAvaliacao] = useState<Avaliacao | null>(null)
  const [carregando, setCarregando] = useState(true)

  // Redirecionar para Roda da Vida no primeiro acesso
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const primeiroAcesso = (session.user as any).primeiroAcesso
      if (primeiroAcesso) {
        router.push('/avaliacao?primeiro=true')
      }
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'loading') return
    
    async function buscarUltimaAvaliacao() {
      try {
        const response = await fetch('/api/avaliacoes')
        if (response.ok) {
          const avaliacoes = await response.json()
          if (avaliacoes && avaliacoes.length > 0) {
            setUltimaAvaliacao(avaliacoes[avaliacoes.length - 1])
          }
        }
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error)
      } finally {
        setCarregando(false)
      }
    }
    buscarUltimaAvaliacao()
  }, [status])

  function calcularMedia(avaliacao: Avaliacao): number {
    const valores = [
      avaliacao.plenitudeFelicidade,
      avaliacao.espiritualidade,
      avaliacao.saudeDisposicao,
      avaliacao.desenvolvimentoIntelectual,
      avaliacao.equilibrioEmocional,
      avaliacao.familia,
      avaliacao.desenvolvimentoAmoroso,
      avaliacao.vidaSocial,
      avaliacao.realizacaoProposito,
      avaliacao.recursosFinanceiros,
      avaliacao.contribuicaoSocial,
      avaliacao.criatividadeHobbyDiversao,
    ]
    return valores.reduce((a, b) => a + b, 0) / valores.length
  }

  function obterPrimeiroNome(nomeCompleto: string | undefined | null): string {
    if (!nomeCompleto) return 'Usuário'
    return nomeCompleto.split(' ')[0]
  }

  function gerarResumoMomento(media: number): { mensagem: string; icone: any; cor: string } {
    if (media >= 8.5) {
      return {
        mensagem: 'Você está em um momento de grande florescimento! Suas áreas da vida estão vibrando em harmonia.',
        icone: Sun,
        cor: 'from-yellow-400 to-orange-400'
      }
    } else if (media >= 7) {
      return {
        mensagem: 'Você está em um bom caminho! Há equilíbrio e crescimento acontecendo na sua jornada.',
        icone: TrendingUp,
        cor: 'from-green-400 to-emerald-400'
      }
    } else if (media >= 5.5) {
      return {
        mensagem: 'Você está em um momento de construção. Há áreas que pedem mais atenção e cuidado.',
        icone: Heart,
        cor: 'from-blue-400 to-cyan-400'
      }
    } else {
      return {
        mensagem: 'É tempo de voltar-se para si com gentileza. Seu bem-estar merece atenção e cuidado especial.',
        icone: Heart,
        cor: 'from-purple-400 to-pink-400'
      }
    }
  }

  function gerarDicasPersonalizadas(nomeArea: string, pontuacao: number): string[] {
    const dicasPorArea: Record<string, string[]> = {
      'Plenitude e Felicidade': [
        'Dedique 10 minutos diários para atividades que genuinamente te trazem alegria',
        'Pratique gratidão: anote 3 coisas boas que aconteceram hoje',
        'Estabeleça pequenas metas alcançáveis para celebrar vitórias diárias'
      ],
      'Espiritualidade': [
        'Experimente uma prática meditativa diária, mesmo que por 5 minutos',
        'Conecte-se com a natureza regularmente para nutrir sua essência',
        'Explore práticas contemplativas que ressoem com você'
      ],
      'Saúde e Disposição': [
        'Estabeleça uma rotina de sono regular - seu corpo agradece',
        'Inclua movimento no seu dia: uma caminhada já faz diferença',
        'Hidrate-se adequadamente e escolha alimentos que nutrem seu corpo'
      ],
      'Desenvolvimento Intelectual': [
        'Reserve tempo para aprender algo novo que desperte sua curiosidade',
        'Leia por prazer - escolha temas que ampliem sua visão de mundo',
        'Participe de conversas enriquecedoras com pessoas inspiradoras'
      ],
      'Equilíbrio Emocional': [
        'Pratique o autocuidado emocional: permita-se sentir sem julgamento',
        'Considere journaling para processar seus sentimentos',
        'Busque apoio quando necessário - você não precisa carregar tudo sozinho'
      ],
      'Família': [
        'Crie momentos de qualidade, mesmo que breves, com quem você ama',
        'Pratique a escuta ativa nas conversas familiares',
        'Estabeleça rituais que fortaleçam os vínculos afetivos'
      ],
      'Desenvolvimento Amoroso': [
        'Cultive o amor-próprio primeiro - você merece seu próprio carinho',
        'Comunique suas necessidades e desejos com clareza e gentileza',
        'Invista em momentos de conexão genuína com seu parceiro(a)'
      ],
      'Vida Social': [
        'Nutra relacionamentos que te fazem sentir genuinamente bem',
        'Diga sim a convites que ressoem com você, mesmo fora da zona de conforto',
        'Seja presente nas conexões que importam para você'
      ],
      'Realização e Propósito': [
        'Reflita sobre o que te faz sentir vivo(a) e realizado(a)',
        'Dê pequenos passos em direção aos seus sonhos todos os dias',
        'Celebre suas conquistas, por menores que pareçam'
      ],
      'Recursos Financeiros': [
        'Crie um plano financeiro simples e realista para seus objetivos',
        'Desenvolva consciência sobre seus padrões de consumo',
        'Invista em educação financeira para tomar decisões mais assertivas'
      ],
      'Contribuição Social': [
        'Encontre causas que ressoem com seus valores e envolva-se',
        'Comece pequeno: um ato de gentileza já faz diferença',
        'Use seus talentos para impactar positivamente sua comunidade'
      ],
      'Criatividade e Diversão': [
        'Reserve tempo sagrado para atividades que te divertem',
        'Experimente algo novo que estimule sua criatividade',
        'Permita-se brincar e ser espontâneo - a vida pede leveza'
      ]
    }
    
    return dicasPorArea[nomeArea] || [
      'Dedique atenção especial a esta área da sua vida',
      'Pequenos passos consistentes levam a grandes transformações',
      'Seja gentil consigo mesmo neste processo de crescimento'
    ]
  }

  const ferramentas = [
    {
      titulo: 'Roda da Vida',
      descricao: 'Avalie o equilíbrio entre as diferentes áreas da sua vida e descubra onde você já está florescendo.',
      icone: Target,
      rota: '/avaliacao',
      tempo: '5-7 minutos',
      cor: 'from-brand-bronze to-brand-gold',
      bloqueado: false,
    },
    {
      titulo: 'Análise do Ano Pessoal',
      descricao: 'Descubra a energia numerológica que rege seu ano com orientações para todas as áreas da vida.',
      icone: Calendar,
      rota: '/numerologia',
      tempo: '3-5 minutos',
      cor: 'from-brand-gold to-brand-bronze',
      bloqueado: false,
    },
    {
      titulo: 'Análise de Traços de Caráter',
      descricao: 'Explore os padrões de comportamento que moldam sua personalidade e influenciam suas escolhas.',
      icone: Brain,
      rota: '#',
      tempo: '10-12 minutos',
      cor: 'from-brand-gold to-brand-bronze',
      bloqueado: true,
    },
    {
      titulo: 'Meditações para sua Vida',
      descricao: 'Práticas guiadas de meditação personalizadas para seu momento atual e áreas de desenvolvimento.',
      icone: Mountain,
      rota: '#',
      tempo: '15-20 minutos',
      cor: 'from-brand-bronze to-brand-gold',
      bloqueado: true,
    },
    {
      titulo: 'Trilha do Desenvolvimento',
      descricao: 'Cursos e conteúdos estruturados para aprofundar sua jornada de autoconhecimento e crescimento.',
      icone: Compass,
      rota: '#',
      tempo: 'Variável',
      cor: 'from-brand-gold to-brand-bronze',
      bloqueado: true,
    },
    {
      titulo: 'Nossa Comunidade',
      descricao: 'Conecte-se com outras pessoas em jornadas de transformação, compartilhe experiências e cresça junto.',
      icone: Users,
      rota: '#',
      tempo: 'Livre',
      cor: 'from-brand-bronze to-brand-gold',
      bloqueado: true,
    },
  ]
  const ferramentasAtivas = ferramentas.filter((f) => !f.bloqueado)
  const ferramentasEmBreve = ferramentas.filter((f) => f.bloqueado)

  // Loading state
  if (status === 'loading' || carregando) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-bronze border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-medium">Carregando sua área...</p>
        </div>
      </div>
    )
  }

  const nomeUsuario = session?.user?.name || 'Usuário'
  const primeiroNomeUsuario = nomeUsuario.split(' ')[0]

  return (
    <div className="luxury-shell py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header com info do usuário - Melhorado */}
        <div className="mb-8">
          <div className="luxury-card-strong p-6 md:p-8">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex-1">
                <p className="text-sm text-brand-medium mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Bem-vindo(a) de volta
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3">{nomeUsuario}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-brand-darker/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-bronze" />
                    <span>
                      {new Date().toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  {ultimaAvaliacao && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-brand-bronze" />
                      <span>
                        Última avaliação: {new Date(ultimaAvaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/historico')}
                  className="flex items-center gap-2 px-4 py-2 text-brand-bronze hover:text-white bg-transparent hover:bg-brand-bronze border-2 border-brand-bronze rounded-xl transition-all"
                  title="Ver histórico"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden md:inline">Histórico</span>
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2 px-4 py-2 text-brand-medium hover:text-white bg-transparent hover:bg-brand-bronze/80 border-2 border-brand-medium rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Header Principal */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-bronze to-brand-gold rounded-full mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="font-tan-mon-cheri text-6xl md:text-7xl text-brand-dark mb-3">
            Da Sombra à Luz
          </h1>
          
          <p className="text-lg text-brand-darker/70 leading-relaxed max-w-2xl mx-auto mb-8">
            Seu espaço de autoconhecimento e transformação
          </p>
          
          {/* Card de Boas-Vindas Personalizado */}
          {!carregando && ultimaAvaliacao ? (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="luxury-card-strong p-8 animate-fadeIn">
                {(() => {
                  const nomeParaExibir = ultimaAvaliacao.usuario?.nome || session?.user?.name || 'Usuário'
                  const primeiroNome = obterPrimeiroNome(nomeParaExibir)
                  const media = calcularMedia(ultimaAvaliacao)
                  const resumo = gerarResumoMomento(media)
                  const IconeResumo = resumo.icone
                  
                  return (
                    <>
                      {/* Saudação */}
                      <div className="mb-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-tan-mon-cheri text-brand-dark mb-3">
                          Olá, {primeiroNome}!
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-brand-medium">
                          <Sparkles className="w-5 h-5 text-brand-gold" />
                          <p>Que bom ter você de volta</p>
                          <Sparkles className="w-5 h-5 text-brand-gold" />
                        </div>
                      </div>

                      {/* Roda da Vida e Insights */}
                      <div className="grid md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-brand-gold/20">
                        {/* Roda da Vida Central */}
                        <div className="text-center">
                          <p className="text-sm text-brand-medium mb-4 font-semibold">Sua Roda da Vida</p>
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="relative">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-bronze to-brand-gold flex items-center justify-center shadow-xl">
                                <span className="text-3xl font-bold text-white">
                                  {media.toFixed(1)}
                                </span>
                              </div>
                              <div className={`absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br ${resumo.cor} rounded-full flex items-center justify-center shadow-md`}>
                                <IconeResumo className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-brand-medium mb-2">de 10 pontos</p>
                          <p className="text-sm font-semibold text-brand-dark">
                            {media >= 8 ? 'Excelente!' : media >= 6.5 ? 'Muito Bom' : media >= 5 ? 'Bom' : 'Em Construção'}
                          </p>
                          <p className="text-xs text-brand-medium mt-3">
                            {new Date(ultimaAvaliacao.dataAvaliacao).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>

                        {/* Área de Destaque */}
                        <div className="text-center">
                          <p className="text-sm text-brand-medium mb-4 font-semibold">Seu Maior Destaque</p>
                          <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-yellow-500 flex items-center justify-center shadow-md">
                              <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          {(() => {
                            const areas = {
                              'Plenitude e Felicidade': ultimaAvaliacao.plenitudeFelicidade,
                              'Espiritualidade': ultimaAvaliacao.espiritualidade,
                              'Saúde e Disposição': ultimaAvaliacao.saudeDisposicao,
                              'Desenvolvimento Intelectual': ultimaAvaliacao.desenvolvimentoIntelectual,
                              'Equilíbrio Emocional': ultimaAvaliacao.equilibrioEmocional,
                              'Família': ultimaAvaliacao.familia,
                              'Desenvolvimento Amoroso': ultimaAvaliacao.desenvolvimentoAmoroso,
                              'Vida Social': ultimaAvaliacao.vidaSocial,
                              'Realização e Propósito': ultimaAvaliacao.realizacaoProposito,
                              'Recursos Financeiros': ultimaAvaliacao.recursosFinanceiros,
                              'Contribuição Social': ultimaAvaliacao.contribuicaoSocial,
                              'Criatividade e Diversão': ultimaAvaliacao.criatividadeHobbyDiversao,
                            }
                            const maiorArea = Object.entries(areas).reduce((a, b) => a[1] > b[1] ? a : b)
                            return (
                              <>
                                <p className="text-xl font-bold text-brand-dark mb-1">{maiorArea[1]}/10</p>
                                <p className="text-xs text-brand-darker font-medium px-2">{maiorArea[0]}</p>
                              </>
                            )
                          })()}
                        </div>

                        {/* Área de Atenção */}
                        <div className="text-center">
                          <p className="text-sm text-brand-medium mb-4 font-semibold">Ponto de Atenção</p>
                          <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-bronze to-amber-600 flex items-center justify-center shadow-md">
                              <Target className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          {(() => {
                            const areas = {
                              'Plenitude e Felicidade': ultimaAvaliacao.plenitudeFelicidade,
                              'Espiritualidade': ultimaAvaliacao.espiritualidade,
                              'Saúde e Disposição': ultimaAvaliacao.saudeDisposicao,
                              'Desenvolvimento Intelectual': ultimaAvaliacao.desenvolvimentoIntelectual,
                              'Equilíbrio Emocional': ultimaAvaliacao.equilibrioEmocional,
                              'Família': ultimaAvaliacao.familia,
                              'Desenvolvimento Amoroso': ultimaAvaliacao.desenvolvimentoAmoroso,
                              'Vida Social': ultimaAvaliacao.vidaSocial,
                              'Realização e Propósito': ultimaAvaliacao.realizacaoProposito,
                              'Recursos Financeiros': ultimaAvaliacao.recursosFinanceiros,
                              'Contribuição Social': ultimaAvaliacao.contribuicaoSocial,
                              'Criatividade e Diversão': ultimaAvaliacao.criatividadeHobbyDiversao,
                            }
                            const menorArea = Object.entries(areas).reduce((a, b) => a[1] < b[1] ? a : b)
                            return (
                              <>
                                <p className="text-xl font-bold text-brand-dark mb-1">{menorArea[1]}/10</p>
                                <p className="text-xs text-brand-darker font-medium px-2">{menorArea[0]}</p>
                              </>
                            )
                          })()}
                        </div>
                      </div>

                      {/* Resumo do Momento */}
                      <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-xl p-6 border border-brand-gold/30 mb-6">
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${resumo.cor} flex items-center justify-center shadow-md`}>
                            <IconeResumo className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-lg font-semibold text-brand-dark mb-2">
                              Seu Momento Atual
                            </h3>
                            <p className="text-brand-darker leading-relaxed">
                              {resumo.mensagem}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dicas Personalizadas */}
                      {(() => {
                        const areas = {
                          'Plenitude e Felicidade': ultimaAvaliacao.plenitudeFelicidade,
                          'Espiritualidade': ultimaAvaliacao.espiritualidade,
                          'Saúde e Disposição': ultimaAvaliacao.saudeDisposicao,
                          'Desenvolvimento Intelectual': ultimaAvaliacao.desenvolvimentoIntelectual,
                          'Equilíbrio Emocional': ultimaAvaliacao.equilibrioEmocional,
                          'Família': ultimaAvaliacao.familia,
                          'Desenvolvimento Amoroso': ultimaAvaliacao.desenvolvimentoAmoroso,
                          'Vida Social': ultimaAvaliacao.vidaSocial,
                          'Realização e Propósito': ultimaAvaliacao.realizacaoProposito,
                          'Recursos Financeiros': ultimaAvaliacao.recursosFinanceiros,
                          'Contribuição Social': ultimaAvaliacao.contribuicaoSocial,
                          'Criatividade e Diversão': ultimaAvaliacao.criatividadeHobbyDiversao,
                        }
                        const menorArea = Object.entries(areas).reduce((a, b) => a[1] < b[1] ? a : b)
                        const dicas = gerarDicasPersonalizadas(menorArea[0], menorArea[1])
                        
                        return (
                          <div className="bg-gradient-to-br from-white to-brand-bronze/5 rounded-xl p-6 border border-brand-gold/30">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-bronze to-brand-gold flex items-center justify-center shadow-md">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                              <h3 className="text-lg font-semibold text-brand-dark">
                                Dicas para {menorArea[0]}
                              </h3>
                            </div>
                            <ul className="space-y-3">
                              {dicas.map((dica, index) => (
                                <li key={index} className="flex items-start gap-3 text-brand-darker">
                                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-gold mt-2"></div>
                                  <p className="text-sm leading-relaxed">{dica}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })()}
                    </>
                  )
                })()}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 border border-brand-gold/30">
                <p className="text-brand-darker leading-relaxed">
                  Bem-vindo(a) ao seu espaço de jornada interior. Aqui você encontra ferramentas 
                  práticas e profundas para mapear seu presente, entender suas energias e 
                  traçar caminhos de crescimento autêntico.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Grid de Ferramentas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {ferramentasAtivas.map((ferramenta, index) => {
            const Icon = ferramenta.icone
            return (
              <div
                key={index}
                className="luxury-card-strong p-8 transition-all duration-300 animate-fadeIn flex flex-col hover:shadow-luxury-lg transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center mb-6 flex-grow">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${ferramenta.cor} rounded-full mb-4 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="font-tan-mon-cheri text-3xl md:text-4xl text-brand-dark mb-3">
                    {ferramenta.titulo}
                  </h2>
                  
                  <p className="text-brand-darker/80 leading-relaxed min-h-[4.5rem]">
                    {ferramenta.descricao}
                  </p>
                </div>

                <button
                  onClick={() => router.push(ferramenta.rota)}
                  className={`w-full bg-gradient-to-r ${ferramenta.cor} hover:from-brand-dark hover:to-brand-medium text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2`}
                >
                  <>
                    Acessar Ferramenta
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                </button>

                <p className="text-center text-sm text-brand-medium mt-4">
                  ⏱️ Tempo estimado: {ferramenta.tempo}
                </p>
              </div>
            )
          })}
        </div>

        {/* Ferramentas em breve */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-brand-dark mb-4 text-center">Em breve</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ferramentasEmBreve.map((ferramenta, index) => {
              const Icon = ferramenta.icone
              return (
                <div
                  key={`bloqueada-${index}`}
                  className="luxury-card p-6 opacity-85"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${ferramenta.cor} rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-brand-dark">{ferramenta.titulo}</h3>
                  </div>
                  <p className="text-sm text-brand-darker/80 mb-3">{ferramenta.descricao}</p>
                  <span className="inline-flex items-center gap-2 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    <Lock className="w-3 h-3" />
                    Em breve
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Seção Sobre */}
        <div className="luxury-card-strong p-8 md:p-12">
          <h2 className="font-tan-mon-cheri text-3xl md:text-4xl text-brand-dark mb-6 text-center">
            Sobre o Portal
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl border border-brand-gold/30">
              <Sparkles className="w-12 h-12 text-brand-bronze mx-auto mb-4" />
              <h3 className="font-semibold text-brand-dark mb-2">Autoconhecimento</h3>
              <p className="text-sm text-brand-darker">
                Ferramentas profundas para compreender seus padrões e potenciais
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl border border-brand-gold/30">
              <Target className="w-12 h-12 text-brand-bronze mx-auto mb-4" />
              <h3 className="font-semibold text-brand-dark mb-2">Clareza</h3>
              <p className="text-sm text-brand-darker">
                Mapas visuais e análises detalhadas do seu momento atual
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl border border-brand-gold/30">
              <Calendar className="w-12 h-12 text-brand-bronze mx-auto mb-4" />
              <h3 className="font-semibold text-brand-dark mb-2">Orientação</h3>
              <p className="text-sm text-brand-darker">
                Recomendações práticas personalizadas para cada área da vida
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-brand-darker/80 leading-relaxed max-w-2xl mx-auto">
              Cada ferramenta foi criada com cuidado para oferecer uma experiência 
              de autoconhecimento profunda e transformadora. Escolha por onde deseja começar 
              e permita-se explorar com presença e curiosidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
