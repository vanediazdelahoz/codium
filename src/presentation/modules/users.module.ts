import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "@infrastructure/database/entities/user.entity"
import { UserRepository } from "@infrastructure/database/repositories/user.repository"
import { USER_REPOSITORY } from "@domain/repositories/user.repository.interface"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
