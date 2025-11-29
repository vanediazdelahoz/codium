import { Controller, Post, Get, Param, Body, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AddTestCaseUseCase } from "@core/application/challenges/usecases/add-test-case.usecase";
import { AddTestCaseDto } from "@core/application/challenges/dto/add-test-case.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "@core/domain/users/user.entity";

@ApiTags("test-cases")
@ApiBearerAuth()
@Controller("challenges/:challengeId/test-cases")
export class TestCasesController {
  constructor(
    private readonly addTestCaseUseCase: AddTestCaseUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Add a test case to a challenge" })
  async addTestCase(
    @Param('challengeId') challengeId: string,
    @Body() dto: AddTestCaseDto,
    @CurrentUser() user: any,
  ) {
    return this.addTestCaseUseCase.execute(challengeId, dto, user.id, user.role);
  }

  @Get()
  @ApiOperation({ summary: "List test cases for a challenge (visible only to authorized users)" })
  async listTestCases(
    @Param('challengeId') challengeId: string,
    @CurrentUser() user: any,
  ) {
    // Students see only public cases; prof/admin see all
    // TODO: Implement getTestCasesByChallenge usecase with visibility rules
    return { message: "Test cases list endpoint - to be implemented" };
  }

  @Delete(":testCaseId")
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: "Delete a test case" })
  async deleteTestCase(
    @Param('challengeId') challengeId: string,
    @Param('testCaseId') testCaseId: string,
    @CurrentUser() user: any,
  ) {
    // TODO: Implement deleteTestCase usecase
    return { message: "Test case deleted - to be implemented" };
  }
}
