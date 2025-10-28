import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { SubmissionRepositoryPort } from "@core/domain/submissions/submission.repository.port";
import { Submission, SubmissionStatus, Language, TestCaseResult } from "@core/domain/submissions/submission.entity";

@Injectable()
export class SubmissionPrismaRepository implements SubmissionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  // ... (los métodos create, findById, etc. están bien y no necesitan cambios)
  async create(submission: Submission): Promise<Submission> {
    const created = await this.prisma.submission.create({
      data: {
        id: submission.id,
        userId: submission.userId,
        challengeId: submission.challengeId,
        courseId: submission.courseId,
        code: submission.code,
        language: submission.language,
        status: submission.status,
      },
      include: { results: true },
    });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Submission | null> {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: { results: true },
    });
    return submission ? this.toDomain(submission) : null;
  }

  async findByUserId(userId: string): Promise<Submission[]> {
    const submissions = await this.prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { results: true },
    });
    return submissions.map((s) => this.toDomain(s));
  }

  async findByChallengeId(challengeId: string): Promise<Submission[]> {
    const submissions = await this.prisma.submission.findMany({
        where: { challengeId },
        orderBy: { createdAt: "desc" },
        include: { results: true },
    });
    return submissions.map(s => this.toDomain(s));
  }
  
  async findByCourseId(courseId: string): Promise<Submission[]> {
    const submissions = await this.prisma.submission.findMany({
        where: { courseId },
        orderBy: { createdAt: "desc" },
        include: { results: true },
    });
    return submissions.map(s => this.toDomain(s));
  }

  async update(id: string, data: Partial<Submission>): Promise<Submission> {
    // CORREGIDO: Mapeamos el Partial<Submission> a un objeto que Prisma entienda.
    const { id: submissionId, createdAt, updatedAt, code, results, ...restOfData } = data;
    
    const updated = await this.prisma.submission.update({
      where: { id },
      data: restOfData, // Pasamos solo los datos primitivos actualizables
      include: { results: true },
    });
    return this.toDomain(updated);
  }
  
  async updateStatus(id: string, status: SubmissionStatus, results?: any): Promise<Submission> {
      // Implementación futura
      throw new Error("Method not implemented.");
  }

  private toDomain(prismaSubmission: any): Submission {
    return new Submission({
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
      results: (prismaSubmission.results || []) as TestCaseResult[],
      createdAt: prismaSubmission.createdAt,
      updatedAt: prismaSubmission.updatedAt,
    });
  }
}