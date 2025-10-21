import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ChallengesController } from "../controllers/challenges.controller"
import { CreateChallengeUseCase } from "@application/challenges/create-challenge.usecase"
import { UpdateChallengeUseCase } from "@application/challenges/update-challenge.usecase"
import { ListChallengesUseCase } from "@application/challenges/list-challenges.usecase"
import { GetChallengeUseCase } from "@application/challenges/get-challenge.usecase"
import { DeleteChallengeUseCase } from "@application/challenges/delete-challenge.usecase"
import { AddTestCaseUseCase } from "@application/challenges/add-test-case.usecase"
import { ChallengeRepository } from "@infrastructure/database/repositories/challenge.repository"
import { TestCaseRepository } from "@infrastructure/database/repositories/test-case.repository"
import { ChallengeEntity } from "@infrastructure/database/entities/challenge.entity"
import { TestCaseEntity } from "@infrastructure/database/entities/test-case.entity"
import { CHALLENGE_REPOSITORY } from "@domain/repositories/challenge.repository.interface"
import { TEST_CASE_REPOSITORY } from "@domain/repositories/test-case.repository.interface"

@Module({
  imports: [TypeOrmModule.forFeature([ChallengeEntity, TestCaseEntity])],
  controllers: [ChallengesController],
  providers: [
    CreateChallengeUseCase,
    UpdateChallengeUseCase,
    ListChallengesUseCase,
    GetChallengeUseCase,
    DeleteChallengeUseCase,
    AddTestCaseUseCase,
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: ChallengeRepository,
    },
    {
      provide: TEST_CASE_REPOSITORY,
      useClass: TestCaseRepository,
    },
  ],
  exports: [CHALLENGE_REPOSITORY, TEST_CASE_REPOSITORY],
})
export class ChallengesModule {}
