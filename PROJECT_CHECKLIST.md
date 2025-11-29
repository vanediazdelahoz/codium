# ✅ Codium Project Checklist - Master Reference

**Última Actualización:** 29 de noviembre de 2025  
**Versión:** 1.0 (Semana 2 Completada)

---

## 🎯 SEMANA 1: Configuración Base

### ✅ Docker Compose

- [x] Servicio API (NestJS) → puerto 3000
- [x] Servicio Postgres 16 → puerto 5432
- [x] Servicio Redis 7 → puerto 6379
- [x] Worker Python
- [x] Worker Java
- [x] Worker Node.js
- [x] Worker C++
- [x] Networks configurados (codium-network)
- [x] Volumes persistentes (postgres_data, redis_data)
- [x] Health checks funcionales
- [x] Comando startup correcto (migrations + seed)

### ✅ Instalación y Build

- [x] npm install completado
- [x] prisma generate sin errores
- [x] npm run build sin errores (TypeScript)
- [x] npm run lint sin critical issues
- [x] Node modules instalados correctamente

---

## 🎯 SEMANA 2: Modelos, Auth, CRUD

### ✅ Modelos Prisma

- [x] User (id, email, password, firstName, lastName, role)
- [x] Course (id, name, code, period, group, profesores, estudiantes)
- [x] CourseStudent (relación N:M con enrollment)
- [x] Challenge (id, title, description, difficulty, timeLimit, memoryLimit, status, createdBy)
- [x] TestCase (id, input, expectedOutput, isHidden, points, order, challenge)
- [x] Submission (id, userId, code, language, status, score, timeMsTotal, memoryUsedMb)
- [x] TestCaseResult (id, submissionId, testCaseId, status, timeMs, memoryMb, output, error)
- [ ] Evaluation (PENDIENTE para Semana 4)
- [ ] Leaderboard (PENDIENTE para Semana 4)

### ✅ Enums Prisma

- [x] UserRole: STUDENT, PROFESSOR, ADMIN
- [x] Difficulty: EASY, MEDIUM, HARD
- [x] ChallengeStatus: DRAFT, PUBLISHED, ARCHIVED
- [x] SubmissionStatus: QUEUED, RUNNING, ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR
- [x] Language: PYTHON, JAVA, NODEJS, CPP

### ✅ Autenticación (JWT)

- [x] JwtStrategy implementado
- [x] JwtAuthGuard funcional
- [x] @Public() decorator para rutas públicas
- [x] @Roles() decorator para validar roles
- [x] RolesGuard para enforcement
- [x] @CurrentUser() decorator para obtener usuario
- [x] Endpoint POST /api/auth/register
- [x] Endpoint POST /api/auth/login → devuelve JWT + user
- [x] Endpoint GET /api/auth/me (NUEVO)
- [x] Token expiration: 7 días
- [x] Password hashing con bcryptjs
- [x] CORS habilitado

### ✅ CRUD Retos

- [x] Endpoint POST /api/challenges (crear reto)
  - [x] Guard: @Roles(ADMIN, PROFESSOR)
  - [x] Validación: CreateChallengeDto
  - [x] Retorna ChallengeDto con id

- [x] Endpoint GET /api/challenges (listar retos)
  - [x] Guard: @AuthGuard
  - [x] Filtro visibilidad por rol:
    - [x] STUDENT: solo PUBLISHED
    - [x] PROFESSOR/ADMIN: todos
  - [x] Retorna array de ChallengeDto

- [x] Endpoint GET /api/challenges/:id (obtener reto)
  - [x] Guard: @AuthGuard
  - [x] Validación de acceso por rol
  - [x] Retorna ChallengeDto

- [x] Endpoint PATCH /api/challenges/:id (actualizar reto)
  - [x] Guard: @Roles(ADMIN, PROFESSOR)
  - [x] Validación: UpdateChallengeDto
  - [x] Retorna ChallengeDto actualizado

- [x] Endpoint DELETE /api/challenges/:id (eliminar reto)
  - [x] Guard: @Roles(ADMIN, PROFESSOR)
  - [x] Cascade delete de test cases
  - [x] Retorna 204 No Content

### ✅ CRUD Test Cases

- [x] Endpoint POST /api/challenges/:id/test-cases (añadir caso)
  - [x] Guard: @Roles(ADMIN, PROFESSOR)
  - [x] Validación: AddTestCaseDto
  - [x] Retorna TestCaseDto

