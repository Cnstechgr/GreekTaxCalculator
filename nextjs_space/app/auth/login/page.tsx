import { LoginForm } from '@/components/auth/login-form';
import { Calculator } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Φορολογικός Υπολογιστής
          </h1>
          <p className="text-gray-600">
            Σύνδεση στον λογαριασμό σας
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoginForm />
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Δεν έχετε λογαριασμό;{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Εγγραφή
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
