import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AssignmentService } from './assignment/assignment.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly assignmentService: AssignmentService) {}

  @Cron("0 */1 * * * *")
  async unassignInactiveEmployees() {
    return this.assignmentService.unassign();
  }
}
