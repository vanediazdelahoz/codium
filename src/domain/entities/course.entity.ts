export class Course {
  id: string
  name: string
  code: string // NRC
  period: string // 2025-1
  group: number
  professorIds: string[]
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<Course>) {
    Object.assign(this, partial)
    this.professorIds = partial.professorIds || []
  }

  addProfessor(professorId: string): void {
    if (!this.professorIds.includes(professorId)) {
      this.professorIds.push(professorId)
    }
  }

  removeProfessor(professorId: string): void {
    this.professorIds = this.professorIds.filter((id) => id !== professorId)
  }

  isProfessor(userId: string): boolean {
    return this.professorIds.includes(userId)
  }
}
