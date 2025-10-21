import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { IChallengeRepository } from "@domain/repositories/challenge.repository.interface"
import type { Challenge } from "@domain/entities/challenge.entity"

export interface UpdateChallengeDto {
  title?: string
  description?: string
  difficulty?: string
  tags?: string[]
  timeLimit?: number
  memoryLimit?: number
  status?: string
}

@Injectable()
export class UpdateChallengeUseCase {
  private readonly challengeRepository: IChallengeRepository

  constructor(challengeRepository: IChallengeRepository) {
    this.challengeRepository = challengeRepository
  }

  async execute(id: string, dto: UpdateChallengeDto, userId: string, userRole: string): Promise<Challenge> {
    const challenge = await this.challengeRepository.findById(id)

    if (!challenge) {
      throw new NotFoundException("Reto no encontrado")
    }

    if (userRole !== "ADMIN" && challenge.createdBy !== userId) {
      throw new ForbiddenException("No tienes permiso para editar este reto")
    }

    return await this.challengeRepository.update(id, dto)
  }
}
