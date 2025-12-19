import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ComparisonTable } from '@/components/calculation/comparison-table';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function ComparisonPage({
  params,
}: {
  params: { businessId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
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

  // Fetch all calculation types for the current year
  const [individual, company, employee, combined] = await Promise.all([
    prisma.individualCalculation.findUnique({
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
          year: currentYear,
        },
      },
    }),
    prisma.employeeIncome.findUnique({
      where: {
        businessId_year: {
          businessId: params.businessId,
          year: currentYear,
        },
      },
    }),
    prisma.combinedCalculation.findUnique({
      where: {
        businessId_year: {
          businessId: params.businessId,
          year: currentYear,
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardHeader user={session.user} />
      
      <div className="container mx-auto px-4 py-8">
        <Link href={`/business/${params.businessId}`}>
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Πίσω στην επιχείρηση
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Πίνακας Σύγκρισης - {business.businessName}
          </h1>
          <p className="text-gray-600">
            Συγκρίνετε διαφορετικές δομές φορολόγησης για το έτος {currentYear}
          </p>
        </div>

        <ComparisonTable
          businessId={params.businessId}
          business={business}
          year={currentYear}
          calculations={{
            individual,
            company,
            employee,
            combined,
          }}
        />
      </div>
    </div>
  );
}
