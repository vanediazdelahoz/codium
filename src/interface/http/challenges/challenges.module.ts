import { Module } from "@nestjs/common";
import { ChallengesController } from "./challenges.controller";
import { CreateChallengeUseCase } from "@core/application/challenges/usecases/create-challenge.usecase";
import { UpdateChallengeUseCase } from "@core/application/challenges/usecases/update-challenge.usecase";
import { ListChallengesUseCase } from "@core/application/challenges/usecases/list-challenges.usecase";
import { GetChallengeUseCase } from "@core/application/challenges/usecases/get-challenge.usecase";
import { DeleteChallengeUseCase } from "@core/application/challenges/usecases/delete-challenge.usecase"; // <-- Importar
import { CHALLENGE_REPOSITORY } from "@core/domain/challenges/challenge.repository.port";
import { ChallengePrismaRepository } from "@infrastructure/database/prisma/challenge-prisma.repository";
import { PrismaService } from "@infrastructure/database/prisma.service";
import { TestCasesModule } from "../test-cases/test-case.module"; // <-- Importar

@Module({
  imports: [TestCasesModule], // <-- Añadir a imports
  controllers: [ChallengesController],
  providers: [
    CreateChallengeUseCase,
    UpdateChallengeUseCase,
    ListChallengesUseCase,
    GetChallengeUseCase,
    DeleteChallengeUseCase, // <-- AÑADIR A LA LISTA DE PROVEEDORES
    PrismaService,
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: ChallengePrismaRepository,
    },
  ],
  exports: [CHALLENGE_REPOSITORY],
})
export class ChallengesModule {}