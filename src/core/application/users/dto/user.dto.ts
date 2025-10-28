import type { UserRole } from "@core/domain/users/user.entity"

export class UserDto {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}
