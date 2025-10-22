import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";

// --- CORE ---
// CORREGIDO: La ruta ahora apunta al módulo correcto 'auth'
import { LoginUseCase } from "@core/application/auth/usecases/login.usecase";
import { RegisterUseCase } from "@core/application/auth/usecases/register.usecase";
import { USER_REPOSITORY } from "@core/domain/users/user.repository.port"; // Usaremos el token como port

// --- INFRASTRUCTURE ---
import { UserPrismaRepository } from "@infrastructure/database/prisma/user-prisma.repository";
import { PrismaService } from "@infrastructure/database/prisma.service";
import { JwtService as CustomJwtService } from "@infrastructure/security/jwt.service";
import { BcryptService } from "@infrastructure/security/bcrypt.service";

// --- INTERFACE ---
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    ConfigModule, // Asegúrate que ConfigModule esté importado para que el useFactory funcione
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRATION", "7d"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    LoginUseCase,
    RegisterUseCase,
    // Infrastructure Services
    PrismaService,
    BcryptService,
    CustomJwtService,
    // Interface Adapters
    JwtStrategy,
    // Repository Port Implementation
    {
      provide: USER_REPOSITORY, // El token que representa la interfaz
      useClass: UserPrismaRepository, // La clase concreta que la implementa
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}