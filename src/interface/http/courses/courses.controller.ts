import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CreateCourseUseCase } from "@core/application/courses/usecases/create-course.usecase";
import { ListCoursesUseCase } from "@core/application/courses/usecases/list-courses.usecase";
import { GetCourseUseCase } from "@core/application/courses/usecases/get-course.usecase";
import { EnrollStudentUseCase } from "@core/application/courses/usecases/enroll-student.usecase";
import { CreateCourseDto } from "@core/application/courses/dto/create-course.dto";
import { EnrollStudentDto } from "@core/application/courses/dto/enroll-student.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "@core/domain/users/user.entity";

@ApiTags("courses")
@ApiBearerAuth()
@Controller("courses")
export class CoursesController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly listCoursesUseCase: ListCoursesUseCase,
    private readonly getCourseUseCase: GetCourseUseCase,
    private readonly enrollStudentUseCase: EnrollStudentUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Create a new course" })
  async create(@Body() dto: CreateCourseDto, @CurrentUser() user: any) {
    return this.createCourseUseCase.execute(dto, user.role);
  }

  @Get()
  @ApiOperation({ summary: 'List all courses' })
  async list(@CurrentUser() user: any) {
    return this.listCoursesUseCase.execute(user.id, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  async get(@Param('id') id: string, @CurrentUser() user: any) {
    return this.getCourseUseCase.execute(id, user.id, user.role);
  }

  @Post(":id/students")
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Enroll student in course" })
  async enrollStudent(@Param('id') courseId: string, @Body() dto: EnrollStudentDto, @CurrentUser() user: any) {
    return this.enrollStudentUseCase.execute(courseId, dto.studentId, user.id, user.role);
  }
}