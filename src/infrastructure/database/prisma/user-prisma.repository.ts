import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UserRepositoryPort } from "@core/domain/users/user.repository.port";
import { User } from "@core/domain/users/user.entity";

@Injectable()
export class UserPrismaRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({ data: user });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(this.toDomain);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await this.prisma.user.update({ where: { id }, data });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private toDomain(prismaUser: any): User {
    return new User(prismaUser);
  }
}