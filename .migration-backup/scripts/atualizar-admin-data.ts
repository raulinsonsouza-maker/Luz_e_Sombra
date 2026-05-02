import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function atualizarAdminData() {
  try {
    // Busca o usuário admin
    const admin = await prisma.usuario.findFirst({
      where: { isAdmin: true }
    })

    if (!admin) {
      console.log('❌ Nenhum usuário admin encontrado')
      return
    }

    // Atualiza com data de nascimento se não tiver
    if (!admin.dataNascimento) {
      await prisma.usuario.update({
        where: { id: admin.id },
        data: {
          dataNascimento: '1990-01-01'
        }
      })

      console.log('✅ Data de nascimento adicionada ao admin!')
      console.log(`   Username: ${admin.username}`)
      console.log(`   Data: 01/01/1990`)
    } else {
      console.log('✅ Admin já possui data de nascimento cadastrada')
      console.log(`   Data: ${admin.dataNascimento}`)
    }

  } catch (error) {
    console.error('❌ Erro ao atualizar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

atualizarAdminData()
