# 🗺️ Flowchart: Submission Processing Pipeline

**Objetivo:** Visualizar dónde estamos y qué falta

---

## FLUJO ACTUAL (Semana 2 ✅ + Semana 3 🔴)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Next.js)                                  │
│          Estudiante envía código en challenge-submissions.tsx                │
└────────────────────────────┬────────────────────────────────────────────────┘
                             │
                             │ POST /api/submissions
                             │ Body: { code, language: "Python", challengeId }
                             │
        ┌────────────────────▼────────────────────┐
        │   SubmitSolutionController ✅            │
        │   - Valida JWT token                    │
        │   - Extrae @CurrentUser()               │
        │   - Llama SubmitSolutionUseCase         │
        └────────────────────┬────────────────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │  SubmitSolutionUseCase ✅               │
        │  1. Normaliza lenguaje ("Python"→enum)  │
        │  2. Crea submission en BD (QUEUED)      │
        │  3. Lee usuario para obtener fullName   │ ✅ enriquecimiento
        │  4. ❌ [FALTA] Encola en Redis         │ 🔴 SEMANA 3
        │  5. Retorna SubmissionDto               │
        └────────────────────┬────────────────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │    SubmissionMapper.toDto() ✅          │
        │    • mapLanguage(PYTHON) → "Python"    │
        │    • Include submittedAt: ISO timestamp │
        │    • Include studentName: "Juan Pérez"  │ ✅
        │    • testCases[].caseId: numeric ✅     │
        │    • testCases[].status: "OK"|"WA" ✅   │
        └────────────────────┬────────────────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │  Response: SubmissionDto ✅             │
        │  {                                      │
        │    id: uuid,                            │
        │    status: "QUEUED",                    │
        │    studentName: "Juan Pérez",           │ ✅
        │    language: "Python",                  │ ✅
        │    testCases: [{caseId: 1, ...}]       │ ✅
        │    submittedAt: "ISO8601"               │ ✅
        │  }                                      │
        └────────────────────┬────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  JSON Response  │
                    │  HTTP 201       │
                    └────────┬────────┘
                             │
            ┌────────────────▼────────────────┐
            │    Frontend: Poll Status ✅      │
            │    GET /api/submissions/:id      │
            │    (cada 2-3 segundos)           │
            │                                 │
            │    Esperando: status change     │
            │    QUEUED → RUNNING → ACCEPTED  │
            └────────────────────┬────────────┘
                                 │
        ┌────────────────────────▼──────────────────────┐
        │         ❌ AQUÍ SE DETIENE AHORA 🛑          │
        │                                               │
        │    Submission queda en QUEUED forever         │
        │    porque NO HAY WORKER PROCESANDO           │
        │                                               │
        │    🔴 FALTA Semana 3:                         │
        │    • Redis Queue no tiene consumer            │
        │    • RunnerService no existe                  │
        │    • SubmissionProcessor no existe            │
        │    • Docker runners no ejecutan código        │
        └────────────────────────────────────────────────┘
