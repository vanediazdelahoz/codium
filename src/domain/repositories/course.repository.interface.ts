import type { Course, CourseStudent } from "../entities/course.entity"

export interface ICourseRepository {
  create(course: Course): Promise<Course>
  findById(id: string): Promise<Course | null>
  findByProfessorId(professorId: string): Promise<Course[]>
  findAll(): Promise<Course[]>
  update(id: string, course: Partial<Course>): Promise<Course>
  delete(id: string): Promise<void>

  enrollStudent(courseStudent: CourseStudent): Promise<void>
  unenrollStudent(courseId: string, studentId: string): Promise<void>
  findStudentsByCourseId(courseId: string): Promise<string[]>
  findCoursesByStudentId(studentId: string): Promise<Course[]>
}

export const COURSE_REPOSITORY = Symbol("COURSE_REPOSITORY")
