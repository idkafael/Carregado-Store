@echo off
REM ⚙️ Script de Configuração Inicial - Carregado Store (Windows)
REM Execute: scripts\setup.bat

echo ⚙️ Configurando Carregado Store...

REM 1. Verificar Node.js
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale Node.js 18+ primeiro.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js versão: %NODE_VERSION%
echo ✅ Node.js OK!

REM 2. Verificar npm
echo 🔍 Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo npm versão: %NPM_VERSION%
echo ✅ npm OK!

REM 3. Instalar dependências globais
echo 📦 Instalando dependências globais...

REM Vercel CLI
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando Vercel CLI...
    npm install -g vercel
) else (
    echo Vercel CLI já instalado
)

REM Live Server
live-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando Live Server...
    npm install -g live-server
) else (
    echo Live Server já instalado
)

echo ✅ Dependências globais instaladas!

REM 4. Instalar dependências do projeto
echo 📦 Instalando dependências do projeto...
npm install

echo 📦 Instalando dependências do backend...
cd backend
npm install
cd ..

echo ✅ Dependências do projeto instaladas!

REM 5. Configurar arquivos de ambiente
echo ⚙️ Configurando arquivos de ambiente...

REM Backend .env
if not exist "backend\.env" (
    echo Criando backend\.env...
    copy "backend\env.example" "backend\.env"
    echo ⚠️ Configure as variáveis em backend\.env
) else (
    echo backend\.env já existe
)

REM Frontend .env.local
if not exist ".env.local" (
    echo Criando .env.local...
    echo # Configurações do Frontend > .env.local
    echo REACT_APP_API_URL=https://carregado-store-backend.railway.app/api >> .env.local
    echo NODE_ENV=production >> .env.local
    echo ✅ Arquivo .env.local criado!
) else (
    echo .env.local já existe
)

REM 6. Verificar estrutura de arquivos
echo 🔍 Verificando estrutura de arquivos...

set MISSING_FILES=0

if not exist "index.html" (
    echo ❌ index.html não encontrado
    set MISSING_FILES=1
)
if not exist "package.json" (
    echo ❌ package.json não encontrado
    set MISSING_FILES=1
)
if not exist "vercel.json" (
    echo ❌ vercel.json não encontrado
    set MISSING_FILES=1
)
if not exist "railway.json" (
    echo ❌ railway.json não encontrado
    set MISSING_FILES=1
)
if not exist "backend\server.js" (
    echo ❌ backend\server.js não encontrado
    set MISSING_FILES=1
)
if not exist "backend\package.json" (
    echo ❌ backend\package.json não encontrado
    set MISSING_FILES=1
)
if not exist "frontend-secure\api-client.js" (
    echo ❌ frontend-secure\api-client.js não encontrado
    set MISSING_FILES=1
)
if not exist "frontend-secure\auth-secure.js" (
    echo ❌ frontend-secure\auth-secure.js não encontrado
    set MISSING_FILES=1
)
if not exist "frontend-secure\payment-secure.js" (
    echo ❌ frontend-secure\payment-secure.js não encontrado
    set MISSING_FILES=1
)
if not exist "frontend-secure\config-secure.js" (
    echo ❌ frontend-secure\config-secure.js não encontrado
    set MISSING_FILES=1
)

if %MISSING_FILES%==1 (
    echo ❌ Arquivos essenciais não encontrados!
    pause
    exit /b 1
)

echo ✅ Estrutura de arquivos OK!

REM 7. Resumo da configuração
echo 📋 Resumo da configuração:
echo.
echo ✅ Node.js: %NODE_VERSION%
echo ✅ npm: %NPM_VERSION%
echo ✅ Dependências: Instaladas
echo ✅ Arquivos: Verificados
echo ✅ Scripts: Configurados
echo.
echo 📁 Estrutura do projeto:
echo    ├── frontend/ (arquivos estáticos)
echo    ├── backend/ (API Node.js)
echo    ├── frontend-secure/ (código seguro)
echo    └── scripts/ (scripts de deploy)
echo.
echo 🚀 Próximos passos:
echo 1. Configure as variáveis em backend\.env
echo 2. Execute: scripts\deploy.bat
echo 3. Configure domínio personalizado
echo.

echo ✅ 🎉 Configuração concluída!
echo.
echo 📞 Comandos úteis:
echo    npm run dev          # Desenvolvimento local
echo    npm run backend:dev  # Backend local
echo    scripts\deploy.bat   # Deploy completo
echo    scripts\update.bat   # Atualizar deploy
echo.

pause
