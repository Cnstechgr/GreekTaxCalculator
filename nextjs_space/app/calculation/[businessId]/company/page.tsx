import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CompanyCalculationForm from '@/components/calculation/company-calculation-form';

export default async function CompanyCalculationPage({
  params,
}: {
  params: { businessId: string };
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

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Fetch existing calculations
  const [currentCalc, previousCalc] = await Promise.all([
    prisma.companyCalculation.findUnique({
      where: {
        businessId_year: {
          businessId: params.businessId,
          year: currentYear,
        },
      },
    }),
    prisma.companyCalculation.findUnique({
      where: {
        businessId_year: {
          businessId: params.businessId,
          year: previousYear,
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader user={{ name: session.user.name, email: session.user.email }} />
      
      <div className="container mx-auto px-4 py-8">
        <Link href={`/business/${params.businessId}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Πίσω
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Εταιρεία - {business.businessName}
          </h1>
          <p className="text-gray-600">
            Φορολογία Εταιρειών: Σταθερός συντελεστής 22%
          </p>
        </div>

        <CompanyCalculationForm
          businessId={params.businessId}
          currentYearData={currentCalc}
          previousYearData={previousCalc}
        />
      </div>
    </div>
  );
}
