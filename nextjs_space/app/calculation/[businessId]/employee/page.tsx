import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { prisma } from '@/lib/db';
import { ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EmployeeCalculationPage({
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href={`/business/${business.id}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Επιστροφή στην Επιχείρηση
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 p-4 rounded-full">
              <Construction className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ατομική + Μισθωτές - Υπό Κατασκευή
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Η λειτουργία υπολογισμού για ατομική επιχείρηση και μισθωτό εισόδημα θα είναι διαθέσιμη σύντομα.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Χρησιμοποιήστε το σενάριο "Ατομική Επιχείρηση" για τους υπολογισμούς σας.
          </p>
          <Link href={`/business/${business.id}`}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Επιστροφή στη Σελίδα Επιχείρησης
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
