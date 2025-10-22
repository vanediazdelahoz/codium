import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { BcryptService } from "@infrastructure/security/bcrypt.service";
import { JwtService as CustomJwtService } from "@infrastructure/security/jwt.service";
import { USER_REPOSITORY, UserRepositoryPort } from "@core/domain/users/user.repository.port";
import { LoginDto, LoginResponse } from "../dto/login.dto"; // CORREGIDO: DTOs importados de su archivo

@Injectable()
export class LoginUseCase {
  // CORREGIDO: El constructor ahora es más limpio y usa inyección de dependencias correctamente
  constructor(
    @Inject(USER_REPOSITORY) // Inyecta la implementación usando el token
    private readonly userRepository: UserRepositoryPort,
    private readonly bcryptService: BcryptService, // Inyecta el servicio de bcrypt
    private readonly jwtService: CustomJwtService, // Inyecta tu servicio de JWT personalizado
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // CORREGIDO: Se usa el BcryptService en lugar de la librería directamente
    const isPasswordValid = await this.bcryptService.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // CORREGIDO: Se usa el servicio personalizado para firmar el token
    const accessToken = await this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}