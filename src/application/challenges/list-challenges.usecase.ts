import { Injectable } from "@nestjs/common"
import type { IChallengeRepository } from "@domain/repositories/challenge.repository.interface"
import type { Challenge } from "@domain/entities/challenge.entity"
import { ChallengeStatus } from "@domain/entities/challenge.entity"

@Injectable()
export class ListChallengesUseCase {
  private readonly challengeRepository: IChallengeRepository

  constructor(challengeRepository: IChallengeRepository) {
    this.challengeRepository = challengeRepository
  }

  async execute(courseId?: string, userRole?: string): Promise<Challenge[]> {
    let challenges: Challenge[]

    if (courseId) {
      challenges = await this.challengeRepository.findByCourseId(courseId)
    } else {
      challenges = await this.challengeRepository.findAll()
    }

    // Los estudiantes solo ven retos publicados
    if (userRole === "STUDENT") {
      challenges = challenges.filter((c) => c.status === ChallengeStatus.PUBLISHED)
    }

    return challenges
  }
}
