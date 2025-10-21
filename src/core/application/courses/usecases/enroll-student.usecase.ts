import { Injectable, NotFoundException, ForbiddenException, ConflictException } from "@nestjs/common"
import type { ICourseRepository } from "@domain/repositories/course.repository.interface"
import type { IUserRepository } from "@domain/repositories/user.repository.interface"
import { CourseStudent } from "@domain/entities/course.entity"

@Injectable()
export class EnrollStudentUseCase {
  private readonly courseRepository: ICourseRepository
  private readonly userRepository: IUserRepository

  constructor(courseRepository: ICourseRepository, userRepository: IUserRepository) {
    this.courseRepository = courseRepository
    this.userRepository = userRepository
  }

  async execute(courseId: string, studentId: string, requestUserId: string, requestUserRole: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId)

    if (!course) {
      throw new NotFoundException("Curso no encontrado")
    }

    // Solo ADMIN o el profesor del curso pueden inscribir estudiantes
    if (requestUserRole !== "ADMIN" && !course.isProfessor(requestUserId)) {
      throw new ForbiddenException("No tienes permiso para inscribir estudiantes en este curso")
    }

    const student = await this.userRepository.findById(studentId)

    if (!student) {
      throw new NotFoundException("Estudiante no encontrado")
    }

    if (!student.isStudent()) {
      throw new ForbiddenException("Solo se pueden inscribir usuarios con rol STUDENT")
    }

    // Verificar si ya está inscrito
    const enrolledStudents = await this.courseRepository.findStudentsByCourseId(courseId)
    if (enrolledStudents.includes(studentId)) {
      throw new ConflictException("El estudiante ya está inscrito en este curso")
    }

    const courseStudent = new CourseStudent({
      courseId,
      studentId,
      enrolledAt: new Date(),
    })

    await this.courseRepository.enrollStudent(courseStudent)
  }
}
