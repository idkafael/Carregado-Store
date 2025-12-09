@echo off
REM 🔄 Script de Atualização - Carregado Store (Windows)
REM Execute: scripts\update.bat

echo 🔄 Atualizando Carregado Store...

REM 1. Atualizar dependências
echo 📦 Atualizando dependências...
npm install

cd backend
npm install
cd ..

echo ✅ Dependências atualizadas!

REM 2. Deploy backend (Railway faz automaticamente)
echo 🚂 Backend será atualizado automaticamente no Railway

REM 3. Deploy frontend
echo 🌐 Atualizando frontend...
vercel --prod

echo ✅ Frontend atualizado!

REM 4. Verificar status
echo 🔍 Verificando status...

REM Verificar se Vercel CLI está disponível
vercel --version >nul 2>&1
if %errorlevel%==0 (
    echo Status do Vercel:
    vercel ls
)

echo ✅ 🎉 Atualização concluída!
echo.
echo 🔗 URLs:
echo    Frontend: https://carregado-store.vercel.app
echo    Backend: https://carregado-store-backend.railway.app
echo.

pause
