import type { Course } from "./course.entity"

export interface CourseRepositoryPort {
  create(course: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course>
  findById(id: string): Promise<Course | null>
  findByCode(code: string): Promise<Course | null>
  findAll(): Promise<Course[]>
  findByProfessorId(professorId: string): Promise<Course[]>
  findByStudentId(studentId: string): Promise<Course[]>
  update(id: string, data: Partial<Course>): Promise<Course>
  delete(id: string): Promise<void>
  enrollStudent(courseId: string, studentId: string): Promise<void>
  unenrollStudent(courseId: string, studentId: string): Promise<void>
  getStudents(courseId: string): Promise<string[]>
}

export const COURSE_REPOSITORY = Symbol("COURSE_REPOSITORY")
