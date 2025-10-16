#!/bin/bash

# ⚙️ Script de Configuração Inicial - Carregado Store
# Execute: chmod +x scripts/setup.sh && ./scripts/setup.sh

set -e

echo "⚙️ Configurando Carregado Store..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar Node.js
log "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js não encontrado. Instale Node.js 18+ primeiro."
    echo "Download: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
log "Node.js versão: $NODE_VERSION"

# Verificar se é versão 18+
if ! node -e "process.exit(parseInt(process.version.slice(1)) >= 18 ? 0 : 1)" 2>/dev/null; then
    error "Node.js 18+ é necessário. Versão atual: $NODE_VERSION"
    exit 1
fi

success "Node.js OK!"

# 2. Verificar npm
log "🔍 Verificando npm..."
if ! command -v npm &> /dev/null; then
    error "npm não encontrado."
    exit 1
fi

NPM_VERSION=$(npm --version)
log "npm versão: $NPM_VERSION"
success "npm OK!"

# 3. Instalar dependências globais
log "📦 Instalando dependências globais..."

# Vercel CLI
if ! command -v vercel &> /dev/null; then
    log "Instalando Vercel CLI..."
    npm install -g vercel
else
    log "Vercel CLI já instalado"
fi

# Live Server (para desenvolvimento)
if ! command -v live-server &> /dev/null; then
    log "Instalando Live Server..."
    npm install -g live-server
else
    log "Live Server já instalado"
fi

success "Dependências globais instaladas!"

# 4. Instalar dependências do projeto
log "📦 Instalando dependências do projeto..."
npm install

log "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

success "Dependências do projeto instaladas!"

# 5. Configurar arquivos de ambiente
log "⚙️ Configurando arquivos de ambiente..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    log "Criando backend/.env..."
    cp backend/env.example backend/.env
    warning "⚠️ Configure as variáveis em backend/.env"
else
    log "backend/.env já existe"
fi

# Frontend .env.local
if [ ! -f ".env.local" ]; then
    log "Criando .env.local..."
    cat > .env.local << EOF
# Configurações do Frontend
REACT_APP_API_URL=https://carregado-store-backend.railway.app/api
NODE_ENV=production
EOF
    success "Arquivo .env.local criado!"
else
    log ".env.local já existe"
fi

# 6. Verificar estrutura de arquivos
log "🔍 Verificando estrutura de arquivos..."

required_files=(
    "index.html"
    "package.json"
    "vercel.json"
    "railway.json"
    "backend/server.js"
    "backend/package.json"
    "frontend-secure/api-client.js"
    "frontend-secure/auth-secure.js"
    "frontend-secure/payment-secure.js"
    "frontend-secure/config-secure.js"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    error "Arquivos essenciais não encontrados:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

success "Estrutura de arquivos OK!"

# 7. Configurar permissões
log "🔐 Configurando permissões..."
chmod +x scripts/*.sh
success "Permissões configuradas!"

# 8. Testar configuração
log "🧪 Testando configuração..."

# Testar se o backend pode ser iniciado
cd backend
if timeout 10s npm start &> /dev/null; then
    success "Backend pode ser iniciado!"
else
    warning "Backend não pôde ser iniciado (normal se dependências não estiverem configuradas)"
fi
cd ..

# 9. Resumo da configuração
log "📋 Resumo da configuração:"
echo ""
echo "✅ Node.js: $NODE_VERSION"
echo "✅ npm: $NPM_VERSION"
echo "✅ Dependências: Instaladas"
echo "✅ Arquivos: Verificados"
echo "✅ Scripts: Configurados"
echo ""
echo "📁 Estrutura do projeto:"
echo "   ├── frontend/ (arquivos estáticos)"
echo "   ├── backend/ (API Node.js)"
echo "   ├── frontend-secure/ (código seguro)"
echo "   └── scripts/ (scripts de deploy)"
echo ""
echo "🚀 Próximos passos:"
echo "1. Configure as variáveis em backend/.env"
echo "2. Execute: ./scripts/deploy.sh"
echo "3. Configure domínio personalizado"
echo ""

success "🎉 Configuração concluída!"

echo ""
echo "📞 Comandos úteis:"
echo "   npm run dev          # Desenvolvimento local"
echo "   npm run backend:dev  # Backend local"
echo "   ./scripts/deploy.sh  # Deploy completo"
echo "   ./scripts/update.sh  # Atualizar deploy"
echo ""
