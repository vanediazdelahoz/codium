# GUÍA: Queue + Workers Integration (Crítica para Semana 3)

**Fecha:** 29 de noviembre de 2025  
**Prioridad:** 🔴 CRÍTICA  
**Impacto:** Sin esto, las submissions quedan encoladas pero nunca se procesan

---

## 🎯 Objetivo

Verificar y completar la integración Queue + Workers:
- ✅ Submissions se encolan en Redis (via Bull)
- ✅ Workers consumen de la cola
- ✅ Workers ejecutan código con Docker (runners)
- ✅ Resultados se guardan en BD y marcan submission como ACCEPTED|WA|TLE|RE|CE

---

## 📐 Arquitectura Actual

```
Frontend → POST /submissions → SubmitSolutionUseCase
                                      ↓
                            Save Submission (QUEUED)
                                      ↓
                            SubmissionQueue.add(job)
                                      ↓
                                  REDIS
                                    ↙ ↘
                        worker-python   worker-java
                             ↓              ↓
                        process job    process job
                             ↓              ↓
                        Docker runner  Docker runner
                             ↓              ↓
                        Compare results
                             ↓
                        Update Submission (BD)
                             ↓
                        Frontend polls GET /submissions/:id
```

---

## 🔧 Estado Actual vs Necesario

| Componente | Estado Actual | Necesario | Impacto |
|------------|---------------|-----------|---------|
| Redis | ✅ Corriendo | ✅ OK | Job persistence |
| Bull Queue | ✅ Instalado | ✅ Enqueue | Job management |
| SubmitSolutionUseCase | ✅ Crea submission | ⚠️ **FALTA** enqueue | **CRÍTICA** |
| worker-*.ts | ✅ Existe | ⚠️ **FALTA** consumer loop | **CRÍTICA** |
| RunnerService | ❌ No existe | ✅ Necesario | **CRÍTICA** |
| Docker SDK | ❌ No instalado | ✅ Necesario | **CRÍTICA** |

---

## 🚀 Plan de Implementación (Paso a Paso)

### PASO 1: Verificar Queue Module en NestJS

```bash
cd /workspaces/codium

# Buscar si existe QueueModule o similar
grep -r "BullModule\|QueueModule" src/
```

**Esperado:** Debe existir en `src/infrastructure/queue/` o similar

**Si no existe:**
```typescript
// src/infrastructure/queue/queue.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'submissions',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
```

### PASO 2: Inyectar Queue en SubmitSolutionUseCase

```typescript
// src/core/application/submissions/usecases/submit-solution.usecase.ts

import { Injectable, Inject } from '@nestjs/common';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

@Injectable()
export class SubmitSolutionUseCase {
  constructor(
    @Inject(getQueueToken('submissions')) private submissionQueue: Queue,
    // ... otros repositorios
  ) {}

  async execute(
    userId: string,
    challengeId: string,
    courseId: string,
    submitSolutionDto: SubmitSolutionDto,
  ): Promise<SubmissionDto> {
    // 1. Crear submission en BD
    const submission = await this.submissionRepository.create({
      userId,
      challengeId,
      courseId,
      code: submitSolutionDto.code,
      language: this.normalizeLanguage(submitSolutionDto.language),
      status: SubmissionStatus.QUEUED,
    });

    // 2. NUEVO: Encolar para procesamiento
    await this.submissionQueue.add(
      {
        submissionId: submission.id,
        userId,
        challengeId,
        code: submission.code,
        language: submission.language,
        testCases: challenge.testCases.map(tc => ({
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
        })),
      },
      {
        attempts: 3, // reintentar 3 veces si falla
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      },
    );

    // 3. Retornar submission con status QUEUED
    return this.submissionMapper.toDto(submission);
  }
}
```

### PASO 3: Crear RunnerService

