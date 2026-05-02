import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET é obrigatório em produção.')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const usernameNormalizado = credentials.username.trim().toLowerCase()
          const usuario = await prisma.usuario.findUnique({
            where: { username: usernameNormalizado }
          })

          if (!usuario || !usuario.ativo) {
            return null
          }

          const senhaValida = await bcrypt.compare(credentials.password, usuario.senha)

          if (!senhaValida) {
            return null
          }

          return {
            id: usuario.id.toString(),
            name: usuario.nome,
            email: usuario.email || undefined,
            username: usuario.username,
            primeiroAcesso: usuario.primeiroAcesso,
            isAdmin: usuario.isAdmin,
            dataNascimento: usuario.dataNascimento,
          }
        } catch (error) {
          console.error('Erro na autenticação:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as any).username
        token.primeiroAcesso = (user as any).primeiroAcesso
        token.isAdmin = (user as any).isAdmin
        token.dataNascimento = (user as any).dataNascimento || null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).username = token.username as string
        (session.user as any).primeiroAcesso = token.primeiroAcesso as boolean
        (session.user as any).isAdmin = token.isAdmin as boolean
        (session.user as any).dataNascimento = token.dataNascimento as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
}
