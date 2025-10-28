import { Inject, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { CHALLENGE_REPOSITORY, ChallengeRepositoryPort } from "@core/domain/challenges/challenge.repository.port";
import { ChallengeDto } from "../dto/challenge.dto";
import { ChallengeMapper } from "../mappers/challenge.mapper";
import { UserRole } from "@core/domain/users/user.entity";
import { ChallengeStatus } from "@core/domain/challenges/challenge.entity";

@Injectable()
export class GetChallengeUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepositoryPort,
  ) {}

  async execute(id: string, userRole: UserRole): Promise<ChallengeDto> {
    const challenge = await this.challengeRepository.findById(id);

    if (!challenge) {
      throw new NotFoundException("Challenge not found");
    }

    if (userRole === UserRole.STUDENT && challenge.status !== ChallengeStatus.PUBLISHED) {
      throw new ForbiddenException("Challenge not available");
    }

    return ChallengeMapper.toDto(challenge);
  }
}