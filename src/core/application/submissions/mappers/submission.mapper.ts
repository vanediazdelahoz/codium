import { Submission, SubmissionStatus, Language as LangEnum } from '@core/domain/submissions/submission.entity';
import { SubmissionDto, TestCaseResultDto } from '../dto/submission.dto';

function mapLanguage(lang: LangEnum): string {
  switch (lang) {
    case LangEnum.PYTHON:
      return 'Python'
    case LangEnum.JAVA:
      return 'Java'
    case LangEnum.NODEJS:
      return 'Node.js'
    case LangEnum.CPP:
      return 'C++'
    default:
      return String(lang)
  }
}

function mapTestCaseStatus(status: SubmissionStatus): string {
  switch (status) {
    case SubmissionStatus.ACCEPTED:
      return 'OK'
    case SubmissionStatus.WRONG_ANSWER:
      return 'WA'
    case SubmissionStatus.TIME_LIMIT_EXCEEDED:
      return 'TLE'
    case SubmissionStatus.RUNTIME_ERROR:
      return 'RE'
    case SubmissionStatus.COMPILATION_ERROR:
      return 'CE'
    default:
      return String(status)
  }
}

export class SubmissionMapper {
  static toDto(entity: Submission, studentName: string = 'Unknown'): SubmissionDto {
    const testCases: TestCaseResultDto[] = (entity.results || []).map((result, idx) => ({
      caseId: idx + 1,
      status: mapTestCaseStatus(result.status),
      timeMs: result.timeMs,
    }))

    const dto: SubmissionDto = {
      id: entity.id,
      studentId: entity.userId,
      studentName,
      challengeId: entity.challengeId,
      courseId: entity.courseId,
      language: mapLanguage(entity.language),
      status: entity.status,
      score: entity.score,
      executionTime: `${(entity.timeMsTotal || 0) / 1000}s`,
      submittedAt: entity.createdAt.toISOString(),
      createdAt: entity.createdAt,
      testCases,
    }

    return dto
  }
}