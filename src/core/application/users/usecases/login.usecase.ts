import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { UserRepositoryPort } from "@core/domain/users/user.repository.port"
import type { LoginDto } from "../dto/login.dto"
import * as bcrypt from "bcrypt"

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

@Injectable()
export class LoginUseCase {
  private readonly userRepository: UserRepositoryPort
  private readonly jwtService: JwtService

  constructor(userRepository: UserRepositoryPort, jwtService: JwtService) {
    this.userRepository = userRepository
    this.jwtService = jwtService
  }

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(dto.email)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }
  }
}
