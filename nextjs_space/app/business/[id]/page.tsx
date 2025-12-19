import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { BusinessInfo } from '@/components/business/business-info';
import { CalculationScenarios } from '@/components/business/calculation-scenarios';
import { prisma } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function BusinessDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const business = await prisma.business.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      individualCalculations: {
        orderBy: { year: 'desc' },
      },
      companyCalculations: {
        orderBy: { year: 'desc' },
      },
      employeeIncomes: {
        orderBy: { year: 'desc' },
      },
    },
  });

  if (!business) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Επιστροφή στον Πίνακα
        </Link>

        <BusinessInfo business={business} />

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Επιλέξτε Σενάριο Υπολογισμού
          </h2>
          <p className="text-gray-600 mb-6">
            Διαλέξτε τον τύπο φορολογικής αναφοράς που θέλετε να υπολογίσετε
          </p>
          <CalculationScenarios businessId={business.id} />
        </div>
      </div>
    </div>
  );
}
