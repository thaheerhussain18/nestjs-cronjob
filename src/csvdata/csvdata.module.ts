import { Module } from '@nestjs/common';
import { CsvdataService } from './csvdata.service';
import { CsvdataController } from './csvdata.controller';
import { FileGenerateModule } from '../file-generate/file-generate.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [FileGenerateModule, PrismaModule],
  controllers: [CsvdataController],
  providers: [CsvdataService],
  exports: [CsvdataService],
})
export class CsvdataModule {}
