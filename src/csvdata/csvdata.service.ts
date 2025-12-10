import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCsvdatumDto } from './dto/create-csvdatum.dto';
import { UpdateCsvdatumDto } from './dto/update-csvdatum.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CsvdataService {
  constructor(private readonly prismaService: PrismaService) {}
 
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
  }

