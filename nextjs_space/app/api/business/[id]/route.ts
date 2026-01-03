import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// DELETE /api/business/[id] - Delete a business
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Μη εξουσιοδοτημένη πρόσβαση' },
        { status: 401 }
      );
    }

    const businessId = params.id;

    // Check if business exists and belongs to the user
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Η επιχείρηση δεν βρέθηκε' },
        { status: 404 }
      );
    }

    if (business.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Δεν έχετε δικαίωμα διαγραφής αυτής της επιχείρησης' },
        { status: 403 }
      );
    }

    // Delete the business (cascading deletes will remove related calculations)
    await prisma.business.delete({
      where: { id: businessId },
    });

    return NextResponse.json(
      { message: 'Η επιχείρηση διαγράφηκε επιτυχώς' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete business error:', error);
    return NextResponse.json(
      { error: 'Σφάλμα κατά τη διαγραφή της επιχείρησης' },
      { status: 500 }
    );
  }
}
