import { Injectable } from "@nestjs/common"
import type { IChallengeRepository } from "@core/domain/challenges/challenge.repository.port"
import type { ChallengeDto } from "../dto/challenge.dto"
import { ChallengeMapper } from "../mappers/challenge.mapper"
import { UserRole } from "@core/domain/users/user.entity"
import { ChallengeStatus } from "@core/domain/challenges/challenge.entity"

@Injectable()
export class ListChallengesUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(userRole: UserRole, courseId?: string): Promise<ChallengeDto[]> {
    let challenges

    if (courseId) {
      challenges = await this.challengeRepository.findByCourseId(courseId)
    } else {
      challenges = await this.challengeRepository.findAll()
    }

    // Students can only see published challenges
    if (userRole === UserRole.STUDENT) {
      challenges = challenges.filter((c) => c.status === ChallengeStatus.PUBLISHED)
    }

    return ChallengeMapper.toDtoArray(challenges)
  }
}