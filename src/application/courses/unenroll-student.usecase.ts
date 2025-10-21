import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { ICourseRepository } from "@domain/repositories/course.repository.interface"

@Injectable()
export class UnenrollStudentUseCase {
  private readonly courseRepository: ICourseRepository

  constructor(courseRepository: ICourseRepository) {
    this.courseRepository = courseRepository
  }

  async execute(courseId: string, studentId: string, requestUserId: string, requestUserRole: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId)

    if (!course) {
      throw new NotFoundException("Curso no encontrado")
    }

    // Solo ADMIN o el profesor del curso pueden desinscribir estudiantes
    if (requestUserRole !== "ADMIN" && !course.isProfessor(requestUserId)) {
      throw new ForbiddenException("No tienes permiso para desinscribir estudiantes de este curso")
    }

    await this.courseRepository.unenrollStudent(courseId, studentId)
  }
}
