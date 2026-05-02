import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function run() {
  const username = `teste_admin_${Date.now()}`
  const senha = 'Teste123'
  const senhaNova = 'Teste12345'

  try {
    const senhaHash = await bcrypt.hash(senha, 10)
    const criado = await prisma.usuario.create({
      data: {
        username,
        senha: senhaHash,
        nome: 'Usuário Teste Admin',
        email: `${username}@teste.local`,
        ativo: true,
        isAdmin: false,
      },
    })

    const buscado = await prisma.usuario.findUnique({ where: { username } })
    if (!buscado) throw new Error('Usuário de teste não foi encontrado após criação')

    const senhaValida = await bcrypt.compare(senha, buscado.senha)
    if (!senhaValida) throw new Error('Senha criada não validou no compare bcrypt')

    const novaHash = await bcrypt.hash(senhaNova, 10)
    await prisma.usuario.update({
      where: { id: criado.id },
      data: { senha: novaHash, ativo: false }
    })

    const atualizado = await prisma.usuario.findUnique({ where: { id: criado.id } })
    if (!atualizado) throw new Error('Usuário não encontrado após atualização')

    const senhaNovaValida = await bcrypt.compare(senhaNova, atualizado.senha)
    if (!senhaNovaValida) throw new Error('Nova senha não validou após update')
    if (atualizado.ativo !== false) throw new Error('Campo ativo não foi atualizado corretamente')

    await prisma.usuario.delete({ where: { id: criado.id } })
    console.log('Fluxo admin OK: criar -> validar -> atualizar -> deletar')
  } catch (error) {
    console.error('Falha no teste de fluxo admin:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

run()
