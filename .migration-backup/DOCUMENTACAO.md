# 🌟 Luz e Sombra - Documentação Completa

**Versão:** 2.0 Otimizada  
**Status:** ✅ 100% Funcional  
**Última Atualização:** 23/10/2025

Portal de autoconhecimento com Roda da Vida e Numerologia.

---

## 🚀 Início Rápido (3 minutos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
```bash
npx prisma migrate dev
npx tsx scripts/criar-admin.ts
```

### 3. Iniciar Servidor
```bash
npm run dev
# http://localhost:3000
```

### 4. Login Admin
```
URL: http://localhost:3000/admin/login
Usuário: admin
Senha: definida no script de criação/reset
```

---

## 📁 Estrutura do Projeto

```
app/
├── page.tsx           # Home (área de membros)
├── login/             # Login usuários
├── admin/             # Painel administrativo
│   ├── page.tsx       # Gestão de usuários
│   └── login/         # Login admin
├── avaliacao/         # Roda da Vida
├── resultado/[id]/    # Resultado da avaliação
├── numerologia/       # Análise numerológica
├── historico/         # Histórico de avaliações
└── api/               # API Routes

components/            # Componentes reutilizáveis
lib/                   # Configurações e utils
prisma/                # Schema e banco de dados
scripts/               # Scripts utilitários
```

---

## 🎯 Funcionalidades Principais

### Para Usuários
- ✅ Login/Logout seguro
- ✅ Roda da Vida (12 áreas de avaliação)
- ✅ Numerologia completa (Ano Pessoal, Pitágoras, etc)
- ✅ Histórico de evolução
- ✅ Comparação de resultados
- ✅ Gráficos interativos (Chart.js)

### Para Administradores
- ✅ Gestão completa de usuários (CRUD)
- ✅ Visualizar todas avaliações
- ✅ Controle de acesso

---

## 🔒 Autenticação

### NextAuth.js + JWT

**Dados na Sessão:**
- username, nome, email
- dataNascimento (para numerologia)
- isAdmin (controle de acesso)
- primeiroAcesso (redirecionamento automático)

### Proteção de Rotas (Middleware)

```
Rotas Protegidas:
- / → Requer login
- /avaliacao → Requer login
- /numerologia → Requer login
- /admin → Requer isAdmin = true

Rotas Públicas:
- /login
- /admin/login
```

---

## 📊 Sistema de Avaliações

### Funcionamento
1. Cada avaliação é **ADICIONADA** (nunca sobrescrita)
2. TODAS ficam salvas no banco
3. Histórico completo disponível
4. Comparação automática de evolução

### Exemplo
```
Setembro:  Média 5.8
Outubro:   Média 6.5  (+0.7) ↑
Novembro:  Média 7.3  (+0.8) ↑
```

---

## 🔢 Numerologia

### Cálculos Disponíveis
- ✅ Ano Universal (energia coletiva)
- ✅ Ano Pessoal (energia individual)
- ✅ 12 Meses Pessoais
- ✅ Tabela de Nascimento de Pitágoras
- ✅ Plano Dominante (Mental/Emocional/Físico)
- ✅ Eu Dominante (Íntimo/Consciente/Social)

**⚠️ Requisito:** Usuário DEVE ter dataNascimento cadastrado

---

## 🗄️ Banco de Dados

### Usuario
```
id, username, senha (hash bcrypt)
nome, email, dataNascimento
isAdmin, primeiroAcesso, ativo
```

### Avaliacao
```
id, usuarioId, dataAvaliacao
12 áreas da vida (1-10):
  - plenitudeFelicidade
  - espiritualidade
  - saudeDisposicao
  - desenvolvimentoIntelectual
  - equilibrioEmocional
  - familia
  - desenvolvimentoAmoroso
  - vidaSocial
  - realizacaoProposito
  - recursosFinanceiros
  - contribuicaoSocial
  - criatividadeHobbyDiversao
```

---

## 🛠️ Scripts Úteis

### Desenvolvimento
```bash
npm run dev               # Servidor desenvolvimento
npm run build             # Build produção
npm start                 # Iniciar produção
```

### Banco de Dados
```bash
npx prisma studio         # Interface visual
npx prisma migrate dev    # Criar migração
```

### Admin
```bash
npx tsx scripts/criar-admin.ts          # Criar admin
npx tsx scripts/verificar-admin.ts      # Verificar admin
npx tsx scripts/resetar-senha-admin.ts  # Resetar senha do admin
npx tsx scripts/adicionar-datas.ts      # Adicionar datas
```

### Limpeza
```bash
Remove-Item -Recurse -Force .next    # Limpar cache
taskkill /F /IM node.exe              # Parar Node
```

---

## ⚙️ Configuração

### .env
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta"
```

---

## 🎨 Tecnologias

- **Next.js 14** - Framework
- **React 18** - UI
- **TypeScript** - Tipagem
- **NextAuth.js** - Autenticação
- **Prisma** - ORM
- **TailwindCSS** - Estilos
- **Chart.js** - Gráficos
- **SQLite** - Database (dev)

---

## 🔄 Fluxos

### Primeiro Acesso
```
1. Admin cria usuário
2. Usuário faz login
3. Sistema redireciona para /avaliacao
4. Preenche Roda da Vida
5. Vê resultado
6. Acessa área de membros
```

### Nova Avaliação
```
1. Clica [Fazer Nova Avaliação]
2. Preenche formulário
3. Sistema ADICIONA nova avaliação
4. Pode comparar no histórico
```

---

## ⚠️ Troubleshooting

### Build Error
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

### Numerologia Não Funciona
```
1. Admin edita usuário
2. Adiciona dataNascimento
3. Usuário faz logout/login
```

### Admin Não Acessa
```bash
npx tsx scripts/verificar-admin.ts
```

### Sessão Desatualizada
```
Logout + Login (atualiza JWT)
```

---

## ✅ Checklist

### Instalação
- [ ] npm install
- [ ] npx prisma migrate dev
- [ ] npx tsx scripts/criar-admin.ts
- [ ] npm run dev

### Teste
- [ ] Login admin
- [ ] Criar usuário
- [ ] Login usuário
- [ ] Fazer avaliação
- [ ] Ver resultado
- [ ] Testar numerologia

---

## 📈 Performance

- Build time: 4-5s
- Código otimizado: 2800 linhas
- swcMinify: ✅
- Bundle otimizado: ✅

---

## 📞 Suporte

1. Ver Troubleshooting
2. Verificar logs do servidor
3. Console do navegador (F12)
4. Executar scripts de verificação

---

**Status:** ✅ Produção Ready  
**Versão:** 2.0  
**Sistema Luz e Sombra** © 2025
