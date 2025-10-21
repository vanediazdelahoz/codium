import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BullModule } from "@nestjs/bull"
import { SubmissionsController } from "../controllers/submissions.controller"
import { SubmitSolutionUseCase } from "@application/submissions/submit-solution.usecase"
import { GetSubmissionUseCase } from "@application/submissions/get-submission.usecase"
import { ListUserSubmissionsUseCase } from "@application/submissions/list-user-submissions.usecase"
import { SubmissionRepository } from "@infrastructure/database/repositories/submission.repository"
import { SubmissionEntity } from "@infrastructure/database/entities/submission.entity"
import { ChallengeEntity } from "@infrastructure/database/entities/challenge.entity"
import { SUBMISSION_REPOSITORY } from "@domain/repositories/submission.repository.interface"
import { CHALLENGE_REPOSITORY } from "@domain/repositories/challenge.repository.interface"
import { ChallengeRepository } from "@infrastructure/database/repositories/challenge.repository"
import { SubmissionProcessor } from "@infrastructure/queue/submission.processor"

@Module({
  imports: [
    TypeOrmModule.forFeature([SubmissionEntity, ChallengeEntity]),
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
    {
      provide: SUBMISSION_REPOSITORY,
      useClass: SubmissionRepository,
    },
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: ChallengeRepository,
    },
  ],
  exports: [SUBMISSION_REPOSITORY],
})
export class SubmissionsModule {}
