import { Controller, Post } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { LoginUseCase } from "@core/application/users/usecases/login.usecase"
import type { RegisterUseCase } from "@core/application/users/usecases/register.usecase"
import type { LoginDto } from "@core/application/users/dto/login.dto"
import type { RegisterDto } from "@core/application/users/dto/register.dto"
import { Public } from "./decorators/public.decorator"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  async register(dto: RegisterDto) {
    return this.registerUseCase.execute(dto)
  }

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "Login successful" })
  async login(dto: LoginDto) {
    return this.loginUseCase.execute(dto)
  }
}
