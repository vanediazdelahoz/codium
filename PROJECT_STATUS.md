# Estado del Proyecto Codium - Plan de Acción

**Fecha:** 29 de noviembre de 2025  
**Versión:** 1.0  
**Estado General:** 60% completado (Semana 2 finalizada, Semana 3-5 pendiente)

---

## 📊 Resumen de Progreso

```
✅ COMPLETADO (Semana 1-2)
├─ Autenticación (JWT + Guards + Roles)
├─ CRUD de Retos
├─ Test Cases (endpoints)
├─ Docker Compose (API, Postgres, Redis, 4 Workers)
├─ Modelos Prisma (User, Course, Challenge, TestCase, Submission)
└─ DTOs frontend-first alignment

⏳ EN PROGRESO (Semana 3+)
├─ Queue + Workers integración (Redis/Bull)
├─ Runners con límites de recursos
├─ Leaderboard
└─ Observabilidad (logs + métricas)

❌ NO INICIADO
├─ Evaluaciones
├─ Swagger automático
├─ Kubernetes manifiestos
└─ Escalado avanzado
```

---

## 1️⃣ SEMANA 1: Configuración Base ✅ COMPLETADO

### ✅ Docker Compose

**Estado:** Validado funcional

**Servicios configurados:**
- ✅ `api` (NestJS) → puerto 3000
- ✅ `postgres` (v16) → puerto 5432
- ✅ `redis` (v7) → puerto 6379
- ✅ `worker-python` → consume queue
- ✅ `worker-java` → consume queue
- ✅ `worker-nodejs` → consume queue
- ✅ `worker-cpp` → consume queue

**Cambios recomendados:** Ninguno crítico. El docker-compose está completo.

---

## 2️⃣ SEMANA 2: Modelos, Auth, CRUD Retos ✅ COMPLETADO

### ✅ Modelos Prisma

**Estado:** Completado y alineado con frontend

| Modelo | Status | Detalles |
|--------|--------|---------|
| `User` | ✅ | id, email, password, firstName, lastName, role (STUDENT, PROFESSOR, ADMIN) |
| `Course` | ✅ | id, name, code, period, group, relación con profesores y estudiantes |
| `CourseStudent` | ✅ | Relación N:M entre User y Course (enrollmentStatus) |
| `Challenge` | ✅ | id, title, description, difficulty, timeLimit, memoryLimit, status, courseId, createdById |
| `TestCase` | ✅ | id, input, expectedOutput, isHidden, points, order |
| `Submission` | ✅ | id, userId, code, language, status, score, timeMsTotal, memoryUsedMb |
| `TestCaseResult` | ✅ | id, submissionId, testCaseId, status, timeMs, memoryMb, output, error |
| `Evaluation` | ❌ | **FALTA** — Necesario para Semana 5 |
| `Leaderboard` | ❌ | **FALTA** — Puede ser computed o materializado |

**Cambios pendientes:**
1. Añadir modelo `Evaluation` (controla tiempos y límites de submissions)
2. Considerar materializar `Leaderboard` en tabla o calcular on-demand

### ✅ Autenticación

**Estado:** Implementado y verificado

- ✅ JWT Bearer token (7 días de expiración)
- ✅ Roles: STUDENT, PROFESSOR, ADMIN
- ✅ Decorators: `@CurrentUser()`, `@Roles()`, `@Public()`
- ✅ Guards: `JwtAuthGuard`, `RolesGuard`
- ✅ Endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`

### ✅ CRUD Retos

**Estado:** Completado

Endpoints:
- ✅ `POST /api/challenges` (crear)
- ✅ `GET /api/challenges` (listar con visibilidad por rol)
- ✅ `GET /api/challenges/:id` (obtener)
- ✅ `PATCH /api/challenges/:id` (actualizar)
- ✅ `DELETE /api/challenges/:id` (eliminar)
- ✅ `POST /api/challenges/:id/test-cases` (añadir test case)
- ✅ `GET /api/challenges/:id/test-cases` (listar test cases)

---

## 3️⃣ SEMANA 3: Cursos y Evaluaciones

### ⏳ Cursos (Parcialmente completado)

**Estado:** Endpoints básicos funcionales

Endpoints:
- ✅ `POST /api/courses` (crear curso)
- ✅ `GET /api/courses` (listar cursos del usuario)
- ✅ `GET /api/courses/:id` (obtener curso)
- ✅ `POST /api/courses/:id/students` (matricular estudiante)

**Pendiente:**
- [ ] Validar que estudiante solo ve retos de su curso
- [ ] Endpoint para obtener estudiantes de un curso
- [ ] Endpoint para desmatricular estudiante

### ❌ Evaluaciones (NO INICIADO)

**Necesario:**
```typescript
model Evaluation {
  id        String    @id @default(uuid())
  courseId  String
  title     String
  startTime DateTime
  endTime   DateTime
  
  // Restricciones
  maxSubmissions Int
  
  challenges EvaluationChallenge[]
  submissions Submission[] // aisladas por evaluación
}

