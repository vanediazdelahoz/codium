import { Module } from '@nestjs/common';
import { TEST_CASE_REPOSITORY } from '@core/domain/test-cases/test-case.repository.port';
import { TestCasePrismaRepository } from '@infrastructure/database/prisma/test-case-prisma.repository';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Module({
  providers: [
    PrismaService,
    {
      provide: TEST_CASE_REPOSITORY,
      useClass: TestCasePrismaRepository,
    },
  ],
  exports: [TEST_CASE_REPOSITORY],
})
export class TestCasesModule {}