import type { Challenge, ChallengeStatus } from "./challenge.entity"

export interface ChallengeRepositoryPort {
  create(challenge: Omit<Challenge, "id" | "createdAt" | "updatedAt">): Promise<Challenge>
  findById(id: string): Promise<Challenge | null>
  findByCourseId(courseId: string): Promise<Challenge[]>
  findByStatus(status: ChallengeStatus): Promise<Challenge[]>
  findAll(): Promise<Challenge[]>
  update(id: string, data: Partial<Challenge>): Promise<Challenge>
  delete(id: string): Promise<void>
}

export const CHALLENGE_REPOSITORY = Symbol("CHALLENGE_REPOSITORY")
