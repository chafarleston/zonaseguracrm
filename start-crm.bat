@echo off
echo ========================================
echo   Zona Segura CRM - Inmobiliario
echo ========================================
echo.
echo [1/3] Compilando frontend...
call build.bat

echo.
echo [2/3] Iniciando servidor en puerto 80...
start "Zona Segura CRM" cmd /k "cd /d %~dp0 && php artisan serve --port=80"

echo [3/3] Abriendo navegador...
timeout /t 2 /nobreak > nul
start http://localhost

echo.
echo ========================================
echo   Servidor iniciado correctamente
echo ========================================
echo.
echo   URL: http://localhost
echo.
echo   Credenciales de demo:
echo   - Admin: admin@zonasegura.com / admin123
echo   - Agente: maria@zonasegura.com / agent123
echo.
echo   Presiona cualquier tecla para cerrar esta ventana...
pause > nul
