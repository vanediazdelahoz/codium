import { Inject, Injectable, ConflictException } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryPort } from "@core/domain/users/user.repository.port";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserDto } from "../dto/user.dto";
import { UserMapper } from "../mappers/user.mapper";
import { User } from "@core/domain/users/user.entity"; // Importar la entidad
import { v4 as uuidv4 } from 'uuid'; // Importar para IDs
import { BcryptService } from "@infrastructure/security/bcrypt.service";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly bcryptService: BcryptService, // Inyectar servicio de hashing
  ) {}

  async execute(dto: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await this.bcryptService.hash(dto.password);

    const newUser = new User({
      id: uuidv4(),
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdUser = await this.userRepository.create(newUser);
    return UserMapper.toDto(createdUser);
  }
}