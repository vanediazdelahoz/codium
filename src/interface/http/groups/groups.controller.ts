import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { JwtGuard } from '@/infrastructure/security/jwt.guard'
import { RolesGuard } from '@/infrastructure/security/roles.guard'
import { PrismaService } from '@/infrastructure/database/prisma.service'

@Controller('groups')
@UseGuards(JwtGuard, RolesGuard)
export class GroupsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async listUserGroups() {
    const groups = await this.prisma.group.findMany({
      include: {
        course: true,
        students: true,
        challenges: true,
      },
    })
    return groups
  }

  @Get(':id')
  async getGroup(@Param('id') id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        course: true,
        students: true,
        challenges: {
          include: { testCases: true },
        },
      },
    })
    return group
  }

  @Get(':id/students')
  async getGroupStudents(@Param('id') groupId: string) {
    const students = await this.prisma.user.findMany({
      where: {
        groups: {
          some: { id: groupId },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })
    return students
  }

  @Post(':id/students')
  async addStudentToGroup(@Param('id') groupId: string, @Body() data: { studentId: string }) {
    const group = await this.prisma.group.update({
      where: { id: groupId },
      data: {
        students: {
          connect: { id: data.studentId },
        },
      },
      include: { students: true },
    })
    return group
  }
}
