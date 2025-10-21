import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { IChallengeRepository } from "@core/domain/challenges/challenge.repository.port"
import type { ChallengeDto } from "../dto/challenge.dto"
import { ChallengeMapper } from "../mappers/challenge.mapper"
import { UserRole } from "@core/domain/users/user.entity"
import { ChallengeStatus } from "@core/domain/challenges/challenge.entity"

@Injectable()
export class GetChallengeUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string, userRole: UserRole): Promise<ChallengeDto> {
    const challenge = await this.challengeRepository.findById(id)

    if (!challenge) {
      throw new NotFoundException("Challenge not found")
    }

    // Students can only see published challenges
    if (userRole === UserRole.STUDENT && challenge.status !== ChallengeStatus.PUBLISHED) {
      throw new ForbiddenException("Challenge not available")
    }

    return ChallengeMapper.toDto(challenge)
  }
}