import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { v4 as uuidv4 } from "uuid"
import type { Queue } from "bull"
import type { ISubmissionRepository } from "@domain/repositories/submission.repository.interface"
import type { IChallengeRepository } from "@domain/repositories/challenge.repository.interface"
import { Submission, SubmissionStatus } from "@domain/entities/submission.entity"
import type { Language } from "@domain/entities/submission.entity"

export interface SubmitSolutionDto {
  challengeId: string
  courseId: string
  code: string
  language: Language
  userId: string
}

@Injectable()
export class SubmitSolutionUseCase {
  private readonly submissionRepository: ISubmissionRepository
  private readonly challengeRepository: IChallengeRepository
  private readonly submissionQueue: Queue

  constructor(
    submissionRepository: ISubmissionRepository,
    challengeRepository: IChallengeRepository,
    submissionQueue: Queue,
  ) {
    this.submissionRepository = submissionRepository
    this.challengeRepository = challengeRepository
    this.submissionQueue = submissionQueue
  }

  async execute(dto: SubmitSolutionDto): Promise<Submission> {
    // Verificar que el reto existe
    const challenge = await this.challengeRepository.findById(dto.challengeId)
    if (!challenge) {
      throw new NotFoundException("Reto no encontrado")
    }

    // Validar tamaño del código
    const maxSizeKb = Number.parseInt(process.env.MAX_CODE_SIZE_KB || "100")
    const codeSizeKb = Buffer.byteLength(dto.code, "utf8") / 1024
    if (codeSizeKb > maxSizeKb) {
      throw new BadRequestException(`El código excede el tamaño máximo de ${maxSizeKb}KB`)
    }

    // Crear submission
    const submission = new Submission({
      id: uuidv4(),
      userId: dto.userId,
      challengeId: dto.challengeId,
      courseId: dto.courseId,
      code: dto.code,
      language: dto.language,
      status: SubmissionStatus.QUEUED,
      score: 0,
      timeMsTotal: 0,
      memoryUsedMb: 0,
      testCaseResults: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Guardar en base de datos
    const saved = await this.submissionRepository.create(submission)

    // Encolar para procesamiento
    await this.submissionQueue.add(
      "process-submission",
      {
        submissionId: saved.id,
        challengeId: dto.challengeId,
        language: dto.language,
        code: dto.code,
        timeLimit: challenge.timeLimit,
        memoryLimit: challenge.memoryLimit,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    )

    return saved
  }
}
