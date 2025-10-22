import { Controller, Get, Post, Param, Body } from "@nestjs/common"; // Añadir Body
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { SubmitSolutionUseCase } from "@core/application/submissions/usecases/submit-solution.usecase";
import { GetSubmissionUseCase } from "@core/application/submissions/usecases/get-submission.usecase";
import { ListUserSubmissionsUseCase } from "@core/application/submissions/usecases/list-user-submissions.usecase";
import { SubmitSolutionDto } from "@core/application/submissions/dto/submit-solution.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("submissions")
@ApiBearerAuth()
@Controller("submissions")
export class SubmissionsController {
  constructor(
    private readonly submitSolutionUseCase: SubmitSolutionUseCase,
    private readonly getSubmissionUseCase: GetSubmissionUseCase,
    private readonly listUserSubmissionsUseCase: ListUserSubmissionsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Submit a solution" })
  async submit(@Body() dto: SubmitSolutionDto, @CurrentUser() user: any) {
    return this.submitSolutionUseCase.execute(dto, user.id);
  }

  @Get('my-submissions')
  @ApiOperation({ summary: 'Get my submissions' })
  async mySubmissions(@CurrentUser() user: any) {
    return this.listUserSubmissionsUseCase.execute(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get submission by ID" })
  async get(@Param('id') id: string, @CurrentUser() user: any) {
    // CORREGIDO: Se pasan los 3 argumentos requeridos por el caso de uso
    return this.getSubmissionUseCase.execute(id, user.id, user.role);
  }
}