# Deploy Completo na VPS Debian (Passo a Passo para Leigo)

Este guia foi feito para executar do zero, sem pular etapa.

## Visao geral do que vamos fazer

1. Conectar na VPS.
2. Instalar tudo que falta: Git, Node, pnpm, PostgreSQL, Nginx.
3. Criar banco local PostgreSQL.
4. Baixar o projeto via Git.
5. Configurar `.env`.
6. Instalar dependencias e buildar.
7. Subir backend com `systemd` (servico que reinicia sozinho).
8. Configurar Nginx para servir site + API.
9. (Opcional, recomendado) Ativar HTTPS com Certbot.

---

## 0) Antes de comecar (dados que voce precisa ter)

Tenha em maos:

- IP da VPS
- Usuario SSH (ex.: `root` ou `debian`)
- URL do repositorio Git (ex.: `https://github.com/seuusuario/luzesombra.git`)
- Dominio apontando para a VPS (ex.: `app.seudominio.com`) - opcional, mas recomendado

---

## 1) Conectar na VPS

No seu computador local (Windows PowerShell):

```bash
ssh root@IP_DA_VPS
```

Exemplo:

```bash
ssh root@123.45.67.89
```

Se for a primeira conexao, digite `yes`.

---

## 2) Atualizar o sistema Debian

Ja dentro da VPS:

```bash
apt update
apt upgrade -y
```

---

## 3) Instalar pacotes basicos

```bash
apt install -y curl git build-essential ca-certificates gnupg
```

---

## 4) Instalar Node.js 22 (LTS) e npm

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
```

Validar:

```bash
node -v
npm -v
```

---

## 5) Instalar pnpm global

```bash
npm install -g pnpm
pnpm -v
```

---

## 6) Instalar PostgreSQL local

```bash
apt install -y postgresql postgresql-contrib
systemctl enable --now postgresql
systemctl status postgresql
```

Se aparecer `active (running)`, esta OK.

---

## 7) Criar banco e usuario no PostgreSQL

### 7.1 Entrar no console do postgres

```bash
sudo -u postgres psql
```

### 7.2 Executar os comandos SQL (copie e cole)

```sql
CREATE USER luzesombra_user WITH PASSWORD 'Sucesso@2025';
CREATE DATABASE luzesombra_db OWNER luzesombra_user;
GRANT ALL PRIVILEGES ON DATABASE luzesombra_db TO luzesombra_user;
\q
```

`SENHA_FORTE_AQUI` deve ser uma senha forte real.

---

## 8) Instalar Nginx

```bash
apt install -y nginx
systemctl enable --now nginx
systemctl status nginx
```

---

## 9) Baixar o projeto com Git

Vamos usar a pasta `/opt/luzesombra`.

```bash
mkdir -p /opt
cd /opt
git clone https://github.com/raulinsonsouza-maker/Luz_e_Sombra luzesombra
cd luzesombra
```

Exemplo:

```bash
git clone https://github.com/seuusuario/luzesombra.git luzesombra
cd luzesombra
```

---

## 10) Criar e configurar arquivo `.env`

### 10.1 Copiar modelo

```bash
cp .env.example .env
```

### 10.2 Editar `.env`

```bash
nano .env
```

Use este exemplo (ajuste os valores):

```env
NODE_ENV=production

PORT=8080
DATABASE_URL=postgresql://luzesombra_user:Sucesso@2025@127.0.0.1:5432/luzesombra_db
JWT_SECRET=COLOQUE_UM_SEGREDO_BEM_GRANDE_AQUI
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SUcesso@2025
ADMIN_NOME=Administrador
LOG_LEVEL=info
CORS_ORIGIN=https://app.seudominio.com
OBJECT_STORAGE_DIR=/opt/luzesombra/storage

BASE_PATH=/
```

Salvar no nano: `Ctrl + O`, Enter, depois `Ctrl + X`.

---

## 11) Instalar dependencias do projeto

Dentro de `/opt/luzesombra`:

```bash
pnpm install --frozen-lockfile
```

Se der erro de lockfile, rode:

```bash
pnpm install --no-frozen-lockfile
```

---

## 12) Criar pastas e permissoes de upload

```bash
mkdir -p /opt/luzesombra/storage
chown -R www-data:www-data /opt/luzesombra/storage
chmod -R 775 /opt/luzesombra/storage
```

---

## 13) Rodar migracoes/schema no banco

```bash
pnpm --filter @workspace/db push
```

---

## 14) Buildar frontend e backend

```bash
pnpm --filter @workspace/luz-e-sombra build
pnpm --filter @workspace/api-server build
```

---

## 15) Criar servico systemd da API

### 15.1 Criar arquivo do servico

```bash
nano /etc/systemd/system/luzesombra-api.service
```

Cole:

```ini
[Unit]
Description=LuzeSombra API
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/luzesombra
EnvironmentFile=/opt/luzesombra/.env
ExecStart=/usr/bin/node --enable-source-maps /opt/luzesombra/artifacts/api-server/dist/index.mjs
Restart=always
RestartSec=5
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Salvar (`Ctrl + O`, Enter, `Ctrl + X`).

