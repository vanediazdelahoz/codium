import { IsString, IsNotEmpty, IsNumber, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateCourseDto {
  @ApiProperty({ example: "Desarrollo de Aplicaciones Backend" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: "NRC12345" })
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty({ example: "2025-1" })
  @IsString()
  @IsNotEmpty()
  period: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  group: number
}
