import { Module } from '@nestjs/common';
import { TEST_CASE_REPOSITORY } from '@core/domain/test-cases/test-case.repository.port';
import { CHALLENGE_REPOSITORY } from '@core/domain/challenges/challenge.repository.port';
import { TestCasePrismaRepository } from '@infrastructure/database/prisma/test-case-prisma.repository';
import { ChallengePrismaRepository } from '@infrastructure/database/prisma/challenge-prisma.repository';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { AddTestCaseUseCase } from '@core/application/challenges/usecases/add-test-case.usecase';
import { TestCasesController } from './test-cases.controller';

@Module({
  controllers: [TestCasesController],
  providers: [
    PrismaService,
    AddTestCaseUseCase,
    {
      provide: TEST_CASE_REPOSITORY,
      useClass: TestCasePrismaRepository,
    },
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: ChallengePrismaRepository,
    },
  ],
  exports: [TEST_CASE_REPOSITORY],
})
export class TestCasesModule {}