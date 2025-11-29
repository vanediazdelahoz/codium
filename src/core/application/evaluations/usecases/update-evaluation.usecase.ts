import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EVALUATION_REPOSITORY, EvaluationRepositoryPort } from "@core/domain/evaluations/evaluation.repository.port";
import { EvaluationDto } from "../dto/evaluation.dto";
import { EvaluationMapper } from "../mappers/evaluation.mapper";
import { UpdateEvaluationDto } from "../dto/create-evaluation.dto";

@Injectable()
export class UpdateEvaluationUseCase {
  constructor(
    @Inject(EVALUATION_REPOSITORY)
    private readonly evaluationRepository: EvaluationRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateEvaluationDto): Promise<EvaluationDto> {
    const evaluation = await this.evaluationRepository.findById(id);

    if (!evaluation) {
      throw new NotFoundException("Evaluation not found");
    }

    const updated = await this.evaluationRepository.update(id, {
      name: dto.name || evaluation.name,
      description: dto.description || evaluation.description,
      status: dto.status || evaluation.status,
      startDate: dto.startDate ? new Date(dto.startDate) : evaluation.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : evaluation.endDate,
      updatedAt: new Date(),
    } as any);

    return EvaluationMapper.toDto(updated);
  }
}
