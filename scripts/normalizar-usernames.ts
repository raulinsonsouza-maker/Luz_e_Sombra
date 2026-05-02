import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function normalizarUsernames() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, username: true },
    })

    for (const usuario of usuarios) {
      const normalizado = usuario.username.trim().toLowerCase()
      if (normalizado !== usuario.username) {
        await prisma.usuario.update({
          where: { id: usuario.id },
          data: { username: normalizado },
        })
        console.log(`Atualizado: ${usuario.username} -> ${normalizado}`)
      }
    }

    console.log('Normalização de usernames concluída.')
  } catch (error) {
    console.error('Erro ao normalizar usernames:', error)
  } finally {
    await prisma.$disconnect()
  }
}

normalizarUsernames()
