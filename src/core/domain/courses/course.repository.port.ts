import { Course, CourseStudent } from "./course.entity";
import { User } from '../users/user.entity';

export interface CourseRepositoryPort {
  create(course: Course): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
  findByProfessorId(professorId: string): Promise<Course[]>;
  findCoursesByStudentId(studentId: string): Promise<Course[]>;
  update(id: string, data: Partial<Course>): Promise<Course>;
  delete(id: string): Promise<void>;
  
  enrollStudent(enrollment: CourseStudent): Promise<void>;
  unenrollStudent(courseId: string, studentId: string): Promise<void>;
  isStudentEnrolled(courseId: string, studentId: string): Promise<boolean>;
  findStudentsByCourseId(courseId: string): Promise<User[]>;
}

export const COURSE_REPOSITORY = Symbol("COURSE_REPOSITORY");