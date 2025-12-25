import { ApiProperty } from "@nestjs/swagger";

export class DownloadActivityPdfDto {
@ApiProperty
({
  description: 'List of columns to include in the PDF',
  example: ['id', 'name', 'date', 'description'],
})
  columns: string[];
}
