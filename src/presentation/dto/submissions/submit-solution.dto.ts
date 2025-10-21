import { IsString, IsNotEmpty, IsEnum, IsUUID } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Language } from "@domain/entities/submission.entity"

export class SubmitSolutionDto {
  @ApiProperty({ example: "uuid-del-reto" })
  @IsUUID()
  @IsNotEmpty()
  challengeId: string

  @ApiProperty({ example: "uuid-del-curso" })
  @IsUUID()
  @IsNotEmpty()
  courseId: string

  @ApiProperty({ example: "def solution(arr):\n    return sum(arr)" })
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty({ enum: Language, example: Language.PYTHON })
  @IsEnum(Language)
  language: Language
}
