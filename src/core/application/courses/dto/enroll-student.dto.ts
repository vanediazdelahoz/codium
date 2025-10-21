import { IsUUID, IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class EnrollStudentDto {
  @ApiProperty({ example: "uuid-del-estudiante" })
  @IsUUID()
  @IsNotEmpty()
  studentId: string
}
