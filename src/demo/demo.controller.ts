import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DemoService } from './demo.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `demo-${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.mimetype === 'application/vnd.ms-excel'
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only Excel files (.xlsx, .xls) are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.demoService.processExcelData(file.path);
  }


  @Get('generate-sample')
  async generateSample(
    @Query('rows', new ParseIntPipe({ optional: true })) rows?: number,
  ) {
    return this.demoService.generateSampleExcel(rows || 50);
  }

  @Get('batch-status')
  async getBatchStatus() {
    return this.demoService.getBatchStatus();
  }

  @Get('queue-status')
  async getQueueStatus() {
    const status = await this.demoService.getDemoQueueStatus();
    return { queue: status };
  }

  /**
   * Get complete status (batch + queue)
   * GET /demo/status
   */
  @Get('status')
  async getStatus() {
    const [batchStatus, queueStatus] = await Promise.all([
      this.demoService.getBatchStatus(),
      this.demoService.getDemoQueueStatus(),
    ]);

    return {
      redis: batchStatus,
      queue: queueStatus,
    };
  }
}
