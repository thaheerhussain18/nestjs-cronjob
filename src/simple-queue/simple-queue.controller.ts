import { Controller, Post, Get } from '@nestjs/common';
import { SimpleQueueService } from './simple-queue.service';

@Controller('simple-queue')
export class SimpleQueueController {
  constructor(private readonly simpleQueueService: SimpleQueueService) {}

  @Post('add-jobs')
  async addJobs() {
    return this.simpleQueueService.addJobs();
  }

  @Post('del-data')
  async delData() {
    return this.simpleQueueService.delData();
  }
  
  @Get('status')
  async getStatus() {
    return this.simpleQueueService.getQueueStatus();
  }
}
