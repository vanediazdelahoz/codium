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
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly difficulty: Difficulty,
    public readonly tags: string[],
    public readonly timeLimit: number,
    public readonly memoryLimit: number,
    public readonly status: ChallengeStatus,
    public readonly courseId: string,
    public readonly createdById: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isPublished(): boolean {
    return this.status === ChallengeStatus.PUBLISHED
  }

  isDraft(): boolean {
    return this.status === ChallengeStatus.DRAFT
  }

  canBeViewedByStudent(): boolean {
    return this.isPublished()
  }
}
