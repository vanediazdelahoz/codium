import { Module } from "@nestjs/common";
import { CoursesController } from "./courses.controller";
import { CreateCourseUseCase } from "@core/application/courses/usecases/create-course.usecase";
import { ListCoursesUseCase } from "@core/application/courses/usecases/list-courses.usecase";
import { GetCourseUseCase } from "@core/application/courses/usecases/get-course.usecase";
import { EnrollStudentUseCase } from "@core/application/courses/usecases/enroll-student.usecase";
import { COURSE_REPOSITORY } from "@core/domain/courses/course.repository.port";
import { CoursePrismaRepository } from "@infrastructure/database/prisma/course-prisma.repository";
import { PrismaService } from "@infrastructure/database/prisma.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [CoursesController],
  providers: [
    CreateCourseUseCase,
    ListCoursesUseCase,
    GetCourseUseCase,
    EnrollStudentUseCase,
    PrismaService,
    {
      provide: COURSE_REPOSITORY,
      useClass: CoursePrismaRepository,
    },
  ],
})
export class CoursesModule {}