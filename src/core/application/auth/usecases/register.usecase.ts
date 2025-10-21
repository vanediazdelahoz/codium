import { Injectable, ConflictException } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import type { IUserRepository } from "@domain/repositories/user.repository.interface"
import { User, UserRole } from "@domain/entities/user.entity"

export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: UserRole
}

@Injectable()
export class RegisterUseCase {
  private readonly userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(dto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email)

    if (existingUser) {
      throw new ConflictException("El email ya está registrado")
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const user = new User({
      id: uuidv4(),
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role || UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return await this.userRepository.create(user)
  }
}
