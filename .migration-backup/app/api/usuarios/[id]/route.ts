import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function validarSenha(senha: string): boolean {
  return senha.length >= 6
}

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// GET - Buscar usuário específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const usuarioId = parseInt(params.id)
    if (Number.isNaN(usuarioId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const usuarioSessaoId = parseInt((session.user as any).id)
    const isAdmin = Boolean((session.user as any).isAdmin)
    const podeVerCompleto = isAdmin || usuarioSessaoId === usuarioId

    if (!podeVerCompleto) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
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
        avaliacoes: isAdmin ? {
          orderBy: { dataAvaliacao: 'desc' },
          take: 10
        } : false
      }
    })

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 })
  }
}

// PUT - Atualizar usuário (apenas admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Apenas admin pode atualizar usuários
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const usuarioId = parseInt(params.id)
    if (Number.isNaN(usuarioId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const body = await request.json()
    const { nome, email, dataNascimento, ativo, isAdmin, senha, novaSenha, primeiroAcesso } = body

    const dadosAtualizacao: any = {}
    
    if (nome !== undefined) {
      const nomeNormalizado = String(nome).trim()
      if (!nomeNormalizado) {
        return NextResponse.json({ error: 'Nome não pode ser vazio' }, { status: 400 })
      }
      dadosAtualizacao.nome = nomeNormalizado
    }
    if (email !== undefined) {
      const emailNormalizado = String(email || '').trim().toLowerCase()
      if (emailNormalizado && !validarEmail(emailNormalizado)) {
        return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
      }
      if (emailNormalizado) {
        const emailExistente = await prisma.usuario.findFirst({
          where: {
            email: emailNormalizado,
            id: { not: usuarioId }
          }
        })
        if (emailExistente) {
          return NextResponse.json({ error: 'Email já está em uso' }, { status: 400 })
        }
      }
      dadosAtualizacao.email = emailNormalizado || null
    }
    if (dataNascimento !== undefined) dadosAtualizacao.dataNascimento = dataNascimento || null
    if (typeof ativo === 'boolean') dadosAtualizacao.ativo = ativo
    if (typeof isAdmin === 'boolean') {
      const currentUserId = parseInt((session.user as any).id)
      if (currentUserId === usuarioId && !isAdmin) {
        return NextResponse.json({ error: 'Você não pode remover seu próprio acesso de administrador' }, { status: 400 })
      }
      dadosAtualizacao.isAdmin = isAdmin
    }
    if (typeof primeiroAcesso === 'boolean') dadosAtualizacao.primeiroAcesso = primeiroAcesso
    
    // Aceita tanto 'senha' quanto 'novaSenha'
    const senhaParaAtualizar = senha || novaSenha
    if (senhaParaAtualizar) {
      if (!validarSenha(String(senhaParaAtualizar))) {
        return NextResponse.json({ error: 'Senha inválida. Use pelo menos 6 caracteres.' }, { status: 400 })
      }
      dadosAtualizacao.senha = await bcrypt.hash(senhaParaAtualizar, 10)
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: dadosAtualizacao,
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        dataNascimento: true,
        primeiroAcesso: true,
        ativo: true,
        isAdmin: true,
        atualizadoEm: true,
      }
    })

    return NextResponse.json(usuarioAtualizado)
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
  }
}

// DELETE - Deletar usuário (apenas admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const usuarioId = parseInt(params.id)
    if (Number.isNaN(usuarioId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const currentUserId = parseInt((session.user as any).id)
    if (currentUserId === usuarioId) {
      return NextResponse.json({ error: 'Você não pode deletar seu próprio usuário' }, { status: 400 })
    }
    
    await prisma.usuario.delete({
      where: { id: usuarioId }
    })

    return NextResponse.json({ message: 'Usuário deletado com sucesso' })
  } catch (error: any) {
    console.error('Erro ao deletar usuário:', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 500 })
  }
}
