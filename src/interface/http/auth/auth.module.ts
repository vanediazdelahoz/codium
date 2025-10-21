import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthController } from "./auth.controller"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { LoginUseCase } from "@core/application/users/usecases/login.usecase"
import { RegisterUseCase } from "@core/application/users/usecases/register.usecase"
import { USER_REPOSITORY } from "@core/application/users/tokens"
import { UserPrismaRepository } from "@infrastructure/users/prisma/user-prisma.repository"
import { PrismaService } from "@infrastructure/database/prisma.service"
import { JwtService as CustomJwtService } from "@infrastructure/security/jwt.service"
import { BcryptService } from "@infrastructure/security/bcrypt.service"

@Module({
  imports: [
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
    JwtStrategy,
    LoginUseCase,
    RegisterUseCase,
    CustomJwtService,
    BcryptService,
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
