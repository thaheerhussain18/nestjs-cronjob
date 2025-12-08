
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';


@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prisma: PrismaService) {}

 @Cron("0 */3 * * * *")
async unassignInactiveEmployees() {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  console.log("Checking for inactive activities before:", tenMinutesAgo);
  const inactive = await this.prisma.activity.findMany({
    where: {
         lastWorkedAt: { lt: tenMinutesAgo } ,
    }
  });

  console.log("Inactive activities:", inactive);

  for (const record of inactive) {
    await this.prisma.activity.update({
      where: { id: record.id },
      data: { employeeId: null,
        lastWorkedAt: null
       }
    });
    this.logger.debug(`Unassigned employee from activity ${record.id}`);
  }
}

}
