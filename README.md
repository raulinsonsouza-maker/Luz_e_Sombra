# Luz e Sombra

Plataforma web de autoconhecimento ("Da Sombra à Luz"): Roda da Vida, Numerologia, Traço de Caráter, Diagnóstico Emocional, Temperamento, 5 Linguagens do Amor, jornada gamificada, comunidade e LMS.

## Stack

- **Frontend:** React 19, Vite 7, Tailwind 4, shadcn/ui (`artifacts/luz-e-sombra`)
- **Backend:** Express 5, JWT, Drizzle ORM, PostgreSQL (`artifacts/api-server`)
- **Domínio:** pacotes compartilhados em `lib/` (motores de scoring, narrativa, DB)

## Pré-requisitos

- Node.js 22+
- pnpm 9+
- PostgreSQL 15+

## Setup local

```bash
# Clonar e instalar
git clone https://github.com/raulinsonsouza-maker/Luz_e_Sombra.git
cd Luz_e_Sombra
pnpm install

# Variáveis de ambiente
cp .env.example .env
# Edite DATABASE_URL, JWT_SECRET, etc.

# Banco de dados (desenvolvimento)
pnpm --filter db push

# API (porta 8080)
pnpm --filter @workspace/api-server dev

# Frontend (outro terminal, porta 5173)
pnpm --filter @workspace/luz-e-sombra dev
```

O frontend em dev faz proxy de `/api` para `http://localhost:8080`.

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm run typecheck` | Verificação TypeScript em todo o monorepo |
| `pnpm run test` | Testes unitários nos pacotes com script `test` |
| `pnpm run lint` | ESLint |
| `pnpm run build` | Typecheck + build de todos os pacotes |

## Deploy

- **VPS (Debian):** ver [DEPLOY_VPS.md](DEPLOY_VPS.md)
- **Replit:** artifacts com `.replit-artifact/artifact.toml`

## Estrutura

```
artifacts/          # Apps deployáveis (SPA + API)
lib/                # Motores de domínio, schema DB, OpenAPI
docs/               # Especificações técnicas
scripts/            # Deploy e utilitários
```

Documentação interna detalhada: [replit.md](replit.md)

## Licença

MIT — ver [LICENSE](LICENSE)
