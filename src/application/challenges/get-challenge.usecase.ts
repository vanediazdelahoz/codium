import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { IChallengeRepository } from "@domain/repositories/challenge.repository.interface"
import type { Challenge } from "@domain/entities/challenge.entity"
import { ChallengeStatus } from "@domain/entities/challenge.entity"

@Injectable()
export class GetChallengeUseCase {
  private readonly challengeRepository: IChallengeRepository

  constructor(challengeRepository: IChallengeRepository) {
    this.challengeRepository = challengeRepository
  }

  async execute(id: string, userRole: string): Promise<Challenge> {
    const challenge = await this.challengeRepository.findById(id)

    if (!challenge) {
      throw new NotFoundException("Reto no encontrado")
    }

    // Los estudiantes solo pueden ver retos publicados
    if (userRole === "STUDENT" && challenge.status !== ChallengeStatus.PUBLISHED) {
      throw new ForbiddenException("No tienes acceso a este reto")
    }

    return challenge
  }
}
