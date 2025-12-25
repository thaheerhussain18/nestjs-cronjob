import { Injectable, Logger, Inject } from '@nestjs/common';
import type { Queue } from 'bull';
import type { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { REDIS_CLIENT } from '../redis/redis.module';
import { DemoRecord } from 'src/demo/demo.service';

@Injectable()
export class BaseQueueService {
  protected readonly logger: Logger;
  protected batchCompletion = new Map<string, { total: number; processed: number }>();

  constructor(
    @Inject(REDIS_CLIENT) protected readonly redis: Redis,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async storeBatchInRedis(data: DemoRecord[], prefix: string = 'batch'): Promise<string> {
    const uuid = uuidv4();
    const batchKey = `${prefix}:${uuid}`;
    await this.redis.set(batchKey, JSON.stringify(data));
    await this.redis.lpush(`${prefix}:waiting`, uuid);
    return uuid;
  }

  async addJobsToQueue(queue: Queue, jobName: string, records: DemoRecord[], batchUuid?: string): Promise<void> {
    const jobOptions = { 
      removeOnComplete: false,
      removeOnFail: false,
      attempts: 3,
    };
    
    if (batchUuid) {
      this.batchCompletion.set(batchUuid, { total: records.length, processed: 0 });
    }
    
    for (const record of records) {
      const jobData = batchUuid ? Object.assign({}, record, { batchUuid }) : record;
      await queue.add(jobName, jobData, jobOptions);
    }
  }

  async getRedisBatchStatus(prefix: string = 'batch') {
    const waiting = await this.redis.lrange(`${prefix}:waiting`, 0, -1);
    const completed = await this.redis.lrange(`${prefix}:completed`, 0, -1);
    return {
      waiting,
      completed,
      totalWaiting: waiting.length,
      totalCompleted: completed.length,
    };
  }

  async getDetailedBatchStatus(prefix: string = 'batch') {
    const waiting = await this.redis.lrange(`${prefix}:waiting`, 0, -1);
    const completed = await this.redis.lrange(`${prefix}:completed`, 0, -1);
    const waitingDetails: { uuid: string; recordCount: number; }[] = [];
    for (const uuid of waiting) {
      const data = await this.redis.get(`${prefix}:${uuid}`);
      let recordCount = 0;
      if (data) {
        recordCount = JSON.parse(data).length;
      }
      waitingDetails.push({ uuid, recordCount });
    }
    return {
      waiting: {
        count: waiting.length,
        batches: waitingDetails,
      },
      completed: {
        count: completed.length,
        batches: completed,
      },
    };
  }

  async getQueueStatus(queue: Queue) {
    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  async moveBatchToCompleted(uuid: string, prefix: string = 'batch') {
    await this.redis.lrem(`${prefix}:waiting`, 0, uuid);
    await this.redis.lpush(`${prefix}:completed`, uuid);
    await this.redis.del(`${prefix}:${uuid}`);
  }

  async trackBatchCompletion(batchUuid: string, prefix: string = 'batch'): Promise<void> {
    if (!this.batchCompletion.has(batchUuid)) {
      const batchData = await this.redis.get(`${prefix}:${batchUuid}`);
      if (batchData) {
        const records = JSON.parse(batchData);
        this.batchCompletion.set(batchUuid, { total: records.length, processed: 0 });
      } else {
        return;
      }
    }
    const batch = this.batchCompletion.get(batchUuid);
    if (!batch) return;
    batch.processed = batch.processed + 1;
    if (batch.processed >= batch.total) {
      await this.moveBatchToCompleted(batchUuid, prefix);
      this.batchCompletion.delete(batchUuid);
    }
  }
}
