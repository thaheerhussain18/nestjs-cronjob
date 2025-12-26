import { Module } from '@nestjs/common';
import { FileGenerateController } from './file-generate.controller';
import { FileGenerateService } from './file-generate.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FileGenerateController],
  providers: [FileGenerateService, PrismaService],
  exports: [FileGenerateService],
})
export class FileGenerateModule {}
