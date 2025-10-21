import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { IChallengeRepository } from "@core/domain/challenges/challenge.repository.port"
import type { UpdateChallengeDto } from "../dto/update-challenge.dto"
import type { ChallengeDto } from "../dto/challenge.dto"
import { ChallengeMapper } from "../mappers/challenge.mapper"
import { UserRole } from "@core/domain/users/user.entity"

@Injectable()
export class UpdateChallengeUseCase {
  constructor(private readonly challengeRepository: IChallengeRepository) {}

  async execute(id: string, dto: UpdateChallengeDto, userId: string, userRole: UserRole): Promise<ChallengeDto> {
    const challenge = await this.challengeRepository.findById(id)
    if (!challenge) {
      throw new NotFoundException("Challenge not found")
    }

    // Un profesor solo puede editar sus propios retos, un admin puede editar cualquiera.
    const isOwner = challenge.createdBy === userId
    const isAdmin = userRole === UserRole.ADMIN

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("You do not have permission to edit this challenge")
    }

    const updated = await this.challengeRepository.update(id, dto)
    return ChallengeMapper.toDto(updated)
  }
}