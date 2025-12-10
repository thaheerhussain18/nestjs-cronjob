// CONSUMER PROCESSOR - Picks up jobs from queue and processes them
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { CsvdataService } from 'src/csvdata/csvdata.service';
import {v4} from 'uuid';
  
@Processor('queue-insert')
export class SimpleQueueProcessor {
  private readonly logger = new Logger(SimpleQueueProcessor.name);
  constructor(private readonly csvdataService: CsvdataService) {}
  
  @Process('process-row')
  async handleProcessRow(job: Job) {
    const { name, code, description } = job.data;
    
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
  }
}
