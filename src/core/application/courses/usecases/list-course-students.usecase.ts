import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { ICourseRepository } from "@domain/repositories/course.repository.interface"
import type { IUserRepository } from "@domain/repositories/user.repository.interface"
import type { User } from "@domain/entities/user.entity"

@Injectable()
export class ListCourseStudentsUseCase {
  private readonly courseRepository: ICourseRepository
  private readonly userRepository: IUserRepository

  constructor(courseRepository: ICourseRepository, userRepository: IUserRepository) {
    this.courseRepository = courseRepository
    this.userRepository = userRepository
  }

  async execute(courseId: string, requestUserId: string, requestUserRole: string): Promise<User[]> {
    const course = await this.courseRepository.findById(courseId)

    if (!course) {
      throw new NotFoundException("Curso no encontrado")
    }

    // Solo ADMIN o el profesor del curso pueden ver la lista de estudiantes
    if (requestUserRole !== "ADMIN" && !course.isProfessor(requestUserId)) {
      throw new ForbiddenException("No tienes permiso para ver los estudiantes de este curso")
    }

    const studentIds = await this.courseRepository.findStudentsByCourseId(courseId)

    const students: User[] = []
    for (const studentId of studentIds) {
      const student = await this.userRepository.findById(studentId)
      if (student) {
        students.push(student)
      }
    }

    return students
  }
}
