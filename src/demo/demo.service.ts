import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';
import { FileGenerateService } from '../file-generate/file-generate.service';
import { BaseQueueService } from '../common/base-queue.service';

@Injectable()
export class DemoService extends BaseQueueService {
  constructor(
    @InjectQueue('demo-queue') private readonly demoQueue: Queue,
    @Inject(REDIS_CLIENT) redis: Redis,
    private readonly fileGenerateService: FileGenerateService,
  ) {
    super(redis);
  }

  async processExcelData(filePath: string) {
    const extraction = await this.fileGenerateService.extractDataFromExcel(filePath);
    if (extraction.data.length === 0) {
      throw new BadRequestException('No valid records found in Excel file');
    }
    const uuid = await this.storeBatchInRedis(extraction.data, 'demo:batch');
    await this.addJobsToQueue(this.demoQueue, 'process-record', extraction.data, uuid);
    return {
      success: true,
      batchUuid: uuid,
      summary: {
        totalRows: extraction.totalRows,
        validRows: extraction.data.length,
        invalidRows: extraction.errors.length,
      },
      errors: extraction.errors,
      message: `Batch ${uuid} created with ${extraction.data.length} valid records`,
    };
  }

  async getBatchStatus() {
    return this.getDetailedBatchStatus('demo:batch');
  }

  async getDemoQueueStatus() {
    return super.getQueueStatus(this.demoQueue);
  }


  async generateSampleExcel(rowCount: number = 50) {
    const buffer = await this.fileGenerateService.generateSampleExcel(rowCount);
    const fileName = `demo-sample-${Date.now()}.xlsx`;
    const filePath = `./uploads/${fileName}`;
    const fs = require('fs');
    fs.writeFileSync(filePath, buffer);
    return {
      success: true,
      fileName,
      filePath,
      rowCount,
    };
  }
}
export interface DemoRecord {
        name: string;
        code: string;
        description: string;
    }[];