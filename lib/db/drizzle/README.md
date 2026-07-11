# Migrations Drizzle

Este diretório recebe migrations versionadas geradas pelo Drizzle Kit.

## Desenvolvimento (schema rápido)

```bash
pnpm --filter db push
```

## Produção (migrations versionadas)

```bash
# 1. Após alterar lib/db/src/schema/, gerar migration:
pnpm --filter db generate

# 2. Aplicar no ambiente:
pnpm --filter db migrate
```

O deploy VPS (`scripts/deploy-vps.sh`) usa `migrate` por padrão. Para voltar ao push em dev, use `pnpm --filter db push`.

Migrations SQL legadas em `artifacts/api-server/migrations/` foram consolidadas no fluxo Drizzle; não aplicar manualmente em paralelo.
