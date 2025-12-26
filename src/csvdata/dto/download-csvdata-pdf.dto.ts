import { ApiProperty } from '@nestjs/swagger';

export class DownloadCsvdataPdfDto {
  @ApiProperty({
    description: 'List of columns to include in the PDF',
    example: ['id', 'name', 'code', 'description'],
  })
  columns: string[];
}
