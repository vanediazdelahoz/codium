import { Inject, Injectable } from "@nestjs/common";
import { SUBMISSION_REPOSITORY, SubmissionRepositoryPort } from "@core/domain/submissions/submission.repository.port";
import { USER_REPOSITORY, UserRepositoryPort } from "@core/domain/users/user.repository.port";
import { SubmissionDto } from "../dto/submission.dto";
import { SubmissionMapper } from "../mappers/submission.mapper";

@Injectable()
export class ListUserSubmissionsUseCase {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissionRepository: SubmissionRepositoryPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<SubmissionDto[]> {
    const submissions = await this.submissionRepository.findByUserId(userId);
    const user = await this.userRepository.findById(userId);
    const studentName = user ? user.fullName : 'Unknown';
    return submissions.map(sub => SubmissionMapper.toDto(sub, studentName));
  }
}