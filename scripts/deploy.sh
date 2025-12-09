#!/bin/bash

# 🚀 Script de Deploy Automatizado - Carregado Store
# Execute: chmod +x scripts/deploy.sh && ./scripts/deploy.sh

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy completo do Carregado Store..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
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

# Verificar pré-requisitos
log "Verificando pré-requisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    error "Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    error "npm não encontrado. Instale npm primeiro."
    exit 1
fi

# Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
    warning "Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

success "Pré-requisitos verificados!"

# 1. Instalar dependências
log "📦 Instalando dependências do projeto..."
npm install

log "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

success "Dependências instaladas!"

# 2. Verificar configurações
log "🔍 Verificando configurações..."

# Verificar se arquivo .env existe no backend
if [ ! -f "backend/.env" ]; then
    warning "Arquivo .env não encontrado no backend. Copiando exemplo..."
    cp backend/env.example backend/.env
    warning "⚠️ IMPORTANTE: Configure as variáveis de ambiente em backend/.env"
fi

# Verificar se variáveis estão configuradas
if grep -q "your-super-secret-jwt-key-here" backend/.env; then
    error "❌ Configure JWT_SECRET em backend/.env"
    exit 1
fi

success "Configurações verificadas!"

# 3. Deploy do Backend (Railway)
log "🚂 Configurando deploy do backend no Railway..."

# Verificar se railway.json existe
if [ ! -f "railway.json" ]; then
    error "Arquivo railway.json não encontrado!"
    exit 1
fi

log "📋 Instruções para Railway:"
echo "1. Acesse https://railway.app"
echo "2. Conecte sua conta GitHub"
echo "3. Crie novo projeto"
echo "4. Conecte este repositório"
echo "5. Configure as variáveis de ambiente:"
echo "   - JWT_SECRET=sua-chave-secreta"
echo "   - SUPABASE_URL=https://vyibdpwhkklxzuxaouza.supabase.co"
echo "   - SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key"
echo "   - PUSHINPAY_TOKEN=48754|3wdvl7xAOkCJM3gD86aJ78aErQcXVBrTn24qEztJ9629c3ea"
echo "   - ALLOWED_ORIGINS=https://carregado-store.com,https://www.carregado-store.com"

read -p "Pressione Enter quando o backend estiver deployado no Railway..."

# 4. Deploy do Frontend (Vercel)
log "🌐 Fazendo deploy do frontend no Vercel..."

# Verificar se está logado no Vercel
if ! vercel whoami &> /dev/null; then
    warning "Não está logado no Vercel. Fazendo login..."
    vercel login
fi

# Deploy
log "Deployando para Vercel..."
vercel --prod

success "Frontend deployado!"

# 5. Configurar domínio personalizado
log "🌐 Configurando domínio personalizado..."

echo "Para configurar domínio personalizado:"
echo "1. Acesse https://vercel.com/dashboard"
echo "2. Vá em Settings > Domains"
echo "3. Adicione seu domínio (ex: carregado-store.com)"
echo "4. Configure DNS conforme instruções"

# 6. Atualizar configurações
log "⚙️ Atualizando configurações..."

# Criar arquivo de configuração para produção
cat > frontend-secure/config-production.js << EOF
// Configuração de Produção - Carregado Store
const SecureConfig = {
  apiUrl: 'https://carregado-store-backend.railway.app/api',
  
  timeouts: {
    pixExpiration: 30 * 60 * 1000,
    statusCheckInterval: 5000,
    redirectDelay: 3000
  },
  
  retry: {
    maxAttempts: 3,
    delay: 2000
  },
  
  messages: {
    creatingPix: 'Criando PIX...',
    waitingPayment: 'Aguardando pagamento...',
    paymentConfirmed: 'Pagamento confirmado!',
    paymentExpired: 'PIX expirado. Crie um novo pagamento.',
    errorCreatingPix: 'Erro ao criar PIX. Tente novamente.',
    errorCheckingStatus: 'Erro ao verificar status. Tente novamente.',
    qrCodeError: 'Erro ao carregar QR Code',
    pixCodeCopied: 'Código PIX copiado!'
  },
  
  debug: {
    enabled: false,
    logLevel: 'error'
  },
  
  urls: {
    success: 'agradecimento.html',
    error: 'erro-pagamento.html'
  },
  
  notifications: {
    duration: 10000,
    position: 'top-right'
  }
};

// Exportar para global
if (typeof window !== 'undefined') {
  window.SecureConfig = SecureConfig;
}
EOF

success "Configurações atualizadas!"

# 7. Testes finais
log "🧪 Executando testes finais..."

# Verificar se arquivos essenciais existem
required_files=(
    "index.html"
    "frontend-secure/api-client.js"
    "frontend-secure/auth-secure.js"
    "frontend-secure/payment-secure.js"
    "frontend-secure/config-secure.js"
    "backend/server.js"
    "backend/package.json"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        error "Arquivo essencial não encontrado: $file"
        exit 1
    fi
done

success "Todos os arquivos essenciais encontrados!"

# 8. Resumo final
log "📋 Resumo do Deploy:"
echo ""
echo "✅ Frontend: Deployado no Vercel"
echo "✅ Backend: Configurado para Railway"
echo "✅ Segurança: Implementada"
echo "✅ Dependências: Instaladas"
echo ""
echo "🔗 URLs:"
echo "   Frontend: https://carregado-store.vercel.app"
echo "   Backend: https://carregado-store-backend.railway.app"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure domínio personalizado no Vercel"
echo "2. Configure DNS do seu domínio"
echo "3. Teste todas as funcionalidades"
echo "4. Configure monitoramento"
echo ""

success "🎉 Deploy concluído com sucesso!"

echo ""
echo "📞 Suporte:"
echo "   - Vercel Dashboard: https://vercel.com/dashboard"
echo "   - Railway Dashboard: https://railway.app/dashboard"
echo "   - Supabase Dashboard: https://supabase.com/dashboard"
echo ""
