# Codium Backend - API Endpoints Specification

**Última actualización:** 29 de noviembre de 2025  
**Versión Backend:** 1.0.0  
**Base URL:** `http://localhost:3000/api`

---

## 📋 Tabla de Contenidos
1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Retos (Challenges)](#retos-challenges)
4. [Casos de Prueba](#casos-de-prueba)
5. [Submissions](#submissions)
6. [Cursos](#cursos)
7. [Nota Importante](#nota-importante)

---

## Autenticación

### POST `/api/auth/register`
Registrar un nuevo usuario.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "estudiante@universidad.edu",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "STUDENT" // opcional; por defecto STUDENT
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "estudiante@universidad.edu",
  "firstName": "Juan",
  "lastName": "Pérez",
  "fullName": "Juan Pérez",
  "role": "STUDENT",
  "createdAt": "2025-11-29T10:00:00Z",
  "updatedAt": "2025-11-29T10:00:00Z"
}
```

---

### POST `/api/auth/login`
Iniciar sesión y obtener token JWT.

**Request Body:**
```json
{
  "email": "estudiante@universidad.edu",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "estudiante@universidad.edu",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "STUDENT"
  }
}
```

---

### GET `/api/auth/me`
Obtener datos del usuario autenticado.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "estudiante@universidad.edu",
  "role": "STUDENT"
}
```

---

## Usuarios

### GET `/api/users`
Listar todos los usuarios (solo ADMIN).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "estudiante@universidad.edu",
    "firstName": "Juan",
    "lastName": "Pérez",
    "fullName": "Juan Pérez",
    "role": "STUDENT",
    "createdAt": "2025-11-29T10:00:00Z",
    "updatedAt": "2025-11-29T10:00:00Z"
  }
]
```

---

### GET `/api/users/:id`
Obtener un usuario por ID.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "estudiante@universidad.edu",
  "firstName": "Juan",
  "lastName": "Pérez",
  "fullName": "Juan Pérez",
  "role": "STUDENT",
  "createdAt": "2025-11-29T10:00:00Z",
  "updatedAt": "2025-11-29T10:00:00Z"
}
```

---

## Retos (Challenges)

### POST `/api/challenges`
Crear un nuevo reto (solo ADMIN/PROFESOR).

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Two Sum",
  "description": "Dado un arreglo de enteros y un target, retorna los índices de los dos números que suman el target.",
  "difficulty": "EASY",
  "tags": ["arrays", "hashmap"],
  "timeLimit": 1500,
  "memoryLimit": 256,
  "courseId": "course-uuid"
}
```

**Response (201):**
```json
{
  "id": "challenge-uuid",
  "title": "Two Sum",
  "description": "Dado un arreglo...",
  "difficulty": "EASY",
  "tags": ["arrays", "hashmap"],
  "timeLimit": 1500,
  "memoryLimit": 256,
  "status": "DRAFT",
  "courseId": "course-uuid",
  "createdBy": "professor-uuid",
  "createdAt": "2025-11-29T10:00:00Z",
  "updatedAt": "2025-11-29T10:00:00Z"
}
```

---

### GET `/api/challenges`
Listar retos.

**Query Parameters:**
- `courseId` (opcional): filtrar por curso

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
[
  {
    "id": "challenge-uuid",
    "title": "Two Sum",
    "description": "...",
    "difficulty": "EASY",
    "tags": ["arrays", "hashmap"],
    "timeLimit": 1500,
    "memoryLimit": 256,
    "status": "PUBLISHED",
    "courseId": "course-uuid",
    "createdBy": "professor-uuid",
    "createdAt": "2025-11-29T10:00:00Z",
    "updatedAt": "2025-11-29T10:00:00Z"
  }
]
```

**Nota:** Estudiantes ven solo retos con `status: "PUBLISHED"`. Profesores/admins ven todos.

---

