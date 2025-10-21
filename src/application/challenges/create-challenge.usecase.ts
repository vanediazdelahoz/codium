import { Injectable, ForbiddenException } from "@nestjs/common"
import { v4 as uuidv4 } from "uuid"
import type { IChallengeRepository } from "@domain/repositories/challenge.repository.interface"
import { Challenge, ChallengeStatus } from "@domain/entities/challenge.entity"
import type { Difficulty } from "@domain/entities/challenge.entity"

export interface CreateChallengeDto {
  title: string
  description: string
  difficulty: Difficulty
  tags: string[]
  timeLimit: number
  memoryLimit: number
  courseId: string
  createdBy: string
}

@Injectable()
export class CreateChallengeUseCase {
  private readonly challengeRepository: IChallengeRepository

  constructor(challengeRepository: IChallengeRepository) {
    this.challengeRepository = challengeRepository
  }

  async execute(dto: CreateChallengeDto, userRole: string): Promise<Challenge> {
    if (userRole !== "ADMIN" && userRole !== "PROFESSOR") {
      throw new ForbiddenException("Solo administradores y profesores pueden crear retos")
    }

    const challenge = new Challenge({
      id: uuidv4(),
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty,
      tags: dto.tags,
      timeLimit: dto.timeLimit,
      memoryLimit: dto.memoryLimit,
      status: ChallengeStatus.DRAFT,
      courseId: dto.courseId,
      createdBy: dto.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return await this.challengeRepository.create(challenge)
  }
}
