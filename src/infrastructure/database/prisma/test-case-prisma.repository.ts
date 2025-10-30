import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { TestCaseRepositoryPort } from "@core/domain/test-cases/test-case.repository.port";
import { TestCase } from "@core/domain/test-cases/test-case.entity";

@Injectable()
export class TestCasePrismaRepository implements TestCaseRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(testCase: TestCase): Promise<TestCase> {
    const created = await this.prisma.testCase.create({ data: testCase });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<TestCase | null> {
    const testCase = await this.prisma.testCase.findUnique({ where: { id } });
    return testCase ? this.toDomain(testCase) : null;
  }

  async findByChallengeId(challengeId: string): Promise<TestCase[]> {
    const testCases = await this.prisma.testCase.findMany({
      where: { challengeId },
      orderBy: { order: "asc" },
    });
    return testCases.map(this.toDomain);
  }

  async update(id: string, data: Partial<TestCase>): Promise<TestCase> {
    const updated = await this.prisma.testCase.update({ where: { id }, data });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.testCase.delete({ where: { id } });
  }

  private toDomain(prismaTestCase: any): TestCase {
    return new TestCase(prismaTestCase);
  }
}