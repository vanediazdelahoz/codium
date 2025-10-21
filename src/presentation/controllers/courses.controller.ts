import { Controller, Get, Post, Delete, Param, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { RolesGuard } from "../guards/roles.guard"
import { Roles } from "../decorators/roles.decorator"
import { CurrentUser } from "../decorators/current-user.decorator"
import { UserRole } from "@domain/entities/user.entity"
import type { CreateCourseUseCase } from "@application/courses/create-course.usecase"
import type { ListCoursesUseCase } from "@application/courses/list-courses.usecase"
import type { GetCourseUseCase } from "@application/courses/get-course.usecase"
import type { EnrollStudentUseCase } from "@application/courses/enroll-student.usecase"
import type { UnenrollStudentUseCase } from "@application/courses/unenroll-student.usecase"
import type { ListCourseStudentsUseCase } from "@application/courses/list-course-students.usecase"
import type { CreateCourseDto } from "../dto/courses/create-course.dto"
import type { EnrollStudentDto } from "../dto/courses/enroll-student.dto"

@ApiTags("courses")
@Controller("courses")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly listCoursesUseCase: ListCoursesUseCase,
    private readonly getCourseUseCase: GetCourseUseCase,
    private readonly enrollStudentUseCase: EnrollStudentUseCase,
    private readonly unenrollStudentUseCase: UnenrollStudentUseCase,
    private readonly listCourseStudentsUseCase: ListCourseStudentsUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Crear un nuevo curso" })
  @ApiResponse({ status: 201, description: "Curso creado exitosamente" })
  async create(dto: CreateCourseDto, @CurrentUser() user: any) {
    return await this.createCourseUseCase.execute(
      {
        ...dto,
        professorId: user.id,
      },
      user.role,
    )
  }

  @Get()
  @ApiOperation({ summary: "Listar cursos" })
  @ApiResponse({ status: 200, description: "Lista de cursos" })
  async findAll(@CurrentUser() user: any) {
    return await this.listCoursesUseCase.execute(user.id, user.role)
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un curso por ID" })
  @ApiResponse({ status: 200, description: "Curso encontrado" })
  async findOne(@Param("id") id: string, @CurrentUser() user: any) {
    return await this.getCourseUseCase.execute(id, user.id, user.role)
  }

  @Post(":id/enroll")
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Inscribir un estudiante en el curso" })
  @ApiResponse({ status: 200, description: "Estudiante inscrito exitosamente" })
  async enrollStudent(@Param("id") id: string, dto: EnrollStudentDto, @CurrentUser() user: any) {
    await this.enrollStudentUseCase.execute(id, dto.studentId, user.id, user.role)
    return { message: "Estudiante inscrito exitosamente" }
  }

  @Delete(":id/students/:studentId")
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Desinscribir un estudiante del curso" })
  @ApiResponse({ status: 200, description: "Estudiante desinscrito exitosamente" })
  async unenrollStudent(@Param("id") id: string, @Param("studentId") studentId: string, @CurrentUser() user: any) {
    await this.unenrollStudentUseCase.execute(id, studentId, user.id, user.role)
    return { message: "Estudiante desinscrito exitosamente" }
  }

  @Get(":id/students")
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Listar estudiantes inscritos en el curso" })
  @ApiResponse({ status: 200, description: "Lista de estudiantes" })
  async listStudents(@Param("id") id: string, @CurrentUser() user: any) {
    const students = await this.listCourseStudentsUseCase.execute(id, user.id, user.role)
    return students.map((s) => ({
      id: s.id,
      email: s.email,
      firstName: s.firstName,
      lastName: s.lastName,
      fullName: s.fullName,
    }))
  }
}
