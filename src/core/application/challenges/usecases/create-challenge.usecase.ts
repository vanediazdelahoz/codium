import { Injectable, ForbiddenException } from "@nestjs/common"
import type { IChallengeRepository } from "@core/domain/challenges/challenge.repository.port"
import type { CreateChallengeDto } from "../dto/create-challenge.dto"
import type { ChallengeDto } from "../dto/challenge.dto"
import { ChallengeMapper } from "../mappers/challenge.mapper"
import { ChallengeStatus } from "@core/domain/challenges/challenge.entity"
import { UserRole } from "@core/domain/users/user.entity"

@Injectable()
export class CreateChallengeUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(dto: CreateChallengeDto, userId: string, userRole: UserRole): Promise<ChallengeDto> {
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.PROFESSOR) {
      throw new ForbiddenException("Only admins and professors can create challenges")
    }

    const challenge = await this.challengeRepository.create({
      ...dto,
      status: ChallengeStatus.DRAFT,
      createdBy: userId,
    })

    return ChallengeMapper.toDto(challenge)
  }
}