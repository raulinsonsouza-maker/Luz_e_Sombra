'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AREAS_DA_VIDA, FormData } from '@/lib/types'
import { ChevronLeft, ChevronRight, User, Calendar, Sparkles, Heart, Home } from 'lucide-react'
import AreaIcon from '@/components/AreaIcon'

function AvaliacaoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const forcarNovo = searchParams.get('novo') === 'true'
  const primeiroAcesso = searchParams.get('primeiro') === 'true'
  
  const [currentStep, setCurrentStep] = useState(0)
  const [carregando, setCarregando] = useState(!forcarNovo)
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    dataNascimento: '',
    plenitudeFelicidade: 5,
    espiritualidade: 5,
    saudeDisposicao: 5,
    desenvolvimentoIntelectual: 5,
    equilibrioEmocional: 5,
    familia: 5,
    desenvolvimentoAmoroso: 5,
    vidaSocial: 5,
    realizacaoProposito: 5,
    recursosFinanceiros: 5,
    contribuicaoSocial: 5,
    criatividadeHobbyDiversao: 5,
  })

  // Preencher dados do usuário automaticamente
  useEffect(() => {
    if (session?.user) {
      const userData = session.user as any
      setFormData(prev => ({
        ...prev,
        nome: userData.name || prev.nome,
        dataNascimento: userData.dataNascimento || prev.dataNascimento
      }))
    }
  }, [session])

  // Verificar se já existe avaliação e redirecionar
  useEffect(() => {
    // Se veio com parâmetro ?novo=true, não redireciona
    if (forcarNovo) {
      setCarregando(false)
      return
    }

    async function verificarAvaliacaoExistente() {
      try {
        const response = await fetch('/api/avaliacoes')
        if (response.ok) {
          const avaliacoes = await response.json()
          if (avaliacoes && avaliacoes.length > 0) {
            // Pegar a avaliação mais recente
            const ultimaAvaliacao = avaliacoes[avaliacoes.length - 1]
            // Redirecionar para o resultado da última avaliação
            router.push(`/resultado/${ultimaAvaliacao.id}`)
            return
          }
        }
      } catch (error) {
        console.error('Erro ao verificar avaliações:', error)
      } finally {
        setCarregando(false)
      }
    }

    verificarAvaliacaoExistente()
  }, [forcarNovo, router])

  const totalSteps = AREAS_DA_VIDA.length + 1 // +1 para informações pessoais

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSliderChange = (areaId: string, value: number) => {
    setFormData({ ...formData, [areaId]: value })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Se é primeiro acesso, marcar como concluído
        if (primeiroAcesso) {
          await fetch('/api/usuarios/primeiro-acesso', {
            method: 'PUT'
          })
        }
        
        // Redirecionar para resultado
        const url = primeiroAcesso ? `/resultado/${data.id}?primeiro=true` : `/resultado/${data.id}`
        router.push(url)
      }
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error)
    }
  }

  const isStepValid = () => {
    if (currentStep === 0) {
      return formData.nome.trim() !== '' && formData.dataNascimento !== ''
    }
    return true
  }

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-8">
            <h2 className="font-tan-mon-cheri text-4xl md:text-5xl text-brand-dark mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-10 h-10 text-brand-gold" strokeWidth={2} />
              {primeiroAcesso ? 'Bem-vinda ao seu primeiro acesso!' : 'Nova Avaliação da Roda da Vida'}
            </h2>
            
            {primeiroAcesso ? (
              <div className="text-left bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 border-2 border-purple-300">
                <p className="text-purple-900 leading-relaxed font-semibold mb-2">
                  🎉 Este é seu primeiro acesso ao sistema!
                </p>
                <p className="text-purple-800 leading-relaxed">
                  Para começar, vamos fazer sua primeira avaliação da Roda da Vida. 
                  Seus dados já foram preenchidos automaticamente. Confirme-os e siga para avaliar as áreas da sua vida.
                </p>
              </div>
            ) : (
              <div className="text-left bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 mb-6 border-2 border-green-300">
                <p className="text-green-900 leading-relaxed font-semibold mb-2">
                  📈 Nova Avaliação para Acompanhar sua Evolução
                </p>
                <p className="text-green-800 leading-relaxed">
                  Esta nova avaliação será <strong>adicionada</strong> ao seu histórico (não sobrescreve as anteriores). 
                  Você poderá comparar sua evolução e ver como suas áreas da vida estão se desenvolvendo ao longo do tempo.
                </p>
              </div>
            )}
            
            <div className="text-left bg-gradient-to-br from-brand-gold/10 to-brand-bronze/10 rounded-2xl p-6 mb-6 border border-brand-gold/30">
              <p className="text-brand-darker leading-relaxed mb-4">
                Este formulário é o primeiro passo do seu processo de transformação.
              </p>
              <p className="text-brand-darker leading-relaxed mb-4">
                Através da Roda da Vida, você vai se conectar com cada área da sua vida, 
                percebendo onde há equilíbrio e onde seu corpo, mente e espírito pedem mais atenção.
              </p>
              <p className="text-brand-darker leading-relaxed mb-4 flex items-start gap-2">
                <Heart className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" fill="currentColor" strokeWidth={2} />
                <span><strong className="text-brand-bronze">Não existe certo ou errado</strong> — apenas o que você sente agora.</span>
              </p>
              <p className="text-brand-darker leading-relaxed">
                Reserve um momento tranquilo, respire fundo e responda com presença. 
                Essas informações vão me ajudar a conduzir sua sessão com mais clareza e propósito.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-brand-dark mb-2">
                <User className="w-4 h-4 mr-2 text-brand-bronze" />
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-3 border-2 border-brand-gold/50 rounded-xl focus:ring-2 focus:ring-brand-bronze focus:border-brand-gold transition-all"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-brand-dark mb-2">
                <Calendar className="w-4 h-4 mr-2 text-brand-bronze" />
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                className="w-full px-4 py-3 border-2 border-brand-gold/50 rounded-xl focus:ring-2 focus:ring-brand-bronze focus:border-brand-gold transition-all"
              />
            </div>
          </div>
        </div>
      )
    }

    const area = AREAS_DA_VIDA[currentStep - 1]
    const currentValue = formData[area.id as keyof FormData] as number

    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="text-center mb-8">
          <AreaIcon iconName={area.icon} className="mb-6 mx-auto" />
          <h2 className="font-tan-mon-cheri text-3xl md:text-4xl text-brand-dark mb-3">
            {area.titulo}
          </h2>
          <p className="text-brand-medium text-lg">
            {area.descricao}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm text-brand-medium">Muito ruim</span>
            <span className="text-3xl font-bold text-brand-bronze">{currentValue}</span>
            <span className="text-sm text-brand-medium">Excelente</span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={currentValue}
            onChange={(e) => handleSliderChange(area.id, parseInt(e.target.value))}
            className="w-full luxury-range"
          />

          <div className="flex justify-between text-xs text-brand-medium/60">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <span key={num}>{num}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const progress = ((currentStep + 1) / totalSteps) * 100

  // Mostrar loading enquanto verifica
  if (carregando) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-bronze"></div>
          <p className="mt-4 text-brand-medium">Verificando avaliações anteriores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="luxury-shell flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Botão Voltar */}
        <div className="mb-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-brand-medium hover:text-brand-dark transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Voltar ao Portal</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-brand-medium">
              Etapa {currentStep + 1} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-brand-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-brand-gold/20 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-brand-bronze to-brand-gold h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="luxury-card-strong p-8 md:p-12">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-gold text-brand-dark font-semibold rounded-xl hover:bg-brand-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-bronze to-brand-gold text-white font-semibold rounded-xl hover:from-brand-dark hover:to-brand-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {currentStep === totalSteps - 1 ? 'Ver Resultado' : 'Próximo'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AvaliacaoPage() {
  return (
    <Suspense fallback={
      <div className="luxury-shell flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-bronze"></div>
          <p className="mt-4 text-brand-medium">Carregando avaliação...</p>
        </div>
      </div>
    }>
      <AvaliacaoContent />
    </Suspense>
  )
}
