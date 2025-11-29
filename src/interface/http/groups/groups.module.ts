import { Module } from '@nestjs/common'
import { GroupsController } from './groups.controller'
import { PrismaService } from '@/infrastructure/database/prisma.service'

@Module({
  controllers: [GroupsController],
  providers: [PrismaService],
})
export class GroupsModule {}
