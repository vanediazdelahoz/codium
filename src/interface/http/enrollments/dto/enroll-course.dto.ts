import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class EnrollCourseDto {
  @ApiProperty({ description: 'ID del curso a inscribir' })
  @IsString()
  courseId!: string
}
