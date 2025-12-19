import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { prisma } from '@/lib/db';
import { IndividualCalculationForm } from '@/components/calculation/individual-calculation-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function IndividualCalculationPage({
  params,
  searchParams,
}: {
  params: { businessId: string };
  searchParams: { year?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const business = await prisma.business.findFirst({
    where: {
      id: params.businessId,
      userId: session.user.id,
    },
  });

  if (!business) {
    redirect('/dashboard');
  }

  const currentYear = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear();

  // Fetch existing calculations for both current and previous year
  const [currentYearCalc, previousYearCalc] = await Promise.all([
    prisma.individualCalculation.findUnique({
      where: {
        businessId_year: {
          businessId: business.id,
          year: currentYear,
        },
      },
    }),
    prisma.individualCalculation.findUnique({
      where: {
        businessId_year: {
          businessId: business.id,
          year: currentYear - 1,
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href={`/business/${business.id}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Επιστροφή στην Επιχείρηση
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Ατομική Επιχείρηση - {business.businessName}
            </h1>
            <p className="text-gray-600">
              Υπολογισμός φόρων με προοδευτική κλίμακα (9%-44%)
            </p>
          </div>

          <IndividualCalculationForm
            business={business}
            currentYear={currentYear}
            currentYearData={currentYearCalc}
            previousYearData={previousYearCalc}
          />
        </div>
      </div>
    </div>
  );
}
