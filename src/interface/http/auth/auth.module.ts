import { Module, forwardRef } from "@nestjs/common"; // <-- AÑADIR forwardRef
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoginUseCase } from "@core/application/auth/usecases/login.usecase";
import { RegisterUseCase } from "@core/application/auth/usecases/register.usecase";
import { BcryptService } from "@infrastructure/security/bcrypt.service";
import { JwtService as CustomJwtService } from "@infrastructure/security/jwt.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    // CORREGIDO: Se usa forwardRef para romper la dependencia circular
    forwardRef(() => UsersModule),
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
    LoginUseCase,
    RegisterUseCase,
    BcryptService,
    CustomJwtService,
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}