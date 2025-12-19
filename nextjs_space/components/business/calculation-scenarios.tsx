'use client';

import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  FileBarChart, 
  Calculator 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export function CalculationScenarios({ businessId }: { businessId: string }) {
  const router = useRouter();

  const scenarios: Scenario[] = [
    {
      id: 'individual',
      title: 'Ατομική Επιχείρηση ✓',
      description: 'Προοδευτική κλίμακα 9-44% - Τεκμαρτή φορολόγηση',
      icon: <Briefcase className="h-6 w-6" />,
      path: `/calculation/${businessId}/individual`,
      color: 'blue',
    },
    {
      id: 'company',
      title: 'Εταιρεία ✓',
      description: 'Εταιρικός φόρος 22% - Προκαταβολή 80%',
      icon: <Building2 className="h-6 w-6" />,
      path: `/calculation/${businessId}/company`,
      color: 'green',
    },
    {
      id: 'individual_employee',
      title: 'Ατομική + Μισθωτές ✓',
      description: 'Επιχείρηση και μισθωτό εισόδημα',
      icon: <Users className="h-6 w-6" />,
      path: `/calculation/${businessId}/employee`,
      color: 'orange',
    },
    {
      id: 'individual_company',
      title: 'Ατομική + Εταιρεία ✓',
      description: 'Συνδυασμένος υπολογισμός - Ξεχωριστή φορολόγηση',
      icon: <TrendingUp className="h-6 w-6" />,
      path: `/calculation/${businessId}/combined`,
      color: 'purple',
    },
    {
      id: 'comparison',
      title: 'Πίνακας Σύγκρισης ✓',
      description: 'Συγκρίνετε όλα τα σενάρια δίπλα-δίπλα',
      icon: <FileBarChart className="h-6 w-6" />,
      path: `/calculation/${businessId}/compare`,
      color: 'indigo',
    },
    {
      id: 'full',
      title: 'Πλήρης Συνδυασμός ✓',
      description: 'Όλες οι πηγές εισοδήματος - Οδηγίες και πρόσβαση',
      icon: <Calculator className="h-6 w-6" />,
      path: `/calculation/${businessId}/full`,
      color: 'red',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:bg-blue-100', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:bg-green-100', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:bg-purple-100', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:bg-orange-100', border: 'border-orange-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', hover: 'hover:bg-indigo-100', border: 'border-indigo-200' },
      red: { bg: 'bg-red-50', text: 'text-red-600', hover: 'hover:bg-red-100', border: 'border-red-200' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scenarios.map((scenario) => {
        const colorClasses = getColorClasses(scenario.color);
        return (
          <div
            key={scenario.id}
            className={`bg-white rounded-xl border-2 ${colorClasses.border} p-6 transition-all hover:shadow-lg cursor-pointer group`}
            onClick={() => router.push(scenario.path)}
          >
            <div className={`${colorClasses.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses.text} group-hover:scale-110 transition-transform`}>
              {scenario.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {scenario.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {scenario.description}
            </p>
            <Button 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                router.push(scenario.path);
              }}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Υπολογισμός
            </Button>
          </div>
        );
      })}
    </div>
  );
}
