import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EVALUATION_REPOSITORY, EvaluationRepositoryPort } from "@core/domain/evaluations/evaluation.repository.port";
import { AddChallengeToEvaluationDto } from "../dto/create-evaluation.dto";

@Injectable()
export class AddChallengeToEvaluationUseCase {
  constructor(
    @Inject(EVALUATION_REPOSITORY)
    private readonly evaluationRepository: EvaluationRepositoryPort,
  ) {}

  async execute(evaluationId: string, dto: AddChallengeToEvaluationDto): Promise<void> {
    const evaluation = await this.evaluationRepository.findById(evaluationId);

    if (!evaluation) {
      throw new NotFoundException("Evaluation not found");
    }

    await this.evaluationRepository.addChallengeToEvaluation(evaluationId, dto.challengeId, dto.order);
  }
}
