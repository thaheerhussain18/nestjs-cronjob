import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCsvdatumDto } from './dto/create-csvdatum.dto';
import { UpdateCsvdatumDto } from './dto/update-csvdatum.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileGenerateService } from '../file-generate/file-generate.service';
import { DownloadCsvdataPdfDto } from './dto/download-csvdata-pdf.dto';

@Injectable()
export class CsvdataService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileGenerateService: FileGenerateService,
  ) {}
 
  async createCsvData(createCsvdatumDto: CreateCsvdatumDto) {
    const { name, code, description } = createCsvdatumDto;
    if (!name) {
      throw new Error('Name is required');
    }
    if (!code) {
      throw new Error('Code is required');
    }
    if (!description) {
      throw new Error('Description is required');
    } 
    
    return await this.prismaService.csvData.create({
      data: {
        name: createCsvdatumDto.name,
        code: createCsvdatumDto.code,
        description: createCsvdatumDto.description,
      },
    });
  }


  async removeCsvData(id: number) {
    return await this.prismaService.csvData.update({
      where: {
        id: id,
      },
      data: {
        status: false,
      },
    });       
  }

  async getAllCsvData() {
   const getallQuery='select name,code,description,status from CsvData';
   return this.prismaService.$queryRawUnsafe(getallQuery);
  }
  async downloadCsvdataPdf(downloadDto: DownloadCsvdataPdfDto) {
    try {
      const csvData = await this.prismaService.csvData.findMany({
        where: { status: true },
      });
      const fileName = 'CsvDatat';
      let columns: string[] = downloadDto.columns;
      if (typeof downloadDto.columns === 'string') {
        columns = (downloadDto.columns as any).split(',').map((col: string) => col.trim());
      }
      
      const pdfBuffer = await this.fileGenerateService.generateTablePDF(
        csvData,
        fileName,
        columns,
      );

      return { buffer: pdfBuffer, fileName };
    } catch (error) {
      throw error;
    }
  }
}

