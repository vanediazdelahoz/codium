import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { IChallengeRepository } from "@core/domain/challenges/challenge.repository.port"
import type { UpdateChallengeDto } from "../dto/update-challenge.dto"
import type { ChallengeDto } from "../dto/challenge.dto"
import { ChallengeMapper } from "../mappers/challenge.mapper"
import { UserRole } from "@core/domain/users/user.entity"

@Injectable()
export class UpdateChallengeUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string, dto: UpdateChallengeDto, userRole: UserRole): Promise<ChallengeDto> {
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.PROFESSOR) {
      throw new ForbiddenException("Only admins and professors can update challenges")
    }

    const challenge = await this.challengeRepository.findById(id)
    if (!challenge) {
      throw new NotFoundException("Challenge not found")
    }

    const updated = await this.challengeRepository.update(id, dto)
    return ChallengeMapper.toDto(updated)
  }
}
