#!/bin/bash

echo "========================================"
echo "  CARREGADO STORE - SETUP LOCAL"
echo "========================================"
echo

# Função para log
log() {
    echo "[$(date +'%H:%M:%S')] $1"
}

# Função para erro
error() {
    echo "❌ ERRO: $1"
    exit 1
}

# Função para sucesso
success() {
    echo "✅ $1"
}

log "Instalando dependências..."
if [ ! -d "node_modules" ]; then
    log "Instalando dependências do servidor local..."
    npm install --save express cors dotenv @supabase/supabase-js axios
    if [ $? -ne 0 ]; then
        error "Falha ao instalar dependências"
    fi
    success "Dependências instaladas"
else
    log "Dependências já instaladas"
fi

echo
log "Configurando arquivo de ambiente..."
if [ ! -f ".env.local" ]; then
    log "Copiando env.local.example para .env.local..."
    cp env.local.example .env.local
    echo
    echo "⚠️  IMPORTANTE: Configure as variáveis em .env.local"
    echo "   - SUPABASE_SERVICE_ROLE_KEY (obrigatório)"
    echo "   - PUSHINPAY_TOKEN (já configurado)"
    echo
else
    log ".env.local já existe"
fi

echo
log "Verificando arquivos necessários..."
if [ ! -f "api/payment.js" ]; then
    error "api/payment.js não encontrado"
fi
if [ ! -f "server-local.js" ]; then
    error "server-local.js não encontrado"
fi

echo
log "Iniciando servidor local..."
echo
echo "🚀 Servidor será iniciado em http://localhost:3000"
echo "🧪 Teste: http://localhost:3000/test"
echo
echo "Pressione Ctrl+C para parar o servidor"
echo

node server-local.js
