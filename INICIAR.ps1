# Script de Inicialização - Da Sombra à Luz
# Execute este script para configurar e iniciar o projeto automaticamente

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "     DA SOMBRA À LUZ - Script de Inicialização" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Node.js não está instalado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Por favor, instale o Node.js:" -ForegroundColor Yellow
    Write-Host "   1. Acesse: https://nodejs.org/" -ForegroundColor White
    Write-Host "   2. Baixe a versão LTS (Recomendado)" -ForegroundColor White
    Write-Host "   3. Execute o instalador" -ForegroundColor White
    Write-Host "   4. Marque a opção 'Add to PATH'" -ForegroundColor White
    Write-Host "   5. Após instalar, feche e abra novo PowerShell" -ForegroundColor White
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✅ npm instalado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: npm não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar se node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências do projeto..." -ForegroundColor Yellow
    Write-Host "   (Isso pode levar alguns minutos...)" -ForegroundColor Gray
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
} else {
    Write-Host "✅ Dependências já instaladas" -ForegroundColor Green
}

Write-Host ""

# Verificar se Prisma Client foi gerado
if (!(Test-Path "node_modules\.prisma\client")) {
    Write-Host "🗄️  Configurando banco de dados..." -ForegroundColor Yellow
    
    npm run prisma:generate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Prisma Client gerado!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Erro ao gerar Prisma Client" -ForegroundColor Yellow
    }
    
    npm run prisma:push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Banco de dados criado!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Erro ao criar banco de dados" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Banco de dados já configurado" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           🚀 INICIANDO SERVIDOR..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Acesse o sistema em: http://localhost:3000" -ForegroundColor Green
Write-Host "🔐 Painel Admin: http://localhost:3000/admin" -ForegroundColor Green
Write-Host "🔑 Senha do Admin: luz2025" -ForegroundColor Green
Write-Host ""
Write-Host "⏹️  Para parar o servidor: Pressione Ctrl+C" -ForegroundColor Gray
Write-Host ""

# Iniciar servidor de desenvolvimento
npm run dev
