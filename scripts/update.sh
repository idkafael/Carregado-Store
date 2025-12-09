#!/bin/bash

# 🔄 Script de Atualização - Carregado Store
# Execute: chmod +x scripts/update.sh && ./scripts/update.sh

set -e

echo "🔄 Atualizando Carregado Store..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

# 1. Atualizar dependências
log "📦 Atualizando dependências..."
npm install

cd backend
npm install
cd ..

success "Dependências atualizadas!"

# 2. Deploy backend (Railway faz automaticamente)
log "🚂 Backend será atualizado automaticamente no Railway"

# 3. Deploy frontend
log "🌐 Atualizando frontend..."
vercel --prod

success "Frontend atualizado!"

# 4. Verificar status
log "🔍 Verificando status..."

# Verificar se Vercel CLI está disponível
if command -v vercel &> /dev/null; then
    log "Status do Vercel:"
    vercel ls
fi

success "🎉 Atualização concluída!"

echo ""
echo "🔗 URLs:"
echo "   Frontend: https://carregado-store.vercel.app"
echo "   Backend: https://carregado-store-backend.railway.app"
echo ""
