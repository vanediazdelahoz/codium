# 🎯 Codium Quick Reference (30 segundos)

**Estado:** ✅ Backend 60% completado (Semana 1-2 DONE, Semana 3 CRÍTICA)

---

## 📊 En Números

```
✅ 5 documentos generados (1390+ líneas)
✅ 8 archivos backend modificados
✅ 3 archivos nuevos creados
✅ 16 endpoints implementados
✅ 7 modelos Prisma completados
✅ 100% build limpio (TypeScript sin errores)
✅ 100% docker-compose funcional

❌ 1 BLOQUEADOR CRÍTICO: Queue + Workers (Semana 3)
```

---

## 🚀 Para Frontend Dev (3 minutos)

### Inicio Rápido

```bash
# Usuarios de prueba (después de seed)
Email: admin@example.com / Password: password
Email: profesor@example.com / Password: password
Email: estudiante@example.com / Password: password

# Obtener JWT
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "estudiante@example.com", "password": "password"}'

# Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "uuid", "email": "...", "role": "STUDENT" }
}

# Usar token en requests posteriores
Header: Authorization: Bearer <accessToken>
```

### Endpoints para Consumir

```
POST   /api/auth/register              (registrar usuario)
POST   /api/auth/login                 (obtener JWT)
GET    /api/auth/me                    (usuario actual)

GET    /api/challenges                 (listar retos disponibles)
GET    /api/challenges/:id             (detalle reto)
GET    /api/challenges/:id/test-cases  (casos de prueba)

POST   /api/submissions                (enviar código)
GET    /api/submissions/:id            (estado de submission)
GET    /api/submissions/my-submissions (mis envíos)

GET    /api/courses                    (mis cursos)
```

### Formato de Respuesta Submissions

```json
{
  "id": "uuid",
  "studentId": "uuid",
  "studentName": "Juan Pérez",      // ✅ Automático
  "language": "Python",              // ✅ String legible
  "status": "ACCEPTED",
  "score": 100,
  "executionTime": "0.45s",          // ✅ Formateado
  "submittedAt": "2025-11-29T10:00:00Z",  // ✅ ISO timestamp
  "testCases": [
    { "caseId": 1, "status": "OK", "timeMs": 40 },   // ✅ caseId numérico
    { "caseId": 2, "status": "OK", "timeMs": 55 }
  ]
}
```

### Lenguajes Soportados

- "Python" (o PYTHON enum)
- "Java" (o JAVA)
- "C++" (o CPP)
- "Node.js" (o NODEJS)

---

## 🛠️ Para Backend Dev (5 minutos)

### Build & Run

```bash
npm run build                    # Compilar TypeScript
npm run start:dev              # Correr en watch mode
npm run prisma:migrate         # Ejecutar migraciones
npm run prisma:seed           # Cargar datos de prueba

docker-compose up              # Levantar full stack
docker-compose down            # Apagar servicios
docker-compose logs api        # Ver logs del API
```

### Próximo Sprint (CRÍTICA - Semana 3)

**Objetivo:** Queue + Workers funcionales

**Tareas:**
1. [ ] `npm install dockerode @types/dockerode`
2. [ ] Crear `src/infrastructure/queue/queue.module.ts`
3. [ ] Crear `src/infrastructure/runners/runner.service.ts`
4. [ ] Crear `src/infrastructure/queue/processors/submission.processor.ts`
5. [ ] Actualizar `SubmitSolutionUseCase` para encolar
6. [ ] Validar: POST /submissions → QUEUED → ACCEPTED

**Guía:** Ver `/workspaces/codium/QUEUE_WORKERS_GUIDE.md` (290+ líneas, listo para copiar/pegar)

**Tiempo:** 4-6 horas  
**Riesgo:** ALTO (sin esto no hay ejecución)

---

## 📚 Documentos por Rol

### 👨‍💼 PM / Tech Lead
→ **EXECUTIVE_SUMMARY.md** (estado completo + roadmap)  
→ **PROJECT_STATUS.md** (detalles semanas 1-5)

### 👨‍💻 Backend Dev
→ **QUEUE_WORKERS_GUIDE.md** (implementación paso a paso)  
→ **PROJECT_CHECKLIST.md** (checkboxes por tarea)

### 👨‍💻 Frontend Dev
→ **ENDPOINTS.md** (especificación API completa)  
→ **BACKEND_READY.md** (quick start español)

### 🔍 Auditor / QA
→ **INTEGRATION_REPORT.md** (cambios realizados)  
→ **PROJECT_CHECKLIST.md** (validaciones)

