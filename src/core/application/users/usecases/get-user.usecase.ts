import { Injectable, NotFoundException } from "@nestjs/common"
import type { UserRepositoryPort } from "@core/domain/users/user.repository.port"
import type { UserDto } from "../dto/user.dto"
import { UserMapper } from "../mappers/user.mapper"

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return UserMapper.toDto(user)
  }
}
