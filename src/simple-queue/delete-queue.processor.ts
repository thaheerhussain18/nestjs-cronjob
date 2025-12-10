// DELETE PROCESSOR - Handles delete jobs from queue
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { CsvdataService } from 'src/csvdata/csvdata.service';

@Processor('queue-delete')
export class DeleteQueueProcessor {
  private readonly logger = new Logger(DeleteQueueProcessor.name);

  constructor(private readonly csvdataService: CsvdataService) {}

  @Process('delete-row')
  async handleDeleteRow(job: Job) {
    const { id } = job.data;

    if (!id) {
      throw new Error('ID is required');
    }

    await this.csvdataService.removeCsvData(id);
    this.logger.log(`✅ Deactivated record: ${id}`);
  }
}
