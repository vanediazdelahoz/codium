import { Inject, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { CHALLENGE_REPOSITORY, ChallengeRepositoryPort } from "@core/domain/challenges/challenge.repository.port";
import { UpdateChallengeDto } from "../dto/update-challenge.dto";
import { ChallengeDto } from "../dto/challenge.dto";
import { ChallengeMapper } from "../mappers/challenge.mapper";
import { UserRole } from "@core/domain/users/user.entity";

@Injectable()
export class UpdateChallengeUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateChallengeDto, userId: string, userRole: UserRole): Promise<ChallengeDto> {
    const challenge = await this.challengeRepository.findById(id);
    if (!challenge) {
      throw new NotFoundException("Challenge not found");
    }

    const isOwner = challenge.createdById === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("You do not have permission to edit this challenge");
    }

    const updated = await this.challengeRepository.update(id, dto);
    return ChallengeMapper.toDto(updated);
  }
}