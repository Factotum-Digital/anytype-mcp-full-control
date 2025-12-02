# MCP ACTUALIZADO - CONEXIÓN REAL A ANYTYPE API

## Cambios Realizados

### Actualización de Endpoints
- URL Base: http://localhost:31009/v1 (API real de Anytype)
- Headers: Anytype-Version: 2025-05-20
- Autenticación: Bearer tokens con formato correcto

### Nuevos Endpoints API
GET /objects/search      → Buscar objetos
GET /objects/{id}        → Obtener objeto específico
POST /objects             → Crear nuevo objeto
PATCH /objects/{id}       → Actualizar objeto
DELETE /objects/{id}      → Eliminar objeto

GET /spaces               → Listar espacios
POST /spaces              → Crear espacio
PATCH /spaces/{id}        → Actualizar espacio
DELETE /spaces/{id}       → Eliminar espacio

GET /types                → Listar tipos
POST /types               → Crear tipo
PATCH /types/{id}         → Actualizar tipo
DELETE /types/{id}         → Eliminar tipo

GET /relations            → Listar relaciones
POST /relations           → Crear relación
PATCH /relations/{id}     → Actualizar relación
DELETE /relations/{id}    → Eliminar relación

### Parámetros Actualizados
- spaceId → space_id
- type → type_filter
- Añadido ANYTYPE_API_VERSION en configuración

## Para Usar el MCP Actualizado

### 1. Obtener API Key de Anytype
1. Abre Anytype Desktop
2. Ve a Settings → Advanced → Developer mode
3. Click en Generate API key
4. Copia el Bearer token

### 2. Configurar Variables
cp .env.example .env
# Edita .env con tu API key real

### 3. Iniciar el Servidor
npm run dev

### 4. Probar Conexión
curl http://localhost:31009/health

## Repositorio Actualizado
GitHub: https://github.com/Factotum-Digital/anytype-mcp-full-control

El MCP ahora conecta directamente con la API real de Anytype v1!
