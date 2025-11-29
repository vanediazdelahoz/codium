import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { SubmissionsController } from "./submissions.controller";
import { SubmitSolutionUseCase } from "@core/application/submissions/usecases/submit-solution.usecase";
import { GetSubmissionUseCase } from "@core/application/submissions/usecases/get-submission.usecase";
import { ListUserSubmissionsUseCase } from "@core/application/submissions/usecases/list-user-submissions.usecase";
import { SUBMISSION_REPOSITORY } from "@core/domain/submissions/submission.repository.port";
import { SubmissionPrismaRepository } from "@infrastructure/database/prisma/submission-prisma.repository";
import { SubmissionProcessor } from "@infrastructure/queue/submission.processor";
import { PrismaService } from "@infrastructure/database/prisma.service";
import { ChallengesModule } from "../challenges/challenges.module";
import { UsersModule } from "../users/users.module";
import { TestCasesModule } from "../test-cases/test-case.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "submissions",
    }),
    ChallengesModule,
    UsersModule,
    TestCasesModule,
  ],
  controllers: [SubmissionsController],
  providers: [
    SubmitSolutionUseCase,
    GetSubmissionUseCase,
    ListUserSubmissionsUseCase,
    SubmissionProcessor,
    PrismaService,
    {
      provide: SUBMISSION_REPOSITORY,
      useClass: SubmissionPrismaRepository,
    },
  ],
})
export class SubmissionsModule {}
