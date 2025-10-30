import { Process, Processor } from "@nestjs/bull"
import type { Job } from "bull"
import { Logger } from "@nestjs/common"

@Processor("submissions")
export class SubmissionProcessor {
  private readonly logger = new Logger(SubmissionProcessor.name)

  @Process("process-submission")
  async handleSubmission(job: Job) {
    const { submissionId, challengeId, language, code, timeLimit, memoryLimit } = job.data

    this.logger.log(`[${submissionId}] Procesando submission para reto ${challengeId}`)
    this.logger.log(`[${submissionId}] Lenguaje: ${language}`)
    this.logger.log(`[${submissionId}] Límites: ${timeLimit}ms, ${memoryLimit}MB`)

    this.logger.log(`[${submissionId}] Submission procesado (STUB)`)

    return {
      submissionId,
      status: "QUEUED",
      message: "Worker stub - Implementación completa en Semana 5",
    }
  }
}
