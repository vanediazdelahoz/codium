import { Module } from "@nestjs/common";
import { ChallengesController } from "./challenges.controller";

// --- CORE ---
import { CreateChallengeUseCase } from "@core/application/challenges/usecases/create-challenge.usecase";
import { UpdateChallengeUseCase } from "@core/application/challenges/usecases/update-challenge.usecase";
import { ListChallengesUseCase } from "@core/application/challenges/usecases/list-challenges.usecase";
import { GetChallengeUseCase } from "@core/application/challenges/usecases/get-challenge.usecase";
// CORREGIDO: El token se importa desde el dominio, que es su lugar correcto.
import { CHALLENGE_REPOSITORY } from "@core/domain/challenges/challenge.repository.port";

// --- INFRASTRUCTURE ---
import { ChallengePrismaRepository } from "@infrastructure/database/prisma/challenge-prisma.repository";
import { PrismaService } from "@infrastructure/database/prisma.service";

@Module({
  controllers: [ChallengesController],
  providers: [
    // Use Cases
    CreateChallengeUseCase,
    UpdateChallengeUseCase,
    ListChallengesUseCase,
    GetChallengeUseCase,
    // Infrastructure Services
    PrismaService,
    // Repository Port Implementation
    {
      provide: CHALLENGE_REPOSITORY, // El token que representa la interfaz
      useClass: ChallengePrismaRepository, // La clase concreta que la implementa
    },
  ],
  exports: [CHALLENGE_REPOSITORY], // <-- AÑADE ESTA LÍNEA
})
export class ChallengesModule {}