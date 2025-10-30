import { Submission } from '@core/domain/submissions/submission.entity';
import { SubmissionDto, TestCaseResultDto } from '../dto/submission.dto';

export class SubmissionMapper {
  static toDto(entity: Submission): SubmissionDto {
    const dto: SubmissionDto = {
      id: entity.id,
      userId: entity.userId,
      challengeId: entity.challengeId,
      courseId: entity.courseId,
      language: entity.language,
      status: entity.status,
      score: entity.score,
      timeMsTotal: entity.timeMsTotal,
      memoryUsedMb: entity.memoryUsedMb,
      createdAt: entity.createdAt,
      results: entity.results?.map(result => {
        const resultDto: TestCaseResultDto = {
          testCaseId: result.testCaseId,
          status: result.status,
          timeMs: result.timeMs,
          memoryMb: result.memoryMb,
        };
        return resultDto;
      }) || [],
    };
    return dto;
  }
}