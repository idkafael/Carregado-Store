#!/bin/bash
# Script de Deploy para Hostinger
# Execute este script após fazer upload dos arquivos via FTP

echo "🚀 Configurando projeto para Hostinger..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar banco de dados
echo "🗄️ Configurando banco de dados..."
node -e "
const { testConnection, syncDatabase } = require('./database');
(async () => {
    try {
        await testConnection();
        console.log('✅ Conexão com banco testada');
        await syncDatabase();
        console.log('✅ Banco de dados sincronizado');
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
})();
"

# Configurar permissões
echo "🔐 Configurando permissões..."
chmod 755 .
chmod 644 .htaccess
chmod 644 package.json

# Iniciar servidor
echo "🌐 Iniciando servidor..."
echo "✅ Projeto configurado para Hostinger!"
echo "📁 Acesse: https://carregado.store"
echo "🔧 Para iniciar: npm start"
