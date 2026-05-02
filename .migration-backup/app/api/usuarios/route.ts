import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function validarUsername(username: string): boolean {
  return /^[a-z0-9._-]{3,30}$/.test(username)
}

function validarSenha(senha: string): boolean {
  return senha.length >= 6
}

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// GET - Listar todos os usuários (apenas admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        dataNascimento: true,
        primeiroAcesso: true,
        ativo: true,
        isAdmin: true,
        criadoEm: true,
        atualizadoEm: true,
        _count: {
          select: { avaliacoes: true }
        }
      },
      orderBy: { criadoEm: 'desc' }
    })

    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}

// POST - Criar novo usuário (apenas admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { username, senha, nome, email, dataNascimento, isAdmin } = body
    const usernameNormalizado = String(username || '').trim().toLowerCase()
    const nomeNormalizado = String(nome || '').trim()
    const senhaNormalizada = String(senha || '')
    const emailNormalizado = typeof email === 'string' ? email.trim().toLowerCase() : ''

    // Validações
    if (!usernameNormalizado || !senhaNormalizada || !nomeNormalizado) {
      return NextResponse.json(
        { error: 'Username, senha e nome são obrigatórios' },
        { status: 400 }
      )
    }

    if (!validarUsername(usernameNormalizado)) {
      return NextResponse.json(
        { error: 'Username inválido. Use 3-30 caracteres: letras minúsculas, números, ponto, hífen ou underline.' },
        { status: 400 }
      )
    }

    if (!validarSenha(senhaNormalizada)) {
      return NextResponse.json(
        { error: 'Senha inválida. Use pelo menos 6 caracteres.' },
        { status: 400 }
      )
    }

    if (emailNormalizado && !validarEmail(emailNormalizado)) {
      return NextResponse.json(
        { error: 'Email inválido.' },
        { status: 400 }
      )
    }

    // Verificar se username já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { username: usernameNormalizado }
    })

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Username já está em uso' },
        { status: 400 }
      )
    }

    // Verificar email duplicado quando informado
    if (emailNormalizado) {
      const emailExistente = await prisma.usuario.findFirst({
        where: { email: emailNormalizado }
      })
      if (emailExistente) {
        return NextResponse.json(
          { error: 'Email já está em uso' },
          { status: 400 }
        )
      }
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senhaNormalizada, 10)

    // Criar usuário
    const novoUsuario = await prisma.usuario.create({
      data: {
        username: usernameNormalizado,
        senha: senhaHash,
        nome: nomeNormalizado,
        email: emailNormalizado || null,
        dataNascimento: dataNascimento || null,
        isAdmin: isAdmin || false,
      },
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        dataNascimento: true,
        primeiroAcesso: true,
        ativo: true,
        isAdmin: true,
        criadoEm: true,
      }
    })

    return NextResponse.json(novoUsuario, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error)
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Username ou email já cadastrado.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}
