import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CsvdataService } from './csvdata.service';
import { CreateCsvdatumDto } from './dto/create-csvdatum.dto';
import { UpdateCsvdatumDto } from './dto/update-csvdatum.dto';

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
}
