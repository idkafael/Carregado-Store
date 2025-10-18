#!/usr/bin/env node

/**
 * Script de Deploy para Vercel - Carregado Store
 * Execute: node deploy-vercel.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message) {
  console.log(`${colors.blue}[${new Date().toLocaleTimeString()}]${colors.reset} ${message}`);
}

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function warning(message) {
  console.log(`${colors.yellow}⚠️ ${message}${colors.reset}`);
}

function error(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

async function main() {
  try {
    log('🚀 Iniciando deploy do Carregado Store na Vercel...');

    // 1. Verificar se Vercel CLI está instalado
    log('Verificando Vercel CLI...');
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      success('Vercel CLI encontrado');
    } catch (err) {
      warning('Vercel CLI não encontrado. Instalando...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
      success('Vercel CLI instalado');
    }

    // 2. Verificar se está logado
    log('Verificando autenticação...');
    try {
      execSync('vercel whoami', { stdio: 'pipe' });
      success('Autenticado no Vercel');
    } catch (err) {
      warning('Não está logado. Fazendo login...');
      execSync('vercel login', { stdio: 'inherit' });
    }

    // 3. Verificar arquivos essenciais
    log('Verificando arquivos essenciais...');
    const requiredFiles = [
      'index.html',
      'vercel.json',
      'api/auth.js',
      'api/payment.js',
      'api/products.js',
      'styles.css',
      'script.js'
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        error(`Arquivo essencial não encontrado: ${file}`);
        process.exit(1);
      }
    }
    success('Todos os arquivos essenciais encontrados');

    // 4. Verificar variáveis de ambiente
    log('Verificando configuração...');
    if (!fs.existsSync('.env.local')) {
      warning('Arquivo .env.local não encontrado');
      if (fs.existsSync('env.example')) {
        warning('Copie env.example para .env.local e configure as variáveis');
      }
    }

    // 5. Deploy
    log('Fazendo deploy na Vercel...');
    const deployCommand = process.argv.includes('--preview') ? 'vercel' : 'vercel --prod';
    execSync(deployCommand, { stdio: 'inherit' });

    success('Deploy concluído com sucesso!');

    // 6. Instruções finais
    log('📋 Próximos passos:');
    console.log('');
    console.log('1. Configure as variáveis de ambiente no Vercel:');
    console.log('   - Acesse https://vercel.com/dashboard');
    console.log('   - Vá em Settings > Environment Variables');
    console.log('   - Adicione as variáveis do arquivo env.example');
    console.log('');
    console.log('2. Configure o domínio carregado.store:');
    console.log('   - Vá em Settings > Domains');
    console.log('   - Adicione carregado.store');
    console.log('   - Configure DNS conforme instruções');
    console.log('');
    console.log('3. Teste todas as funcionalidades:');
    console.log('   - Login/Registro');
    console.log('   - Pagamentos PIX');
    console.log('   - Produtos');
    console.log('');

  } catch (err) {
    error(`Erro durante o deploy: ${err.message}`);
    process.exit(1);
  }
}

main();


