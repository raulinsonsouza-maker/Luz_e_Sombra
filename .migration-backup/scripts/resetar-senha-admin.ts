import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetarSenhaAdmin() {
  const novaSenha = process.argv[2] || 'luz2025'

  try {
    const admin = await prisma.usuario.findFirst({
      where: { username: 'admin' }
    })

    if (!admin) {
      console.log('❌ Usuário admin não encontrado.')
      console.log('   Execute: npx tsx scripts/criar-admin.ts')
      return
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10)

    await prisma.usuario.update({
      where: { id: admin.id },
      data: {
        senha: senhaHash,
        ativo: true,
        isAdmin: true
      }
    })

    console.log('✅ Senha do admin atualizada com sucesso!')
    console.log(`   Username: ${admin.username}`)
    console.log(`   Nova senha: ${novaSenha}`)
  } catch (error) {
    console.error('❌ Erro ao resetar senha do admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetarSenhaAdmin()
