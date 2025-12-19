// API route for Combined calculations (Ατομική + Εταιρεία)
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Save or update combined calculation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Μη εξουσιοδοτημένη πρόσβαση' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { businessId, year, ...calculationData } = data;

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

    // Upsert calculation
    const calculation = await prisma.combinedCalculation.upsert({
      where: {
        businessId_year: {
          businessId,
          year: parseInt(year),
        },
      },
      update: {
        ...calculationData,
        updatedAt: new Date(),
      },
      create: {
        businessId,
        year: parseInt(year),
        ...calculationData,
      },
    });

    // Update business last calculation date
    await prisma.business.update({
      where: { id: businessId },
      data: { lastCalculationDate: new Date() },
    });

    return NextResponse.json(calculation);
  } catch (error) {
    console.error('Combined calculation error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά την αποθήκευση του υπολογισμού' },
      { status: 500 }
    );
  }
}

// Get combined calculations for a business
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

    if (!businessId) {
      return NextResponse.json(
        { error: 'Απαιτείται businessId' },
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

    // Fetch calculations
    const where: any = { businessId };
    if (year) {
      where.year = parseInt(year);
    }

    const calculations = await prisma.combinedCalculation.findMany({
      where,
      orderBy: { year: 'desc' },
    });

    return NextResponse.json(calculations);
  } catch (error) {
    console.error('Get combined calculations error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά την ανάκτηση των υπολογισμών' },
      { status: 500 }
    );
  }
}
