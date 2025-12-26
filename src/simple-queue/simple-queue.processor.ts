// CONSUMER PROCESSOR - Picks up jobs from queue and processes them
import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import type { Job } from 'bull';
import type { Redis } from 'ioredis';
import { CsvdataService } from 'src/csvdata/csvdata.service';
import { REDIS_CLIENT } from '../redis/redis.module';
import { BaseQueueService } from '../common/base-queue.service';

@Processor('queue-insert')
export class SimpleQueueProcessor extends BaseQueueService {
  constructor(
    @Inject(REDIS_CLIENT) redis: Redis,
    private readonly csvdataService: CsvdataService,
  ) {
    super(redis);
  }
  
  @Process({ name: 'process-row', concurrency: 5 })
  async handleProcessRow(job: Job) {
    const { name, code, description, batchUuid } = job.data;
    
    if (!name) {
      throw new Error('Name is required');
    }
    if (!code) {
      throw new Error('Code is required');
    }
    if (!description) {
      throw new Error('Description is required');
    }
    
    await this.csvdataService.createCsvData({ name, code, description });
    console.log(` Inserted record: ${name} ${code} ${batchUuid}, 'batch'}`);
    if (batchUuid) {
      await this.trackBatchCompletion(batchUuid, 'batch');
    }
  }
}
