import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EVALUATION_REPOSITORY, EvaluationRepositoryPort } from "@core/domain/evaluations/evaluation.repository.port";

@Injectable()
export class DeleteEvaluationUseCase {
  constructor(
    @Inject(EVALUATION_REPOSITORY)
    private readonly evaluationRepository: EvaluationRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const evaluation = await this.evaluationRepository.findById(id);

    if (!evaluation) {
      throw new NotFoundException("Evaluation not found");
    }

    await this.evaluationRepository.delete(id);
  }
}
