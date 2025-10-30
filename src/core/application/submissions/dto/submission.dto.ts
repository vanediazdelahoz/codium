import { Language, SubmissionStatus } from '@core/domain/submissions/submission.entity';

export class TestCaseResultDto {
  testCaseId: string;
  status: SubmissionStatus;
  timeMs: number;
  memoryMb: number;
}

export class SubmissionDto {
  id: string;
  userId: string;
  challengeId: string;
  courseId: string;
  language: Language;
  status: SubmissionStatus;
  score: number;
  timeMsTotal: number;
  memoryUsedMb: number;
  createdAt: Date;
  results: TestCaseResultDto[];
}