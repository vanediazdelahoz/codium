import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EVALUATION_REPOSITORY, EvaluationRepositoryPort } from "@core/domain/evaluations/evaluation.repository.port";
import { EvaluationDto } from "../dto/evaluation.dto";
import { EvaluationMapper } from "../mappers/evaluation.mapper";

@Injectable()
export class GetEvaluationUseCase {
  constructor(
    @Inject(EVALUATION_REPOSITORY)
    private readonly evaluationRepository: EvaluationRepositoryPort,
  ) {}

  async execute(id: string): Promise<EvaluationDto> {
    const evaluation = await this.evaluationRepository.findById(id);

    if (!evaluation) {
      throw new NotFoundException("Evaluation not found");
    }

    return EvaluationMapper.toDto(evaluation);
  }
}
