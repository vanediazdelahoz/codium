import { Process, Processor } from "@nestjs/bull"
import type { Job } from "bull"
import { Logger, Inject } from "@nestjs/common"
import { PrismaService } from "../database/prisma.service"
import { SUBMISSION_REPOSITORY, SubmissionRepositoryPort } from "@core/domain/submissions/submission.repository.port"
import { TEST_CASE_REPOSITORY, TestCaseRepositoryPort } from "@core/domain/test-cases/test-case.repository.port"
import { RunnerService } from "../runners/runner.service"

@Processor("submissions")
export class SubmissionProcessor {
  private readonly logger = new Logger(SubmissionProcessor.name)

  constructor(
    private readonly prisma: PrismaService,
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissionRepository: SubmissionRepositoryPort,
    @Inject(TEST_CASE_REPOSITORY)
    private readonly testCaseRepository: TestCaseRepositoryPort,
    private readonly runnerService: RunnerService,
  ) {}

  @Process("process-submission")
  async handleSubmission(job: Job) {
    const { submissionId, language, code, testCases } = job.data

    this.logger.log(`[${submissionId}] Procesando submission`)
    this.logger.log(`[${submissionId}] Lenguaje: ${language}`)

    try {
      // Marcar como RUNNING
      await this.prisma.submission.update({
        where: { id: submissionId },
        data: { status: "RUNNING", updatedAt: new Date() },
      })

      const resultsToCreate: any[] = []
      let passedCount = 0
      let totalTime = 0
      let hasCompilationError = false

      // Procesar cada caso de prueba
      for (const testCase of testCases || []) {
        try {
          const runResult = await this.runnerService.run(
            language,
            code,
            testCase.input || "",
            {
              timeout: 5000,
              memory: 256,
              cpus: 1,
            },
          )

          let status = "ACCEPTED"
          if (runResult.error) {
            if (runResult.error.includes("TIMEOUT")) {
              status = "TIMEOUT"
            } else if (runResult.error.includes("COMPILATION_ERROR")) {
              status = "COMPILATION_ERROR"
              hasCompilationError = true
            } else {
              status = "RUNTIME_ERROR"
            }
          } else {
            // Comparar output
            const outputMatch = this.compareOutputs(runResult.output, testCase.expectedOutput)
            status = outputMatch ? "ACCEPTED" : "WRONG_ANSWER"
          }

          if (status === "ACCEPTED") {
            passedCount++
          }

          totalTime += runResult.timeMs

          resultsToCreate.push({
            submissionId,
            testCaseId: testCase.testCaseId,
            status,
            timeMs: runResult.timeMs,
            memoryMb: 0,
            output: runResult.output || null,
            error: runResult.error || null,
          })

          this.logger.debug(`[${submissionId}] TC: ${status} (${runResult.timeMs}ms)`)
        } catch (err: any) {
          this.logger.error(`[${submissionId}] Error ejecutando test case:`, err.message)
          resultsToCreate.push({
            submissionId,
            testCaseId: testCase.testCaseId,
            status: "RUNTIME_ERROR",
            timeMs: 0,
            memoryMb: 0,
            output: null,
            error: err.message,
          })
        }
      }

      // Persistir resultados
      if (resultsToCreate.length > 0) {
        await this.prisma.testCaseResult.createMany({
          data: resultsToCreate,
          skipDuplicates: true,
        }).catch(async () => {
          // Si createMany falla, intentar uno por uno
          for (const r of resultsToCreate) {
            await this.prisma.testCaseResult.create({ data: r })
          }
        })
      }

      // Determinar estado final
      let finalStatus: "ACCEPTED" | "WRONG_ANSWER" | "COMPILATION_ERROR" = "ACCEPTED"
      let score = 0

      if (hasCompilationError) {
        finalStatus = "COMPILATION_ERROR"
        score = 0
      } else if (passedCount === testCases.length && testCases.length > 0) {
        finalStatus = "ACCEPTED"
        score = 100
      } else {
        finalStatus = "WRONG_ANSWER"
        score = Math.round((passedCount / Math.max(1, testCases.length)) * 100)
      }

      // Actualizar submission con resultado final
      await this.prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: finalStatus,
          score,
          timeMsTotal: totalTime,
          updatedAt: new Date(),
        },
      })

      this.logger.log(`[${submissionId}] Finalizado: ${finalStatus} (${passedCount}/${testCases.length} passed)`)

      return {
        submissionId,
        finalStatus,
        passedCount,
        totalTestCases: testCases.length,
        totalTimeMs: totalTime,
        score,
      }
    } catch (error: any) {
      this.logger.error(`[${submissionId}] Error crítico:`, error.message)

      // Marcar como error
      await this.prisma.submission.update({
        where: { id: submissionId },
        data: { status: "RUNTIME_ERROR", updatedAt: new Date() },
      }).catch(() => {})

      throw error
    }
  }

  private compareOutputs(actual: string, expected: string): boolean {
    if (!actual) actual = ""
    if (!expected) expected = ""

    const actualTrimmed = actual.trim()
    const expectedTrimmed = expected.trim()

    // Comparación exacta
    if (actualTrimmed === expectedTrimmed) return true

    // Comparación por líneas
    const actualLines = actualTrimmed.split("\n").map(l => l.trim()).filter(l => l.length > 0)
    const expectedLines = expectedTrimmed.split("\n").map(l => l.trim()).filter(l => l.length > 0)

    if (actualLines.length === expectedLines.length && actualLines.every((ln, i) => ln === expectedLines[i])) {
      return true
    }

    // Comparación numérica (tolerancia pequeña para floats)
    const actualNum = parseFloat(actualTrimmed)
    const expectedNum = parseFloat(expectedTrimmed)
    if (!isNaN(actualNum) && !isNaN(expectedNum) && Math.abs(actualNum - expectedNum) < 0.0001) {
      return true
    }

    return false
  }
}
