import { Injectable, NotFoundException } from "@nestjs/common"
import type { ISubmissionRepository } from "@domain/repositories/submission.repository.interface"
import type { Submission } from "@domain/entities/submission.entity"

@Injectable()
export class GetSubmissionUseCase {
  private readonly submissionRepository: ISubmissionRepository

  constructor(submissionRepository: ISubmissionRepository) {
    this.submissionRepository = submissionRepository
  }

  async execute(id: string): Promise<Submission> {
    const submission = await this.submissionRepository.findById(id)

    if (!submission) {
      throw new NotFoundException("Submission no encontrado")
    }

    return submission
  }
}
