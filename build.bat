@echo off
echo ========================================
echo   Zona Segura CRM - Build Script
echo ========================================
echo.

echo [1/4] Compilando frontend...
cd /d %~dp0frontend
call yarn build
if errorlevel 1 (
    echo ERROR: Fallo al compilar el frontend
    pause
    exit /b 1
)

echo.
echo [2/4] Copiando archivos a public/...
cd /d %~dp0

REM Crear directorios si no existen
if not exist "public\assets" mkdir "public\assets"
if not exist "public\images" mkdir "public\images"

REM Copiar index.html como spa.html
copy /Y "frontend\dist\index.html" "public\spa.html" > nul

REM Copiar assets
xcopy /E /Y "frontend\dist\assets\*" "public\assets\" > nul

REM Copiar images
xcopy /E /Y "frontend\dist\images\*" "public\images\" > nul

echo [3/4] Limpiando cache de Laravel...
php artisan config:clear > nul
php artisan cache:clear > nul
php artisan view:clear > nul

echo.
echo [4/4] Optimizando para produccion...
php artisan config:cache > nul
php artisan route:cache > nul

echo.
echo ========================================
echo   Build completado exitosamente!
echo ========================================
