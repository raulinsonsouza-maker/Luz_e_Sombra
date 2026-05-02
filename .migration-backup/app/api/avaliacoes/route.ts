import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const usuarioId = parseInt((session.user as any).id)

    const avaliacao = await prisma.avaliacao.create({
      data: {
        usuarioId,
        plenitudeFelicidade: body.plenitudeFelicidade,
        espiritualidade: body.espiritualidade,
        saudeDisposicao: body.saudeDisposicao,
        desenvolvimentoIntelectual: body.desenvolvimentoIntelectual,
        equilibrioEmocional: body.equilibrioEmocional,
        familia: body.familia,
        desenvolvimentoAmoroso: body.desenvolvimentoAmoroso,
        vidaSocial: body.vidaSocial,
        realizacaoProposito: body.realizacaoProposito,
        recursosFinanceiros: body.recursosFinanceiros,
        contribuicaoSocial: body.contribuicaoSocial,
        criatividadeHobbyDiversao: body.criatividadeHobbyDiversao,
      },
    })

    // Se é a primeira avaliação, marca primeiroAcesso como false
    if ((session.user as any).primeiroAcesso) {
      await prisma.usuario.update({
        where: { id: usuarioId },
        data: { primeiroAcesso: false }
      })
    }

    return NextResponse.json(avaliacao)
  } catch (error) {
    console.error('Erro ao criar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar avaliação' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const usuarioId = parseInt((session.user as any).id)
    const isAdmin = (session.user as any).isAdmin

    // Se é admin, retorna todas as avaliações. Se não, só as do usuário
    const avaliacoes = await prisma.avaliacao.findMany({
      where: isAdmin ? undefined : { usuarioId },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            username: true,
          }
        }
      },
      orderBy: {
        dataAvaliacao: 'desc',
      },
    })

    return NextResponse.json(avaliacoes)
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar avaliações' },
      { status: 500 }
    )
  }
}
