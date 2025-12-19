// API route for comparison tables
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Get all calculations for comparison
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Μη εξουσιοδοτημένη πρόσβαση' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');
    const year = searchParams.get('year');

    if (!businessId || !year) {
      return NextResponse.json(
        { error: 'Απαιτείται businessId και year' },
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

    const yearInt = parseInt(year);

    // Fetch all calculation types for the given year
    const [individual, company, employee, combined, fullCombined] = await Promise.all([
      prisma.individualCalculation.findUnique({
        where: { businessId_year: { businessId, year: yearInt } },
      }),
      prisma.companyCalculation.findUnique({
        where: { businessId_year: { businessId, year: yearInt } },
      }),
      prisma.employeeIncome.findUnique({
        where: { businessId_year: { businessId, year: yearInt } },
      }),
      prisma.combinedCalculation.findUnique({
        where: { businessId_year: { businessId, year: yearInt } },
      }),
      prisma.fullCombinedCalculation.findUnique({
        where: { businessId_year: { businessId, year: yearInt } },
      }),
    ]);

    return NextResponse.json({
      business,
      year: yearInt,
      calculations: {
        individual,
        company,
        employee,
        combined,
        fullCombined,
      },
    });
  } catch (error) {
    console.error('Get comparison data error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά την ανάκτηση των δεδομένων σύγκρισης' },
      { status: 500 }
    );
  }
}
