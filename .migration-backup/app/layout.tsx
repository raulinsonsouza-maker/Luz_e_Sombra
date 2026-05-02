import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import SiteHeader from '@/components/SiteHeader'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: {
    default: 'Da Sombra à Luz',
    template: '%s | Da Sombra à Luz',
  },
  description: 'Portal de ferramentas de autoconhecimento: Roda da Vida e Análise Numerológica',
  icons: {
    icon: '/logo-luxury.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.cdnfonts.com/css/tan-mon-cheri" rel="stylesheet" />
      </head>
      <body className={`${montserrat.className} antialiased`}>
        <Providers>
          <SiteHeader />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
