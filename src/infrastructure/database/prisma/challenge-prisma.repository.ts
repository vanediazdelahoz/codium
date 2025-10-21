import { Injectable } from "@nestjs/common"
import type { PrismaService } from "../prisma.service"
import type { IChallengeRepository } from "@core/domain/challenges/challenge.repository.port"
import type { Challenge, Difficulty, ChallengeStatus } from "@core/domain/challenges/challenge.entity"

@Injectable()
export class ChallengePrismaRepository implements IChallengeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(challenge: Omit<Challenge, "id" | "createdAt" | "updatedAt">): Promise<Challenge> {
    const created = await this.prisma.challenge.create({
      data: {
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        tags: challenge.tags,
        timeLimit: challenge.timeLimit,
        memoryLimit: challenge.memoryLimit,
        status: challenge.status,
        courseId: challenge.courseId,
        createdBy: challenge.createdBy,
      },
    })

    return this.toDomain(created)
  }

  async findById(id: string): Promise<Challenge | null> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
    })

    return challenge ? this.toDomain(challenge) : null
  }

  async findAll(): Promise<Challenge[]> {
    const challenges = await this.prisma.challenge.findMany()
    return challenges.map(this.toDomain)
  }

  async findByCourseId(courseId: string): Promise<Challenge[]> {
    const challenges = await this.prisma.challenge.findMany({
      where: { courseId },
    })
    return challenges.map(this.toDomain)
  }

  async findByStatus(status: ChallengeStatus): Promise<Challenge[]> {
    const challenges = await this.prisma.challenge.findMany({
      where: { status },
    })
    return challenges.map(this.toDomain)
  }

  async update(id: string, data: Partial<Challenge>): Promise<Challenge> {
    const updated = await this.prisma.challenge.update({
      where: { id },
      data,
    })

    return this.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.challenge.delete({
      where: { id },
    })
  }

  private toDomain(prismaChallenge: any): Challenge {
    return {
      id: prismaChallenge.id,
      title: prismaChallenge.title,
      description: prismaChallenge.description,
      difficulty: prismaChallenge.difficulty as Difficulty,
      tags: prismaChallenge.tags,
      timeLimit: prismaChallenge.timeLimit,
      memoryLimit: prismaChallenge.memoryLimit,
      status: prismaChallenge.status as ChallengeStatus,
      courseId: prismaChallenge.courseId,
      createdBy: prismaChallenge.createdBy,
      createdAt: prismaChallenge.createdAt,
      updatedAt: prismaChallenge.updatedAt,
    }
  }
}
