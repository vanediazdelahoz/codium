import { IsString, IsNotEmpty, IsEnum, IsArray, IsNumber, Min, IsUUID } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Difficulty } from "@domain/entities/challenge.entity"

export class CreateChallengeDto {
  @ApiProperty({ example: "Two Sum" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: "Dado un arreglo de enteros y un target..." })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ enum: Difficulty, example: Difficulty.EASY })
  @IsEnum(Difficulty)
  difficulty: Difficulty

  @ApiProperty({ example: ["arrays", "hashmap"] })
  @IsArray()
  @IsString({ each: true })
  tags: string[]

  @ApiProperty({ example: 5000, description: "Límite de tiempo en ms" })
  @IsNumber()
  @Min(100)
  timeLimit: number

  @ApiProperty({ example: 256, description: "Límite de memoria en MB" })
  @IsNumber()
  @Min(64)
  memoryLimit: number

  @ApiProperty({ example: "uuid-del-curso" })
  @IsUUID()
  @IsNotEmpty()
  courseId: string
}
