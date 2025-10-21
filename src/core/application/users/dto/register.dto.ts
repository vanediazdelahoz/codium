import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator"
import { UserRole } from "@core/domain/users/user.entity"

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsEnum(UserRole)
  role: UserRole = UserRole.STUDENT
}
