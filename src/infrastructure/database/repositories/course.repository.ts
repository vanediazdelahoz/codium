import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { ICourseRepository } from "@domain/repositories/course.repository.interface"
import { Course, type CourseStudent } from "@domain/entities/course.entity"
import type { CourseEntity } from "../entities/course.entity"
import type { CourseStudentEntity } from "../entities/course-student.entity"

@Injectable()
export class CourseRepository implements ICourseRepository {
  private readonly courseRepository: Repository<CourseEntity>
  private readonly courseStudentRepository: Repository<CourseStudentEntity>

  constructor(courseRepository: Repository<CourseEntity>, courseStudentRepository: Repository<CourseStudentEntity>) {
    this.courseRepository = courseRepository
    this.courseStudentRepository = courseStudentRepository
  }

  async create(course: Course): Promise<Course> {
    const entity = this.courseRepository.create(course)
    const saved = await this.courseRepository.save(entity)
    return new Course(saved)
  }

  async findById(id: string): Promise<Course | null> {
    const entity = await this.courseRepository.findOne({ where: { id } })
    return entity ? new Course(entity) : null
  }

  async findByProfessorId(professorId: string): Promise<Course[]> {
    const entities = await this.courseRepository
      .createQueryBuilder("course")
      .where(":professorId = ANY(course.professor_ids)", { professorId })
      .getMany()

    return entities.map((e) => new Course(e))
  }

  async findAll(): Promise<Course[]> {
    const entities = await this.courseRepository.find()
    return entities.map((e) => new Course(e))
  }

  async update(id: string, course: Partial<Course>): Promise<Course> {
    await this.courseRepository.update(id, course)
    const updated = await this.courseRepository.findOne({ where: { id } })
    return new Course(updated!)
  }

  async delete(id: string): Promise<void> {
    await this.courseRepository.delete(id)
  }

  async enrollStudent(courseStudent: CourseStudent): Promise<void> {
    const entity = this.courseStudentRepository.create(courseStudent)
    await this.courseStudentRepository.save(entity)
  }

  async unenrollStudent(courseId: string, studentId: string): Promise<void> {
    await this.courseStudentRepository.delete({ courseId, studentId })
  }

  async findStudentsByCourseId(courseId: string): Promise<string[]> {
    const entities = await this.courseStudentRepository.find({ where: { courseId } })
    return entities.map((e) => e.studentId)
  }

  async findCoursesByStudentId(studentId: string): Promise<Course[]> {
    const courseStudents = await this.courseStudentRepository.find({ where: { studentId } })
    const courseIds = courseStudents.map((cs) => cs.courseId)

    if (courseIds.length === 0) {
      return []
    }

    const entities = await this.courseRepository.findByIds(courseIds)
    return entities.map((e) => new Course(e))
  }
}
