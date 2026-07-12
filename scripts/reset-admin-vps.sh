#!/bin/bash
set -e
set -a
source /opt/luzesombra/.env
set +a
HASH='$2b$10$xiDI6P8u97uNRPNFSSpy2uDQz0Ysi4BHgUkGddG1knFS.QeE5e5Om'
psql "$DATABASE_URL" -c "UPDATE usuarios SET senha = '${HASH}', atualizado_em = NOW() WHERE username = 'admin' AND is_admin = true RETURNING id, username, nome;"
sed -i 's/^ADMIN_PASSWORD=.*/ADMIN_PASSWORD=admin/' /opt/luzesombra/.env
echo "ADMIN_PASSWORD atualizado no .env"
