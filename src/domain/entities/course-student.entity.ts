export class CourseStudent {
  courseId: string
  studentId: string
  enrolledAt: Date

  constructor(partial: Partial<CourseStudent>) {
    Object.assign(this, partial)
  }
}
