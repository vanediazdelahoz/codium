export enum UserRole {
  STUDENT = "STUDENT",
  PROFESSOR = "PROFESSOR",
  ADMIN = "ADMIN",
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

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