### 15.2 Ativar servico

```bash
systemctl daemon-reload
systemctl enable --now luzesombra-api
systemctl status luzesombra-api
```

Se estiver `active (running)`, API no ar.

### 15.3 Ver logs da API (debug)

```bash
journalctl -u luzesombra-api -f
```

Para sair: `Ctrl + C`.

---

## 16) Configurar Nginx (site + API)

### 16.1 Criar config do site

```bash
nano /etc/nginx/sites-available/luzesombra
```

Cole (troque `app.seudominio.com` pelo seu dominio):

```nginx
server {
  listen 80;
  server_name app.seudominio.com;

  root /opt/luzesombra/artifacts/luz-e-sombra/dist/public;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    try_files $uri /index.html;
  }
}
```

### 16.2 Ativar config

```bash
ln -s /etc/nginx/sites-available/luzesombra /etc/nginx/sites-enabled/luzesombra
nginx -t
systemctl reload nginx
```

Se `nginx -t` mostrar `syntax is ok`, esta certo.

---

## 17) (Opcional e recomendado) Ativar HTTPS com Certbot

### 17.1 Instalar certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 17.2 Emitir certificado

```bash
certbot --nginx -d app.seudominio.com
```

Siga as perguntas na tela e escolha redirecionar HTTP para HTTPS.

### 17.3 Testar renovacao automatica

```bash
certbot renew --dry-run
```

---

## 18) Checklist final de validacao

Rode estes testes:

```bash
curl http://127.0.0.1:8080/api/healthz
systemctl status luzesombra-api
systemctl status nginx
```

No navegador:

- `http://app.seudominio.com` (ou `https://` se SSL ativo)
- Fazer login
- Testar upload de imagem (perfil/traco/comunidade)

---

## 19) Produção: primeiro Git (push), depois a VPS

**Regra fixa:** o que corre em produção vem **só** do repositório remoto (GitHub/GitLab, etc.). Alterações só na tua máquina **não** entram na VPS até estarem **commitadas e enviadas** (`git push`).

### 19.1 Na tua máquina (sempre antes do deploy)

1. Confirma o branch (normalmente `main`, o mesmo que a VPS faz `pull`).
2. Envia o código para o remoto:

```bash
git status
git add -A
git commit -m "Descrição clara da alteração"
git push origin main
```

(Substitui `main` pelo nome do branch de produção, se for outro.)

Só depois disto faz sentido correr `git pull` na VPS ou o script `deploy-vps.sh`.

### 19.2 Na VPS — atualizar quando já existir commit no remoto

Dentro de `/opt/luzesombra`:

```bash
git pull
pnpm install --frozen-lockfile
pnpm --filter @workspace/db push
pnpm --filter @workspace/luz-e-sombra build
pnpm --filter @workspace/api-server build
systemctl restart luzesombra-api
systemctl reload nginx
```

Ou, em vez da sequência manual acima, a partir da raiz do clone na VPS:

```bash
sudo bash scripts/deploy-vps.sh
```

---

## 20) Comandos uteis de suporte

### Healthcheck do deploy falha (`curl` a `/api/healthz`)

O `scripts/deploy-vps.sh` volta a tentar o healthcheck durante alguns segundos (arranque lento ou `RestartSec`).

Se continuar a falhar, na VPS:

```bash
systemctl status luzesombra-api --no-pager -l
journalctl -u luzesombra-api -n 80 --no-pager
```

Causas frequentes:

- **`PORT` em falta** no ficheiro referenciado por `EnvironmentFile=` (ex.: `PORT=8080` no `/opt/luzesombra/.env`).
- **`DATABASE_URL` em falta** para o processo do systemd (o deploy faz `source .env` só para o `drizzle-kit`; o Node da API lê o mesmo ficheiro via systemd).
- **Permissões do `.env`**: com `User=www-data`, o utilizador tem de conseguir ler o ficheiro (ex.: `chgrp www-data /opt/luzesombra/.env` e `chmod 640 /opt/luzesombra/.env`).
- **Caminho do `ExecStart`**: tem de apontar para `artifacts/api-server/dist/index.mjs` dentro do clone atualizado.

Teste manual na VPS:

```bash
curl -sv http://127.0.0.1:8080/api/healthz
```

Ver logs da API:

```bash
journalctl -u luzesombra-api -n 100 --no-pager
```

Reiniciar API:

```bash
systemctl restart luzesombra-api
```

Ver erros do Nginx:

```bash
tail -n 100 /var/log/nginx/error.log
```

---

## Observacoes importantes

- O backend agora salva arquivos localmente em `OBJECT_STORAGE_DIR`.
- Em producao, sempre use senhas fortes em `DATABASE_URL`, `JWT_SECRET` e `ADMIN_PASSWORD`.
- Se usar dominio, configure DNS antes do Certbot (registro A apontando para IP da VPS).
