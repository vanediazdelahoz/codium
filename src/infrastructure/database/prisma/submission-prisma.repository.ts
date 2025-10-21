import { Injectable } from "@nestjs/common"
import type { PrismaService } from "../prisma.service"
import type { ISubmissionRepository } from "@core/domain/submissions/submission.repository.port"
import type { Submission, SubmissionStatus, Language } from "@core/domain/submissions/submission.entity"

@Injectable()
export class SubmissionPrismaRepository implements ISubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(submission: Omit<Submission, "id" | "createdAt" | "updatedAt">): Promise<Submission> {
    const created = await this.prisma.submission.create({
      data: {
        userId: submission.userId,
        challengeId: submission.challengeId,
        courseId: submission.courseId,
        code: submission.code,
        language: submission.language,
        status: submission.status,
        score: submission.score,
        timeMsTotal: submission.timeMsTotal,
        memoryUsedMb: submission.memoryUsedMb,
        testCaseResults: submission.testCaseResults as any,
      },
    })

    return this.toDomain(created)
  }

  async findById(id: string): Promise<Submission | null> {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    })

    return submission ? this.toDomain(submission) : null
  }

  async findByUserId(userId: string): Promise<Submission[]> {
    const submissions = await this.prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    return submissions.map(this.toDomain)
  }

  async findByChallengeId(challengeId: string): Promise<Submission[]> {
    const submissions = await this.prisma.submission.findMany({
      where: { challengeId },
      orderBy: { createdAt: "desc" },
    })
    return submissions.map(this.toDomain)
  }

  async update(id: string, data: Partial<Submission>): Promise<Submission> {
    const updated = await this.prisma.submission.update({
      where: { id },
      data: {
        ...data,
        testCaseResults: data.testCaseResults as any,
      },
    })

    return this.toDomain(updated)
  }

  private toDomain(prismaSubmission: any): Submission {
    return {
      id: prismaSubmission.id,
      userId: prismaSubmission.userId,
      challengeId: prismaSubmission.challengeId,
      courseId: prismaSubmission.courseId,
      code: prismaSubmission.code,
      language: prismaSubmission.language as Language,
      status: prismaSubmission.status as SubmissionStatus,
      score: prismaSubmission.score,
      timeMsTotal: prismaSubmission.timeMsTotal,
      memoryUsedMb: prismaSubmission.memoryUsedMb,
      testCaseResults: prismaSubmission.testCaseResults || [],
      createdAt: prismaSubmission.createdAt,
      updatedAt: prismaSubmission.updatedAt,
    }
  }
}
