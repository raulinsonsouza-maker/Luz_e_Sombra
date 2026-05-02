import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function diagnosticar() {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { id: 'desc' },
      take: 15,
      select: {
        id: true,
        username: true,
        nome: true,
        ativo: true,
        isAdmin: true,
        criadoEm: true,
        senha: true,
      },
    })

    if (usuarios.length === 0) {
      console.log('Nenhum usuário encontrado no banco.')
      return
    }

    console.log('Usuários recentes:')
    for (const u of usuarios) {
      console.log(
        `${u.id} | ${u.username} | ativo=${u.ativo} | admin=${u.isAdmin} | hashLen=${u.senha?.length ?? 0}`
      )
    }
  } catch (error) {
    console.error('Erro ao diagnosticar login:', error)
  } finally {
    await prisma.$disconnect()
  }
}

diagnosticar()
