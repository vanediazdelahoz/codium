import { Language, SubmissionStatus } from '@core/domain/submissions/submission.entity';

// Define la forma de un resultado de caso de prueba individual
export class TestCaseResultDto {
  testCaseId: string;
  status: SubmissionStatus;
  timeMs: number;
  memoryMb: number;
}

// Define la forma del objeto de envío completo
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