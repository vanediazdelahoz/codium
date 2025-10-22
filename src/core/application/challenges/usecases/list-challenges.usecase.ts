import { Inject, Injectable } from "@nestjs/common";
import { CHALLENGE_REPOSITORY, ChallengeRepositoryPort } from "@core/domain/challenges/challenge.repository.port";
import { ChallengeDto } from "../dto/challenge.dto";
import { ChallengeMapper } from "../mappers/challenge.mapper";
import { UserRole } from "@core/domain/users/user.entity";
import { ChallengeStatus } from "@core/domain/challenges/challenge.entity";

@Injectable()
export class ListChallengesUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepositoryPort,
  ) {}

  async execute(userRole: UserRole, courseId?: string): Promise<ChallengeDto[]> {
    let challenges;

    if (courseId) {
      challenges = await this.challengeRepository.findByCourseId(courseId);
    } else {
      challenges = await this.challengeRepository.findAll();
    }

    if (userRole === UserRole.STUDENT) {
      challenges = challenges.filter((c) => c.status === ChallengeStatus.PUBLISHED);
    }

    return challenges.map(c => ChallengeMapper.toDto(c));
  }
}