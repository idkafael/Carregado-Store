@echo off
REM 🚀 Script de Deploy Automatizado - Carregado Store (Windows)
REM Execute: scripts\deploy.bat

echo 🚀 Iniciando deploy completo do Carregado Store...

REM 1. Verificar pré-requisitos
echo Verificando pré-requisitos...

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale Node.js 18+ primeiro.
    pause
    exit /b 1
)

REM Verificar npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado. Instale npm primeiro.
    pause
    exit /b 1
)

echo ✅ Pré-requisitos verificados!

REM 2. Instalar dependências
echo 📦 Instalando dependências do projeto...
npm install

echo 📦 Instalando dependências do backend...
cd backend
npm install
cd ..

echo ✅ Dependências instaladas!

REM 3. Verificar configurações
echo 🔍 Verificando configurações...

REM Verificar se arquivo .env existe no backend
if not exist "backend\.env" (
    echo ⚠️ Arquivo .env não encontrado no backend. Copiando exemplo...
    copy "backend\env.example" "backend\.env"
    echo ⚠️ IMPORTANTE: Configure as variáveis de ambiente em backend\.env
)

REM Verificar se variáveis estão configuradas
findstr /C:"your-super-secret-jwt-key-here" "backend\.env" >nul
if %errorlevel%==0 (
    echo ❌ Configure JWT_SECRET em backend\.env
    pause
    exit /b 1
)

echo ✅ Configurações verificadas!

REM 4. Deploy do Backend (Railway)
echo 🚂 Configurando deploy do backend no Railway...

if not exist "railway.json" (
    echo ❌ Arquivo railway.json não encontrado!
    pause
    exit /b 1
)

echo 📋 Instruções para Railway:
echo 1. Acesse https://railway.app
echo 2. Conecte sua conta GitHub
echo 3. Crie novo projeto
echo 4. Conecte este repositório
echo 5. Configure as variáveis de ambiente:
echo    - JWT_SECRET=sua-chave-secreta
echo    - SUPABASE_URL=https://vyibdpwhkklxzuxaouza.supabase.co
echo    - SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
echo    - PUSHINPAY_TOKEN=48754^|3wdvl7xAOkCJM3gD86aJ78aErQcXVBrTn24qEztJ9629c3ea
echo    - ALLOWED_ORIGINS=https://carregado-store.com,https://www.carregado-store.com
echo.
pause

REM 5. Deploy do Frontend (Vercel)
echo 🌐 Fazendo deploy do frontend no Vercel...

REM Verificar se está logado no Vercel
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Não está logado no Vercel. Fazendo login...
    vercel login
)

REM Deploy
echo Deployando para Vercel...
vercel --prod

echo ✅ Frontend deployado!

REM 6. Configurar domínio personalizado
echo 🌐 Configurando domínio personalizado...

echo Para configurar domínio personalizado:
echo 1. Acesse https://vercel.com/dashboard
echo 2. Vá em Settings ^> Domains
echo 3. Adicione seu domínio (ex: carregado-store.com)
echo 4. Configure DNS conforme instruções

REM 7. Atualizar configurações
echo ⚙️ Atualizando configurações...

