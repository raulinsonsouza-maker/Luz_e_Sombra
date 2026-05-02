'use client'

import { ReactNode } from 'react'

export function UiCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`luxury-card p-6 ${className}`}>{children}</div>
}

export function UiCardStrong({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`luxury-card-strong p-6 ${className}`}>{children}</div>
}

export function UiBadge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-brand-gold/15 text-brand-dark border border-brand-gold/35 ${className}`}>{children}</span>
}

export function UiAlert({
  children,
  tone = 'info',
  className = '',
}: {
  children: ReactNode
  tone?: 'info' | 'success' | 'warning' | 'danger'
  className?: string
}) {
  const map = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  }
  return <div className={`rounded-xl border px-4 py-3 text-sm ${map[tone]} ${className}`}>{children}</div>
}
