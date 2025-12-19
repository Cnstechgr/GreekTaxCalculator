// Export utilities for generating PDF, Excel, Word documents
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, TextRun } from 'docx';
import { formatCurrency } from './tax-calculator';

/**
 * Generate PDF for calculation results
 */
export async function generatePDF(
  businessName: string,
  calculationType: string,
  year: number,
  data: any
): Promise<Buffer> {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(`Φορολογικός Υπολογισμός - ${year}`, 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Επιχείρηση: ${businessName}`, 14, 30);
  doc.text(`Σενάριο: ${calculationType}`, 14, 37);
  doc.text(`Ημερομηνία: ${new Date().toLocaleDateString('el-GR')}`, 14, 44);
  
  // Add data table
  const tableData = Object.entries(data)
    .filter(([key, value]) => value !== null && value !== undefined)
    .map(([key, value]) => [
      key.replace(/([A-Z])/g, ' $1').trim(),
      typeof value === 'number' ? formatCurrency(value) : String(value)
    ]);
  
  autoTable(doc, {
    startY: 55,
    head: [['Πεδίο', 'Τιμή']],
    body: tableData,
    theme: 'grid',
    styles: { font: 'helvetica' },
    headStyles: { fillColor: [41, 98, 255] },
  });
  
  return Buffer.from(doc.output('arraybuffer'));
}

/**
 * Generate Excel for calculation results
 */
export async function generateExcel(
  businessName: string,
  calculationType: string,
  year: number,
  data: any
): Promise<Buffer> {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Prepare data
  const wsData = [
    ['Φορολογικός Υπολογισμός'],
    [`Επιχείρηση: ${businessName}`],
    [`Σενάριο: ${calculationType}`],
    [`Έτος: ${year}`],
    [`Ημερομηνία: ${new Date().toLocaleDateString('el-GR')}`],
    [],
    ['Πεδίο', 'Τιμή'],
  ];
  
  Object.entries(data)
    .filter(([key, value]) => value !== null && value !== undefined)
    .forEach(([key, value]) => {
      wsData.push([
        key.replace(/([A-Z])/g, ' $1').trim(),
        String(value)
      ]);
    });
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Add to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Υπολογισμός');
  
  // Generate buffer
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

/**
 * Generate Word document for calculation results
 */
export async function generateWord(
  businessName: string,
  calculationType: string,
  year: number,
  data: any
): Promise<Buffer> {
  // Create document sections
  const sections = [
    new Paragraph({
      text: `Φορολογικός Υπολογισμός - ${year}`,
      heading: 'Heading1',
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: `Επιχείρηση: ${businessName}`,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: `Σενάριο: ${calculationType}`,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: `Ημερομηνία: ${new Date().toLocaleDateString('el-GR')}`,
      spacing: { after: 300 },
    }),
  ];
  
  // Create table rows
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Πεδίο', bold: true })],
          })],
          width: { size: 50, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: 'Τιμή', bold: true })],
          })],
          width: { size: 50, type: WidthType.PERCENTAGE },
        }),
      ],
    }),
  ];
  
  Object.entries(data)
    .filter(([key, value]) => value !== null && value !== undefined)
    .forEach(([key, value]) => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(key.replace(/([A-Z])/g, ' $1').trim())],
            }),
            new TableCell({
              children: [new Paragraph(
                typeof value === 'number' ? formatCurrency(value) : String(value)
              )],
            }),
          ],
        })
      );
    });
  
  // Create table
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
  });
  
  // Create document
  const doc = new Document({
    sections: [
      {
        children: [...sections, table],
      },
    ],
  });
  
  // Generate buffer
  return await Packer.toBuffer(doc);
}
