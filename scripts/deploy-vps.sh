#!/usr/bin/env bash
#
# Atualiza LuzeSombra na VPS: pull, dependências, schema (opcional), build, restart.
#
# Uso:
#   sudo bash scripts/deploy-vps.sh
#   ou, a partir da raiz do projeto:
#   sudo ./scripts/deploy-vps.sh
#
# Variáveis opcionais:
#   APP_DIR=/caminho/do/clone     (padrão: /opt/luzesombra)
#   SKIP_DB_PUSH=1                não roda drizzle-kit push (quando não mudou lib/db)
#

set -e

APP_DIR="${APP_DIR:-/opt/luzesombra}"
SKIP_DB_PUSH="${SKIP_DB_PUSH:-0}"

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "Erro: repositório Git não encontrado em $APP_DIR"
  echo "Defina APP_DIR se o clone estiver em outro lugar, ex.: APP_DIR=/opt/meuprojeto $0"
  exit 1
fi

cd "$APP_DIR"

echo "=========================================="
echo " Deploy LuzeSombra — $(date -Iseconds)"
echo " Diretório: $APP_DIR"
echo "=========================================="

echo ""
echo "==> git pull"
git pull

echo ""
echo "==> pnpm install"
if ! pnpm install --frozen-lockfile; then
  echo "Aviso: --frozen-lockfile falhou; tentando sem travar o lockfile..."
  pnpm install --no-frozen-lockfile
fi

if [[ "$SKIP_DB_PUSH" == "1" ]]; then
  echo ""
  echo "==> Pulando drizzle push (SKIP_DB_PUSH=1)"
else
  echo ""
  echo "==> drizzle-kit push (precisa de DATABASE_URL no .env)"
  if [[ ! -f .env ]]; then
    echo "Erro: arquivo .env não encontrado em $APP_DIR"
    exit 1
  fi
  set -a
  # shellcheck disable=SC1091
  source ./.env
  set +a
  pnpm --filter @workspace/db push
fi

echo ""
echo "==> build frontend (@workspace/luz-e-sombra)"
pnpm --filter @workspace/luz-e-sombra build

echo ""
echo "==> build API (@workspace/api-server)"
pnpm --filter @workspace/api-server build

echo ""
echo "==> systemctl restart luzesombra-api + reload nginx"
systemctl restart luzesombra-api
systemctl reload nginx

echo ""
echo "==> healthcheck"
if curl -sf http://127.0.0.1:8080/api/healthz >/dev/null; then
  curl -s http://127.0.0.1:8080/api/healthz
  echo ""
  echo ""
  echo "Concluído com sucesso."
else
  echo "Aviso: healthcheck não respondeu; veja: journalctl -u luzesombra-api -n 50 --no-pager"
  exit 1
fi
