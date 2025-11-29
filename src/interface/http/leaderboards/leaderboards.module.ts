import { Module } from "@nestjs/common";
import { LeaderboardsController } from "./leaderboards.controller";
import { LeaderboardService } from "@core/application/leaderboards/leaderboard.service";
import { SUBMISSION_REPOSITORY } from "@core/domain/submissions/submission.repository.port";
import { CHALLENGE_REPOSITORY } from "@core/domain/challenges/challenge.repository.port";
import { EVALUATION_REPOSITORY } from "@core/domain/evaluations/evaluation.repository.port";
import { COURSE_REPOSITORY } from "@core/domain/courses/course.repository.port";
import { SubmissionPrismaRepository } from "@infrastructure/database/prisma/submission-prisma.repository";
import { ChallengePrismaRepository } from "@infrastructure/database/prisma/challenge-prisma.repository";
import { EvaluationPrismaRepository } from "@infrastructure/database/prisma/evaluation-prisma.repository";
import { CoursePrismaRepository } from "@infrastructure/database/prisma/course-prisma.repository";
import { PrismaService } from "@infrastructure/database/prisma.service";

@Module({
  controllers: [LeaderboardsController],
  providers: [
    LeaderboardService,
    PrismaService,
    {
      provide: SUBMISSION_REPOSITORY,
      useClass: SubmissionPrismaRepository,
    },
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: ChallengePrismaRepository,
    },
    {
      provide: EVALUATION_REPOSITORY,
      useClass: EvaluationPrismaRepository,
    },
    {
      provide: COURSE_REPOSITORY,
      useClass: CoursePrismaRepository,
    },
  ],
})
export class LeaderboardsModule {}
