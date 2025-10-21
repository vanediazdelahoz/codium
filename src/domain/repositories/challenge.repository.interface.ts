import type { Challenge } from "../entities/challenge.entity"

export interface IChallengeRepository {
  create(challenge: Challenge): Promise<Challenge>
  findById(id: string): Promise<Challenge | null>
  findByCourseId(courseId: string): Promise<Challenge[]>
  findAll(): Promise<Challenge[]>
  update(id: string, challenge: Partial<Challenge>): Promise<Challenge>
  delete(id: string): Promise<void>
}

export const CHALLENGE_REPOSITORY = Symbol("CHALLENGE_REPOSITORY")
