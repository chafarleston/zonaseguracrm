# Zona Segura CRM - Sistema de Gestión Inmobiliaria

CRM completo para la gestión de ventas de propiedades inmobiliarias, construido con Laravel 13 + React 19.

## Características

### Módulos Implementados

- **Sitio Web Público**: Página de propiedades en venta (sin login)
- **Dashboard**: Métricas y KPIs del negocio
- **Propiedades**: CRUD completo con mapas, filtros y galería de imágenes
- **Clientes/Leads**: Gestión de contactos con seguimiento de origen y estado
- **Pipeline de Ventas**: Kanban board para negociaciones
- **Calendario**: Agenda de citas y visitas a propiedades
- **Tareas**: Gestión de tareas y recordatorios
- **Documentos**: Upload/download de contratos y documentos
- **Reportes**: Estadísticas de ventas, agentes y propiedades
- **Usuarios**: Sistema de roles (Admin, Agente, Usuario)

### Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Laravel 13.8 (PHP 8.3+) |
| Frontend | React 19 + TypeScript |
| UI Components | shadcn/ui (47 componentes) |
| CSS | Tailwind CSS 3.4 |
| Mapas | Leaflet + react-leaflet |
| State Management | TanStack React Query |
| Formularios | react-hook-form + zod |
| Autenticación | Laravel Sanctum |
| Base de Datos | MySQL |

## Instalación

### Requisitos Previos

- PHP 8.3+
- Composer
- Node.js 18+ (recomendado: 20 LTS)
- Yarn o npm
- MySQL/MariaDB
- Laragon (Windows) o similar

### Pasos de Instalación

1. **Clonar o copiar el proyecto** en `C:\laragon\www\zonaseguracrm`

2. **Crear la base de datos** en MySQL:
   ```sql
   CREATE DATABASE zonaseguracrm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Instalar dependencias del backend**:
   ```bash
   composer install
   ```

4. **Generar clave de la aplicación**:
   ```bash
   php artisan key:generate
   ```

5. **Ejecutar migraciones y seeders**:
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Instalar dependencias del frontend**:
   ```bash
   cd frontend
   yarn install
   ```

7. **Compilar y desplegar el frontend**:
   ```bash
   # Desde la raíz del proyecto
   build.bat
   ```

8. **Iniciar el servidor**:
   ```bash
   serve.bat
   # O manualmente:
   php artisan serve --port=80
   ```

9. **Acceder a la aplicación**:
   - **Sitio web**: http://localhost
   - **CRM (login)**: http://localhost/login

### Credenciales de Demo

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@zonasegura.com | admin123 |
| Agente 1 | maria@zonasegura.com | agent123 |
| Agente 2 | carlos@zonasegura.com | agent123 |

## Estructura de Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | **Público** | Página de propiedades en venta |
| `/login` | **Público** | Login para agentes |
| `/admin` | **Protegido** | Dashboard del CRM |
| `/admin/properties` | **Protegido** | Gestión de propiedades |
| `/admin/clients` | **Protegido** | Gestión de clientes |
| `/admin/pipeline` | **Protegido** | Pipeline de ventas |
| `/admin/calendar` | **Protegido** | Calendario de citas |
| `/admin/tasks` | **Protegido** | Tareas |
| `/admin/documents` | **Protegido** | Documentos |
| `/admin/reports` | **Protegido** | Reportes |

## Estructura del Proyecto

```
zonaseguracrm/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/    # Controladores API
│   │   ├── Middleware/          # Middleware personalizado
│   │   └── Resources/          # API Resources
│   └── Models/                 # Modelos Eloquent
├── database/
│   ├── migrations/             # Migraciones de BD
│   └── seeders/                # Datos de ejemplo
├── frontend/
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── context/            # Context API
│   │   ├── hooks/              # Custom Hooks
│   │   ├── pages/              # Páginas
│   │   ├── services/           # Servicios API
│   │   └── types/              # Tipos TypeScript
│   └── package.json
├── public/
│   ├── spa.html                # Frontend compilado
│   ├── assets/                 # JS/CSS compilado
│   └── images/                 # Imágenes
├── routes/
│   ├── api.php                 # Rutas API
│   └── web.php                 # Rutas web (SPA)
├── .env                        # Configuración
├── build.bat                   # Script de build
├── serve.bat                   # Script para iniciar servidor
└── README.md                   # Este archivo
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/logout` - Cerrar sesión

### Propiedades
- `GET /api/properties` - Listar propiedades
- `GET /api/properties?all=1` - Todas las propiedades (sin paginación)
- `GET /api/properties/{id}` - Obtener propiedad
- `POST /api/properties` - Crear propiedad
- `PUT /api/properties/{id}` - Actualizar propiedad
- `DELETE /api/properties/{id}` - Eliminar propiedad (admin)

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/{id}` - Actualizar cliente
- `DELETE /api/clients/{id}` - Eliminar cliente
- `POST /api/clients/{id}/convert` - Convertir lead

### Negociaciones (Deals)
- `GET /api/deals` - Listar negociaciones
- `POST /api/deals` - Crear negociación
- `PUT /api/deals/{id}` - Actualizar negociación
- `PUT /api/deals/{id}/stage` - Cambiar estado
- `GET /api/pipeline` - Pipeline de ventas

### Citas
- `GET /api/appointments` - Listar citas
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/{id}` - Actualizar cita
- `PUT /api/appointments/{id}/cancel` - Cancelar cita
- `PUT /api/appointments/{id}/complete` - Completar cita
- `GET /api/calendar` - Calendario de citas

### Tareas
- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/{id}` - Actualizar tarea
- `PUT /api/tasks/{id}/complete` - Completar tarea
- `PUT /api/tasks/{id}/start` - Iniciar tarea

### Dashboard y Reportes
- `GET /api/dashboard` - Métricas del dashboard
- `GET /api/reports/sales` - Reporte de ventas
- `GET /api/reports/agents` - Rendimiento de agentes
- `GET /api/reports/properties` - Estadísticas de propiedades
- `GET /api/reports/clients` - Estadísticas de clientes

## Scripts Disponibles

| Script | Descripción |
|---|---|
| `build.bat` | Compilar frontend y copiar a public/ |
| `serve.bat` | Iniciar servidor en puerto 80 |
| `start-crm.bat` | Iniciar en modo desarrollo (puerto 5173) |

## Roles de Usuario

| Rol | Permisos |
|---|---|
| Admin | Acceso completo a todos los módulos |
| Agente | Gestión de sus propiedades, clientes y negociaciones |
| Usuario | Solo lectura de propiedades |

## Personalización

### Cambiar tema de colores

Edita `frontend/src/index.css` para modificar las variables CSS del tema.

### Agregar nuevos módulos

1. Crear migración: `php artisan make:migration create_tabla_table`
2. Crear modelo: `php artisan make:model Modelo`
3. Crear controlador: `php artisan make:controller Api/ControladorController --api`
4. Crear API Resource: `php artisan make:resource ModeloResource`
5. Agregar rutas en `routes/api.php`
6. Crear componentes React en `frontend/src/`
7. Ejecutar `build.bat` para compilar

## Licencia

Proyecto privado - Zona Segura Inmobiliaria
