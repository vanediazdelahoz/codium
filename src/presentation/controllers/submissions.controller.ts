import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { CurrentUser } from "../decorators/current-user.decorator"
import type { SubmitSolutionUseCase } from "@application/submissions/submit-solution.usecase"
import type { GetSubmissionUseCase } from "@application/submissions/get-submission.usecase"
import type { ListUserSubmissionsUseCase } from "@application/submissions/list-user-submissions.usecase"
import type { SubmitSolutionDto } from "../dto/submissions/submit-solution.dto"

@ApiTags("submissions")
@Controller("submissions")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubmissionsController {
  constructor(
    private readonly submitSolutionUseCase: SubmitSolutionUseCase,
    private readonly getSubmissionUseCase: GetSubmissionUseCase,
    private readonly listUserSubmissionsUseCase: ListUserSubmissionsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Enviar una solución" })
  @ApiResponse({ status: 201, description: "Solución enviada y en cola de procesamiento" })
  async submit(@Body() dto: SubmitSolutionDto, @CurrentUser() user: any) {
    return await this.submitSolutionUseCase.execute({
      ...dto,
      userId: user.id,
    })
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener resultado de un submission" })
  @ApiResponse({ status: 200, description: "Submission encontrado" })
  async findOne(@Param("id") id: string) {
    return await this.getSubmissionUseCase.execute(id)
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "Listar submissions de un usuario" })
  @ApiResponse({ status: 200, description: "Lista de submissions" })
  async findByUser(@Param("userId") userId: string) {
    return await this.listUserSubmissionsUseCase.execute(userId)
  }
}
