import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { ITestCaseRepository } from "@domain/repositories/test-case.repository.interface"
import { TestCase } from "@domain/entities/test-case.entity"
import type { TestCaseEntity } from "../entities/test-case.entity"

@Injectable()
export class TestCaseRepository implements ITestCaseRepository {
  private readonly repository: Repository<TestCaseEntity>

  constructor(repository: Repository<TestCaseEntity>) {
    this.repository = repository
  }

  async create(testCase: TestCase): Promise<TestCase> {
    const entity = this.repository.create(testCase)
    const saved = await this.repository.save(entity)
    return new TestCase(saved)
  }

  async findById(id: string): Promise<TestCase | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity ? new TestCase(entity) : null
  }

  async findByChallengeId(challengeId: string): Promise<TestCase[]> {
    const entities = await this.repository.find({
      where: { challengeId },
      order: { order: "ASC" },
    })
    return entities.map((e) => new TestCase(e))
  }

  async findVisibleByChallengeId(challengeId: string): Promise<TestCase[]> {
    const entities = await this.repository.find({
      where: { challengeId, isHidden: false },
      order: { order: "ASC" },
    })
    return entities.map((e) => new TestCase(e))
  }

  async update(id: string, testCase: Partial<TestCase>): Promise<TestCase> {
    await this.repository.update(id, testCase)
    const updated = await this.repository.findOne({ where: { id } })
    return new TestCase(updated!)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async deleteAllByChallengeId(challengeId: string): Promise<void> {
    await this.repository.delete({ challengeId })
  }
}
