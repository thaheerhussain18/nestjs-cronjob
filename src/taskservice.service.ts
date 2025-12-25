import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AssignmentService } from './assignment/assignment.service';
import { CsvdataService } from './csvdata/csvdata.service';
import { DataGenerator } from './common/data-generator.util';
import { CsvData } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly assignmentService: AssignmentService,
    private readonly csvdataService: CsvdataService,
    private readonly prismaService: PrismaService
  ) {}

  @Cron("0 */1 * * * *")
  async unassignInactiveEmployees() {
    // return this.assignmentService.unassign();
  //  const record:CsvData= await this.csvdataService.createCsvData(DataGenerator.generateRecord(1));
const record:CsvData= await this.prismaService.csvData.create({
    data: DataGenerator.generateRecord(1)
   });
   this.logger.log(`Created CSV Data Record: ${JSON.stringify(record)}`);
   return record;
  }
}
