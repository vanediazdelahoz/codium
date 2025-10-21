import { Controller, Get, Post, Patch, Param, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import type { CreateChallengeUseCase } from "@core/application/challenges/usecases/create-challenge.usecase"
import type { UpdateChallengeUseCase } from "@core/application/challenges/usecases/update-challenge.usecase"
import type { ListChallengesUseCase } from "@core/application/challenges/usecases/list-challenges.usecase"
import type { GetChallengeUseCase } from "@core/application/challenges/usecases/get-challenge.usecase"
import type { CreateChallengeDto } from "@core/application/challenges/dto/create-challenge.dto"
import type { UpdateChallengeDto } from "@core/application/challenges/dto/update-challenge.dto"
import { Roles } from "../auth/decorators/roles.decorator"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { UserRole } from "@core/domain/users/user.entity"

@ApiTags("challenges")
@ApiBearerAuth()
@Controller("challenges")
export class ChallengesController {
  constructor(
    private readonly createChallengeUseCase: CreateChallengeUseCase,
    private readonly updateChallengeUseCase: UpdateChallengeUseCase,
    private readonly listChallengesUseCase: ListChallengesUseCase,
    private readonly getChallengeUseCase: GetChallengeUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Create a new challenge" })
  async create(dto: CreateChallengeDto, @CurrentUser() user: any) {
    return this.createChallengeUseCase.execute(dto, user.id, user.role)
  }

  @Get()
  @ApiOperation({ summary: "List all challenges" })
  async list(@CurrentUser() user: any, @Query('courseId') courseId?: string) {
    return this.listChallengesUseCase.execute(user.role, courseId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get challenge by ID" })
  async get(@Param('id') id: string, @CurrentUser() user: any) {
    return this.getChallengeUseCase.execute(id, user.role)
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Update challenge" })
  async update(@Param('id') id: string, dto: UpdateChallengeDto, @CurrentUser() user: any) {
    return this.updateChallengeUseCase.execute(id, dto, user.role)
  }
}
