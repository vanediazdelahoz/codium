import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common'
import { JwtGuard } from '@/infrastructure/security/jwt.guard'
import { RolesGuard } from '@/infrastructure/security/roles.guard'
import { Roles } from '@/infrastructure/security/roles.decorator'
import { PrismaService } from '@/infrastructure/database/prisma.service'

@Controller('enrollments')
@UseGuards(JwtGuard)
export class EnrollmentsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getMyEnrollments(@Request() req: any) {
    const userId = req.user.id
    const enrollments = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        courses: {
          include: {
            professor: { select: { id: true, firstName: true, lastName: true } },
            groups: { include: { students: true } },
          },
        },
      },
    })
    return enrollments?.courses || []
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  async enrollInCourse(@Request() req: any, @Body() data: { courseId: string }) {
    const userId = req.user.id
    const enrollment = await this.prisma.course.update({
      where: { id: data.courseId },
      data: {
        students: {
          connect: { id: userId },
        },
      },
      include: {
        students: true,
        groups: { include: { students: true } },
      },
    })
    return {
      message: 'Enrolled successfully',
      course: enrollment,
    }
  }
}
