import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { SUBMISSION_REPOSITORY, SubmissionRepositoryPort } from "@core/domain/submissions/submission.repository.port";
import { CHALLENGE_REPOSITORY, ChallengeRepositoryPort } from "@core/domain/challenges/challenge.repository.port";
import { Submission, SubmissionStatus } from "@core/domain/submissions/submission.entity";
import { SubmitSolutionDto } from "../dto/submit-solution.dto";
import { SubmissionDto } from "../dto/submission.dto";
import { SubmissionMapper } from "../mappers/submission.mapper";

@Injectable()
export class SubmitSolutionUseCase {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissionRepository: SubmissionRepositoryPort,
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepositoryPort,
    @InjectQueue('submissions')
    private readonly submissionQueue: Queue,
  ) {}

  async execute(dto: SubmitSolutionDto, userId: string): Promise<SubmissionDto> {
    const challenge = await this.challengeRepository.findById(dto.challengeId);
    if (!challenge) throw new NotFoundException("Reto no encontrado");

    const submission = new Submission({
      id: uuidv4(),
      userId: userId,
      challengeId: dto.challengeId,
      courseId: dto.courseId,
      code: dto.code,
      language: dto.language,
      status: SubmissionStatus.QUEUED,
      score: 0,
      timeMsTotal: 0,
      memoryUsedMb: 0,
      results: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.submissionRepository.create(submission);

    // Include the language in the job payload so language-specific workers
    // can decide whether to process it without querying the DB.
    await this.submissionQueue.add("process-submission", { submissionId: saved.id, language: saved.language });

    return SubmissionMapper.toDto(saved);
  }
}