'use client';

import { Building2, MapPin, Hash, Briefcase } from 'lucide-react';

interface Business {
  businessName: string;
  activity: string;
  address: string;
  taxId: string;
}

export function BusinessInfo({ business }: { business: Business }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-xl">
          <Building2 className="h-8 w-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {business.businessName}
          </h1>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Δραστηριότητα
                </div>
                <div className="text-gray-900">{business.activity}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Διεύθυνση
                </div>
                <div className="text-gray-900">{business.address}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  ΑΦΜ
                </div>
                <div className="text-gray-900 font-mono">{business.taxId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
