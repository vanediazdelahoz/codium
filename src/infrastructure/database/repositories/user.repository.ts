import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { IUserRepository } from "@domain/repositories/user.repository.interface"
import { User } from "@domain/entities/user.entity"
import type { UserEntity } from "../entities/user.entity"

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly repository: Repository<UserEntity>

  constructor(repository: Repository<UserEntity>) {
    this.repository = repository
  }

  async create(user: User): Promise<User> {
    const entity = this.repository.create(user)
    const saved = await this.repository.save(entity)
    return new User(saved)
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity ? new User(entity) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } })
    return entity ? new User(entity) : null
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find()
    return entities.map((e) => new User(e))
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.repository.update(id, user)
    const updated = await this.repository.findOne({ where: { id } })
    return new User(updated!)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}
