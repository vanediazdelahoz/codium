export enum UserRole {
  STUDENT = "STUDENT",
  PROFESSOR = "PROFESSOR",
  ADMIN = "ADMIN",
}

export class User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<User>) {
    Object.assign(this, partial)
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN
  }

  isProfessor(): boolean {
    return this.role === UserRole.PROFESSOR
  }

  isStudent(): boolean {
    return this.role === UserRole.STUDENT
  }

  canManageChallenges(): boolean {
    return this.isAdmin() || this.isProfessor()
  }
}
