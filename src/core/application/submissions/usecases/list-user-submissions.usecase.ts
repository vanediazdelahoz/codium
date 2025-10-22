import { Inject, Injectable } from "@nestjs/common";
import { SUBMISSION_REPOSITORY, SubmissionRepositoryPort } from "@core/domain/submissions/submission.repository.port";
import { SubmissionDto } from "../dto/submission.dto";
import { SubmissionMapper } from "../mappers/submission.mapper";

@Injectable()
export class ListUserSubmissionsUseCase {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(userId: string): Promise<SubmissionDto[]> {
    const submissions = await this.submissionRepository.findByUserId(userId);
    return submissions.map(sub => SubmissionMapper.toDto(sub));
  }
}