```

---

## FLUJO COMPLETO (Semana 3 🔴 → Objetivo)

```
POST /api/submissions (arriba)
                │
                ▼
    SubmitSolutionUseCase
                │
                ├─ ✅ Normaliza lenguaje
                ├─ ✅ Crea submission (QUEUED)
                ├─ ✅ Enriquece con studentName
                │
                └─ 🔴 NUEVO (Semana 3):
                   this.submissionQueue.add(job)
                        │
                        ▼
                    ┌─────────────────────────────────┐
                    │  Redis Queue (Bull)             │
                    │  Queue: 'submissions'           │ 🔴 NUEVO
                    │  [Job 1: { submissionId, ...}]  │
                    │  [Job 2: { submissionId, ...}]  │
                    │  [Job 3: { submissionId, ...}]  │
                    └──┬────────────────────────┬──────┘
                       │                        │
            ┌──────────▼─────┐      ┌──────────▼─────────┐
            │  Worker Python  │      │   Worker Java      │
            │  @Processor     │      │   @Processor       │ 🔴 NUEVO
            │  (@Process)     │      │   (@Process)       │
            └──────────┬──────┘      └────────────┬──────┘
                       │                         │
            ┌──────────▼─────┐      ┌──────────▼──────────┐
            │ SubmissionJob  │      │ SubmissionJob      │
            │ {              │      │ {                  │ 🔴 NUEVO
            │  submissionId,  │      │  submissionId,     │
            │  code,          │      │  code,             │
            │  language,      │      │  language,         │
            │  testCases[]    │      │  testCases[]       │
            │ }              │      │ }                  │
            └──────────┬──────┘      └────────────┬──────┘
                       │                         │
            ┌──────────▼─────────────────────────┬──────┐
            │   RunnerService (Docker SDK)             │ 🔴 NUEVO
            │   private executeContainer() {           │
            │     • docker.createContainer()           │
            │     • HostConfig:                        │
            │       - NetworkMode: 'none'    ✅        │
            │       - Memory: 256MB          ✅        │
            │       - CpuQuota: 1 CPU        ✅        │
            │       - PidsLimit: 10          ✅        │
            │     • Timeout: 5 segundos      ✅        │
            │     • Captura stdout/stderr               │
            │     • container.remove()                 │
            │   }                                      │
            └────────────────────┬─────────────────────┘
                                 │
                    ┌────────────▼──────────┐
                    │  Docker Containers    │ 🔴 NUEVO
                    ├──────────────────────┤
                    │ python:3.11-alpine    │
                    │ /tmp/solution.py      │
                    │ stdin: test input     │
                    │ stdout: "expected"    │
                    └──────────────────────┘
                                 │
                    ┌────────────▼──────────┐
                    │  SubmissionProcessor  │
                    │  @Process() handler   │ 🔴 NUEVO
                    │                       │
                    │  1. status: RUNNING   │
                    │  2. Loop testCases:   │
                    │     • runnerService   │
                    │       .runPython()    │
                    │     • Compare output  │
                    │       vs expected     │
                    │     • Save result     │
                    │  3. Calculate final   │
                    │     status            │
                    │  4. Update submission │
                    │     + score + time    │
                    │  5. Update BD         │
                    └──────────────┬────────┘
                                  │
                    ┌─────────────▼──────────┐
                    │  TestCaseResult DB     │ 🔴 NUEVO
                    │  (per test case)       │
                    │  {                     │
                    │    submissionId,       │
                    │    testCaseId,         │
                    │    status: "ACCEPTED", │
                    │    timeMs: 45,         │
                    │    output: "...",      │
                    │    error: null         │
                    │  }                     │
                    └─────────────┬──────────┘
                                  │
                    ┌─────────────▼──────────┐
                    │  Submission Updated    │
                    │  (in Database)         │
                    │  {                     │
                    │    id: uuid,           │
                    │    status: "ACCEPTED", │
                    │    score: 100,         │
                    │    timeMsTotal: 145    │
                    │  }                     │
                    └─────────────┬──────────┘
                                  │
                    ┌─────────────▼──────────┐
                    │  Frontend Polls Again  │
                    │  GET /submissions/:id  │
                    │                        │
                    │  Response:             │
                    │  {                     │
                    │    status: "ACCEPTED", │
                    │    testCases: [        │
                    │      {                 │
                    │        caseId: 1,      │
                    │        status: "OK",   │
                    │        timeMs: 45      │
                    │      }, ...            │
                    │    ]                   │
                    │  }                     │
                    │                        │
                    │  Frontend: ✅ Show    │
                    │  "Submission Accepted" │
                    └────────────────────────┘
```

---

## Timeline: Qué Falta

```
ACTUAL                    NECESARIO (Semana 3)
═══════════════════════════════════════════════════════════════

submission.status = QUEUED    0. npm install dockerode
   │                          1. Crear QueueModule
   │                          2. Crear RunnerService
   │                          3. Crear SubmissionProcessor
   │                          4. Update SubmitSolutionUseCase
   │                             └─ await queue.add(job)
   │
   └─→ [FOREVER] ❌           └─→ Redis Queue
                                 ↓
                          Worker Processor
                                 ↓
                          RunnerService
                                 ↓
                          Docker Container
                                 ↓
                          Compare Output
                                 ↓
                          Save Results
                                 ↓
                          Update Submission
                                 ↓
                          submission.status = ACCEPTED ✅
