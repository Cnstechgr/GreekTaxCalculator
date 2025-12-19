import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { prisma } from '@/lib/db';
import { ChevronLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function FullCalculationPage({
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
            Πλήρης Συνδυασμός - {business.businessName}
          </h1>
          <p className="text-gray-600">
            Ολοκληρωμένη ανάλυση όλων των πηγών εισοδήματος: Ατομική + Εταιρεία + Μισθωτές
          </p>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                Χρήση Ξεχωριστών Σεναρίων
              </h2>
              <p className="text-blue-800 mb-4">
                Για την πλήρη ανάλυση όλων των πηγών εισοδήματος, μπορείτε να χρησιμοποιήσετε τα ακόλουθα σενάρια:
              </p>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-lg mb-2">1. Ατομική + Εταιρεία</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Συνδυάζει ατομική επιχείρηση με εταιρεία για ξεχωριστή φορολόγηση
                  </p>
                  <Link href={`/calculation/${params.businessId}/combined`}>
                    <Button variant="outline" className="w-full">
                      Άνοιγμα Σεναρίου Ατομική + Εταιρεία
                    </Button>
                  </Link>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-lg mb-2">2. Ατομική & Μισθωτές</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Συνδυάζει ατομική επιχείρηση με μισθωτό εισόδημα
                  </p>
                  <Link href={`/calculation/${params.businessId}/employee`}>
                    <Button variant="outline" className="w-full">
                      Άνοιγμα Σεναρίου Ατομική & Μισθωτές
                    </Button>
                  </Link>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-lg mb-2">3. Πίνακας Σύγκρισης</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Συγκρίνετε όλα τα σενάρια και δείτε αναλυτικά αποτελέσματα
                  </p>
                  <Link href={`/calculation/${params.businessId}/compare`}>
                    <Button variant="outline" className="w-full">
                      Άνοιγμα Πίνακα Σύγκρισης
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Συμβουλές</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Χρησιμοποιήστε το σενάριο "Ατομική + Εταιρεία" αν έχετε και ατομική επιχείρηση και εταιρεία</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Χρησιμοποιήστε το σενάριο "Ατομική & Μισθωτές" αν έχετε ατομική επιχείρηση και μισθωτό εισόδημα</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Ο πίνακας σύγκρισης σας επιτρέπει να δείτε όλα τα σενάρια δίπλα-δίπλα</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Μπορείτε να εξάγετε τα αποτελέσματα σε PDF, Excel ή Word από κάθε σενάριο</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
