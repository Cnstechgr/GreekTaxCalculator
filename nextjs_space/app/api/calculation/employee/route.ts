import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST - Save or update employee income calculation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Μη εξουσιοδοτημένη πρόσβαση' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { businessId, year, ...calculationData } = data;

    if (!businessId || !year) {
      return NextResponse.json(
        { error: 'Απαιτούνται businessId και year' },
        { status: 400 }
      );
    }

    // Verify business belongs to user
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
    const calculation = await prisma.employeeIncome.upsert({
      where: {
        businessId_year: {
          businessId,
          year: parseInt(year),
        },
      },
      update: calculationData,
      create: {
        businessId,
        year: parseInt(year),
        ...calculationData,
      },
    });

    // Update business lastCalculationDate
    await prisma.business.update({
      where: { id: businessId },
      data: { lastCalculationDate: new Date() },
    });

    return NextResponse.json(calculation);
  } catch (error) {
    console.error('Employee income save error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά την αποθήκευση' },
      { status: 500 }
    );
  }
}

// GET - Fetch employee income calculations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Μη εξουσιοδοτημένη πρόσβαση' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const year = searchParams.get('year');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Απαιτείται businessId' },
        { status: 400 }
      );
    }

    // Verify business belongs to user
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

    const where: any = { businessId };
    if (year) {
      where.year = parseInt(year);
    }

    const calculations = await prisma.employeeIncome.findMany({
      where,
      orderBy: { year: 'desc' },
    });

    return NextResponse.json(calculations);
  } catch (error) {
    console.error('Employee income fetch error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά την ανάκτηση δεδομένων' },
      { status: 500 }
    );
  }
}
