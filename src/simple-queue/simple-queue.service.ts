// PRODUCER SERVICE - Creates jobs and adds them to queue
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class SimpleQueueService {
  private readonly logger = new Logger(SimpleQueueService.name);

  constructor(
    @InjectQueue('queue-insert') private readonly queue: Queue,
    @InjectQueue(`queue-delete`) private readonly deleteQueue: Queue,
  ) {}

  async addJobs() {
    const rows: Array<{ name: string; code: string; description: string }> = [];
    
    for (let i = 1; i <= 1000; i++) {
      rows.push({
        name: `User ${i}`,
        code: `CODE${i.toString().padStart(3, '0')}`,
        description: `Record number ${i}`,
      });
    }
    for (const row of rows) {
      await this.queue.add('process-row', row,{
        removeOnComplete: true,
      });
    }
    return { success: true, jobsAdded: rows.length };
  }

  async delData() {
    for (let i = 2127; i <= 2627; i++) {
      await this.deleteQueue.add('delete-row', { id: i });
    }
    return { success: true, jobsAdded: 501 };
  }
  async getQueueStatus() {
    const waiting = await this.queue.getWaiting();
    const waitingDel = await this.deleteQueue.getWaiting();
    const active = await this.queue.getActive();
    const activeDel = await this.deleteQueue.getActive();
    const completed = await this.queue.getCompleted();
    const completedDel = await this.deleteQueue.getCompleted();
    const failed = await this.queue.getFailed();
    const failedDel = await this.deleteQueue.getFailed();
    return {
      waiting: waiting.length,
      waitingDel: waitingDel.length,
      active: active.length,
      activeDel: activeDel.length,
      completed: completed.length,
      completedDel: completedDel.length,
      failed: failed.length,
      failedDel: failedDel.length, 
    };
  }
}
