import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { CsvdataService } from 'src/csvdata/csvdata.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileGenerateService {
    constructor(private readonly csvDataService: CsvdataService,
        private readonly prismaService: PrismaService
    ) {}
  async generateSampleExcel(rowCount: number = 100) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sample Data');

    // Row 1: Headers
    worksheet.addRow(['Name', 'Code', 'Description']);
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    };

    // Row 2: Instructions
    worksheet.addRow([
      'Enter full name',
      'Unique code (e.g., CODE001)',
      'Optional description',
    ]);
    worksheet.getRow(2).font = { italic: true, color: { argb: 'FF666666' } };
    worksheet.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFF2CC' },
    };

    // Row 3+: Sample data
    for (let i = 1; i <= rowCount; i++) {
      worksheet.addRow([
        `User ${i}`,
        `CODE${i.toString().padStart(3, '0')}`,
        `Record number ${i}`,
      ]);
    }

    // Set column widths
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 30;

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async extractDataFromExcel(filePath: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    const data: Array<{ name: string; code: string; description: string }> = [];
    const errors: Array<{ row: number; error: string }> = [];

    const rows: Array<{ rowNumber: number; name: string; code: string; description: string }> = [];

    // First, collect all rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 2) return; // Skip first 2 rows

      const name = row.getCell(1).value?.toString().trim() || '';
      const code = row.getCell(2).value?.toString().trim() || '';
      const description = row.getCell(3).value?.toString().trim() || '';

      rows.push({ rowNumber, name, code, description });
    });

    // Now process each row asynchronously
    for (const row of rows) {
      const rowErrors: string[] = [];

      if (!row.name) rowErrors.push('Name is required');
      if (!row.code) rowErrors.push('Code is required');

      // Check for unique code
      if (row.code) {
        const existing = await this.prismaService.csvData.findUnique({
          where: { code: row.code },
        });
        if (existing) {
          rowErrors.push('Code must be unique');
        }
      }

      if (rowErrors.length > 0) {
        errors.push({ row: row.rowNumber, error: rowErrors.join(', ') });
      } else {
        data.push({ name: row.name, code: row.code, description: row.description });
      }
    }

    // Delete file after processing
    fs.unlinkSync(filePath);

    return { data, errors, totalRows: data.length + errors.length };
  }

  validateRow(row: { name: string; code: string; description?: string }) {
    const errors: string[] = [];

    if (!row.name || row.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!row.code || row.code.trim() === '') {
      errors.push('Code is required');
    }

    return { isValid: errors.length === 0, errors };
  }
}
