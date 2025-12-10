import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';
import { FileGenerateService } from './file-generate.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('file-generate')
export class FileGenerateController {
  constructor(private readonly fileGenerateService: FileGenerateService) {}

  @Get('sample-excel')
  async downloadSampleExcel(
    @Query('rows') rows: string = '100',
    @Res() res: Response,
  ) {
    const rowCount = parseInt(rows) || 100;
    const buffer = await this.fileGenerateService.generateSampleExcel(rowCount);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=sample-data-${rowCount}-rows.xlsx`,
    );

    res.send(buffer);
  }

  @Post('upload-excel')
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
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `excel-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return cb(
            new BadRequestException('Only Excel files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const result = await this.fileGenerateService.extractDataFromExcel(
      file.path,
    );
    return {
      message: 'Excel file processed',
      file: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
      },
      result: {
        totalRows: result.totalRows,
        validRows: result.data.length,
        invalidRows: result.errors.length,
        data: result.data,
        errors: result.errors,
      },
    };
  }
}
