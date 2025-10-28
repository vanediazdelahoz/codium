import { Controller, Get, Param } from "@nestjs/common"; // Se añade Param
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
// CORREGIDO: Se elimina la palabra 'type' para que las importaciones sean reales
import { GetUserUseCase } from "@core/application/users/usecases/get-user.usecase";
import { ListUsersUseCase } from "@core/application/users/usecases/list-users.usecase";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@core/domain/users/user.entity";

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
    return this.listUsersUseCase.execute();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  async getUser(@Param("id") id: string) { // Se añade @Param("id") para capturar el valor
    return this.getUserUseCase.execute(id);
  }
}