import { Inject, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { SUBMISSION_REPOSITORY, SubmissionRepositoryPort } from "@core/domain/submissions/submission.repository.port";
import { SubmissionDto } from "../dto/submission.dto";
import { SubmissionMapper } from "../mappers/submission.mapper";
import { UserRole } from "@core/domain/users/user.entity"; // <-- Importación que faltaba

@Injectable()
export class GetSubmissionUseCase {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissionRepository: SubmissionRepositoryPort,
  ) {}

  async execute(id: string, userId: string, userRole: UserRole): Promise<SubmissionDto> {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) throw new NotFoundException("Submission no encontrado");

    // Lógica de autorización: solo el dueño o un admin pueden ver el submission
    if (submission.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException("No tienes permiso para ver este envío.");
    }

    return SubmissionMapper.toDto(submission);
  }
}