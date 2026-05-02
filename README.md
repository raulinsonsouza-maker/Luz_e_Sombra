# Da Sombra à Luz

Portal de autoconhecimento com Roda da Vida e Análise Numerológica, construído com Next.js + Prisma.

## Início rápido

1) Instalar dependências:
```bash
npm install
```

2) Configurar banco local:
```bash
npx prisma migrate dev
npx tsx scripts/criar-admin.ts
```

3) Iniciar o projeto:
```bash
npm run dev
```

4) Acessos:
- Usuários: `http://localhost:3000/login`
- Admin: `http://localhost:3000/admin/login`

## Comandos úteis

```bash
npm run dev
npm run build
npm start
npm run prisma:generate
npm run prisma:push
npm run prisma:studio
```

## Documentação

- Guia principal: `DOCUMENTACAO.md`
- Documentação técnica: `docs/SISTEMA_AVALIACOES.md`
- Validação funcional: `docs/VALIDACAO_SISTEMA.md`
