import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Calculator, TrendingUp, FileText, Building2, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
                <Calculator className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Φορολογικός Υπολογιστής
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Επαγγελματική εφαρμογή υπολογισμού φόρων για λογιστές και επιχειρήσεις
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 h-12 px-8">
                  Σύνδεση
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-900 h-12 px-8">
                  Εγγραφή
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Χαρακτηριστικά
            </h2>
            <p className="text-lg text-gray-600">
              Πλήρης λύση για τον υπολογισμό φόρων στην Ελλάδα
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                7 Σενάρια Φορολόγησης
              </h3>
              <p className="text-gray-600">
                Ατομική, Εταιρεία, Μισθωτές και συνδυασμένα σενάρια
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="bg-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Εξαγωγή Αναφορών
              </h3>
              <p className="text-gray-600">
                PDF, Excel, Word - όλα τα αποτελέσματα σε μία κίνηση
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
              <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Βάση Δεδομένων
              </h3>
              <p className="text-gray-600">
                Αποθήκευση και διαχείριση επιχειρήσεων
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Scenarios Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Σενάρια Υπολογισμών
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Ατομική Επιχείρηση</h3>
              <p className="text-sm text-gray-600">Προοδευτική κλίμακα 9-44%</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Εταιρεία</h3>
              <p className="text-sm text-gray-600">Φόρος 22%</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Ατομική + Εταιρεία</h3>
              <p className="text-sm text-gray-600">Συνδυασμένος υπολογισμός</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Ατομική + Μισθωτές</h3>
              <p className="text-sm text-gray-600">Επιχείρηση + μισθωτό εισόδημα</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Πλήρης Σύνδυασμός</h3>
              <p className="text-sm text-gray-600">Όλες οι πηγές εισοδήματος</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Συγκριτικοί Πίνακες</h3>
              <p className="text-sm text-gray-600">Ανάλυση σεναρίων</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-200">
            © 2025 Φορολογικός Υπολογιστής. Επαγγελματική εφαρμογή για λογιστές.
          </p>
        </div>
      </div>
    </div>
  );
}
