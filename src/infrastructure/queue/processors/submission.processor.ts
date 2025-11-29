import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { SubmissionStatus, Language } from '@prisma/client';
import { RunnerService } from '../../runners/runner.service';
import { PrismaService } from '../../database/prisma.service';

export interface SubmissionJob {
  submissionId: string;
  userId: string;
  challengeId: string;
  code: string;
  language: Language | string;
  testCases: Array<{
    testCaseId: string;
    input: string;
    expectedOutput: string;
  }>;
}

@Processor('submissions')
@Injectable()
export class SubmissionProcessor {
  private readonly logger = new Logger('SubmissionProcessor');

  constructor(
    private runnerService: RunnerService,
    private prisma: PrismaService,
  ) {}

  @Process()
  async processSubmission(job: Job<SubmissionJob>) {
    const { submissionId, code, language, testCases } = job.data;

    this.logger.log(
      `Processing submission ${submissionId} with ${testCases.length} test cases`,
    );

    try {
      // 1. Marcar como RUNNING
      await this.prisma.submission.update({
        where: { id: submissionId },
        data: { status: SubmissionStatus.RUNNING },
      });

      // 2. Ejecutar cada test case
      let passedCount = 0;
      let totalTime = 0;

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        try {
          const runResult = await this.runnerService.run(
            language,
            code,
            testCase.input,
            {
              timeout: 5000, // 5 segundos
              memory: 256, // MB
              cpus: 1,
            },
          );

          this.logger.debug(`[RUNNER] Output: "${runResult.output}" (len: ${runResult.output?.length}), Error: "${runResult.error}"`);

          const status = this.compareOutput(
            runResult.output,
            testCase.expectedOutput,
          );

          // Guardar resultado
          await this.prisma.testCaseResult.create({
            data: {
              submissionId,
              testCaseId: testCase.testCaseId,
              status: this.mapStatusToSubmissionStatus(status),
              timeMs: runResult.timeMs,
              memoryMb: 0, // TODO: obtener del runner
              output: runResult.output,
              error: runResult.error,
            },
          });

          if (status === 'ACCEPTED') {
            passedCount++;
          }

          totalTime += runResult.timeMs;

          this.logger.debug(
            `Test case ${i + 1}/${testCases.length}: ${status} (${runResult.timeMs}ms)`,
          );
        } catch (error) {
          this.logger.error(
            `Error executing test case ${i + 1}`,
            error.stack,
          );

          await this.prisma.testCaseResult.create({
            data: {
              submissionId,
              testCaseId: testCase.testCaseId,
              status: SubmissionStatus.RUNTIME_ERROR,
              timeMs: 0,
              memoryMb: 0,
              error: error.message,
            },
          });
        }
      }

      // 3. Calcular submission status final
      const allPassed = passedCount === testCases.length;
      const finalStatus = allPassed
        ? SubmissionStatus.ACCEPTED
        : SubmissionStatus.WRONG_ANSWER;

      // 4. Actualizar submission
      await this.prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: finalStatus,
          score: allPassed ? 100 : Math.round((passedCount / testCases.length) * 100),
          timeMsTotal: totalTime,
        },
      });

      this.logger.log(
        `Submission ${submissionId} completed: ${finalStatus} (${passedCount}/${testCases.length} passed, ${totalTime}ms total)`,
      );

      return {
        submissionId,
        finalStatus,
        passedCount,
        totalTestCases: testCases.length,
        totalTimeMs: totalTime,
      };
    } catch (error) {
      this.logger.error(
        `Fatal error processing submission ${submissionId}`,
        error.stack,
      );

      // Marcar como RUNTIME_ERROR
      try {
        await this.prisma.submission.update({
          where: { id: submissionId },
          data: { status: SubmissionStatus.RUNTIME_ERROR },
        });
      } catch (e) {
        this.logger.error(`Could not update submission status: ${e.message}`);
      }

      throw error; // Bull reintentará
    }
  }

  private compareOutput(actual: string, expected: string): string {
    const actualTrimmed = actual.trim();
    const expectedTrimmed = expected.trim();

    // DEBUG: Log valores para investigación
    this.logger.debug(`[COMPARE] Actual: "${actualTrimmed}" (len: ${actualTrimmed.length}, hex: ${Buffer.from(actualTrimmed).toString('hex')})`);
    this.logger.debug(`[COMPARE] Expected: "${expectedTrimmed}" (len: ${expectedTrimmed.length}, hex: ${Buffer.from(expectedTrimmed).toString('hex')})`);

    // Comparación exacta
    if (actualTrimmed === expectedTrimmed) {
      return 'ACCEPTED';
    }

    // Ignorar diferencias de líneas en blanco
    const actualLines = actualTrimmed
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    const expectedLines = expectedTrimmed
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (
      actualLines.length === expectedLines.length &&
      actualLines.every((line, idx) => line === expectedLines[idx])
    ) {
      return 'ACCEPTED';
    }

    // Intentar comparación numérica (por si la salida/esperado son números)
    const actualNum = parseFloat(actualTrimmed);
    const expectedNum = parseFloat(expectedTrimmed);
    if (!isNaN(actualNum) && !isNaN(expectedNum) && actualNum === expectedNum) {
      return 'ACCEPTED';
    }

    return 'WRONG_ANSWER';
  }

  private mapStatusToSubmissionStatus(status: string): SubmissionStatus {
    switch (status) {
      case 'ACCEPTED':
        return SubmissionStatus.ACCEPTED;
      case 'WRONG_ANSWER':
        return SubmissionStatus.WRONG_ANSWER;
      case 'TIME_LIMIT_EXCEEDED':
        return SubmissionStatus.TIME_LIMIT_EXCEEDED;
      case 'RUNTIME_ERROR':
        return SubmissionStatus.RUNTIME_ERROR;
      case 'COMPILATION_ERROR':
        return SubmissionStatus.COMPILATION_ERROR;
      default:
        return SubmissionStatus.RUNTIME_ERROR;
    }
  }
}
