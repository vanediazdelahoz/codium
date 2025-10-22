import { Controller, Post, Body } from "@nestjs/common"; // Importar @Body
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
// CORREGIDO: Las rutas ahora apuntan a la carpeta 'auth'
import { LoginUseCase } from "@core/application/auth/usecases/login.usecase";
import { RegisterUseCase } from "@core/application/auth/usecases/register.usecase";
import { LoginDto } from "@core/application/auth/dto/login.dto";
import { RegisterDto } from "@core/application/auth/dto/register.dto";
import { Public } from "./decorators/public.decorator";

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
  async register(@Body() dto: RegisterDto) { // Usar @Body() para capturar los datos
    return this.registerUseCase.execute(dto);
  }

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "Login successful" })
  async login(@Body() dto: LoginDto) { // Usar @Body() para capturar los datos
    return this.loginUseCase.execute(dto);
  }
}