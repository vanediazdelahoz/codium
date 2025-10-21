import { Injectable } from "@nestjs/common"
import type { ISubmissionRepository } from "@domain/repositories/submission.repository.interface"
import type { Submission } from "@domain/entities/submission.entity"

@Injectable()
export class ListUserSubmissionsUseCase {
  private readonly submissionRepository: ISubmissionRepository

  constructor(submissionRepository: ISubmissionRepository) {
    this.submissionRepository = submissionRepository
  }

  async execute(userId: string): Promise<Submission[]> {
    return await this.submissionRepository.findByUserId(userId)
  }
}
