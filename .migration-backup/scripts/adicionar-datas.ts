import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function adicionarDatas() {
  try {
    console.log('Verificando usuários sem data de nascimento...\n')

    const usuarios = await prisma.usuario.findMany({
      where: {
        dataNascimento: null
      },
      select: {
        id: true,
        username: true,
        nome: true,
        dataNascimento: true,
      }
    })

    if (usuarios.length === 0) {
      console.log('✅ Todos os usuários já têm data de nascimento!')
      return
    }

    console.log(`⚠️  Encontrados ${usuarios.length} usuários sem data:\n`)
    
    for (const usuario of usuarios) {
      console.log(`📝 ${usuario.nome} (${usuario.username})`)
      
      // Adicionar data padrão
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          dataNascimento: '1990-01-01' // Data padrão
        }
      })
      
      console.log('   ✅ Data adicionada: 01/01/1990\n')
    }

    console.log('✅ Todas as datas foram adicionadas!')
    console.log('\n⚠️  IMPORTANTE: Peça aos usuários para atualizarem suas datas de nascimento reais no admin.')

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

adicionarDatas()
