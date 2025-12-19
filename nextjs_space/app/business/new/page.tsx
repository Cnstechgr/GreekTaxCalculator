import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { NewBusinessForm } from '@/components/business/new-business-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewBusinessPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Επιστροφή στον Πίνακα
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Νέα Επιχείρηση
          </h1>
          <p className="text-gray-600 mb-8">
            Συμπληρώστε τα στοιχεία της επιχείρησης
          </p>

          <NewBusinessForm />
        </div>
      </div>
    </div>
  );
}
