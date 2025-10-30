// src/interface/http/users/users.module.ts

import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";

// Casos de Uso
import { CreateUserUseCase } from "@core/application/users/usecases/create-user.usecase";
import { GetUserUseCase } from "@core/application/users/usecases/get-user.usecase";
import { ListUsersUseCase } from "@core/application/users/usecases/list-users.usecase";

// Dependencias
import { USER_REPOSITORY } from "@core/domain/users/user.repository.port";
import { UserPrismaRepository } from "@infrastructure/database/prisma/user-prisma.repository";
import { PrismaService } from "@infrastructure/database/prisma.service";
import { BcryptService } from "@infrastructure/security/bcrypt.service"; // <-- AÑADIDO

@Module({
  controllers: [UsersController],
  providers: [
    // Casos de Uso
    CreateUserUseCase, // <-- AÑADIDO
    GetUserUseCase,
    ListUsersUseCase,

    // Dependencias
    PrismaService,
    BcryptService, // <-- AÑADIDO: CreateUserUseCase lo necesita
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}