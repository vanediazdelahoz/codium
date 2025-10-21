# Guía de Pruebas - Proyecto Codium

## Requisitos Previos

- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- Git

## Configuración Inicial

### 1. Clonar el repositorio

\`\`\`bash
git clone <repository-url>
cd codium
\`\`\`

### 2. Configurar variables de entorno

\`\`\`bash
cp .env.example .env
\`\`\`

Editar `.env` si es necesario (los valores por defecto funcionan con Docker Compose).

### 3. Iniciar servicios con Docker Compose

\`\`\`bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Verificar que todos los servicios estén corriendo
docker-compose ps
\`\`\`

Los servicios disponibles son:
- **API**: http://localhost:3000/api
- **Swagger**: http://localhost:3000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 4. Verificar migraciones de base de datos

\`\`\`bash
# Ejecutar migraciones (si no se ejecutaron automáticamente)
docker-compose exec api npx prisma migrate deploy

# Ejecutar seed (datos de prueba)
docker-compose exec api npx prisma db seed
\`\`\`

## Pruebas de la API

### Usando Swagger UI

1. Abrir http://localhost:3000/docs
2. Explorar todos los endpoints disponibles
3. Probar directamente desde la interfaz

### Usando cURL o Postman

#### 1. Autenticación

**Registrar un nuevo usuario (ADMIN)**

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@codium.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }'
\`\`\`

**Registrar un estudiante**

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@codium.com",
    "password": "Student123!",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "STUDENT"
  }'
\`\`\`

**Login**

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@codium.com",
    "password": "Admin123!"
  }'
\`\`\`

Respuesta:
\`\`\`json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@codium.com",
    "role": "ADMIN"
  }
}
\`\`\`

**Guardar el token** para usarlo en las siguientes peticiones.

#### 2. Gestión de Cursos (ADMIN/PROFESSOR)

**Crear un curso**

\`\`\`bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Desarrollo Backend",
    "code": "NRC12345",
    "period": "2025-1",
    "group": 1
  }'
\`\`\`

**Listar cursos**

\`\`\`bash
curl -X GET http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

**Inscribir estudiante en curso**

\`\`\`bash
curl -X POST http://localhost:3000/api/courses/{courseId}/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "studentId": "student-uuid"
  }'
\`\`\`

#### 3. Gestión de Retos (ADMIN/PROFESSOR)

**Crear un reto**

\`\`\`bash
curl -X POST http://localhost:3000/api/challenges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Two Sum",
    "description": "Dado un arreglo de enteros y un target, retorna los índices de dos números que sumen el target.",
    "difficulty": "EASY",
    "tags": ["arrays", "hashmap"],
    "timeLimit": 1500,
    "memoryLimit": 256,
    "courseId": "course-uuid"
  }'
\`\`\`

**Agregar caso de prueba**

\`\`\`bash
curl -X POST http://localhost:3000/api/challenges/{challengeId}/test-cases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "input": "[2,7,11,15]\n9",
    "expectedOutput": "[0,1]",
    "isHidden": false,
    "points": 50
  }'
\`\`\`

**Publicar reto**

\`\`\`bash
curl -X PATCH http://localhost:3000/api/challenges/{challengeId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "PUBLISHED"
  }'
\`\`\`

**Listar retos**

\`\`\`bash
curl -X GET http://localhost:3000/api/challenges \
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

#### 4. Envío de Soluciones (STUDENT)

**Enviar solución en Python**

\`\`\`bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -d '{
    "challengeId": "challenge-uuid",
    "courseId": "course-uuid",
    "language": "PYTHON",
    "code": "def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []"
  }'
\`\`\`

**Consultar estado del submission**

\`\`\`bash
curl -X GET http://localhost:3000/api/submissions/{submissionId} \
  -H "Authorization: Bearer STUDENT_TOKEN"
\`\`\`

**Listar mis submissions**

\`\`\`bash
curl -X GET http://localhost:3000/api/submissions/my-submissions \
  -H "Authorization: Bearer STUDENT_TOKEN"
\`\`\`

## Verificación de Workers

### Verificar que los workers estén procesando

\`\`\`bash
# Ver logs de workers
docker-compose logs -f worker-python
docker-compose logs -f worker-java
docker-compose logs -f worker-nodejs
docker-compose logs -f worker-cpp

# Verificar cola de Redis
docker-compose exec redis redis-cli
> KEYS *
> LLEN bull:submissions:waiting
> LLEN bull:submissions:active
\`\`\`

### Escalar workers

\`\`\`bash
# Escalar worker de Python a 3 instancias
docker-compose up -d --scale worker-python=3

# Verificar instancias
docker-compose ps | grep worker-python
\`\`\`

## Verificación de Requisitos Semana 2

### ✅ 1. Diseño de modelos y capas

**Verificar estructura Clean Architecture:**

\`\`\`bash
tree src/
\`\`\`

Debe mostrar:
- `src/core/domain/` - Entidades y ports
- `src/core/application/` - Use cases, DTOs, mappers
- `src/infrastructure/` - Implementaciones (Prisma, Redis, JWT)
- `src/interface/http/` - Controladores y módulos

**Verificar modelos de dominio:**

\`\`\`bash
cat src/core/domain/users/user.entity.ts
cat src/core/domain/challenges/challenge.entity.ts
cat src/core/domain/submissions/submission.entity.ts
cat src/core/domain/courses/course.entity.ts
\`\`\`

### ✅ 2. Autenticación + CRUD Retos

**Probar autenticación:**
- Registro de usuarios ✓
- Login con JWT ✓
- Protección de rutas por roles ✓

**Probar CRUD de retos:**
- Crear reto (ADMIN/PROFESSOR) ✓
- Listar retos ✓
- Actualizar reto ✓
- Eliminar reto ✓
- Agregar casos de prueba ✓

### ✅ 3. Docker Compose con API + DB + Redis

**Verificar servicios:**

\`\`\`bash
docker-compose ps
\`\`\`

Debe mostrar:
- codium-api (running)
- codium-postgres (running)
- codium-redis (running)
- codium-worker-python (running)
- codium-worker-java (running)
- codium-worker-nodejs (running)
- codium-worker-cpp (running)

**Verificar conectividad:**

\`\`\`bash
# PostgreSQL
docker-compose exec postgres psql -U codium -d codium_db -c "\dt"

# Redis
docker-compose exec redis redis-cli ping
\`\`\`

### ✅ 4. Workers stub con Redis

**Verificar que workers consuman de Redis:**

\`\`\`bash
# Enviar un submission
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"challengeId":"uuid","courseId":"uuid","language":"PYTHON","code":"print(\"Hello\")"}'

# Ver logs del worker
docker-compose logs -f worker-python
\`\`\`

Debe mostrar:
\`\`\`
[Worker Python] Processing submission: subm-xxx
[Worker Python] Language: PYTHON
[Worker Python] Status: QUEUED -> RUNNING
[Worker Python] Execution completed (stub)
\`\`\`

## Pruebas de Integración

### Script de prueba completo

\`\`\`bash
#!/bin/bash

echo "=== Prueba Completa del Sistema ==="

# 1. Registrar admin
echo "\n1. Registrando admin..."
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!","firstName":"Admin","lastName":"Test","role":"ADMIN"}')

# 2. Login admin
echo "\n2. Login admin..."
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}' | jq -r '.accessToken')

echo "Token: $ADMIN_TOKEN"

# 3. Crear curso
echo "\n3. Creando curso..."
COURSE_ID=$(curl -s -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"Test Course","code":"TEST001","period":"2025-1","group":1}' | jq -r '.id')

echo "Course ID: $COURSE_ID"

# 4. Crear reto
echo "\n4. Creando reto..."
CHALLENGE_ID=$(curl -s -X POST http://localhost:3000/api/challenges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"title\":\"Test Challenge\",\"description\":\"Test\",\"difficulty\":\"EASY\",\"tags\":[\"test\"],\"timeLimit\":1500,\"memoryLimit\":256,\"courseId\":\"$COURSE_ID\"}" | jq -r '.id')

echo "Challenge ID: $CHALLENGE_ID"

# 5. Registrar estudiante
echo "\n5. Registrando estudiante..."
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"Student123!","firstName":"Student","lastName":"Test","role":"STUDENT"}'

# 6. Login estudiante
echo "\n6. Login estudiante..."
STUDENT_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"Student123!"}' | jq -r '.accessToken')

# 7. Enviar submission
echo "\n7. Enviando submission..."
SUBMISSION_ID=$(curl -s -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d "{\"challengeId\":\"$CHALLENGE_ID\",\"courseId\":\"$COURSE_ID\",\"language\":\"PYTHON\",\"code\":\"print('Hello')\"}" | jq -r '.id')

echo "Submission ID: $SUBMISSION_ID"

echo "\n=== Prueba Completada ==="
\`\`\`

## Solución de Problemas

### La API no inicia

\`\`\`bash
# Ver logs
docker-compose logs api

# Verificar que Postgres esté listo
docker-compose logs postgres

# Reiniciar servicios
docker-compose restart api
\`\`\`

### Workers no procesan submissions

\`\`\`bash
# Verificar Redis
docker-compose exec redis redis-cli ping

# Ver cola
docker-compose exec redis redis-cli
> LLEN bull:submissions:waiting

# Reiniciar workers
docker-compose restart worker-python worker-java worker-nodejs worker-cpp
\`\`\`

### Error de migraciones

\`\`\`bash
# Resetear base de datos
docker-compose exec api npx prisma migrate reset

# Ejecutar migraciones
docker-compose exec api npx prisma migrate deploy

# Ejecutar seed
docker-compose exec api npx prisma db seed
\`\`\`

## Comandos Útiles

\`\`\`bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (resetear DB)
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache

# Ver logs en tiempo real
docker-compose logs -f

# Ejecutar comando en contenedor
docker-compose exec api npm run test

# Escalar workers
docker-compose up -d --scale worker-python=5
\`\`\`

## Próximos Pasos (Semana 5)

- Implementar runners reales con Docker (ejecutar código en contenedores aislados)
- Implementar leaderboard
- Implementar módulo de evaluaciones/parciales
- Agregar logs estructurados y métricas
- Implementar límites de tiempo y memoria reales
- Agregar más casos de prueba
