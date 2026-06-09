@echo off
title Zona Segura Inmobiliaria
echo ============================================
echo   ZONA SEGURA INMOBILIARIA
echo   Laravel API + React Frontend
echo ============================================
echo.

echo [1/2] Starting Laravel API server (port 8000)...
start "Laravel API" /min cmd /c "php artisan serve --port=8000"
if %errorlevel% equ 0 (
    echo   ✓ Laravel API started
) else (
    echo   ✗ Failed to start Laravel API
)
timeout /t 2 /nobreak >nul

echo [2/2] Starting React frontend (port 5173)...
cd /d "%~dp0frontend"
start "React Frontend" /min cmd /c ".\node_modules\.bin\vite --port=5173 --host"
cd /d "%~dp0"
if %errorlevel% equ 0 (
    echo   ✓ React Frontend started
) else (
    echo   ✗ Failed to start React Frontend
)

echo.
echo ============================================
echo   Servidores iniciados:
echo   Laravel API:  http://localhost:8000
echo   React App:    http://localhost:5173
echo ============================================
echo.
echo   Credenciales de demo:
echo   Admin: admin@zonasegura.com / admin123
echo   User:  usuario@zonasegura.com / user123
echo ============================================
echo.
echo   Presiona cualquier tecla para cerrar los servidores...
pause >nul

echo.
echo Cerrando servidores...
taskkill /f /fi "WINDOWTITLE eq Laravel API" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq React Frontend" >nul 2>&1
echo   ✓ Servidores cerrados.
timeout /t 2 /nobreak >nul
