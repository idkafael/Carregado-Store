# Script para substituir arquivos no repositório Carregado-Store

echo "🔄 Substituindo arquivos no repositório Carregado-Store..."

# Navegar para o diretório do projeto
cd "D:\Downloads (HD)\Project\Telas\Tela OnlyFans Stripe Integrada"

# Remover .git se existir
if [ -d ".git" ]; then
    echo "🗑️ Removendo .git existente..."
    rm -rf .git
fi

# Inicializar novo repositório
echo "📁 Inicializando novo repositório Git..."
git init

# Conectar ao repositório correto
echo "🔗 Conectando ao repositório Carregado-Store..."
git remote add origin https://github.com/idkafael/Carregado-Store.git

# Adicionar apenas arquivos do projeto
echo "📦 Adicionando arquivos do projeto..."
git add index.html script.js styles.css package.json server.js
git add models/ routes/ utils/ 
git add .env vercel.json README.md LICENSE
git add *.md *.sh *.json

# Fazer commit
echo "💾 Fazendo commit..."
git commit -m "Update: Substituição completa dos arquivos - OnlyFans Stripe Integration"

# Push para GitHub
echo "📤 Fazendo push para GitHub..."
git push -f origin main

echo "✅ Substituição concluída!"
echo "📁 GitHub: https://github.com/idkafael/Carregado-Store"
echo "🌐 Site: https://carregado.store"
