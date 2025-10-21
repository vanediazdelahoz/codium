import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { ISubmissionRepository } from "@domain/repositories/submission.repository.interface"
import { Submission } from "@domain/entities/submission.entity"
import type { SubmissionEntity } from "../entities/submission.entity"

@Injectable()
export class SubmissionRepository implements ISubmissionRepository {
  private readonly repository: Repository<SubmissionEntity>

  constructor(repository: Repository<SubmissionEntity>) {
    this.repository = repository
  }

  async create(submission: Submission): Promise<Submission> {
    const entity = this.repository.create(submission)
    const saved = await this.repository.save(entity)
    return new Submission(saved)
  }

  async findById(id: string): Promise<Submission | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity ? new Submission(entity) : null
  }

  async findByUserId(userId: string): Promise<Submission[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    })
    return entities.map((e) => new Submission(e))
  }

  async findByChallengeId(challengeId: string): Promise<Submission[]> {
    const entities = await this.repository.find({
      where: { challengeId },
      order: { createdAt: "DESC" },
    })
    return entities.map((e) => new Submission(e))
  }

  async findByCourseId(courseId: string): Promise<Submission[]> {
    const entities = await this.repository.find({
      where: { courseId },
      order: { createdAt: "DESC" },
    })
    return entities.map((e) => new Submission(e))
  }

  async update(id: string, submission: Partial<Submission>): Promise<Submission> {
    await this.repository.update(id, submission)
    const updated = await this.repository.findOne({ where: { id } })
    return new Submission(updated!)
  }

  async findBestSubmissions(challengeId: string): Promise<Submission[]> {
    const entities = await this.repository
      .createQueryBuilder("submission")
      .where("submission.challengeId = :challengeId", { challengeId })
      .andWhere("submission.status = :status", { status: "ACCEPTED" })
      .orderBy("submission.score", "DESC")
      .addOrderBy("submission.timeMsTotal", "ASC")
      .limit(100)
      .getMany()

    return entities.map((e) => new Submission(e))
  }
}
