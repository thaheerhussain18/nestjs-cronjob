import { Controller, Post, Get, Query } from '@nestjs/common';
import { SimpleQueueService } from './simple-queue.service';

@Controller('simple-queue')
export class SimpleQueueController {
  constructor(private readonly simpleQueueService: SimpleQueueService) {}

  @Post('addJobs')
  async addJobs(
    @Query('total') total?: string,
    @Query('batchSize') batchSize?: string,
  ) {
    const totalRecords = total ? parseInt(total, 10) : 100000;
    const batch = batchSize ? parseInt(batchSize, 10) : 1000;
    return this.simpleQueueService.addJobs(totalRecords, batch);
  }

  @Post('delData')
  async delData() {
    return this.simpleQueueService.delData();
  }
  
  @Get('status')
  async getStatus() {
    return this.simpleQueueService.getAllQueueStatus();
  }

  @Get('redis')
  async getRedisStatus() {
    return this.simpleQueueService.getRedisStatus();
  }

  @Get('queue-jobs')
  async getQueueJobs() {
    return this.simpleQueueService.getQueueJobs();
  }
}
