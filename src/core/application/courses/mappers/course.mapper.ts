import { Course } from '@core/domain/courses/course.entity';
import { CourseDto } from '../dto/course.dto';

export class CourseMapper {
  static toDto(entity: Course): CourseDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      period: entity.period,
      group: entity.group,
      professorIds: entity.professorIds,
    };
  }
}