import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { LoginUseCase } from "@application/auth/login.usecase"
import type { RegisterUseCase } from "@application/auth/register.usecase"
import type { LoginDto } from "../dto/auth/login.dto"
import type { RegisterDto } from "../dto/auth/register.dto"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Iniciar sesión" })
  @ApiResponse({ status: 200, description: "Login exitoso" })
  @ApiResponse({ status: 401, description: "Credenciales inválidas" })
  async login(@Body() dto: LoginDto) {
    return await this.loginUseCase.execute(dto)
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registrar nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario creado exitosamente" })
  @ApiResponse({ status: 409, description: "El email ya está registrado" })
  async register(@Body() dto: RegisterDto) {
    const user = await this.registerUseCase.execute(dto)
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
