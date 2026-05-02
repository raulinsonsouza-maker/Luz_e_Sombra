'use client'

import { useRouter } from 'next/navigation'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-fadeIn border-2 border-brand-gold/20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-6">
          <AlertCircle className="w-10 h-10 text-orange-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-brand-dark mb-2">404</h1>
        <h2 className="font-tan-mon-cheri text-3xl text-brand-medium mb-4">
          Página não encontrada
        </h2>
        
        <p className="text-brand-darker mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>

        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-bronze to-brand-gold hover:from-brand-dark hover:to-brand-medium text-white font-semibold rounded-xl transition-all shadow-lg"
        >
          <Home className="w-5 h-5" />
          Voltar para Início
        </button>
      </div>
    </div>
  )
}
