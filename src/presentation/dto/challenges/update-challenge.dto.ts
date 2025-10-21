import { IsString, IsEnum, IsArray, IsNumber, Min, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Difficulty, ChallengeStatus } from "@domain/entities/challenge.entity"

export class UpdateChallengeDto {
  @ApiProperty({ example: "Two Sum", required: false })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ example: "Descripción actualizada...", required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ enum: Difficulty, required: false })
  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty

  @ApiProperty({ example: ["arrays", "hashmap"], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @ApiProperty({ example: 5000, required: false })
  @IsNumber()
  @Min(100)
  @IsOptional()
  timeLimit?: number

  @ApiProperty({ example: 256, required: false })
  @IsNumber()
  @Min(64)
  @IsOptional()
  memoryLimit?: number

  @ApiProperty({ enum: ChallengeStatus, required: false })
  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus
}
