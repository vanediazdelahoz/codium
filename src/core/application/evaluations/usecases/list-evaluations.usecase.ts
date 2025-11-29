import { Inject, Injectable } from "@nestjs/common";
import { EVALUATION_REPOSITORY, EvaluationRepositoryPort } from "@core/domain/evaluations/evaluation.repository.port";
import { EvaluationDto } from "../dto/evaluation.dto";
import { EvaluationMapper } from "../mappers/evaluation.mapper";

@Injectable()
export class ListEvaluationsUseCase {
  constructor(
    @Inject(EVALUATION_REPOSITORY)
    private readonly evaluationRepository: EvaluationRepositoryPort,
  ) {}

  async execute(courseId?: string): Promise<EvaluationDto[]> {
    let evaluations;

    if (courseId) {
      evaluations = await this.evaluationRepository.findByCourseId(courseId);
    } else {
      evaluations = await this.evaluationRepository.findAll();
    }

    return EvaluationMapper.toDtoArray(evaluations);
  }
}
