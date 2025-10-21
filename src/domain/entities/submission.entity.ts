export enum SubmissionStatus {
  QUEUED = "QUEUED",
  RUNNING = "RUNNING",
  ACCEPTED = "ACCEPTED",
  WRONG_ANSWER = "WRONG_ANSWER",
  TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED",
  RUNTIME_ERROR = "RUNTIME_ERROR",
  COMPILATION_ERROR = "COMPILATION_ERROR",
  MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED",
}

export enum Language {
  PYTHON = "PYTHON",
  JAVA = "JAVA",
  NODEJS = "NODEJS",
  CPP = "CPP",
}

export interface TestCaseResult {
  testCaseId: string
  status: SubmissionStatus
  timeMs: number
  memoryMb: number
  output?: string
  error?: string
}

export class Submission {
  id: string
  userId: string
  challengeId: string
  courseId: string
  code: string
  language: Language
  status: SubmissionStatus
  score: number
  timeMsTotal: number
  memoryUsedMb: number
  testCaseResults: TestCaseResult[]
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<Submission>) {
    Object.assign(this, partial)
    this.testCaseResults = partial.testCaseResults || []
  }

  isCompleted(): boolean {
    return ![SubmissionStatus.QUEUED, SubmissionStatus.RUNNING].includes(this.status)
  }

  isAccepted(): boolean {
    return this.status === SubmissionStatus.ACCEPTED
  }

  markAsQueued(): void {
    this.status = SubmissionStatus.QUEUED
  }

  markAsRunning(): void {
    this.status = SubmissionStatus.RUNNING
  }

  updateResults(status: SubmissionStatus, score: number, results: TestCaseResult[]): void {
    this.status = status
    this.score = score
    this.testCaseResults = results
    this.timeMsTotal = results.reduce((sum, r) => sum + r.timeMs, 0)
    this.memoryUsedMb = Math.max(...results.map((r) => r.memoryMb))
  }
}
