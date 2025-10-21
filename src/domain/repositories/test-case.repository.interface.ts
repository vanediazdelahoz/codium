import type { TestCase } from "../entities/test-case.entity"

export interface ITestCaseRepository {
  create(testCase: TestCase): Promise<TestCase>
  findById(id: string): Promise<TestCase | null>
  findByChallengeId(challengeId: string): Promise<TestCase[]>
  findVisibleByChallengeId(challengeId: string): Promise<TestCase[]>
  update(id: string, testCase: Partial<TestCase>): Promise<TestCase>
  delete(id: string): Promise<void>
  deleteAllByChallengeId(challengeId: string): Promise<void>
}

export const TEST_CASE_REPOSITORY = Symbol("TEST_CASE_REPOSITORY")
