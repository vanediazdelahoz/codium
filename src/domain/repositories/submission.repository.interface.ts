import type { Submission } from "../entities/submission.entity"

export interface ISubmissionRepository {
  create(submission: Submission): Promise<Submission>
  findById(id: string): Promise<Submission | null>
  findByUserId(userId: string): Promise<Submission[]>
  findByChallengeId(challengeId: string): Promise<Submission[]>
  findByCourseId(courseId: string): Promise<Submission[]>
  update(id: string, submission: Partial<Submission>): Promise<Submission>
  findBestSubmissions(challengeId: string): Promise<Submission[]>
}

export const SUBMISSION_REPOSITORY = Symbol("SUBMISSION_REPOSITORY")
