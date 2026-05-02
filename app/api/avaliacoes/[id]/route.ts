import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const avaliacaoId = parseInt(params.id)
    if (Number.isNaN(avaliacaoId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const avaliacao = await prisma.avaliacao.findUnique({
      where: {
        id: avaliacaoId,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            dataNascimento: true,
            username: true,
          }
        }
      }
    })

    if (!avaliacao) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    const usuarioSessaoId = parseInt((session.user as any).id)
    const isAdmin = Boolean((session.user as any).isAdmin)
    if (!isAdmin && avaliacao.usuarioId !== usuarioSessaoId) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    return NextResponse.json(avaliacao)
  } catch (error) {
    console.error('Erro ao buscar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar avaliação' },
      { status: 500 }
    )
  }
}
