import { Controller, Get } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import type { GetUserUseCase } from "@core/application/users/usecases/get-user.usecase"
import type { ListUsersUseCase } from "@core/application/users/usecases/list-users.usecase"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "@core/domain/users/user.entity"

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "List all users (Admin only)" })
  async listUsers() {
    return this.listUsersUseCase.execute()
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  async getUser(id: string) {
    return this.getUserUseCase.execute(id)
  }
}
