import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { BusinessList } from '@/components/dashboard/business-list';
import { prisma } from '@/lib/db';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Όλες οι Επιχειρήσεις
          </h1>
          <p className="text-gray-600">
            Διαχειρίστε τις επιχειρήσεις σας και τους φορολογικούς υπολογισμούς
          </p>
        </div>

        <BusinessList businesses={businesses} />
      </div>
    </div>
  );
}