- [x] Endpoint GET /api/challenges/:id/test-cases (listar casos)
  - [x] Guard: @AuthGuard
  - [x] Filtro: estudiantes ven solo los no-hidden
  - [x] Retorna array de TestCaseDto

- [x] Endpoint DELETE /api/challenges/:id/test-cases/:caseId (eliminar caso)
  - [x] Guard: @Roles(ADMIN, PROFESSOR)
  - [x] Validación de permisos
  - [x] Retorna 204 No Content

### ✅ Submissions (DTOs Redesigned)

- [x] SubmitSolutionDto:
  - [x] code: string
  - [x] language: Language | string (ambos formatos)
  - [x] challengeId: string

- [x] SubmissionDto (FRONTEND-FIRST):
  - [x] id: string
  - [x] studentId: string (UUID)
  - [x] studentName: string (enriquecido desde BD) ✅
  - [x] language: string legible ("Python", "C++", "Node.js", "Java") ✅
  - [x] status: SubmissionStatus
  - [x] score: number
  - [x] executionTime: string formateado ("0.45s") ✅
  - [x] submittedAt: ISO timestamp ✅
  - [x] testCases: array de { caseId: number, status: "OK"|"WA"|"TLE"|"RE"|"CE", timeMs: number }

### ✅ Submissions Use Cases

- [x] SubmitSolutionUseCase
  - [x] Normaliza lenguaje: "Python" → PYTHON enum
  - [x] Crea submission en BD con status QUEUED
  - [x] [ ] PENDIENTE: Encola en Redis (Semana 3)
  - [x] Retorna SubmissionDto

- [x] GetSubmissionUseCase
  - [x] Obtiene submission por id
  - [x] Enriquece con studentName desde USER_REPOSITORY ✅
  - [x] Retorna SubmissionDto

- [x] ListUserSubmissionsUseCase
  - [x] Lista submissions del usuario
  - [x] Enriquece array completo con studentName desde USER_REPOSITORY ✅
  - [x] Retorna array de SubmissionDto

### ✅ Submissions Mapper

- [x] SubmissionMapper.toDto(entity, studentName):
  - [x] mapLanguage(): PYTHON → "Python", CPP → "C++", etc. ✅
  - [x] mapTestCaseStatus(): SubmissionStatus → corto códigos ✅
  - [x] Calcula executionTime formateado
  - [x] Incluye submittedAt: ISO timestamp
  - [x] Incluye studentName (parámetro)

### ✅ Cursos (Endpoints Básicos)

- [x] POST /api/courses (crear curso)
- [x] GET /api/courses (listar cursos del usuario)
- [x] GET /api/courses/:id (obtener curso)
- [x] POST /api/courses/:id/students (matricular estudiante)

---

## 🎯 SEMANA 3: Queue + Workers (CRÍTICA) 🔴

### ❌ Instalación de dependencias

- [ ] npm install dockerode
- [ ] npm install --save-dev @types/dockerode
- [ ] Verificar npm list @nestjs/bull bull

### ❌ Queue Module

- [ ] Crear src/infrastructure/queue/queue.module.ts
- [ ] BullModule.forRoot() con Redis config
- [ ] Registrar queue 'submissions'
- [ ] Exportar BullModule

### ❌ Runner Service

- [ ] Crear src/infrastructure/runners/runner.service.ts
- [ ] Método runPython(code, input, limits)
- [ ] Método runNodeJs(code, input, limits)
- [ ] Método runCpp(code, input, limits)
- [ ] Método runJava(code, input, limits)
- [ ] executeContainer() privado:
  - [ ] Docker.createContainer()
  - [ ] HostConfig: --network none ✅
  - [ ] HostConfig: --cpus 1
  - [ ] HostConfig: --memory 256MB
  - [ ] HostConfig: PidsLimit = 10
  - [ ] Timeout control (5 segundos)
  - [ ] Captura stdout/stderr
  - [ ] Limpia container

### ❌ Submission Processor

- [ ] Crear src/infrastructure/queue/processors/submission.processor.ts
- [ ] @Processor('submissions')
- [ ] @Process() método
- [ ] Recibe SubmissionJob: { submissionId, code, language, testCases[] }
- [ ] Actualiza submission a status RUNNING
- [ ] Loop por cada test case:
  - [ ] Llama runnerService.run()
  - [ ] Compara output vs expectedOutput
  - [ ] Guarda TestCaseResult
- [ ] Calcula submission status final (ACCEPTED o WRONG_ANSWER)
- [ ] Actualiza submission con score, timeMsTotal
- [ ] Manejo de errores: retry 3 veces

