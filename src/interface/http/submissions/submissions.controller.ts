import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";
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
  @ApiBody({ type: SubmitSolutionDto })
  @ApiResponse({ status: 201, description: 'Submission enqueued' })
  async submit(@Body() dto: SubmitSolutionDto, @CurrentUser() user: any) {
    return this.submitSolutionUseCase.execute(dto, user.id);
  }

  @Get('my-submissions')
  @ApiOperation({ summary: 'Get my submissions' })
  @ApiResponse({ status: 200, description: 'List of submissions for current user' })
  async mySubmissions(@CurrentUser() user: any) {
    return this.listUserSubmissionsUseCase.execute(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get submission by ID" })
  @ApiResponse({ status: 200, description: 'Submission detail' })
  async get(@Param('id') id: string, @CurrentUser() user: any) {
    return this.getSubmissionUseCase.execute(id, user.id, user.role);
  }
}