```

---

## Stack de Cambios Requeridos (Semana 3)

```
1. DEPENDENCIAS
   └─ npm install dockerode @types/dockerode

2. INFRASTRUCTURE (nuevo)
   ├─ src/infrastructure/queue/queue.module.ts
   ├─ src/infrastructure/runners/runner.service.ts
   └─ src/infrastructure/queue/processors/submission.processor.ts

3. MODULES (actualizar)
   ├─ src/app.module.ts (importar QueueModule)
   ├─ workers/python-worker/worker.module.ts (actualizar)
   ├─ workers/java-worker/worker.module.ts (actualizar)
   ├─ workers/nodejs-worker/worker.module.ts (actualizar)
   └─ workers/cpp-worker/worker.module.ts (actualizar)

4. USE CASES (actualizar)
   └─ src/core/application/submissions/usecases/submit-solution.usecase.ts
      ├─ Inyectar @Inject(getQueueToken('submissions'))
      └─ await this.submissionQueue.add(jobData)

5. VALIDACIÓN
   └─ docker-compose up
   └─ POST /api/submissions
   └─ GET /api/submissions/:id (polling)
   └─ Verificar: status cambia QUEUED → RUNNING → ACCEPTED
```

---

## Archivos Generados en Esta Sesión

```
CORE DOCUMENTATION (1390+ líneas):
├─ ENDPOINTS.md              (350+ líneas - Frontend Dev)
├─ INTEGRATION_REPORT.md     (230+ líneas - Tech Lead)
├─ BACKEND_READY.md          (120+ líneas - Frontend Quick Start)
├─ PROJECT_STATUS.md         (400+ líneas - Roadmap Completo)
├─ QUEUE_WORKERS_GUIDE.md    (290+ líneas - ⭐ CRÍTICA Semana 3)
├─ EXECUTIVE_SUMMARY.md      (400+ líneas - PM/CTO)
├─ PROJECT_CHECKLIST.md      (280+ líneas - QA/Dev)
├─ QUICK_REFERENCE.md        (180+ líneas - Todos)
└─ SESSION_SUMMARY.md        (220+ líneas - Esta sesión)

FLOW DIAGRAMS:
└─ Este archivo: flowchart visual
```

---

## ¿Por Dónde Empezar?

### Para Implementar Semana 3:

1. **Leer:** `QUEUE_WORKERS_GUIDE.md` (paso 1-6, 30 min)
2. **Instalar:** `npm install dockerode @types/dockerode` (2 min)
3. **Código:** Crear `QueueModule` + `RunnerService` (2 horas)
4. **Código:** Crear `SubmissionProcessor` (1.5 horas)
5. **Código:** Actualizar `SubmitSolutionUseCase` (30 min)
6. **Test:** `docker-compose up && POST /submissions` (1 hora)

**Total:** 4-6 horas

---

## Checkpoints de Validación

```
✅ Checkpoint 1: Build limpio
   npm run build → exit 0

✅ Checkpoint 2: Docker levanta
   docker-compose up -d && docker-compose ps

✅ Checkpoint 3: Redis conecta
   docker exec codium-redis redis-cli PING → PONG

✅ Checkpoint 4: Worker consume jobs
   docker-compose logs worker-python | grep "Processing"

✅ Checkpoint 5: Submission procesa
   POST /submissions → status QUEUED
   (esperar 5s)
   GET /submissions/:id → status ACCEPTED

❌ Si falla algo:
   → Revisar QUEUE_WORKERS_GUIDE.md sección "Debugging"
```

---

**Generado:** 29 de noviembre de 2025  
**Propósito:** Visualizar dónde estamos y qué falta para Semana 3  
**Próximo:** Implementar QUEUE_WORKERS_GUIDE.md
