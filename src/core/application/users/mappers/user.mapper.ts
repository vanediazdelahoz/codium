import type { User } from "@core/domain/users/user.entity"
import type { UserDto } from "../dto/user.dto"

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  static toDtoList(users: User[]): UserDto[] {
    return users.map((user) => this.toDto(user))
  }
}
