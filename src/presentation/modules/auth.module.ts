import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthController } from "../controllers/auth.controller"
import { LoginUseCase } from "@application/auth/login.usecase"
import { RegisterUseCase } from "@application/auth/register.usecase"
import { UserRepository } from "@infrastructure/database/repositories/user.repository"
import { UserEntity } from "@infrastructure/database/entities/user.entity"
import { USER_REPOSITORY } from "@domain/repositories/user.repository.interface"
import { JwtStrategy } from "@infrastructure/security/jwt.strategy"

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
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
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
