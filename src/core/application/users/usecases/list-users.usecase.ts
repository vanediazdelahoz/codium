import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryPort } from "@core/domain/users/user.repository.port";
import { UserDto } from "../dto/user.dto";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => UserMapper.toDto(user));
  }
}