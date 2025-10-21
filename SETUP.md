# Guía de Configuración - Codium

## Requisitos Previos

- Docker >= 20.10
- Docker Compose >= 2.0
- Make (opcional, para usar comandos del Makefile)

## Instalación Rápida

### 1. Clonar el repositorio

\`\`\`bash
git clone <repo-url>
cd codium
\`\`\`

### 2. Configurar variables de entorno

El archivo `.env` ya está incluido con valores por defecto para desarrollo:

\`\`\`env
NODE_ENV=development
PORT=3000
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=codium
DATABASE_PASSWORD=codium_password
DATABASE_NAME=codium_db
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=codium-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
\`\`\`

### 3. Iniciar servicios

\`\`\`bash
# Con Make
make dev

# O con Docker Compose directamente
docker-compose up -d
\`\`\`

### 4. Verificar que los servicios estén corriendo

\`\`\`bash
docker-compose ps
\`\`\`

Deberías ver:
- codium-api (puerto 3000)
- codium-postgres (puerto 5432)
- codium-redis (puerto 6379)
- codium-worker-python
- codium-worker-java
- codium-worker-nodejs
- codium-worker-cpp

### 5. Inicializar la base de datos

\`\`\`bash
# Esperar a que PostgreSQL esté listo y ejecutar migraciones
bash scripts/init-db.sh

# Sembrar datos de prueba (usuario admin)
bash scripts/seed-db.sh
\`\`\`

### 6. Acceder a la aplicación

- **API**: http://localhost:3000/api
- **Documentación Swagger**: http://localhost:3000/docs

### 7. Credenciales de prueba

Después de ejecutar el seed:

\`\`\`
Email: admin@codium.com
Password: admin123
Role: ADMIN
\`\`\`

## Comandos Útiles

### Ver logs

\`\`\`bash
# Todos los servicios
make logs

# Solo API
make logs-api

# Solo workers
make logs-workers
\`\`\`

### Escalar workers

\`\`\`bash
# Escalar worker de Python a 3 instancias
make scale service=worker-python replicas=3

# Escalar todos los workers a 2 instancias
make scale-all-workers
\`\`\`

### Detener servicios

\`\`\`bash
make down
\`\`\`

### Limpiar todo (incluye volúmenes)

\`\`\`bash
make clean
\`\`\`

### Reconstruir imágenes

\`\`\`bash
make rebuild
\`\`\`

## Probar la API

### 1. Registrar un usuario

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "estudiante@universidad.edu",
    "password": "password123",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "STUDENT"
  }'
\`\`\`

### 2. Iniciar sesión

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@codium.com",
    "password": "admin123"
  }'
\`\`\`

Guarda el `accessToken` de la respuesta.

### 3. Crear un curso (como ADMIN o PROFESSOR)

\`\`\`bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "name": "Desarrollo Backend",
    "code": "NRC12345",
    "period": "2025-1",
    "group": 1
  }'
\`\`\`

### 4. Crear un reto

\`\`\`bash
curl -X POST http://localhost:3000/api/challenges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "title": "Two Sum",
    "description": "Dado un arreglo de enteros...",
    "difficulty": "EASY",
    "tags": ["arrays", "hashmap"],
    "timeLimit": 5000,
    "memoryLimit": 256,
    "courseId": "<id-del-curso>"
  }'
\`\`\`

### 5. Enviar una solución

\`\`\`bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "challengeId": "<id-del-reto>",
    "courseId": "<id-del-curso>",
    "code": "def solution(arr):\n    return sum(arr)",
    "language": "PYTHON"
  }'
\`\`\`

## Estructura de la Base de Datos

### Tablas principales

- **users**: Usuarios del sistema (STUDENT, PROFESSOR, ADMIN)
- **courses**: Cursos académicos
- **course_students**: Relación estudiantes-cursos
- **challenges**: Retos algorítmicos
- **test_cases**: Casos de prueba para cada reto
- **submissions**: Envíos de soluciones

## Troubleshooting

### Los contenedores no inician

\`\`\`bash
# Ver logs de error
docker-compose logs

# Limpiar y reiniciar
make clean
make dev
\`\`\`

### Error de conexión a PostgreSQL

\`\`\`bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres
\`\`\`

### Error de conexión a Redis

\`\`\`bash
# Verificar que Redis esté corriendo
docker-compose ps redis

# Ver logs de Redis
docker-compose logs redis
\`\`\`

### Los workers no procesan jobs

\`\`\`bash
# Ver logs de workers
make logs-workers

# Reiniciar workers
docker-compose restart worker-python worker-java worker-nodejs worker-cpp
\`\`\`

## Próximos Pasos

Para la Semana 5 (11 de noviembre) se implementará:

1. Runners efímeros con Docker para ejecutar código
2. Sistema de calificación automática
3. Leaderboard
4. Logs estructurados y métricas
5. (Opcional) Despliegue en Kubernetes

## Soporte

Si encuentras problemas, revisa:

1. Los logs de los servicios: `make logs`
2. La documentación de Swagger: http://localhost:3000/docs
3. El archivo README.md principal
