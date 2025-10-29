#!/bin/bash
# Script para substituir arquivos no repositório Carregado-Store

echo "🔄 Substituindo arquivos no repositório Carregado-Store..."

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

# Verificar se remote origin existe
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  Remote origin não configurado."
    echo "Configure com: git remote add origin https://github.com/carregadostore/Carregado-Store.git"
    echo "Ou clone o repositório primeiro."
    exit 1
fi

# Adicionar todos os arquivos
echo "📦 Adicionando todos os arquivos..."
git add .

# Commit das mudanças
echo "💾 Fazendo commit..."
git commit -m "Update: Substituição completa dos arquivos - $(date '+%Y-%m-%d %H:%M:%S')"

# Push para GitHub
echo "📤 Fazendo push para GitHub..."
git push origin main

# Deploy para Vercel
echo "🌐 Fazendo deploy para Vercel..."
vercel --prod

echo "✅ Substituição concluída!"
echo "📁 GitHub: https://github.com/carregadostore/Carregado-Store"
echo "🌐 Site: https://carregado.store"
echo "📊 Dashboard: https://vercel.com/dashboard"
