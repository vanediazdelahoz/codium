import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { LoginUseCase } from "@core/application/auth/usecases/login.usecase";
import { RegisterUseCase } from "@core/application/auth/usecases/register.usecase";
import { LoginDto } from "@core/application/auth/dto/login.dto";
import { RegisterDto } from "@core/application/auth/dto/register.dto";
import { Public } from "./decorators/public.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";

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
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "Login successful" })
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current authenticated user info" })
  @ApiResponse({ status: 200, description: "Current user data" })
  async getCurrentUser(@CurrentUser() user: any) {
    return user;
  }
}