import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import type { Job } from 'bull';
import type { Redis } from 'ioredis';
import { CsvdataService } from 'src/csvdata/csvdata.service';
import { REDIS_CLIENT } from '../redis/redis.module';
import { BaseQueueService } from '../common/base-queue.service';

@Processor('demo-queue')
export class DemoProcessor extends BaseQueueService {
  constructor(
    private readonly csvdataService: CsvdataService,
    @Inject(REDIS_CLIENT) redis: Redis,
  ) {
    super(redis);
  }

  @Process('process-record')
  async handleProcessRecord(job: Job) {
    const { name, code, description, batchUuid } = job.data;

    this.logger.log(`Processing job ${job.id}: ${name} (${code})`);

    try {
      await this.csvdataService.createCsvData({ name, code, description });
      
      this.logger.log(`✅ Successfully inserted: ${name} (${code})`);
      
      if (batchUuid) {
        await this.trackBatchCompletion(batchUuid, 'demo:batch');
      }

      return { success: true, name, code };
    } catch (error) {
      this.logger.error(`❌ Failed to process ${name}: ${error.message}`);
      throw error;
    }
  }
}
