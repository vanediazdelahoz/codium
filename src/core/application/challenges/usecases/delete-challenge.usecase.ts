import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { IChallengeRepository } from "@domain/repositories/challenge.repository.interface"
import type { ITestCaseRepository } from "@domain/repositories/test-case.repository.interface"

@Injectable()
export class DeleteChallengeUseCase {
  private readonly challengeRepository: IChallengeRepository
  private readonly testCaseRepository: ITestCaseRepository

  constructor(challengeRepository: IChallengeRepository, testCaseRepository: ITestCaseRepository) {
    this.challengeRepository = challengeRepository
    this.testCaseRepository = testCaseRepository
  }

  async execute(id: string, userId: string, userRole: string): Promise<void> {
    const challenge = await this.challengeRepository.findById(id)

    if (!challenge) {
      throw new NotFoundException("Reto no encontrado")
    }

    if (userRole !== "ADMIN" && challenge.createdBy !== userId) {
      throw new ForbiddenException("No tienes permiso para eliminar este reto")
    }

    // Eliminar casos de prueba asociados
    await this.testCaseRepository.deleteAllByChallengeId(id)

    // Eliminar el reto
    await this.challengeRepository.delete(id)
  }
}
