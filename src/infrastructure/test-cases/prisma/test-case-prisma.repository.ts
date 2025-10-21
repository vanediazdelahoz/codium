import { Injectable } from "@nestjs/common"
import type { PrismaService } from "../../database/prisma.service"
import type { ITestCaseRepository } from "@core/domain/test-cases/test-case.repository.port"
import type { TestCase } from "@core/domain/test-cases/test-case.entity"

@Injectable()
export class TestCasePrismaRepository implements ITestCaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(testCase: Omit<TestCase, "id">): Promise<TestCase> {
    const created = await this.prisma.testCase.create({
      data: {
        challengeId: testCase.challengeId,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        isHidden: testCase.isHidden,
        points: testCase.points,
        order: testCase.order,
      },
    })

    return this.toDomain(created)
  }

  async findById(id: string): Promise<TestCase | null> {
    const testCase = await this.prisma.testCase.findUnique({
      where: { id },
    })

    return testCase ? this.toDomain(testCase) : null
  }

  async findByChallengeId(challengeId: string): Promise<TestCase[]> {
    const testCases = await this.prisma.testCase.findMany({
      where: { challengeId },
      orderBy: { order: "asc" },
    })
    return testCases.map(this.toDomain)
  }

  async update(id: string, data: Partial<TestCase>): Promise<TestCase> {
    const updated = await this.prisma.testCase.update({
      where: { id },
      data,
    })

    return this.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.testCase.delete({
      where: { id },
    })
  }

  private toDomain(prismaTestCase: any): TestCase {
    return {
      id: prismaTestCase.id,
      challengeId: prismaTestCase.challengeId,
      input: prismaTestCase.input,
      expectedOutput: prismaTestCase.expectedOutput,
      isHidden: prismaTestCase.isHidden,
      points: prismaTestCase.points,
      order: prismaTestCase.order,
    }
  }
}
