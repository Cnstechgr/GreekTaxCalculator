'use client';

import { Building2, Calendar, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Business {
  id: string;
  businessName: string;
  activity: string;
  address: string;
  taxId: string;
  updatedAt: Date;
  individualCalculations?: Array<{ year: number }>;
}

export function BusinessList({ businesses }: { businesses: Business[] }) {
  if (businesses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-50 p-4 rounded-full">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Δεν υπάρχουν επιχειρήσεις
        </h3>
        <p className="text-gray-600 mb-6">
          Προσθέστε την πρώτη σας επιχείρηση για να ξεκινήσετε
        </p>
        <Link href="/business/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Building2 className="mr-2 h-5 w-5" />
            Προσθήκη Επιχείρησης
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <div
          key={business.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                ΑΦΜ: {business.taxId}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {business.businessName}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{business.activity}</p>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Calendar className="h-3 w-3" />
              Τελευταία ενημέρωση:{' '}
              {new Date(business.updatedAt).toLocaleDateString('el-GR')}
            </div>

            {business.individualCalculations && business.individualCalculations.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg mb-4">
                <FileText className="h-3 w-3" />
                Υπολογισμοί: {business.individualCalculations[0].year}
              </div>
            )}

            <Link href={`/business/${business.id}`}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Άνοιγμα
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
