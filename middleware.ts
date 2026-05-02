import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Proteger admin
    if (path.startsWith('/admin') && path !== '/admin/login') {
      if (!(token as any)?.isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }

    // Primeiro acesso → avaliação
    if ((token as any)?.primeiroAcesso && 
        !path.startsWith('/avaliacao') && 
        !path.startsWith('/resultado')) {
      return NextResponse.redirect(new URL('/avaliacao', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        return path.startsWith('/login') || path.startsWith('/admin/login') || !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/',
    '/avaliacao/:path*',
    '/resultado/:path*',
    '/numerologia/:path*',
    '/historico/:path*',
    '/admin/:path*',
    '/login',
  ],
}
