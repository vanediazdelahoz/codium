import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CoursesController } from "../controllers/courses.controller"
import { CreateCourseUseCase } from "@application/courses/create-course.usecase"
import { ListCoursesUseCase } from "@application/courses/list-courses.usecase"
import { GetCourseUseCase } from "@application/courses/get-course.usecase"
import { EnrollStudentUseCase } from "@application/courses/enroll-student.usecase"
import { UnenrollStudentUseCase } from "@application/courses/unenroll-student.usecase"
import { ListCourseStudentsUseCase } from "@application/courses/list-course-students.usecase"
import { CourseRepository } from "@infrastructure/database/repositories/course.repository"
import { CourseEntity } from "@infrastructure/database/entities/course.entity"
import { CourseStudentEntity } from "@infrastructure/database/entities/course-student.entity"
import { UserEntity } from "@infrastructure/database/entities/user.entity"
import { COURSE_REPOSITORY } from "@domain/repositories/course.repository.interface"
import { USER_REPOSITORY } from "@domain/repositories/user.repository.interface"
import { UserRepository } from "@infrastructure/database/repositories/user.repository"

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, CourseStudentEntity, UserEntity])],
  controllers: [CoursesController],
  providers: [
    CreateCourseUseCase,
    ListCoursesUseCase,
    GetCourseUseCase,
    EnrollStudentUseCase,
    UnenrollStudentUseCase,
    ListCourseStudentsUseCase,
    {
      provide: COURSE_REPOSITORY,
      useClass: CourseRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [COURSE_REPOSITORY],
})
export class CoursesModule {}
