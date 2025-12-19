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
    const { businessName, activity, address, taxId } = body;

    if (!businessName || !activity || !address || !taxId) {
      return NextResponse.json(
        { error: 'Όλα τα πεδία είναι υποχρεωτικά' },
        { status: 400 }
      );
    }

    // Validate tax ID (9 digits)
    if (!/^\d{9}$/.test(taxId)) {
      return NextResponse.json(
        { error: 'Ο ΑΦΜ πρέπει να είναι 9 ψηφία' },
        { status: 400 }
      );
    }

    const business = await prisma.business.create({
      data: {
        userId: session.user.id,
        businessName,
        activity,
        address,
        taxId,
      },
    });

    return NextResponse.json({ business }, { status: 201 });
  } catch (error) {
    console.error('Business creation error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά τη δημιουργία της επιχείρησης' },
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

    const businesses = await prisma.business.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        individualCalculations: {
          orderBy: { year: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json({ businesses });
  } catch (error) {
    console.error('Business fetch error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά την ανάκτηση επιχειρήσεων' },
      { status: 500 }
    );
  }
}
