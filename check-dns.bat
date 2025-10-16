@echo off
echo ====================================
echo Verificando DNS de carregado.store
echo ====================================
echo.

:loop
nslookup -type=NS carregado.store 8.8.8.8 | findstr "vercel"
if %errorlevel% equ 0 (
    echo.
    echo ✅ PROPAGOU! Nameservers da Vercel detectados!
    echo Seu dominio esta funcionando!
    pause
    exit
) else (
    echo ⏳ Ainda nao propagou... Tentando novamente em 30 segundos...
    timeout /t 30 /nobreak >nul
    goto loop
)







