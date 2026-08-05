#!/bin/bash
# ============================================================
#  Zona Segura CRM - Script de Despliegue a Producción
#  Uso: ./deploy.sh
#  Requiere: git (o acceso FTP/SCP), composer, node, yarn
# ============================================================
set -e

# ---------- Configuración ----------
PROJECT_DIR="/var/www/zonaseguracrm"
BRANCH="main"                # Rama para git pull (si usas git)
SKIP_FRONTEND="no"           # "yes" si ya subiste el build manualmente
SKIP_MIGRATE="no"            # "yes" si no quieres correr migraciones
RUN_SEEDERS="no"             # "yes" SOLO si necesitas (re)sembrar servicios/config inicial

# ---------- Colores ----------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Despliegue de Zona Segura CRM${NC}"
echo -e "${GREEN}============================================${NC}"

# ---------- 0. Verificaciones ----------
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}El directorio $PROJECT_DIR no existe.${NC}"
    exit 1
fi

cd "$PROJECT_DIR"

# ---------- 1. Modo mantenimiento ----------
echo -e "${YELLOW}[1/9] Activando modo mantenimiento...${NC}"
php artisan down --retry=60 || true

# ---------- 2. ACTUALIZAR REPOSITORIO (PRIMERO) ----------
# IMPORTANTE: esto SIEMPRE va antes de yarn/npm.
# Si GitHub trae cambios en package.json, yarn lo tomará en el paso 5.
echo -e "${YELLOW}[2/9] Actualizando código desde el repositorio...${NC}"
if [ -d ".git" ]; then
    # Evita conflictos con node_modules/vendor que ya no se rastrean en git.
    # Estos directorios se regeneran con yarn/composer más adelante.
    echo -e "${YELLOW}  Limpiando cambios locales de node_modules y vendor...${NC}"
    git checkout -- frontend/node_modules 2>/dev/null || true
    git checkout -- node_modules 2>/dev/null || true
    git checkout -- vendor 2>/dev/null || true
    git clean -fd frontend/node_modules node_modules vendor 2>/dev/null || true

    git pull origin "$BRANCH"
else
    echo "No hay repositorio git. Asegúrate de haber subido los archivos actualizados (FTP/SCP)."
    read -p "Presiona Enter para continuar..." -n1
fi

# ---------- 3. Dependencias PHP ----------
echo -e "${YELLOW}[3/9] Instalando dependencias PHP...${NC}"
composer install --no-dev --optimize-autoloader --no-interaction

# ---------- 4. Permisos de directorios ----------
echo -e "${YELLOW}[4/9] Ajustando permisos...${NC}"
sudo chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# ---------- 5. FRONTEND (DESPUÉS del git pull) ----------
# Se compila con el código YA actualizado, tomando las dependencias nuevas.
if [ "$SKIP_FRONTEND" = "no" ]; then
    echo -e "${YELLOW}[5/9] Compilando frontend (con código actualizado)...${NC}"
    if [ -d "frontend" ]; then
        cd frontend
        yarn install --non-interactive 2>/dev/null || npm install
        yarn build 2>/dev/null || npm run build
        cd ..
        # Copiar build a public/
        cp -r frontend/dist/index.html public/spa.html
        cp -r frontend/dist/assets/* public/assets/
        cp -r frontend/dist/images/* public/images/ 2>/dev/null || true
        echo -e "${GREEN}  Frontend compilado y copiado a public/.${NC}"
    else
        echo -e "${YELLOW}  No hay carpeta frontend/, se omite.${NC}"
    fi
else
    echo -e "${YELLOW}[5/9] Frontend omitido (SKIP_FRONTEND=yes).${NC}"
fi

# ---------- 6. Migraciones ----------
if [ "$SKIP_MIGRATE" = "no" ]; then
    echo -e "${YELLOW}[6/9] Ejecutando migraciones...${NC}"
    php artisan migrate --force
else
    echo -e "${YELLOW}[6/9] Migraciones omitidas (SKIP_MIGRATE=yes).${NC}"
fi

# ---------- 7. Seeders (SOLO si RUN_SEEDERS=yes) ----------
if [ "$RUN_SEEDERS" = "yes" ]; then
    echo -e "${YELLOW}[7/9] Ejecutando seeders...${NC}"
    php artisan db:seed --class=ServiceSeeder --force || true
    php artisan db:seed --class=CompanySettingSeeder --force || true
else
    echo -e "${YELLOW}[7/9] Seeders omitidos (RUN_SEEDERS=no). Los datos existentes no se modifican.${NC}"
fi

# ---------- 8. Enlace de storage y caché ----------
echo -e "${YELLOW}[8/9] Configurando storage y caché...${NC}"
php artisan storage:link 2>/dev/null || true
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear
php artisan config:cache || true
php artisan route:cache || true
php artisan optimize || true

# ---------- 9. Desactivar mantenimiento ----------
echo -e "${YELLOW}[9/9] Desactivando modo mantenimiento...${NC}"
php artisan up

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Despliegue completado correctamente ✅${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "  Sitio:    ${GREEN}$(grep APP_URL .env | cut -d= -f2)${NC}"
echo ""
echo "  Pasos opcionales:"
echo "   - Ejecuta: php artisan migrate:status (verificar migraciones)"
echo "   - Recarga el navegador con Ctrl+F5"
echo ""
