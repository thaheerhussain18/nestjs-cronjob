// PRODUCER SERVICE - Creates jobs and adds them to queue
import { Injectable, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';
import { BaseQueueService } from '../common/base-queue.service';
import { DataGenerator } from '../common/data-generator.util';

@Injectable()
export class SimpleQueueService extends BaseQueueService {
  constructor(
    @InjectQueue('queue-insert') private readonly queue: Queue,
    @InjectQueue('queue-delete') private readonly deleteQueue: Queue,
    @Inject(REDIS_CLIENT) redis: Redis,
  ) {
    super(redis);
  }

  async addJobs(totalRecords: number = 100000, batchSize: number = 1000) {
    const timestamp = Date.now();
    const batches = Math.ceil(totalRecords / batchSize);
    const allJobs: any[] = [];
    for (let batch = 0; batch < batches; batch++) {
      const startIdx = batch * batchSize + 1;
      const endIdx = Math.min((batch + 1) * batchSize, totalRecords);
      const batchRows = DataGenerator.generateBatch(endIdx - startIdx + 1, startIdx, timestamp);
      
      batchRows.forEach(row => {
        allJobs.push({
          name: 'process-row',
          data: { ...row, batchUuid: timestamp.toString() },
          opts: {
            removeOnComplete: true,
          }
        });
      });
    }
    await this.queue.addBulk(allJobs);

    const queueStatus = await this.queue.getJobCounts();

    return { 
      success: true, 
      uuid: timestamp.toString(),
      totalRows: allJobs.length,
      batches,
      batchSize,
      queueStatus,
      message: `${allJobs.length} jobs added to queue instantly`
    };
  }



  async delData() {
    for (let i = 2127; i <= 2627; i++) {
      await this.deleteQueue.add('delete-row', { id: i });
    }
    return { success: true, jobsAdded: 501 };
  }

  async getRedisStatus() {
    return this.getRedisBatchStatus('batch');
  }

  async getAllQueueStatus() {
    const insertQueueStatus = await super.getQueueStatus(this.queue);
    const deleteQueueStatus = await super.getQueueStatus(this.deleteQueue);
    const redisStatus = await this.getRedisBatchStatus('batch');
    
    return {
      insertQueue: insertQueueStatus,
      deleteQueue: deleteQueueStatus,
      redis: {
        waiting: redisStatus.totalWaiting,
        completed: redisStatus.totalCompleted,
      },
    };
  }

  async getQueueJobs() {
    const waiting = await this.queue.getWaiting();
    const active = await this.queue.getActive();
    const completed = await this.queue.getCompleted();
    const failed = await this.queue.getFailed();
    
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      waitingSample: waiting.slice(0, 3).map(j => ({ id: j.id, data: j.data })),
      activeSample: active.slice(0, 3).map(j => ({ id: j.id, data: j.data })),
      failedSample: failed.slice(0, 3).map(j => ({ id: j.id, data: j.data, failedReason: j.failedReason })),
    };
  }
}
