import { Entity, PrimaryColumn, CreateDateColumn } from "typeorm"

@Entity("course_students")
export class CourseStudentEntity {
  @PrimaryColumn({ name: "course_id" })
  courseId: string

  @PrimaryColumn({ name: "student_id" })
  studentId: string

  @CreateDateColumn({ name: "enrolled_at" })
  enrolledAt: Date
}
