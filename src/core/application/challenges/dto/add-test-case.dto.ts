import { IsString, IsBoolean, IsNumber, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class AddTestCaseDto {
  @ApiProperty({ example: "[2,7,11,15]\n9" })
  @IsString()
  input: string

  @ApiProperty({ example: "[0,1]" })
  @IsString()
  expectedOutput: string

  @ApiProperty({ example: false })
  @IsBoolean()
  isHidden: boolean

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  points: number
}
