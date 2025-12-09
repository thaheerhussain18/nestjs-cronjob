import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssignmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async unassign() {
    const tenMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    const records = await this.prismaService.activity.findMany({
      include: { employee: true, assignments: true },
    });
    console.log(
      'Records:',
      records.map((r) => ({
        id: r.id,
        employee: r.employee?.name,
        lastWorkedAt: r.lastWorkedAt,
        assignments: r.assignments.map((a) => a.title),
      })),
    );
    const inactive = await this.prismaService.activity.findMany({
      where: {
        lastWorkedAt: { lt: tenMinutesAgo },
      },
      include: {
        assignments: true,
      },
    });

    const assignmentIds = inactive.flatMap((activity) =>
      activity.assignments.map((a) => a.id),
    );

    if (assignmentIds.length > 0) {
      await this.prismaService.assignment.updateMany({
        where: { id: { in: assignmentIds } },
        data: { status: false },
      });
    }
    console.log(
      `Unassigned ${assignmentIds.length} assignments from inactive employees.`,
    );
  }
}