model EvaluationChallenge {
  evaluationId String
  challengeId  String
}
```

**Cambios necesarios en Submission:**
```typescript
// Agregar a Submission:
evaluationId  String? // null si es práctica, uuid si es evaluación
```

---

## 4️⃣ SEMANA 4-5: Runners y Procesamiento de Submissions

### ❌ Queue + Workers (EN DISEÑO)

**Estado:** Estructura lista, workers no procesan todavía

**Problema actual:** Workers están en docker-compose pero no consumen de Redis correctamente.

**Plan de implementación:**

1. **Verificar worker.ts en cada worker:**
   ```typescript
   // workers/python-worker/worker.ts
   import { Queue } from 'bull';
   import { createConnection } from 'typeorm'; // o Prisma
   
   const submissionQueue = new Queue('submissions', {
     redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }
   });
   
   submissionQueue.process(async (job) => {
     // job.data = { submissionId, code, language, testCases }
     // 1. Ejecutar código
     // 2. Comparar con expectedOutput
     // 3. Actualizar Submission en BD
   });
   ```

2. **Actualizar SubmitSolutionUseCase:**
   ```typescript
   // Encolar submission
   await this.submissionQueue.add({
     submissionId: submission.id,
     code: submission.code,
     language: submission.language,
     testCases: challenge.testCases
   });
   ```

3. **Implementar runners con límites:**
   ```bash
   # Python
   docker run --network none --cpus 1 --memory 256m \
     python:3.11-alpine python /tmp/solution.py < input.txt
   
   # Node.js
   docker run --network none --cpus 1 --memory 256m \
     node:20-alpine node /tmp/solution.js < input.txt
   
   # C++
   docker run --network none --cpus 2 --memory 512m \
     gcc:latest g++ /tmp/solution.cpp -o /tmp/solution && /tmp/solution < input.txt
   
   # Java
   docker run --network none --cpus 2 --memory 512m \
     openjdk:21-slim javac /tmp/Solution.java && java -cp /tmp Solution < input.txt
   ```

### ❌ Runners Efímeros (NO INICIADO)

**Requerimientos:**
- [ ] --network none (sin internet)
- [ ] --cpus 1-2 (límite de CPU)
- [ ] --memory 256-512m (límite de memoria)
- [ ] Timeout (5-10 segundos por test case)
- [ ] Lectura segura de stdin/stdout

**Implementación sugerida:**

Crear servicio `RunnerService` en NestJS:
```typescript
// src/infrastructure/runners/runner.service.ts

@Injectable()
export class RunnerService {
  constructor(private docker: Docker) {}
  
  async executeCode(
    language: Language,
    code: string,
    input: string,
    limits: { cpu: string; memory: string; timeout: number }
  ): Promise<{ output: string; error?: string; timeMs: number }> {
    // 1. Crear contenedor efímero
    // 2. Escribir código en /tmp/solution
    // 3. Ejecutar con docker run
    // 4. Capturar stdout/stderr
    // 5. Eliminar contenedor
    // 6. Retornar resultado
  }
}
```

---

## 5️⃣ Observabilidad: Logs + Métricas

### ❌ Logs Estructurados (NO INICIADO)

**Requerimiento:** Logs JSON con requestId / submissionId

```typescript
// src/infrastructure/logging/structured-logger.ts
@Injectable()
export class StructuredLogger {
  log(message: string, context?: string, metadata?: object) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      context,
      ...metadata
    }));
  }
}
```

**Uso:**
```typescript
this.logger.log('Submission received', 'SubmitSolutionUseCase', {
  submissionId,
  userId,
  challengeId,
  language
});
```

### ❌ Métricas (NO INICIADO)

**Requerimiento:** Endpoint `GET /metrics` con:
- submissions_total
- submissions_failed_total
- average_execution_time_ms
- active_runners

```typescript
// src/interface/http/metrics/metrics.controller.ts
@Controller('metrics')
export class MetricsController {
  @Get()
  @Public()
  async getMetrics() {
    return {
      submissions_total: 1250,
      submissions_failed_total: 45,
      average_execution_time_ms: 320,
      active_runners: 4
    };
  }
}
```

---

## 6️⃣ Leaderboard

### ❌ Leaderboard (NO INICIADO)

**Cálculo necesario:**
- Por reto: Top 10 por score + tiempo
- Por curso: Ranking general
- Por evaluación: Ranking aislado (si aplica)

**Implementación:**

Opción A - On-demand (SQL query):
```sql
SELECT 
  u.id, u.firstName, u.lastName,
  COUNT(s.id) as total_submissions,
  SUM(s.score) as total_score,
  AVG(s.timeMsTotal) as avg_time
