import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  period: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  group: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  professorId: string;
}