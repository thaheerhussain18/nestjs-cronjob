import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { ActivityModule } from './activity/activity.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './taskservice.service';
import { AssignmentService } from './assignment/assignment.service';
import { AssignmentModule } from './assignment/assignment.module';

@Module({
  imports: [
    PrismaModule,
    EmployeeModule,
    ActivityModule,
    ScheduleModule.forRoot(),
    AssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, TasksService, AssignmentService],
})
export class AppModule {}
