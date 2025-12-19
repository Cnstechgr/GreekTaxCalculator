// API route for exporting calculations to PDF, Excel, Word
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { generatePDF, generateExcel, generateWord } from '@/lib/export-utils';

export const dynamic = 'force-dynamic';

type ExportFormat = 'pdf' | 'excel' | 'word';
type CalculationType = 'individual' | 'company' | 'employee' | 'combined' | 'full';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Μη εξουσιοδοτημένη πρόσβαση' },
        { status: 401 }
      );
    }

    const { businessId, year, calculationType, format } = await req.json();

    if (!businessId || !year || !calculationType || !format) {
      return NextResponse.json(
        { error: 'Λείπουν απαραίτητα πεδία' },
        { status: 400 }
      );
    }

    // Verify business ownership
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        userId: session.user.id,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Η επιχείρηση δεν βρέθηκε' },
        { status: 404 }
      );
    }

    // Fetch calculation data based on type
    let calculationData: any = null;
    const yearInt = parseInt(year);
    
    switch (calculationType as CalculationType) {
      case 'individual':
        calculationData = await prisma.individualCalculation.findUnique({
          where: { businessId_year: { businessId, year: yearInt } },
        });
        break;
      case 'company':
        calculationData = await prisma.companyCalculation.findUnique({
          where: { businessId_year: { businessId, year: yearInt } },
        });
        break;
      case 'employee':
        calculationData = await prisma.employeeIncome.findUnique({
          where: { businessId_year: { businessId, year: yearInt } },
        });
        break;
      case 'combined':
        calculationData = await prisma.combinedCalculation.findUnique({
          where: { businessId_year: { businessId, year: yearInt } },
        });
        break;
      case 'full':
        calculationData = await prisma.fullCombinedCalculation.findUnique({
          where: { businessId_year: { businessId, year: yearInt } },
        });
        break;
      default:
        return NextResponse.json(
          { error: 'Μη έγκυρος τύπος υπολογισμού' },
          { status: 400 }
        );
    }

    if (!calculationData) {
      return NextResponse.json(
        { error: 'Δεν βρέθηκε υπολογισμός για το έτος ' + year },
        { status: 404 }
      );
    }

    // Generate file based on format
    let fileBuffer: Buffer;
    let contentType: string;
    let fileExtension: string;
    let fileName: string;

    const calculationTypeLabel = {
      individual: 'Ατομική',
      company: 'Εταιρεία',
      employee: 'Ατομική-Μισθωτές',
      combined: 'Ατομική-Εταιρεία',
      full: 'Πλήρης-Συνδυασμός',
    }[calculationType as CalculationType];

    switch (format as ExportFormat) {
      case 'pdf':
        fileBuffer = await generatePDF(
          business.businessName,
          calculationTypeLabel,
          yearInt,
          calculationData
        );
        contentType = 'application/pdf';
        fileExtension = 'pdf';
        break;
      case 'excel':
        fileBuffer = await generateExcel(
          business.businessName,
          calculationTypeLabel,
          yearInt,
          calculationData
        );
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        break;
      case 'word':
        fileBuffer = await generateWord(
          business.businessName,
          calculationTypeLabel,
          yearInt,
          calculationData
        );
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileExtension = 'docx';
        break;
      default:
        return NextResponse.json(
          { error: 'Μη έγκυρη μορφή εξαγωγής' },
          { status: 400 }
        );
    }

    fileName = `${business.businessName}-${calculationTypeLabel}-${year}.${fileExtension}`;

    // Log export
    await prisma.exportLog.create({
      data: {
        userId: session.user.id,
        businessId,
        exportType: format,
        calculationType,
        year: yearInt,
        fileName,
      },
    });

    // Return file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά την εξαγωγή του αρχείου' },
      { status: 500 }
    );
  }
}
