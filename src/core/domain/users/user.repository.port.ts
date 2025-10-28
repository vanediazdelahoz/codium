import { User } from "./user.entity";

export interface UserRepositoryPort {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");