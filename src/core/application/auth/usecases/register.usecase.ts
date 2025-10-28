import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { BcryptService } from '@infrastructure/security/bcrypt.service';
import { USER_REPOSITORY, UserRepositoryPort } from '@core/domain/users/user.repository.port';
import { RegisterDto } from '../dto/register.dto';
import { UserDto } from '../../users/dto/user.dto';
import { UserMapper } from '../../users/mappers/user.mapper';
import { User, UserRole } from '@core/domain/users/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(dto: RegisterDto): Promise<UserDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await this.bcryptService.hash(dto.password);

    const newUser = new User({
      id: uuidv4(),
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role || UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdUser = await this.userRepository.create(newUser);

    return UserMapper.toDto(createdUser);
  }
}