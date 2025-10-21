export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum ChallengeStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export class Challenge {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  tags: string[]
  timeLimit: number // milliseconds
  memoryLimit: number // MB
  status: ChallengeStatus
  courseId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<Challenge>) {
    Object.assign(this, partial)
  }

  isPublished(): boolean {
    return this.status === ChallengeStatus.PUBLISHED
  }

  isDraft(): boolean {
    return this.status === ChallengeStatus.DRAFT
  }

  publish(): void {
    this.status = ChallengeStatus.PUBLISHED
  }

  archive(): void {
    this.status = ChallengeStatus.ARCHIVED
  }
}
