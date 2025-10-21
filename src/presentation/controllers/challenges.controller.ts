import { Controller, Get, Post, Put, Delete, Param, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { RolesGuard } from "../guards/roles.guard"
import { Roles } from "../decorators/roles.decorator"
import { CurrentUser } from "../decorators/current-user.decorator"
import { UserRole } from "@domain/entities/user.entity"
import type { CreateChallengeUseCase } from "@application/challenges/create-challenge.usecase"
import type { UpdateChallengeUseCase } from "@application/challenges/update-challenge.usecase"
import type { ListChallengesUseCase } from "@application/challenges/list-challenges.usecase"
import type { GetChallengeUseCase } from "@application/challenges/get-challenge.usecase"
import type { DeleteChallengeUseCase } from "@application/challenges/delete-challenge.usecase"
import type { AddTestCaseUseCase } from "@application/challenges/add-test-case.usecase"
import type { CreateChallengeDto } from "../dto/challenges/create-challenge.dto"
import type { UpdateChallengeDto } from "../dto/challenges/update-challenge.dto"
import type { AddTestCaseDto } from "../dto/challenges/add-test-case.dto"

@ApiTags("challenges")
@Controller("challenges")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ChallengesController {
  constructor(
    private readonly createChallengeUseCase: CreateChallengeUseCase,
    private readonly updateChallengeUseCase: UpdateChallengeUseCase,
    private readonly listChallengesUseCase: ListChallengesUseCase,
    private readonly getChallengeUseCase: GetChallengeUseCase,
    private readonly deleteChallengeUseCase: DeleteChallengeUseCase,
    private readonly addTestCaseUseCase: AddTestCaseUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Crear un nuevo reto" })
  @ApiResponse({ status: 201, description: "Reto creado exitosamente" })
  async create(dto: CreateChallengeDto, @CurrentUser() user: any) {
    return await this.createChallengeUseCase.execute(
      {
        ...dto,
        createdBy: user.id,
      },
      user.role,
    )
  }

  @Get()
  @ApiOperation({ summary: "Listar todos los retos" })
  @ApiResponse({ status: 200, description: "Lista de retos" })
  async findAll(@Query("courseId") courseId: string, @CurrentUser() user: any) {
    return await this.listChallengesUseCase.execute(courseId, user.role)
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un reto por ID" })
  @ApiResponse({ status: 200, description: "Reto encontrado" })
  @ApiResponse({ status: 404, description: "Reto no encontrado" })
  async findOne(@Param("id") id: string, @CurrentUser() user: any) {
    return await this.getChallengeUseCase.execute(id, user.role)
  }

  @Put(":id")
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Actualizar un reto" })
  @ApiResponse({ status: 200, description: "Reto actualizado" })
  async update(@Param("id") id: string, dto: UpdateChallengeDto, @CurrentUser() user: any) {
    return await this.updateChallengeUseCase.execute(id, dto, user.id, user.role)
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Eliminar un reto" })
  @ApiResponse({ status: 200, description: "Reto eliminado" })
  async remove(@Param("id") id: string, @CurrentUser() user: any) {
    await this.deleteChallengeUseCase.execute(id, user.id, user.role)
    return { message: "Reto eliminado exitosamente" }
  }

  @Post(":id/test-cases")
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Agregar caso de prueba a un reto" })
  @ApiResponse({ status: 201, description: "Caso de prueba agregado" })
  async addTestCase(@Param("id") id: string, dto: AddTestCaseDto, @CurrentUser() user: any) {
    return await this.addTestCaseUseCase.execute(id, dto, user.id, user.role)
  }
}
