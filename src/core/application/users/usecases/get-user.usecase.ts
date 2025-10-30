import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryPort } from "@core/domain/users/user.repository.port";
import { UserDto } from "../dto/user.dto";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? UserMapper.toDto(user) : null;
  }
}