### ❌ Worker Module

- [ ] Actualizar workers/python-worker/worker.module.ts
- [ ] Importar BullModule
- [ ] Proveedores: SubmissionProcessor, RunnerService
- [ ] Acceso a Prisma

### ❌ Worker Bootstrap

- [ ] Actualizar workers/python-worker/worker.ts
- [ ] NestFactory.create(WorkerModule)
- [ ] Logger: "Python worker started"
- [ ] Conexión Redis visible

### ❌ SubmitSolutionUseCase Update

- [ ] Inyectar Queue 'submissions'
- [ ] Después de crear submission:
  - [ ] this.submissionQueue.add(jobData)
  - [ ] Opciones: attempts: 3, backoff, removeOnComplete
- [ ] Retornar submission con status QUEUED

### ❌ Validación

- [ ] docker-compose up -d
- [ ] Esperar ~30 segundos
- [ ] docker-compose ps → todos UP
- [ ] docker-compose logs worker-python → "worker started"
- [ ] POST /api/submissions → retorna status QUEUED
- [ ] Esperar 3-5 segundos
- [ ] GET /api/submissions/:id → status cambia a ACCEPTED|WA
- [ ] docker exec codium-postgres psql... → verificar TestCaseResult guardados

**Checklist de Debug:**
- [ ] Redis conectado: docker exec codium-redis redis-cli PING → PONG
- [ ] Jobs encolados: docker exec codium-redis redis-cli LRANGE bull:submissions:1:wait 0 -1
- [ ] Worker consume: docker-compose logs worker-python | grep "Processing submission"
- [ ] Docker image existe: docker images | grep python:3.11
- [ ] Container ejecuta: docker run --rm python:3.11-alpine python -c "print('hello')"

---

## 🎯 SEMANA 4: Leaderboard + Evaluaciones + Observabilidad

### ❌ Modelo Evaluation (Prisma)

- [ ] model Evaluation { id, courseId, title, startTime, endTime, maxSubmissions }
- [ ] model EvaluationChallenge { evaluationId, challengeId }
- [ ] Agregar evaluationId? a Submission
- [ ] Migration: prisma migrate dev

### ❌ Endpoints Evaluations

- [ ] POST /api/evaluations (crear)
- [ ] GET /api/evaluations (listar)
- [ ] GET /api/evaluations/:id (obtener)
- [ ] PATCH /api/evaluations/:id (actualizar)
- [ ] DELETE /api/evaluations/:id (eliminar)
- [ ] POST /api/evaluations/:id/challenges (asignar reto)

### ❌ Leaderboard Query (On-Demand)

- [ ] SQL: SELECT user, total_score, avg_time, rank
- [ ] GET /api/leaderboard/challenge/:id
- [ ] GET /api/leaderboard/course/:id
- [ ] GET /api/leaderboard/evaluation/:id
- [ ] Filtro: solo submissions ACCEPTED
- [ ] Order by: score DESC, time ASC

### ❌ Logs Estructurados

- [ ] Crear src/infrastructure/logging/structured-logger.ts
- [ ] Logger inyectable
- [ ] Método log(message, context, metadata)
- [ ] Salida JSON: timestamp, level, message, context, metadata
- [ ] Eventos:
  - [ ] submission_created
  - [ ] execution_started
  - [ ] execution_completed
  - [ ] error

### ❌ Métricas

- [ ] Crear src/interface/http/metrics/metrics.controller.ts
- [ ] GET /metrics (sin autenticación)
- [ ] Expone:
  - [ ] submissions_total
  - [ ] submissions_failed_total
  - [ ] average_execution_time_ms
  - [ ] active_runners

---

## 🎯 SEMANA 5: Swagger + Seeds + Escalado

### ❌ Swagger Automático

- [ ] npm install @nestjs/swagger
- [ ] Configurar en main.ts:
  - [ ] SwaggerModule.setup()
  - [ ] Resultado: http://localhost:3000/api/docs

### ❌ Decorators Swagger en Controllers

- [ ] @ApiOperation(description)
- [ ] @ApiResponse(status, type)
- [ ] @ApiBearerAuth()
- [ ] @ApiParam(), @ApiBody()

### ❌ Seeds (prisma/seed.ts)

- [ ] 1 usuario ADMIN
- [ ] 2 usuarios PROFESSOR
- [ ] 5 usuarios STUDENT
- [ ] 2 cursos con estudiantes inscritos
- [ ] 5 retos por curso (Easy, Medium, Hard)
- [ ] 3 test cases por reto
- [ ] Script para reset: prisma db seed

