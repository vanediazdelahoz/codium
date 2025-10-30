interface CourseProps {
  id: string;
  name: string;
  code: string;
  period: string;
  group: number;
  professorIds: string[];
  studentIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class Course {
  public readonly id: string;
  public readonly name: string;
  public readonly code: string;
  public readonly period: string;
  public readonly group: number;
  public readonly professorIds: string[];
  public readonly studentIds?: string[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: CourseProps) {
    this.id = props.id;
    this.name = props.name;
    this.code = props.code;
    this.period = props.period;
    this.group = props.group;
    this.professorIds = props.professorIds;
    this.studentIds = props.studentIds;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isProfessor(userId: string): boolean {
    return this.professorIds.includes(userId);
  }
}

interface CourseStudentProps {
    courseId: string;
    studentId: string;
    enrolledAt: Date;
}

export class CourseStudent {
    public readonly courseId: string;
    public readonly studentId: string;
    public readonly enrolledAt: Date;

    constructor(props: CourseStudentProps) {
        this.courseId = props.courseId;
        this.studentId = props.studentId;
        this.enrolledAt = props.enrolledAt;
    }
}