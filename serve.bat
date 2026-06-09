@echo off
echo ========================================
echo   Zona Segura CRM - Servidor
echo ========================================
echo.
echo   Iniciando servidor en puerto 80...
echo   URL: http://localhost
echo.
echo   Presiona Ctrl+C para detener
echo ========================================
echo.

php artisan serve --port=80
