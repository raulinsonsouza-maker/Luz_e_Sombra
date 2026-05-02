import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function criarAdmin() {
  const senhaAdmin = process.env.ADMIN_PASSWORD || process.argv[2] || 'admin123'

  try {
    // Verifica se já existe um admin
    const adminExistente = await prisma.usuario.findFirst({
      where: { isAdmin: true }
    })

    if (adminExistente) {
      console.log('✅ Usuário admin já existe!')
      console.log(`   Username: ${adminExistente.username}`)
      console.log(`   Nome: ${adminExistente.nome}`)
      return
    }

    // Cria senha hash
    const senhaHash = await bcrypt.hash(senhaAdmin, 10)

    // Cria usuário admin
    const admin = await prisma.usuario.create({
      data: {
        username: 'admin',
        senha: senhaHash,
        nome: 'Administrador',
        email: 'admin@luzsombra.com',
        dataNascimento: '1990-01-01', // Data padrão para admin
        isAdmin: true,
        primeiroAcesso: false,
        ativo: true,
      }
    })

    console.log('✅ Usuário admin criado com sucesso!')
    console.log(`   Username: ${admin.username}`)
    console.log(`   Senha: ${senhaAdmin}`)
    console.log(`   Nome: ${admin.nome}`)
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!')

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

criarAdmin()