---

## 🔐 Auth Quick Reference

```typescript
// Login
POST /api/auth/login
Body: { email, password }
Response: { accessToken, user: { id, email, role } }

// Current User
GET /api/auth/me
Header: Authorization: Bearer <token>
Response: { id, email, role }

// Roles
STUDENT    → ver retos PUBLISHED, enviar solutions
PROFESSOR  → CRUD retos propios, ver submissions estudiantes
ADMIN      → acceso total
```

---

## 🗄️ Modelo de Datos

```
User (id, email, password, firstName, lastName, role)
  ├─ Submissions (submissions)
  ├─ Enrolled Courses (coursesEnrolled)
  ├─ Professor Courses (coursesProfessor)
  └─ Created Challenges (createdChallenges)

Course (id, name, code, period, group)
  ├─ Professors (User[])
  ├─ Students (CourseStudent[])
  ├─ Challenges (Challenge[])
  └─ Submissions (Submission[])

Challenge (id, title, description, difficulty, timeLimit, memoryLimit, status)
  ├─ TestCases (TestCase[])
  └─ Submissions (Submission[])

TestCase (id, input, expectedOutput, isHidden, points, order)
  └─ Results (TestCaseResult[])

Submission (id, code, language, status, score, timeMsTotal)
  ├─ User (User)
  ├─ Challenge (Challenge)
  ├─ Course (Course)
  └─ Results (TestCaseResult[])

TestCaseResult (id, status, timeMs, memoryMb, output, error)
  ├─ Submission (Submission)
  └─ TestCase (TestCase)
```

---

## 🐳 Docker Services

```
postgres:16     → port 5432 (database)
redis:7         → port 6379 (queue)
api:NestJS      → port 3000 (backend)
worker-python   → consumes queue
worker-java     → consumes queue
worker-nodejs   → consumes queue
worker-cpp      → consumes queue

Todos en network: codium-network
Datos persistentes: postgres_data, redis_data
```

---

## ✅ Status Board

| Feature | Semana | Status | Docs |
|---------|--------|--------|------|
| **Auth + JWT** | 2 | ✅ | ENDPOINTS.md |
| **CRUD Retos** | 2 | ✅ | ENDPOINTS.md |
| **Submissions (DTOs)** | 2 | ✅ | INTEGRATION_REPORT.md |
| **Queue + Workers** | 3 | ❌ | QUEUE_WORKERS_GUIDE.md |
| **Runners** | 3 | ❌ | QUEUE_WORKERS_GUIDE.md |
| **Leaderboard** | 4 | ❌ | PROJECT_STATUS.md |
| **Evaluaciones** | 4 | ❌ | PROJECT_STATUS.md |
| **Logs + Métricas** | 4 | ❌ | PROJECT_STATUS.md |
| **Swagger** | 5 | ❌ | PROJECT_STATUS.md |
| **Kubernetes** | 6 | ❌ | PROJECT_STATUS.md |

---

## 🎯 This Week's Focus

**CRITICAL:** Implementar Queue + Workers  
**TIME:** 4-6 horas  
**BLOCKER:** SÍ (submissions se quedan encoladas sin esto)

**Start:** `/workspaces/codium/QUEUE_WORKERS_GUIDE.md` paso 1

---

## 📞 Error Rápido?

```bash
# ¿Build falla?
npm run build 2>&1 | tail -50

# ¿Docker no levanta?
docker-compose ps                           # Ver status
docker-compose logs api | tail -100         # Ver errores

# ¿Redis no conecta?
docker exec codium-redis redis-cli PING     # Debe retornar PONG

# ¿Worker no consume?
docker-compose logs worker-python | grep -i error

# ¿DB tiene datos?
docker exec -it codium-postgres psql -U codium -d codium_db -c "SELECT COUNT(*) FROM challenges;"
```

---

## 🚀 Comandos Útiles

```bash
# Develop
npm run start:dev                   # Watch mode
npm run prisma:studio             # Browser DB explorer

# Test
npm run test                        # Jest
npm run test:watch                 # Watch mode

# Deploy
npm run build                       # Compile
npm run start:prod                 # Production mode
docker-compose -f docker-compose.prod.yml up

# Scale
docker-compose up --scale worker-java=3

# Clean
docker-compose down -v              # Remove everything
npm run prisma:migrate reset        # Reset DB
```

---

**Última Actualización:** 29 de noviembre de 2025  
**Versión:** 1.0  
**Próximo:** QUEUE_WORKERS_GUIDE.md (Semana 3)
