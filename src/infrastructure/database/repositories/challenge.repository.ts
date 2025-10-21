import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { IChallengeRepository } from "@domain/repositories/challenge.repository.interface"
import { Challenge } from "@domain/entities/challenge.entity"
import type { ChallengeEntity } from "../entities/challenge.entity"

@Injectable()
export class ChallengeRepository implements IChallengeRepository {
  private readonly repository: Repository<ChallengeEntity>

  constructor(repository: Repository<ChallengeEntity>) {
    this.repository = repository
  }

  async create(challenge: Challenge): Promise<Challenge> {
    const entity = this.repository.create(challenge)
    const saved = await this.repository.save(entity)
    return new Challenge(saved)
  }

  async findById(id: string): Promise<Challenge | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity ? new Challenge(entity) : null
  }

  async findByCourseId(courseId: string): Promise<Challenge[]> {
    const entities = await this.repository.find({ where: { courseId } })
    return entities.map((e) => new Challenge(e))
  }

  async findAll(): Promise<Challenge[]> {
    const entities = await this.repository.find()
    return entities.map((e) => new Challenge(e))
  }

  async update(id: string, challenge: Partial<Challenge>): Promise<Challenge> {
    await this.repository.update(id, challenge)
    const updated = await this.repository.findOne({ where: { id } })
    return new Challenge(updated!)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}
