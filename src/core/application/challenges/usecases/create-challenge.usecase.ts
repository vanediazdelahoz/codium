import { Inject, Injectable, ForbiddenException } from "@nestjs/common";
import { CHALLENGE_REPOSITORY, ChallengeRepositoryPort } from "@core/domain/challenges/challenge.repository.port";
import { CreateChallengeDto } from "../dto/create-challenge.dto";
import { ChallengeDto } from "../dto/challenge.dto";
import { ChallengeMapper } from "../mappers/challenge.mapper";
import { Challenge, ChallengeStatus } from "@core/domain/challenges/challenge.entity"; // Importar la entidad
import { UserRole } from "@core/domain/users/user.entity";
import { v4 as uuidv4 } from 'uuid'; // Importar para generar IDs

@Injectable()
export class CreateChallengeUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepositoryPort,
  ) {}

  async execute(dto: CreateChallengeDto, userId: string, userRole: UserRole): Promise<ChallengeDto> {
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.PROFESSOR) {
      throw new ForbiddenException("Only admins and professors can create challenges");
    }

    // 1. Crear una instancia de la entidad Challenge
    const newChallenge = new Challenge({
      id: uuidv4(),
      ...dto,
      status: ChallengeStatus.DRAFT,
      createdById: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Pasar la instancia completa al repositorio
    const createdChallenge = await this.challengeRepository.create(newChallenge);

    // 3. Mapear a un DTO para la respuesta
    return ChallengeMapper.toDto(createdChallenge);
  }
}