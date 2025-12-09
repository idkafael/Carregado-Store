@echo off
echo ========================================
echo   CARREGADO STORE - SETUP LOCAL
echo ========================================
echo.

echo [1/4] Instalando dependencias...
if not exist node_modules (
    echo Instalando dependencias do servidor local...
    npm install --save express cors dotenv @supabase/supabase-js axios
    if errorlevel 1 (
        echo ERRO: Falha ao instalar dependencias
        pause
        exit /b 1
    )
) else (
    echo Dependencias ja instaladas
)

echo.
echo [2/4] Configurando arquivo de ambiente...
if not exist .env.local (
    echo Copiando env.local.example para .env.local...
    copy env.local.example .env.local
    echo.
    echo ⚠️  IMPORTANTE: Configure as variaveis em .env.local
    echo    - SUPABASE_SERVICE_ROLE_KEY (obrigatorio)
    echo    - PUSHINPAY_TOKEN (ja configurado)
    echo.
) else (
    echo .env.local ja existe
)

echo.
echo [3/4] Verificando arquivos necessarios...
if not exist api\payment.js (
    echo ERRO: api\payment.js nao encontrado
    pause
    exit /b 1
)
if not exist server-local.js (
    echo ERRO: server-local.js nao encontrado
    pause
    exit /b 1
)

echo.
echo [4/4] Iniciando servidor local...
echo.
echo 🚀 Servidor sera iniciado em http://localhost:3000
echo 🧪 Teste: http://localhost:3000/test
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

node server-local.js
