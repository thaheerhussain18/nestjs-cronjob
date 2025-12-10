import { Module } from '@nestjs/common';
import { CsvdataService } from './csvdata.service';
import { CsvdataController } from './csvdata.controller';

@Module({
  controllers: [CsvdataController],
  providers: [CsvdataService],
  exports: [CsvdataService],
})
export class CsvdataModule {}
