export class Course {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly period: string,
    public readonly group: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  getDisplayName(): string {
    return `${this.name} - ${this.code} (Grupo ${this.group})`
  }
}
