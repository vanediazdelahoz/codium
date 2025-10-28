import { IsString, IsEnum, IsArray, IsNumber, IsOptional, Min, Max } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { Difficulty, ChallengeStatus } from "@core/domain/challenges/challenge.entity"

export class UpdateChallengeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ enum: Difficulty })
  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @ApiPropertyOptional()
  @IsNumber()
  @Min(100)
  @Max(10000)
  @IsOptional()
  timeLimit?: number

  @ApiPropertyOptional()
  @IsNumber()
  @Min(64)
  @Max(1024)
  @IsOptional()
  memoryLimit?: number

  @ApiPropertyOptional({ enum: ChallengeStatus })
  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus
}
