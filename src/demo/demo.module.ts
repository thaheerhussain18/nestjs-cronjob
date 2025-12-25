import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { DemoProcessor } from './demo.processor';
import { CsvdataModule } from 'src/csvdata/csvdata.module';
import { FileGenerateModule } from '../file-generate/file-generate.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'demo-queue',
    }),
    CsvdataModule,
    FileGenerateModule,
  ],
  controllers: [DemoController],
  providers: [DemoService, DemoProcessor],
  exports: [DemoService],
})
export class DemoModule {}
