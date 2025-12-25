import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import moment from 'moment';
import * as puppeteer from 'puppeteer';
@Injectable()
export class FileGenerateService {
    constructor(private readonly prismaService: PrismaService) {}
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
  async generateTablePDF(data: any[], fileName: string, columns: string[]): Promise<Buffer> {
    try {
      const launchOptions: any = {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      };
      
      if (process.env.FILE_GENERATION_CHROME_PATH) {
        launchOptions.executablePath = process.env.FILE_GENERATION_CHROME_PATH;
      }
      
      const browser = await puppeteer.launch(launchOptions);
 
      const page = await browser.newPage();
 
      // Define some constants for layout and styling
      const mainHeader = 'SyncOffice';
      const currentDate = moment().format('DD-MM-YYYY');
 
      // Define the header template
      const headerTemplate = `
        <div style="width: 100%; color: black;padding: 0px 20px 15px 20px;  font-size: 13px; display: flex; justify-content: space-between; align-items: center; font-weight: 600;">
          <div>${mainHeader}</div>
          <div>${fileName}</div>
          <div>${currentDate}</div>
        </div>
      `;
 
      // Define the footer template
      const footerTemplate = `
        <div style="width: 100%; font-size: 12px;padding: 20px 20px 0px 10px; border-top: 1px solid #ddd; font-weight: 600;">
          <div style="color: black; display: flex; align-items: center; justify-content: space-between;">
            <span style="margin-left: 10px;">Copyright © Candy Technologies Private Limited. All Rights Reserved.</span>
          </div>
        </div>
      `;
 
      // Create an HTML template for the PDF content
      const content = `
            <html>
              <head>
                <style>
                  body {
                    font-family: 'Montserrat', sans-serif;
                    margin: 0;          
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                    border-left: 1px dotted #ddd;
                  }
                  
                  td {
                    padding: 8px;
                    text-align: left;
                    border-right: 1px dotted #ddd;
                    font-size: 12px;
                  }
                
                  th {
                    background-color: #f5f5f5;
                    color: black;
                    padding: 8px;
                    text-align: left;
                    font-size: 12px;
                    border-right: 1px dotted #ddd;
                  }
                </style>
              </head>
              <body>
              <table>
                <thead>
                  <tr style="text-transform: capitalize">
                    ${columns.map((header) => `<th>${header.replace(/_/g, ' ')}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${data
                    .map(
                      (row) => `
                    <tr>
                      ${columns.map((header) => `<td>${row[header]}</td>`).join('')}
                    </tr>
                  `,
                    )
                    .join('')}
                </tbody>
              </table>
            </body>
            </html>
          `;
      // Set the HTML content of the page
      await page.setContent(content);
 
      // Generate the PDF and store it in a Buffer
      const pdfBuffer = Buffer.from(
        await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '50px', bottom: '50px', left: '20px', right: '20px' },
          displayHeaderFooter: true,
          headerTemplate: headerTemplate,
          footerTemplate: footerTemplate,
        }),
      );
 
      // Close the browser
      await browser.close();
 
      // Return the PDF as a Buffer
      return pdfBuffer;
    } catch (error) {
      console.error(error.message);
      throw new ConflictException('Something went wrong while generating PDF file');
    }
  }
 
}
