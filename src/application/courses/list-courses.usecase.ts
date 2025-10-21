import { Injectable } from "@nestjs/common"
import type { ICourseRepository } from "@domain/repositories/course.repository.interface"
import type { Course } from "@domain/entities/course.entity"

@Injectable()
export class ListCoursesUseCase {
  private readonly courseRepository: ICourseRepository

  constructor(courseRepository: ICourseRepository) {
    this.courseRepository = courseRepository
  }

  async execute(userId: string, userRole: string): Promise<Course[]> {
    if (userRole === "ADMIN") {
      return await this.courseRepository.findAll()
    }

    if (userRole === "PROFESSOR") {
      return await this.courseRepository.findByProfessorId(userId)
    }

    // STUDENT
    return await this.courseRepository.findCoursesByStudentId(userId)
  }
}
