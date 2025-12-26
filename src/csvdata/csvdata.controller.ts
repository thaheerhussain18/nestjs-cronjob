import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { CsvdataService } from './csvdata.service';
import { CreateCsvdatumDto } from './dto/create-csvdatum.dto';
import { UpdateCsvdatumDto } from './dto/update-csvdatum.dto';
import type { Response } from 'express';
import { DownloadCsvdataPdfDto } from './dto/download-csvdata-pdf.dto';

@Controller('csvdata')
export class CsvdataController {
  constructor(private readonly csvdataService: CsvdataService) {}

  @Post()
  create(@Body() createCsvdatumDto: CreateCsvdatumDto) {
    return this.csvdataService.createCsvData(createCsvdatumDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.csvdataService.removeCsvData(+id);
  }

  @Post('download-pdf')
  async downloadPdf(@Query() downloadDto: DownloadCsvdataPdfDto, @Res() res: Response) {
    const { buffer, fileName } = await this.csvdataService.downloadCsvdataPdf(downloadDto);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
    res.send(buffer);
  }

  @Get()
  async findAll() {
    return this.csvdataService.getAllCsvData();
  }
}
