import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoginUseCase } from "@core/application/auth/usecases/login.usecase";
import { RegisterUseCase } from "@core/application/auth/usecases/register.usecase";
import { USER_REPOSITORY } from "@core/domain/users/user.repository.port";
import { UserPrismaRepository } from "@infrastructure/database/prisma/user-prisma.repository";
import { PrismaService } from "@infrastructure/database/prisma.service";
import { BcryptService } from "@infrastructure/security/bcrypt.service";
import { JwtService as CustomJwtService } from "@infrastructure/security/jwt.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
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
    PrismaService,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}