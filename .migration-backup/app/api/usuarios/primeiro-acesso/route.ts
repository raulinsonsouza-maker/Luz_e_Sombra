import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Marcar primeiro acesso como concluído (qualquer usuário autenticado)
export async function PUT() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const usuarioId = parseInt((session.user as any).id)

    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { primeiroAcesso: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar primeiro acesso:', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}
