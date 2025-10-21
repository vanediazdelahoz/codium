import type { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { UserEntity } from "./entities/user.entity"
import { ChallengeEntity } from "./entities/challenge.entity"
import { SubmissionEntity } from "./entities/submission.entity"
import { TestCaseEntity } from "./entities/test-case.entity"
import { CourseEntity } from "./entities/course.entity"
import { CourseStudentEntity } from "./entities/course-student.entity"

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: Number.parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER || "codium",
  password: process.env.DATABASE_PASSWORD || "codium_password",
  database: process.env.DATABASE_NAME || "codium_db",
  entities: [UserEntity, ChallengeEntity, SubmissionEntity, TestCaseEntity, CourseEntity, CourseStudentEntity],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
})
