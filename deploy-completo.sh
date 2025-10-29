#!/bin/bash
# Script de Deploy Automatizado - GitHub + Vercel

echo "🚀 Iniciando deploy para GitHub e Vercel..."

# Verificar se Git está configurado
if ! git config user.name &> /dev/null; then
    echo "❌ Git não configurado. Configure primeiro:"
    echo "git config --global user.name 'Seu Nome'"
    echo "git config --global user.email 'seu@email.com'"
    exit 1
fi

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se está logado na Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Fazendo login na Vercel..."
    vercel login
fi

# Inicializar Git se não existir
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositório Git..."
    git init
    git add .
    git commit -m "Initial commit - carregado.store"
fi

# Adicionar arquivos ao Git
echo "📦 Adicionando arquivos ao Git..."
git add .

# Commit das mudanças
echo "💾 Fazendo commit..."
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# Verificar se remote origin existe
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  Remote origin não configurado."
    echo "Configure com: git remote add origin https://github.com/carregadostore/carregado.store.git"
    echo "Ou crie o repositório no GitHub primeiro."
    exit 1
fi

# Push para GitHub
echo "📤 Fazendo push para GitHub..."
git push origin main

# Deploy para Vercel
echo "🌐 Fazendo deploy para Vercel..."
vercel --prod

echo "✅ Deploy concluído!"
echo "📁 GitHub: https://github.com/carregadostore/carregado.store"
echo "🌐 Site: https://carregado.store"
echo "📊 Dashboard: https://vercel.com/dashboard"
