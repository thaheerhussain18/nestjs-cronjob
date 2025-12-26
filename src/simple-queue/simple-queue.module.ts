import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SimpleQueueController } from './simple-queue.controller';
import { SimpleQueueService } from './simple-queue.service';
import { SimpleQueueProcessor } from './simple-queue.processor';
import { DeleteQueueProcessor } from './delete-queue.processor';
import { CsvdataModule } from 'src/csvdata/csvdata.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'queue-insert',
    }),
    BullModule.registerQueue({
      name: 'queue-delete',
    }),
    CsvdataModule,
  ],
  controllers: [SimpleQueueController],
  providers: [SimpleQueueService, SimpleQueueProcessor, DeleteQueueProcessor],
})
export class SimpleQueueModule {}
