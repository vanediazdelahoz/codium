import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EVALUATION_REPOSITORY, EvaluationRepositoryPort } from "@core/domain/evaluations/evaluation.repository.port";

@Injectable()
export class RemoveChallengeFromEvaluationUseCase {
  constructor(
    @Inject(EVALUATION_REPOSITORY)
    private readonly evaluationRepository: EvaluationRepositoryPort,
  ) {}

  async execute(evaluationId: string, challengeId: string): Promise<void> {
    const evaluation = await this.evaluationRepository.findById(evaluationId);

    if (!evaluation) {
      throw new NotFoundException("Evaluation not found");
    }

    await this.evaluationRepository.removeChallengeFromEvaluation(evaluationId, challengeId);
  }
}
