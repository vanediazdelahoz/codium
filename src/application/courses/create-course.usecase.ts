import { Injectable, ForbiddenException } from "@nestjs/common"
import { v4 as uuidv4 } from "uuid"
import type { ICourseRepository } from "@domain/repositories/course.repository.interface"
import { Course } from "@domain/entities/course.entity"

export interface CreateCourseDto {
  name: string
  code: string
  period: string
  group: number
  professorId: string
}

@Injectable()
export class CreateCourseUseCase {
  private readonly courseRepository: ICourseRepository

  constructor(courseRepository: ICourseRepository) {
    this.courseRepository = courseRepository
  }

  async execute(dto: CreateCourseDto, userRole: string): Promise<Course> {
    if (userRole !== "ADMIN" && userRole !== "PROFESSOR") {
      throw new ForbiddenException("Solo administradores y profesores pueden crear cursos")
    }

    const course = new Course({
      id: uuidv4(),
      name: dto.name,
      code: dto.code,
      period: dto.period,
      group: dto.group,
      professorIds: [dto.professorId],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return await this.courseRepository.create(course)
  }
}