### ❌ Docker Compose Scale

- [ ] docker-compose up --scale worker-java=3
- [ ] Verificar: 3 instancias de java-worker
- [ ] Todos consumen de la misma Redis queue
- [ ] Balanceo automático

### ❌ Kubernetes (Opcional)

- [ ] Manifiestos:
  - [ ] api-deployment.yaml
  - [ ] postgres-statefulset.yaml
  - [ ] redis-deployment.yaml
  - [ ] worker-job.yaml
- [ ] HPA para workers (autoscale)
- [ ] PersistentVolumes para datos

---

## 🔐 Seguridad & Compliance

### ✅ Implementado

- [x] JWT 7 días expiración
- [x] Password hashing bcryptjs
- [x] CORS habilitado
- [x] Role-based access control
- [x] @Public() para excepciones
- [x] Request validation (class-validator)

### ⏳ Pendiente (Semana 3+)

- [ ] Runners: --network none (sin internet)
- [ ] Runners: --pids-limit (limitar procesos)
- [ ] Runners: --security-opt no-new-privileges
- [ ] Rate limiting en /submissions
- [ ] SQL injection prevention (Prisma already safe)
- [ ] XSS protection (frontend responsibility)

---

## 📊 Documentación

### ✅ Generado

- [x] ENDPOINTS.md (350+ líneas — especificación API)
- [x] INTEGRATION_REPORT.md (230+ líneas — reporte cambios)
- [x] BACKEND_READY.md (120+ líneas — quick start español)
- [x] PROJECT_STATUS.md (400+ líneas — estado + roadmap)
- [x] QUEUE_WORKERS_GUIDE.md (290+ líneas — implementación)
- [x] EXECUTIVE_SUMMARY.md (400+ líneas — resumen ejecutivo)
- [x] PROJECT_CHECKLIST.md (este archivo)

### ❌ Pendiente

- [ ] Swagger API docs (auto-generated)
- [ ] Architecture diagrams (opcional)
- [ ] Deployment guide (Kubernetes)
- [ ] Troubleshooting guide

---

## 🚀 Validación Final

### Pre-Deploy Checklist

- [ ] npm run build → exit 0 (sin errores)
- [ ] npm run lint → sin critical
- [ ] docker-compose ps → todos UP
- [ ] POST /api/auth/login → JWT válido
- [ ] GET /api/auth/me → usuario retornado
- [ ] GET /api/challenges → con visibilidad
- [ ] POST /api/submissions → QUEUED
- [ ] GET /api/submissions/:id → ACCEPTED (después de 5s)
- [ ] GET /api/leaderboard/challenge/:id → ranking
- [ ] GET /metrics → métricas visibles

### Performance Targets

- [ ] POST /submissions: < 100ms
- [ ] GET /challenges: < 200ms
- [ ] Code execution: < 5 segundos
- [ ] Memory usage per runner: < 256MB
- [ ] CPU limit: 1-2 cores por runner

---

## 📞 Estado por Componente

| Componente | Semana | Status | Crítica? |
|-----------|--------|--------|----------|
| Docker Compose | 1 | ✅ | No |
| Modelos Prisma | 2 | ✅ | Sí |
| Autenticación | 2 | ✅ | Sí |
| CRUD Retos | 2 | ✅ | Sí |
| Submissions DTOs | 2 | ✅ | Sí |
| Queue + Workers | 3 | ❌ | 🔴 **SÍ** |
| Runners | 3 | ❌ | 🔴 **SÍ** |
| Leaderboard | 4 | ❌ | No |
| Evaluaciones | 4 | ❌ | No |
| Observabilidad | 4 | ❌ | No |
| Swagger | 5 | ❌ | No |
| Kubernetes | 6 | ❌ | No |

---

## 🎯 Siguiente Paso

**Semana 3 Objetivo:** Queue + Workers funcionales

**Primer PR:**
1. Instalar dockerode
2. Crear QueueModule + RunnerService
3. Implementar SubmissionProcessor
4. Actualizar SubmitSolutionUseCase
5. Test: POST /submissions → procesa completamente

**Guía:** `/workspaces/codium/QUEUE_WORKERS_GUIDE.md` (290+ líneas de código listo)

**Tiempo:** 4-6 horas

**Riesgo:** ALTO → sin esto no hay feature de submission

---

**Generado:** 29 de noviembre de 2025  
**Versión:** 1.0 (Ready for Development Sprints)
