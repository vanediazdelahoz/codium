import { Module } from "@nestjs/common"
import { BullModule } from "@nestjs/bull"
import { SubmissionsController } from "./submissions.controller"
import { SubmitSolutionUseCase } from "@core/application/submissions/usecases/submit-solution.usecase"
import { GetSubmissionUseCase } from "@core/application/submissions/usecases/get-submission.usecase"
import { ListUserSubmissionsUseCase } from "@core/application/submissions/usecases/list-user-submissions.usecase"
import { SUBMISSION_REPOSITORY } from "@core/application/submissions/tokens"
import { SubmissionPrismaRepository } from "@infrastructure/database/prisma/submission-prisma.repository"
import { SubmissionProcessor } from "@infrastructure/queue/submission.processor"
import { PrismaService } from "@infrastructure/database/prisma.service"

@Module({
  imports: [
    BullModule.registerQueue({
      name: "submissions",
    }),
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
