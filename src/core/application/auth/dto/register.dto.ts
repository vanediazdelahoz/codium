import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "@core/domain/users/user.entity";

export class RegisterDto {
  @ApiProperty({
    example: "estudiante@universidad.edu",
    description: "Email del usuario",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    example: "password123",
    description: "Contraseña del usuario",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @ApiProperty({
    example: "Juan",
    description: "Nombre del usuario",
  })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty({
    example: "Pérez",
    description: "Apellido del usuario",
  })
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty({
    example: UserRole.STUDENT,
    enum: UserRole,
    description: "Rol del usuario",
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole
}