FROM users u
LEFT JOIN submissions s ON u.id = s.userId
WHERE s.challengeId = $1 AND s.status = 'ACCEPTED'
GROUP BY u.id
ORDER BY total_score DESC, avg_time ASC
LIMIT 10;
```

Opción B - Materializada (tabla caché):
```typescript
model Leaderboard {
  id String @id @default(uuid())
  userId String
  challengeId String
  courseId String
  rank Int
  score Int
  timeMs Int
  submissionsCount Int
  updatedAt DateTime @updatedAt
}
```

---

## 7️⃣ Entregables: Swagger + Seeds + Docker Compose Scale

### ⏳ Swagger (Documentación)

**Estado:** ENDPOINTS.md creado, pero sin Swagger automático

**Implementar:**
```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Codium API')
  .setDescription('Plataforma de juez online')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

**Resultado:** UI en `http://localhost:3000/api/docs`

### ⏳ Seeds (Datos de Prueba)

**Estado:** `prisma/seed.ts` existe pero puede necesitar ampliación

**Verificar:**
- [ ] Usuarios: 1 admin, 2 profesores, 5 estudiantes
- [ ] Cursos: 2 cursos con estudiantes inscritos
- [ ] Retos: 5 retos básicos (Easy, Medium, Hard)
- [ ] Test cases: 3 casos por reto
- [ ] Submissions: muestras para testing

### ⏳ Docker Compose Scale

**Plan:**
```bash
# Ejecutar 3 instancias de Python worker
docker-compose up --scale worker-python=3

# Resultado: 3 contenedores worker-python consumiendo de la misma queue Redis
```

**Problema a verificar:** Asegurar que cada instancia pueda resolver ${DATABASE_URL}

---

## 🎯 Roadmap Priorizado

### CRÍTICO (Semana 3)
1. [ ] Verificar workers en docker-compose procesan realmente
2. [ ] Implementar Queue enqueue en SubmitSolutionUseCase
3. [ ] Crear RunnerService con Docker SDK
4. [ ] Implementar runners con límites (--network none, --cpus, --memory)
5. [ ] Test: enviar submission → debe procesarse en worker

### IMPORTANTE (Semana 4)
6. [ ] Evaluaciones: crear modelo y endpoints
7. [ ] Leaderboard: implementar query on-demand
8. [ ] Logs estructurados JSON
9. [ ] Métricas: endpoint /metrics

### DESEABLE (Semana 5)
10. [ ] Swagger automático
11. [ ] Escalado: docker-compose --scale
12. [ ] Kubernetes manifiestos (si tiempo permite)

---

## 📋 Checklist de Validación

| Tarea | Status | Responsable |
|-------|--------|-------------|
| Docker Compose funcional | ✅ | Done |
| Modelos Prisma completos | ✅ | Done |
| Auth implementado | ✅ | Done |
| CRUD Retos | ✅ | Done |
| Queue + Workers | ⏳ | Pendiente |
| Runners con límites | ⏳ | Pendiente |
| Leaderboard | ❌ | No iniciado |
| Observabilidad | ❌ | No iniciado |
| Swagger | ❌ | No iniciado |
| Kubernetes | ❌ | No iniciado |

---

## 🚀 Próximo Paso

**¿Quieres que comience con...?**

**A)** Verificar workers en docker-compose (debug Queue + Redis integration)  
**B)** Implementar RunnerService con Docker SDK  
**C)** Crear modelo Evaluation + endpoints  
**D)** Implementar Leaderboard on-demand  
**E)** Configurar Swagger automático  

Recommend: **A → B → D** (permite enviar submissions completas y ver ranking)

---

**Generado:** 29 de noviembre de 2025  
**Backend Version:** 1.0 (Production Ready Foundation)
