import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { v4 as uuidv4 } from "uuid"
import type { IChallengeRepository } from "@domain/repositories/challenge.repository.interface"
import type { ITestCaseRepository } from "@domain/repositories/test-case.repository.interface"
import { TestCase } from "@domain/entities/test-case.entity"

export interface AddTestCaseDto {
  input: string
  expectedOutput: string
  isHidden: boolean
  points: number
}

@Injectable()
export class AddTestCaseUseCase {
  private readonly challengeRepository: IChallengeRepository
  private readonly testCaseRepository: ITestCaseRepository

  constructor(challengeRepository: IChallengeRepository, testCaseRepository: ITestCaseRepository) {
    this.challengeRepository = challengeRepository
    this.testCaseRepository = testCaseRepository
  }

  async execute(challengeId: string, dto: AddTestCaseDto, userId: string, userRole: string): Promise<TestCase> {
    const challenge = await this.challengeRepository.findById(challengeId)

    if (!challenge) {
      throw new NotFoundException("Reto no encontrado")
    }

    if (userRole !== "ADMIN" && challenge.createdBy !== userId) {
      throw new ForbiddenException("No tienes permiso para agregar casos de prueba a este reto")
    }

    const existingCases = await this.testCaseRepository.findByChallengeId(challengeId)
    const nextOrder = existingCases.length

    const testCase = new TestCase({
      id: uuidv4(),
      challengeId,
      input: dto.input,
      expectedOutput: dto.expectedOutput,
      isHidden: dto.isHidden,
      points: dto.points,
      order: nextOrder,
      createdAt: new Date(),
    })

    return await this.testCaseRepository.create(testCase)
  }
}