```typescript
// src/infrastructure/runners/runner.service.ts

import { Injectable, Logger } from '@nestjs/common';
import Docker from 'dockerode';
import { Language } from '@prisma/client';

interface RunResult {
  output: string;
  error?: string;
  timeMs: number;
  exitCode: number;
}

@Injectable()
export class RunnerService {
  private readonly logger = new Logger('RunnerService');
  private docker = new Docker();

  async runPython(
    code: string,
    input: string,
    limits: { timeout: number; memory: number; cpus: number },
  ): Promise<RunResult> {
    return this.executeContainer({
      image: 'python:3.11-alpine',
      cmd: ['python', '/tmp/solution.py'],
      code,
      input,
      limits,
    });
  }

  async runNodeJs(
    code: string,
    input: string,
    limits: { timeout: number; memory: number; cpus: number },
  ): Promise<RunResult> {
    return this.executeContainer({
      image: 'node:20-alpine',
      cmd: ['node', '/tmp/solution.js'],
      code,
      input,
      limits,
    });
  }

  async runCpp(
    code: string,
    input: string,
    limits: { timeout: number; memory: number; cpus: number },
  ): Promise<RunResult> {
    // Compilar primero
    await this.executeContainer({
      image: 'gcc:latest',
      cmd: ['g++', '/tmp/solution.cpp', '-o', '/tmp/solution'],
      code,
      input: '',
      limits,
    });

    // Luego ejecutar
    return this.executeContainer({
      image: 'gcc:latest',
      cmd: ['/tmp/solution'],
      code: '', // ya compilado
      input,
      limits,
    });
  }

  async runJava(
    code: string,
    input: string,
    limits: { timeout: number; memory: number; cpus: number },
  ): Promise<RunResult> {
    // Java necesita nombre de clase = Solution
    const finalCode = code.includes('public class Solution')
      ? code
      : code.replace(/public class \w+/, 'public class Solution');

    return this.executeContainer({
      image: 'openjdk:21-slim',
      cmd: ['java', '-cp', '/tmp', 'Solution'],
      code: finalCode,
      input,
      limits,
    });
  }

  private async executeContainer(params: {
    image: string;
    cmd: string[];
    code: string;
    input: string;
    limits: { timeout: number; memory: number; cpus: number };
  }): Promise<RunResult> {
    const startTime = Date.now();
    let container;

    try {
      // 1. Crear contenedor
      container = await this.docker.createContainer({
        Image: params.image,
        Cmd: params.cmd,
        HostConfig: {
          NetworkMode: 'none', // SIN INTERNET
          Memory: params.limits.memory * 1024 * 1024, // bytes
          CpuQuota: params.limits.cpus * 100000, // CPUs en unidades
          PidsLimit: 10, // máximo 10 procesos
          ReadonlyRootfs: false,
          CapDrop: ['ALL'], // Dropear todas las capabilities
          SecurityOpt: ['no-new-privileges:true'],
        },
        StdinOnce: false,
        OpenStdin: true,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
      });

      // 2. Escribir código (si lo hay)
      if (params.code) {
        await container.putArchive(
          Buffer.from(
            JSON.stringify({
              [params.code.includes('class') ? 'Solution.java' : 'solution.py']: {
                data: Buffer.from(params.code).toString('base64'),
              },
            }),
          ),
          { path: '/tmp' },
        );
      }

      // 3. Iniciar contenedor
      await container.start();

      // 4. Enviar entrada
      const stream = await container.attach({
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true,
      });

      stream.write(params.input);
      stream.end();

      // 5. Capturar salida
      const chunks: Buffer[] = [];
      stream.on('data', chunk => chunks.push(chunk));

      // 6. Esperar con timeout
      const output = await Promise.race([
        new Promise<string>((resolve, reject) => {
          stream.on('end', () => {
            resolve(Buffer.concat(chunks).toString());
          });
          stream.on('error', reject);
        }),
        new Promise<string>((_, reject) =>
          setTimeout(
            () => reject(new Error('TIMEOUT')),
            params.limits.timeout,
          ),
        ),
      ]);

      const timeMs = Date.now() - startTime;

      return {
        output,
        timeMs,
        exitCode: 0,
      };
    } catch (error) {
      const timeMs = Date.now() - startTime;

      if (error.message === 'TIMEOUT') {
        return {
          output: '',
          error: 'TIME_LIMIT_EXCEEDED',
          timeMs,
          exitCode: -1,
        };
      }

      return {
        output: '',
        error: `RUNTIME_ERROR: ${error.message}`,
        timeMs,
        exitCode: 1,
      };
    } finally {
      // Limpiar: eliminar contenedor
      if (container) {
        try {
          await container.remove({ force: true });
        } catch (e) {
          this.logger.warn(`Failed to remove container: ${e.message}`);
        }
      }
    }
  }
}
```

### PASO 4: Implementar Worker Processor

