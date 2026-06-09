#!/usr/bin/env bash
#
# Atualiza LuzeSombra na VPS: pull, dependências, schema (opcional), build, restart.
#
# IMPORTANTE (produção): na máquina de desenvolvimento, faz sempre
#   git commit && git push
# para o branch que a VPS usa (ex.: main) ANTES de correr este script na VPS.
# O deploy só traz o que já está no remoto; código só local nunca aparece em produção.
#
# Uso:
#   sudo bash scripts/deploy-vps.sh
#   ou, a partir da raiz do projeto:
#   sudo ./scripts/deploy-vps.sh
#
# Variáveis opcionais:
#   APP_DIR=/caminho/do/clone     (padrão: /opt/luzesombra)
#   SKIP_DB_PUSH=1                não roda drizzle-kit push (quando não mudou lib/db)
#   SKIP_TESTS=1                  não roda testes do motor traco antes do build
#   HEALTHCHECK_RETRIES=25        tentativas do curl ao healthz (padrão: 25)
#   HEALTHCHECK_SLEEP=1           segundos entre tentativas (padrão: 1)
#

set -e

# sudo costuma limpar o PATH; pnpm fica em /usr/local/bin ou no npm global do root.
resolve_pnpm() {
  if command -v pnpm >/dev/null 2>&1; then
    command -v pnpm
    return 0
  fi
  local candidate
  for candidate in \
    /usr/local/bin/pnpm \
    /usr/bin/pnpm \
    /root/.local/share/pnpm/pnpm \
    /root/.npm-global/bin/pnpm; do
    if [[ -x "$candidate" ]]; then
      echo "$candidate"
      return 0
    fi
  done
  if command -v corepack >/dev/null 2>&1; then
    corepack enable >/dev/null 2>&1 || true
    corepack prepare pnpm@9 --activate >/dev/null 2>&1 || true
    if command -v pnpm >/dev/null 2>&1; then
      command -v pnpm
      return 0
    fi
  fi
  if command -v npm >/dev/null 2>&1; then
    echo "pnpm não encontrado; instalando globalmente com npm…" >&2
    npm install -g pnpm
    command -v pnpm
    return 0
  fi
  echo "Erro: pnpm não encontrado. Instale com: npm install -g pnpm" >&2
  return 1
}

PNPM="$(resolve_pnpm)"
export PATH="$(dirname "$PNPM"):${PATH:-/usr/local/bin:/usr/bin}"

APP_DIR="${APP_DIR:-/opt/luzesombra}"
SKIP_DB_PUSH="${SKIP_DB_PUSH:-0}"
SKIP_TESTS="${SKIP_TESTS:-0}"
HEALTHCHECK_RETRIES="${HEALTHCHECK_RETRIES:-25}"
HEALTHCHECK_SLEEP="${HEALTHCHECK_SLEEP:-1}"

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
echo "==> git fetch + reset (clone de produção segue o remoto; alterações locais são descartadas)"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if git diff --quiet && git diff --cached --quiet; then
  git pull --ff-only origin "$BRANCH"
else
  echo "   Aviso: working tree suja (ex.: pnpm-lock.yaml modificado localmente); a alinhar com origin/$BRANCH"
  git fetch origin
  git reset --hard "origin/$BRANCH"
fi

echo ""
echo "==> pnpm install ($PNPM)"
if ! "$PNPM" install --frozen-lockfile; then
  echo "Aviso: --frozen-lockfile falhou; tentando sem travar o lockfile..."
  "$PNPM" install --no-frozen-lockfile
fi

if [[ "$SKIP_TESTS" != "1" ]]; then
  echo ""
  echo "==> testes motor traco (@workspace/traco-imagem-engine)"
  "$PNPM" --filter @workspace/traco-imagem-engine test
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
  "$PNPM" --filter @workspace/db push
fi

echo ""
echo "==> build frontend (@workspace/luz-e-sombra)"
"$PNPM" --filter @workspace/luz-e-sombra build

echo ""
echo "==> build API (@workspace/api-server)"
"$PNPM" --filter @workspace/api-server build

echo ""
echo "==> systemctl restart luzesombra-api + reload nginx"
systemctl restart luzesombra-api
systemctl reload nginx

echo ""
echo "==> healthcheck (http://127.0.0.1:8080/api/healthz, até $((HEALTHCHECK_RETRIES * HEALTHCHECK_SLEEP))s)"
ok=0
for ((i = 1; i <= HEALTHCHECK_RETRIES; i++)); do
  if curl -sf http://127.0.0.1:8080/api/healthz >/dev/null; then
    ok=1
    break
  fi
  if ((i == 1)); then
    systemctl is-active --quiet luzesombra-api || echo "   Aviso: unidade luzesombra-api não está active."
  fi
  echo "   aguardando API… ($i/$HEALTHCHECK_RETRIES)"
  sleep "$HEALTHCHECK_SLEEP"
done

if [[ "$ok" -eq 1 ]]; then
  curl -s http://127.0.0.1:8080/api/healthz
  echo ""
  echo ""
  echo "==> artefatos compilados (datas devem ser de hoje)"
  ls -la artifacts/api-server/dist/index.mjs 2>/dev/null || true
  ls -la artifacts/luz-e-sombra/dist/public/index.html 2>/dev/null || true
  echo ""
  systemctl status luzesombra-api --no-pager -l | head -8 || true
  echo ""
  echo "Concluído com sucesso."
  echo "No browser: hard refresh (Ctrl+Shift+R) e Reanalisar no Traço para carregar traco-mediapipe-v3."
else
  echo ""
  echo "Erro: healthcheck não respondeu após ${HEALTHCHECK_RETRIES} tentativas."
  echo "Diagnóstico rápido:"
  systemctl status luzesombra-api --no-pager -l || true
  echo ""
  echo "Logs recentes:"
  journalctl -u luzesombra-api -n 40 --no-pager || true
  echo ""
  echo "Verifique no .env do systemd (EnvironmentFile=): PORT=8080, DATABASE_URL, e permissões"
  echo "para o User do serviço (ex.: www-data) ler o ficheiro (ex.: grupo www-data + chmod 640)."
  exit 1
fi
