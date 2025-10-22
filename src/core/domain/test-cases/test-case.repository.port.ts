import { TestCase } from "./test-case.entity";

export interface TestCaseRepositoryPort {
  create(testCase: TestCase): Promise<TestCase>; // Acepta la entidad completa
  findById(id: string): Promise<TestCase | null>;
  findByChallengeId(challengeId: string): Promise<TestCase[]>;
  update(id: string, data: Partial<TestCase>): Promise<TestCase>;
  delete(id: string): Promise<void>;
  // Puedes añadir otros métodos como deleteAllByChallengeId si lo necesitas
}

export const TEST_CASE_REPOSITORY = Symbol("TEST_CASE_REPOSITORY");