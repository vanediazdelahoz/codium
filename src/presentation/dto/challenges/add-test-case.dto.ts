import { IsString, IsNotEmpty, IsBoolean, IsNumber, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class AddTestCaseDto {
  @ApiProperty({ example: "5\n1 2 3 4 5" })
  @IsString()
  @IsNotEmpty()
  input: string

  @ApiProperty({ example: "15" })
  @IsString()
  @IsNotEmpty()
  expectedOutput: string

  @ApiProperty({ example: false, description: "Si es true, el estudiante no verá este caso" })
  @IsBoolean()
  isHidden: boolean

  @ApiProperty({ example: 10, description: "Puntos que vale este caso de prueba" })
  @IsNumber()
  @Min(1)
  points: number
}
