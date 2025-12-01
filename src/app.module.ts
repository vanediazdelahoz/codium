import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
import { APP_GUARD } from "@nestjs/core";
import { Reflector } from "@nestjs/core";

import { AuthModule } from "./interface/http/auth/auth.module";
import { UsersModule } from "./interface/http/users/users.module";
import { ChallengesModule } from "./interface/http/challenges/challenges.module";
import { SubmissionsModule } from "./interface/http/submissions/submissions.module";
import { CoursesModule } from "./interface/http/courses/courses.module";
import { EvaluationsModule } from "./interface/http/evaluations/evaluations.module";
import { LeaderboardsModule } from "./interface/http/leaderboards/leaderboards.module";
import { JwtAuthGuard } from "./interface/http/auth/guards/jwt-auth.guard";
import { RolesGuard } from "./interface/http/auth/guards/roles.guard";
import { PrismaService } from "./infrastructure/database/prisma.service";
import { TestCasesModule } from "./interface/http/test-cases/test-case.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { GroupsModule } from "./interface/http/groups/groups.module";
import { EnrollmentsModule } from "./interface/http/enrollments/enrollments.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number.parseInt(process.env.REDIS_PORT || "6379"),
      },
    }),
    InfrastructureModule,
    AuthModule,
    UsersModule,
    ChallengesModule,
    SubmissionsModule,
    CoursesModule,
    EvaluationsModule,
    LeaderboardsModule,
    TestCasesModule,
    GroupsModule,
    EnrollmentsModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    Reflector,
  ],
})
export class AppModule {}