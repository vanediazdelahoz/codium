import { Course, CourseStudent } from "./course.entity";
import { User } from '../users/user.entity';

export interface CourseRepositoryPort {
  create(course: Course): Promise<Course>; // Acepta la entidad completa
  findById(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
  findByProfessorId(professorId: string): Promise<Course[]>;
  findCoursesByStudentId(studentId: string): Promise<Course[]>; // Corregido
  update(id: string, data: Partial<Course>): Promise<Course>;
  delete(id: string): Promise<void>;
  
  // Métodos de inscripción
  enrollStudent(enrollment: CourseStudent): Promise<void>; // Acepta la entidad de unión
  unenrollStudent(courseId: string, studentId: string): Promise<void>;
  isStudentEnrolled(courseId: string, studentId: string): Promise<boolean>; // Método que faltaba
  findStudentsByCourseId(courseId: string): Promise<User[]>; // Debe devolver usuarios, no IDs
}

export const COURSE_REPOSITORY = Symbol("COURSE_REPOSITORY");