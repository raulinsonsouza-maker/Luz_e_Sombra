'use client'

import { useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Home, Target, Calendar, History, Shield, LogOut, Menu, X } from 'lucide-react'

export default function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isPublicPage = pathname === '/login' || pathname === '/admin/login'
  if (isPublicPage || status !== 'authenticated' || !session?.user) {
    return null
  }

  const isAdmin = Boolean((session.user as any).isAdmin)
  const nomeUsuario = session.user.name || 'Usuário'
  const primeiroNome = nomeUsuario.split(' ')[0]

  const links = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/avaliacao', label: 'Avaliação', icon: Target },
    { href: '/numerologia', label: 'Numerologia', icon: Calendar },
    { href: '/historico', label: 'Histórico', icon: History },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-brand-gold/25 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-3 text-brand-dark hover:text-brand-bronze transition-colors"
            aria-label="Ir para página inicial"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full overflow-hidden shadow-luxury">
              <Image src="/logo-luxury.svg" alt="Logo Da Sombra à Luz" width={40} height={40} />
            </div>
            <div className="text-left">
              <p className="text-base font-semibold leading-none">Da Sombra à Luz</p>
              <p className="text-xs text-brand-medium">Experiência Premium</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-2 rounded-2xl border border-brand-gold/20 bg-white/80 p-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <button
                  key={href}
                  type="button"
                  onClick={() => router.push(href)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-brand-gold/25 text-brand-dark border border-brand-gold/40 shadow-sm'
                      : 'text-brand-medium hover:text-brand-dark hover:bg-brand-gold/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              )
            })}

            {isAdmin && (
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname.startsWith('/admin')
                    ? 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block text-right">
              <p className="text-xs text-brand-medium">Olá,</p>
              <p className="text-sm font-semibold text-brand-dark">{primeiroNome}</p>
            </div>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-brand-gold/30 text-brand-dark"
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-gold/40 text-brand-dark hover:bg-brand-gold/10 transition-all"
              aria-label="Sair do sistema"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-brand-gold/20 bg-white/95 p-2 space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <button
                  key={`m-${href}`}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    router.push(href)
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                    active ? 'bg-brand-gold/20 text-brand-dark' : 'text-brand-medium'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              )
            })}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  router.push('/admin')
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-purple-700 bg-purple-50"
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