### GET `/api/challenges/:id`
Obtener un reto específico.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "id": "challenge-uuid",
  "title": "Two Sum",
  "description": "...",
  "difficulty": "EASY",
  "tags": ["arrays", "hashmap"],
  "timeLimit": 1500,
  "memoryLimit": 256,
  "status": "PUBLISHED",
  "courseId": "course-uuid",
  "createdBy": "professor-uuid",
  "createdAt": "2025-11-29T10:00:00Z",
  "updatedAt": "2025-11-29T10:00:00Z"
}
```

---

### PATCH `/api/challenges/:id`
Actualizar un reto (solo ADMIN/PROFESOR que lo creó).

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Two Sum - Updated",
  "difficulty": "MEDIUM",
  "status": "PUBLISHED"
}
```

**Response (200):** Reto actualizado (mismo formato que GET).

---

### DELETE `/api/challenges/:id`
Eliminar un reto (solo ADMIN/PROFESOR que lo creó).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "message": "Reto eliminado exitosamente"
}
```

---

## Casos de Prueba

### POST `/api/challenges/:challengeId/test-cases`
Añadir un caso de prueba a un reto (solo ADMIN/PROFESOR que lo creó).

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "input": "[2,7,11,15]\n9",
  "expectedOutput": "[0,1]",
  "isHidden": false,
  "points": 50
}
```

**Response (201):**
```json
{
  "id": "test-case-uuid",
  "challengeId": "challenge-uuid",
  "input": "[2,7,11,15]\n9",
  "expectedOutput": "[0,1]",
  "isHidden": false,
  "points": 50,
  "order": 1,
  "createdAt": "2025-11-29T10:00:00Z",
  "updatedAt": "2025-11-29T10:00:00Z"
}
```

---

### GET `/api/challenges/:challengeId/test-cases`
Listar casos de prueba de un reto.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
[
  {
    "id": "test-case-uuid",
    "challengeId": "challenge-uuid",
    "input": "[2,7,11,15]\n9",
    "expectedOutput": "[0,1]",
    "isHidden": false,
    "points": 50,
    "order": 1,
    "createdAt": "2025-11-29T10:00:00Z",
    "updatedAt": "2025-11-29T10:00:00Z"
  }
]
```

**Nota:** Estudiantes ven solo casos no ocultos (`isHidden: false`). Profesores/admins ven todos.

---

## Submissions

### POST `/api/submissions`
Enviar una solución a un reto.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "challengeId": "challenge-uuid",
  "courseId": "course-uuid",
  "code": "def solution(arr, target):\n    for i in range(len(arr)):\n        for j in range(i+1, len(arr)):\n            if arr[i] + arr[j] == target:\n                return [i, j]\n    return []",
  "language": "Python"
}
```

**Lenguajes soportados:** `"Python"`, `"C++"`, `"Java"`, `"Node.js"` (o enums: `PYTHON`, `CPP`, `JAVA`, `NODEJS`)

**Response (201):**
```json
{
  "id": "submission-uuid",
  "studentId": "student-uuid",
  "studentName": "Juan Pérez",
  "challengeId": "challenge-uuid",
  "courseId": "course-uuid",
  "language": "Python",
  "status": "QUEUED",
  "score": 0,
  "executionTime": "0.0s",
  "submittedAt": "2025-11-29T10:00:00Z",
  "createdAt": "2025-11-29T10:00:00Z",
  "testCases": []
}
```

---

### GET `/api/submissions/my-submissions`
Listar los submissions del usuario autenticado.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
[
  {
    "id": "submission-uuid",
    "studentId": "student-uuid",
    "studentName": "Juan Pérez",
    "challengeId": "challenge-uuid",
    "courseId": "course-uuid",
    "language": "Python",
    "status": "ACCEPTED",
    "score": 100,
    "executionTime": "0.45s",
    "submittedAt": "2025-11-29T10:00:00Z",
    "createdAt": "2025-11-29T10:00:00Z",
    "testCases": [
      { "caseId": 1, "status": "OK", "timeMs": 40 },
      { "caseId": 2, "status": "OK", "timeMs": 55 }
    ]
  }
]
```

---

### GET `/api/submissions/:id`
Obtener un submission específico.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "id": "submission-uuid",
  "studentId": "student-uuid",
  "studentName": "Juan Pérez",
  "challengeId": "challenge-uuid",
  "courseId": "course-uuid",
  "language": "Python",
  "status": "ACCEPTED",
  "score": 100,
  "executionTime": "0.45s",
  "submittedAt": "2025-11-29T10:00:00Z",
  "createdAt": "2025-11-29T10:00:00Z",
  "testCases": [
    { "caseId": 1, "status": "OK", "timeMs": 40 },
    { "caseId": 2, "status": "OK", "timeMs": 55 },
    { "caseId": 3, "status": "OK", "timeMs": 38 },
    { "caseId": 4, "status": "OK", "timeMs": 42 }
  ]
}
```

