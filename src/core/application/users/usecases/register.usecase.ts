import { Injectable, ConflictException } from "@nestjs/common"
import type { UserRepositoryPort } from "@core/domain/users/user.repository.port"
import type { RegisterDto } from "../dto/register.dto"
import type { UserDto } from "../dto/user.dto"
import { UserMapper } from "../mappers/user.mapper"
import * as bcrypt from "bcrypt"

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(dto: RegisterDto): Promise<UserDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email)
    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const user = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
    })

    return UserMapper.toDto(user)
  }
}
