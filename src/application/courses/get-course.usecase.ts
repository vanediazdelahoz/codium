import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { ICourseRepository } from "@domain/repositories/course.repository.interface"
import type { Course } from "@domain/entities/course.entity"

@Injectable()
export class GetCourseUseCase {
  private readonly courseRepository: ICourseRepository

  constructor(courseRepository: ICourseRepository) {
    this.courseRepository = courseRepository
  }

  async execute(id: string, userId: string, userRole: string): Promise<Course> {
    const course = await this.courseRepository.findById(id)

    if (!course) {
      throw new NotFoundException("Curso no encontrado")
    }

    // Verificar acceso
    if (userRole === "ADMIN") {
      return course
    }

    if (userRole === "PROFESSOR" && course.isProfessor(userId)) {
      return course
    }

    if (userRole === "STUDENT") {
      const studentCourses = await this.courseRepository.findCoursesByStudentId(userId)
      const hasAccess = studentCourses.some((c) => c.id === id)

      if (!hasAccess) {
        throw new ForbiddenException("No tienes acceso a este curso")
      }

      return course
    }

    throw new ForbiddenException("No tienes acceso a este curso")
  }
}