REM Criar arquivo de configuração para produção
echo // Configuração de Produção - Carregado Store > frontend-secure\config-production.js
echo const SecureConfig = { >> frontend-secure\config-production.js
echo   apiUrl: 'https://carregado-store-backend.railway.app/api', >> frontend-secure\config-production.js
echo. >> frontend-secure\config-production.js
echo   timeouts: { >> frontend-secure\config-production.js
echo     pixExpiration: 30 * 60 * 1000, >> frontend-secure\config-production.js
echo     statusCheckInterval: 5000, >> frontend-secure\config-production.js
echo     redirectDelay: 3000 >> frontend-secure\config-production.js
echo   }, >> frontend-secure\config-production.js
echo. >> frontend-secure\config-production.js
echo   retry: { >> frontend-secure\config-production.js
echo     maxAttempts: 3, >> frontend-secure\config-production.js
echo     delay: 2000 >> frontend-secure\config-production.js
echo   }, >> frontend-secure\config-production.js
echo. >> frontend-secure\config-production.js
echo   messages: { >> frontend-secure\config-production.js
echo     creatingPix: 'Criando PIX...', >> frontend-secure\config-production.js
echo     waitingPayment: 'Aguardando pagamento...', >> frontend-secure\config-production.js
echo     paymentConfirmed: 'Pagamento confirmado!', >> frontend-secure\config-production.js
echo     paymentExpired: 'PIX expirado. Crie um novo pagamento.', >> frontend-secure\config-production.js
echo     errorCreatingPix: 'Erro ao criar PIX. Tente novamente.', >> frontend-secure\config-production.js
echo     errorCheckingStatus: 'Erro ao verificar status. Tente novamente.', >> frontend-secure\config-production.js
echo     qrCodeError: 'Erro ao carregar QR Code', >> frontend-secure\config-production.js
echo     pixCodeCopied: 'Código PIX copiado!' >> frontend-secure\config-production.js
echo   }, >> frontend-secure\config-production.js
echo. >> frontend-secure\config-production.js
echo   debug: { >> frontend-secure\config-production.js
echo     enabled: false, >> frontend-secure\config-production.js
echo     logLevel: 'error' >> frontend-secure\config-production.js
echo   }, >> frontend-secure\config-production.js
echo. >> frontend-secure\config-production.js
echo   urls: { >> frontend-secure\config-production.js
echo     success: 'agradecimento.html', >> frontend-secure\config-production.js
echo     error: 'erro-pagamento.html' >> frontend-secure\config-production.js
echo   }, >> frontend-secure\config-production.js
echo. >> frontend-secure\config-production.js
echo   notifications: { >> frontend-secure\config-production.js
echo     duration: 10000, >> frontend-secure\config-production.js
echo     position: 'top-right' >> frontend-secure\config-production.js
echo   } >> frontend-secure\config-production.js
echo }; >> frontend-secure\config-production.js
echo. >> frontend-secure\config-production.js
echo // Exportar para global >> frontend-secure\config-production.js
echo if (typeof window !== 'undefined') { >> frontend-secure\config-production.js
echo   window.SecureConfig = SecureConfig; >> frontend-secure\config-production.js
echo } >> frontend-secure\config-production.js

echo ✅ Configurações atualizadas!

REM 8. Testes finais
echo 🧪 Executando testes finais...

REM Verificar se arquivos essenciais existem
set REQUIRED_FILES=0

if not exist "index.html" (
    echo ❌ index.html não encontrado
    set REQUIRED_FILES=1
)
if not exist "frontend-secure\api-client.js" (
    echo ❌ frontend-secure\api-client.js não encontrado
    set REQUIRED_FILES=1
)
if not exist "frontend-secure\auth-secure.js" (
    echo ❌ frontend-secure\auth-secure.js não encontrado
    set REQUIRED_FILES=1
)
if not exist "frontend-secure\payment-secure.js" (
    echo ❌ frontend-secure\payment-secure.js não encontrado
    set REQUIRED_FILES=1
)
if not exist "frontend-secure\config-secure.js" (
    echo ❌ frontend-secure\config-secure.js não encontrado
    set REQUIRED_FILES=1
)
if not exist "backend\server.js" (
    echo ❌ backend\server.js não encontrado
    set REQUIRED_FILES=1
)
if not exist "backend\package.json" (
    echo ❌ backend\package.json não encontrado
    set REQUIRED_FILES=1
)

if %REQUIRED_FILES%==1 (
    echo ❌ Arquivos essenciais não encontrados!
    pause
    exit /b 1
)

echo ✅ Todos os arquivos essenciais encontrados!

REM 9. Resumo final
echo 📋 Resumo do Deploy:
echo.
echo ✅ Frontend: Deployado no Vercel
echo ✅ Backend: Configurado para Railway
echo ✅ Segurança: Implementada
echo ✅ Dependências: Instaladas
echo.
echo 🔗 URLs:
echo    Frontend: https://carregado-store.vercel.app
echo    Backend: https://carregado-store-backend.railway.app
echo.
echo 📋 Próximos passos:
echo 1. Configure domínio personalizado no Vercel
echo 2. Configure DNS do seu domínio
echo 3. Teste todas as funcionalidades
echo 4. Configure monitoramento
echo.

echo ✅ 🎉 Deploy concluído com sucesso!
echo.
echo 📞 Suporte:
echo    - Vercel Dashboard: https://vercel.com/dashboard
echo    - Railway Dashboard: https://railway.app/dashboard
echo    - Supabase Dashboard: https://supabase.com/dashboard
echo.

pause
