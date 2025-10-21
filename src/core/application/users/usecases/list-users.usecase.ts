import { Injectable } from "@nestjs/common"
import type { UserRepositoryPort } from "@core/domain/users/user.repository.port"
import type { UserDto } from "../dto/user.dto"
import { UserMapper } from "../mappers/user.mapper"

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll()
    return UserMapper.toDtoList(users)
  }
}
