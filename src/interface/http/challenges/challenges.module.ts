import { Module } from "@nestjs/common"
import { ChallengesController } from "./challenges.controller"
import { CreateChallengeUseCase } from "@core/application/challenges/usecases/create-challenge.usecase"
import { UpdateChallengeUseCase } from "@core/application/challenges/usecases/update-challenge.usecase"
import { ListChallengesUseCase } from "@core/application/challenges/usecases/list-challenges.usecase"
import { GetChallengeUseCase } from "@core/application/challenges/usecases/get-challenge.usecase"
import { CHALLENGE_REPOSITORY } from "@core/application/challenges/tokens"
import { ChallengePrismaRepository } from "@infrastructure/challenges/prisma/challenge-prisma.repository"
import { PrismaService } from "@infrastructure/database/prisma.service"

@Module({
  controllers: [ChallengesController],
  providers: [
    CreateChallengeUseCase,
    UpdateChallengeUseCase,
    ListChallengesUseCase,
    GetChallengeUseCase,
    PrismaService,
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: ChallengePrismaRepository,
    },
  ],
})
export class ChallengesModule {}
