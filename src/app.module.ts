import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { ActivityModule } from './activity/activity.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { TasksService } from './taskservice.service';
import { AssignmentService } from './assignment/assignment.service';
import { AssignmentModule } from './assignment/assignment.module';
import { SimpleQueueModule } from './simple-queue/simple-queue.module';
import { CsvdataModule } from './csvdata/csvdata.module';
import { FileGenerateModule } from './file-generate/file-generate.module';

@Module({
  imports: [
    PrismaModule,
    EmployeeModule,
    ActivityModule,
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
      },
    }),
    AssignmentModule,
    SimpleQueueModule,
    CsvdataModule,
    FileGenerateModule,
  ],
  controllers: [AppController],
  providers: [AppService, TasksService, AssignmentService],
})
export class AppModule {}