```typescript
// src/infrastructure/queue/processors/submission.processor.ts

import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RunnerService } from '../runners/runner.service';

interface SubmissionJob {
  submissionId: string;
  userId: string;
  challengeId: string;
  code: string;
  language: string;
  testCases: Array<{
    testCaseId: string;
    input: string;
    expectedOutput: string;
  }>;
}

@Processor('submissions')
export class SubmissionProcessor {
  private readonly logger = new Logger('SubmissionProcessor');

  constructor(
    private runnerService: RunnerService,
    private submissionRepository: SubmissionRepository,
    private testCaseResultRepository: TestCaseResultRepository,
  ) {}

  @Process()
  async processSubmission(job: Job<SubmissionJob>) {
    const { submissionId, code, language, testCases } = job.data;

    this.logger.log(
      `Processing submission ${submissionId} (${testCases.length} test cases)`,
    );

    try {
      // 1. Marcar como RUNNING
      await this.submissionRepository.update(submissionId, {
        status: 'RUNNING',
      });

      // 2. Ejecutar cada test case
      const results = [];
      let passedCount = 0;
      let totalTime = 0;

      for (const testCase of testCases) {
        const runResult = await this.runnerService.run(
          language,
          code,
          testCase.input,
          {
            timeout: 5000,
            memory: 256,
            cpus: 1,
          },
        );

        const status = this.compareOutput(
          runResult.output,
          testCase.expectedOutput,
        );

        // Guardar resultado
        await this.testCaseResultRepository.create({
          submissionId,
          testCaseId: testCase.testCaseId,
          status,
          timeMs: runResult.timeMs,
          output: runResult.output,
          error: runResult.error,
        });

        results.push({ status, timeMs: runResult.timeMs });
        if (status === 'ACCEPTED') passedCount++;
        totalTime += runResult.timeMs;
      }

      // 3. Calcular submission status final
      const allPassed = passedCount === testCases.length;
      const finalStatus = allPassed ? 'ACCEPTED' : 'WRONG_ANSWER';

      // 4. Actualizar submission
      await this.submissionRepository.update(submissionId, {
        status: finalStatus,
        score: allPassed ? 100 : (passedCount / testCases.length) * 100,
        timeMsTotal: totalTime,
      });

      this.logger.log(
        `Submission ${submissionId} completed: ${finalStatus} (${passedCount}/${testCases.length} passed)`,
      );

      return { submissionId, finalStatus, passedCount, testCasesLength: testCases.length };
    } catch (error) {
      this.logger.error(
        `Error processing submission ${submissionId}`,
        error.stack,
      );

      // Marcar como RUNTIME_ERROR
      await this.submissionRepository.update(submissionId, {
        status: 'RUNTIME_ERROR',
      });

      throw error; // Bull reintentará
    }
  }

  private compareOutput(actual: string, expected: string): string {
    const actualTrimmed = actual.trim();
    const expectedTrimmed = expected.trim();

    if (actualTrimmed === expectedTrimmed) {
      return 'ACCEPTED';
    }

    // Lógica adicional para ignorar espacios/líneas en blanco
    if (
      actualTrimmed.split('\n').join('') ===
      expectedTrimmed.split('\n').join('')
    ) {
      return 'ACCEPTED';
    }

    return 'WRONG_ANSWER';
  }
}
```

### PASO 5: Actualizar worker.ts

```typescript
// workers/python-worker/worker.ts

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logger = new Logger('Python Worker');

  const app = await NestFactory.create(WorkerModule);
  await app.init();

  logger.log('Python worker started and listening to submissions queue');
  logger.log(`Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
}

bootstrap().catch(err => {
  console.error('Worker startup failed:', err);
  process.exit(1);
});
```

```typescript
// workers/python-worker/worker.module.ts

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from '../../src/infrastructure/database/prisma.module';
import { SubmissionProcessor } from '../../src/infrastructure/queue/processors/submission.processor';
import { RunnerService } from '../../src/infrastructure/runners/runner.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue({ name: 'submissions' }),
    PrismaModule,
  ],
  providers: [SubmissionProcessor, RunnerService],
})
export class WorkerModule {}
```

---

## 📦 Instalación de dependencias

```bash
cd /workspaces/codium

# Docker SDK para Node.js
npm install dockerode
npm install --save-dev @types/dockerode

# Ya tiene @nestjs/bull y bull instalados
npm list @nestjs/bull bull
```

---

## ✅ Validación Final

### 1. Build debe pasar
```bash
npm run build
```

### 2. Docker Compose debe funcionar
```bash
docker-compose up -d
# Esperar ~30 segundos

# Verificar servicios
docker-compose ps
# Debe mostrar: postgres, redis, api, worker-python, worker-java, worker-nodejs, worker-cpp (UP)

# Verificar logs del worker
docker-compose logs worker-python | tail -20
# Debe mostrar: "Python worker started and listening to submissions queue"
```

### 3. Probar el flujo completo

```bash
# Terminal 1: Ver logs en tiempo real
docker-compose logs -f api worker-python

# Terminal 2: Hacer POST a submissions
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "challengeId": "<challenge-uuid>",
    "code": "print(\"hello\")",
    "language": "Python"
  }'

# Debería retornar submission con status: "QUEUED"

# Esperar 2-5 segundos, luego verificar estado
curl -X GET http://localhost:3000/api/submissions/<submission-id> \
  -H "Authorization: Bearer <token>"

# Status debe cambiar a: ACCEPTED, WRONG_ANSWER, o RUNTIME_ERROR
```

---

## 🐛 Debugging

### Si worker no consume jobs

```bash
# Verificar conexión Redis desde contenedor
docker exec codium-redis redis-cli PING
# Debe retornar: PONG

# Ver jobs encolados
docker exec codium-redis redis-cli LRANGE bull:submissions:1:wait 0 -1

# Ver procesando
docker exec codium-redis redis-cli LRANGE bull:submissions:1:active 0 -1
```

### Si container runner no ejecuta

```bash
# Verificar imagen Python
docker pull python:3.11-alpine

# Test manual
docker run --rm --network none -i python:3.11-alpine python -c "print('hello')" < /dev/null

# Ver logs del contenedor
docker logs <container-id>
```

---

## 📊 Siguiente Paso

Una vez validado:
1. ✅ Submissions se encolan
2. ✅ Workers procesan
3. ✅ Runners ejecutan código
4. ✅ Resultados se guardan

**Proceder a:**
- Leaderboard (ranking)
- Observabilidad (logs + métricas)
- Swagger (documentación automática)

---

**Crítica:** Este paso es **BLOQUEANTE**. Sin Queue + Workers, las submissions quedan eternamente encoladas.

Generado: 29 de noviembre de 2025