**Estados de submission:**
- `QUEUED` — en cola de ejecución
- `RUNNING` — se está ejecutando
- `ACCEPTED` — pasó todos los casos
- `WRONG_ANSWER` — salida incorrecta
- `TIME_LIMIT_EXCEEDED` — se excedió el tiempo
- `RUNTIME_ERROR` — error en ejecución
- `COMPILATION_ERROR` — error de compilación

**Estados de test case:**
- `OK` — pasó correctamente
- `WA` — respuesta incorrecta
- `TLE` — tiempo excedido
- `RE` — error en ejecución
- `CE` — error de compilación

---

## Cursos

### POST `/api/courses`
Crear un nuevo curso (solo ADMIN/PROFESOR).

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Estructuras de Datos 101",
  "code": "ED101",
  "period": "2025-1",
  "group": 1
}
```

**Response (201):**
```json
{
  "id": "course-uuid",
  "name": "Estructuras de Datos 101",
  "code": "ED101",
  "period": "2025-1",
  "group": 1,
  "createdAt": "2025-11-29T10:00:00Z",
  "updatedAt": "2025-11-29T10:00:00Z"
}
```

---

### GET `/api/courses`
Listar cursos.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
[
  {
    "id": "course-uuid",
    "name": "Estructuras de Datos 101",
    "code": "ED101",
    "period": "2025-1",
    "group": 1,
    "createdAt": "2025-11-29T10:00:00Z",
    "updatedAt": "2025-11-29T10:00:00Z"
  }
]
```

**Nota:** Estudiantes ven solo cursos en los que están inscritos. Profesores ven sus cursos. Admins ven todos.

---

### GET `/api/courses/:id`
Obtener un curso específico.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):** Mismo formato que arriba.

---

### POST `/api/courses/:id/students`
Matricular un estudiante en un curso (solo ADMIN/PROFESOR).

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": "student-uuid"
}
```

**Response (200):**
```json
{
  "message": "Estudiante matriculado exitosamente"
}
```

---

## Nota Importante

### Autenticación Bearer Token
Todos los endpoints (excepto `register` y `login`) requieren header:
```
Authorization: Bearer <accessToken>
```

El token se obtiene del endpoint `POST /api/auth/login`.

### Códigos de Error
- `400` — Bad Request (validación)
- `401` — Unauthorized (sin token o token inválido)
- `403` — Forbidden (rol insuficiente o permisos)
- `404` — Not Found
- `409` — Conflict (ej. email duplicado)
- `500` — Internal Server Error

### CORS
El backend tiene CORS habilitado en todos los orígenes. El frontend puede hacer llamadas desde cualquier puerto.

---

## Instrucciones de Integración

### Instalación y Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Generar cliente Prisma
npm run prisma:generate

# 3. Ejecutar migraciones (si existen cambios en schema)
npm run prisma:migrate

# 4. (Opcional) Cargar datos de seed
npm run prisma:seed

# 5. Compilar backend
npm run build

# 6. Ejecutar en modo desarrollo
npm run start:dev
```

### Variables de Entorno

Crear `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/codium"
REDIS_HOST="localhost"
REDIS_PORT=6379
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION="7d"
PORT=3000
```

### Docker Compose

Para levantar los servicios (PostgreSQL + Redis):

```bash
docker-compose up -d
```

---

## Próximas Mejoras (Backlog)

- [ ] Implementar WebSocket para updates en vivo de submissions
- [ ] Endpoint GET para listar test cases con paginación
- [ ] Endpoint DELETE para eliminar test cases
- [ ] Rate limiting en endpoints de submission
- [ ] Endpoint para obtener leaderboard por reto/curso
- [ ] Endpoint para exportar resultados
- [ ] Optimización de queries (n+1 prevention)
- [ ] Implementar transacciones en operaciones críticas

---

**Documentación generada:** 29 de noviembre de 2025
