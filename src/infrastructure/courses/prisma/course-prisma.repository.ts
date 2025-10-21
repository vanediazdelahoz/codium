import { Injectable } from "@nestjs/common"
import type { PrismaService } from "../../database/prisma.service"
import type { ICourseRepository } from "@core/domain/courses/course.repository.port"
import type { Course } from "@core/domain/courses/course.entity"

@Injectable()
export class CoursePrismaRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(course: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course> {
    const created = await this.prisma.course.create({
      data: {
        name: course.name,
        code: course.code,
        period: course.period,
        group: course.group,
        professorIds: course.professorIds,
      },
    })

    return this.toDomain(created)
  }

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    })

    return course ? this.toDomain(course) : null
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.prisma.course.findMany()
    return courses.map(this.toDomain)
  }

  async findByProfessorId(professorId: string): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: {
        professorIds: {
          has: professorId,
        },
      },
    })
    return courses.map(this.toDomain)
  }

  async update(id: string, data: Partial<Course>): Promise<Course> {
    const updated = await this.prisma.course.update({
      where: { id },
      data,
    })

    return this.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({
      where: { id },
    })
  }

  async enrollStudent(courseId: string, studentId: string): Promise<void> {
    await this.prisma.courseStudent.create({
      data: {
        courseId,
        studentId,
      },
    })
  }

  async unenrollStudent(courseId: string, studentId: string): Promise<void> {
    await this.prisma.courseStudent.delete({
      where: {
        courseId_studentId: {
          courseId,
          studentId,
        },
      },
    })
  }

  async findStudentsByCourseId(courseId: string): Promise<string[]> {
    const enrollments = await this.prisma.courseStudent.findMany({
      where: { courseId },
      select: { studentId: true },
    })
    return enrollments.map((e) => e.studentId)
  }

  private toDomain(prismaCourse: any): Course {
    return {
      id: prismaCourse.id,
      name: prismaCourse.name,
      code: prismaCourse.code,
      period: prismaCourse.period,
      group: prismaCourse.group,
      professorIds: prismaCourse.professorIds,
      createdAt: prismaCourse.createdAt,
      updatedAt: prismaCourse.updatedAt,
    }
  }
}
