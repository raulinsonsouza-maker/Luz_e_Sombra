import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verificarAdmin() {
  try {
    const admin = await prisma.usuario.findFirst({
      where: { username: 'admin' }
    })

    if (!admin) {
      console.log('❌ Usuário admin não encontrado!')
      return
    }

    console.log('✅ Usuário admin encontrado:')
    console.log(`   ID: ${admin.id}`)
    console.log(`   Username: ${admin.username}`)
    console.log(`   Nome: ${admin.nome}`)
    console.log(`   isAdmin: ${admin.isAdmin}`)
    console.log(`   Ativo: ${admin.ativo}`)
    console.log(`   Data Nascimento: ${admin.dataNascimento || 'NÃO CADASTRADA'}`)

    if (!admin.isAdmin) {
      console.log('\n⚠️  PROBLEMA ENCONTRADO: isAdmin está FALSE!')
      console.log('   Corrigindo...')
      
      await prisma.usuario.update({
        where: { id: admin.id },
        data: { isAdmin: true }
      })
      
      console.log('✅ isAdmin corrigido para TRUE!')
    }

    if (!admin.dataNascimento) {
      console.log('\n⚠️  AVISO: Admin sem data de nascimento!')
      console.log('   Adicionando data padrão...')
      
      await prisma.usuario.update({
        where: { id: admin.id },
        data: { dataNascimento: '1990-01-01' }
      })
      
      console.log('✅ Data de nascimento adicionada: 01/01/1990')
    }

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verificarAdmin()
