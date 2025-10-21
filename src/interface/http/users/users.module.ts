import { Module } from "@nestjs/common"
import { UsersController } from "./users.controller"
import { GetUserUseCase } from "@core/application/users/usecases/get-user.usecase"
import { ListUsersUseCase } from "@core/application/users/usecases/list-users.usecase"
import { USER_REPOSITORY } from "@core/application/users/tokens"
import { UserPrismaRepository } from "@infrastructure/users/prisma/user-prisma.repository"
import { PrismaService } from "@infrastructure/database/prisma.service"

@Module({
  controllers: [UsersController],
  providers: [
    GetUserUseCase,
    ListUsersUseCase,
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
})
export class UsersModule {}
