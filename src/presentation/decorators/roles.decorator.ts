import { SetMetadata } from "@nestjs/common"
import type { UserRole } from "@domain/entities/user.entity"

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles)
