import { IsString, IsNotEmpty, IsEnum, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
// CORREGIDO: La ruta ahora apunta a la ubicación correcta de la entidad Submission.
import { Language } from "@core/domain/submissions/submission.entity";

export class SubmitSolutionDto {
  @ApiProperty({ example: "uuid-del-reto" })
  @IsUUID()
  @IsNotEmpty()
  challengeId: string;

  @ApiProperty({ example: "uuid-del-curso" })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ example: "def solution(arr):\n    return sum(arr)" })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: Language, example: Language.PYTHON })
  @IsEnum(Language)
  language: Language;
}