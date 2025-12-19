import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Μη εξουσιοδοτημένος' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { businessId, year, ...data } = body;

    if (!businessId || !year) {
      return NextResponse.json(
        { error: 'Λείπουν απαιτούμενα στοιχεία' },
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
    const calculation = await prisma.individualCalculation.upsert({
      where: {
        businessId_year: {
          businessId,
          year: parseInt(year),
        },
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        businessId,
        year: parseInt(year),
        ...data,
      },
    });

    // Update business lastCalculationDate
    await prisma.business.update({
      where: { id: businessId },
      data: { lastCalculationDate: new Date() },
    });

    return NextResponse.json({ calculation }, { status: 200 });
  } catch (error) {
    console.error('Calculation save error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά την αποθήκευση' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Μη εξουσιοδοτημένος' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const year = searchParams.get('year');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Λείπει το ID της επιχείρησης' },
        { status: 400 }
      );
    }

    const where: any = {
      businessId,
      business: {
        userId: session.user.id,
      },
    };

    if (year) {
      where.year = parseInt(year);
    }

    const calculations = await prisma.individualCalculation.findMany({
      where,
      orderBy: { year: 'desc' },
    });

    return NextResponse.json({ calculations });
  } catch (error) {
    console.error('Calculation fetch error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά την ανάκτηση' },
      { status: 500 }
    );
  }
}
