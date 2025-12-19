'use client';

import { formatCurrency } from '@/lib/tax-calculator';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface ComparisonTableProps {
  businessId: string;
  business: any;
  year: number;
  calculations: {
    individual: any;
    company: any;
    employee: any;
    combined: any;
  };
}

export function ComparisonTable({
  businessId,
  business,
  year,
  calculations,
}: ComparisonTableProps) {
  const { individual, company, employee, combined } = calculations;

  const scenarios = [
    {
      name: 'Ατομική Επιχείρηση',
      data: individual,
      link: `/calculation/${businessId}/individual`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Εταιρεία',
      data: company,
      link: `/calculation/${businessId}/company`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Ατομική & Μισθωτές',
      data: employee,
      link: `/calculation/${businessId}/employee`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Ατομική + Εταιρεία',
      data: combined,
      link: `/calculation/${businessId}/combined`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const handleExport = async (calculationType: string, format: 'pdf' | 'excel' | 'word') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          year,
          calculationType,
          format,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${calculationType}-${year}.${format === 'excel' ? 'xlsx' : format === 'word' ? 'docx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Η εξαγωγή ολοκληρώθηκε!');
      } else {
        toast.error('Σφάλμα κατά την εξαγωγή');
      }
    } catch (error) {
      toast.error('Σφάλμα δικτύου');
    }
  };

  return (
    <div className="space-y-6">
      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.name}
            className={`${scenario.bgColor} rounded-lg p-4 border-2 ${
              scenario.data ? 'border-current' : 'border-gray-200'
            }`}
          >
            <h3 className={`font-bold text-lg mb-2 ${scenario.color}`}>
              {scenario.name}
            </h3>
            <div className="space-y-2 text-sm mb-4">
              {scenario.data ? (
                <>
                  <div>
                    <span className="text-gray-600">Φορολογητέο:</span>
                    <div className="font-semibold">
                      {formatCurrency(
                        scenario.data.taxableIncome ||
                          scenario.data.taxableResults ||
                          scenario.data.totalTaxableIncome ||
                          scenario.data.totalIncome ||
                          0
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Φόρος:</span>
                    <div className="font-semibold">
                      {formatCurrency(
                        scenario.data.taxDue ||
                          scenario.data.netTaxDue ||
                          scenario.data.totalTaxes ||
                          0
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Καθαρό:</span>
                    <div className="font-semibold">
                      {formatCurrency(scenario.data.netIncome || scenario.data.totalNetIncome || 0)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 italic">Δεν υπάρχουν δεδομένα</div>
              )}
            </div>
            <div className="space-y-2">
              <Link href={scenario.link}>
                <Button variant="outline" className="w-full" size="sm">
                  {scenario.data ? 'Επεξεργασία' : 'Δημιουργία'}
                </Button>
              </Link>
              {scenario.data && (
                <div className="flex gap-1">
                  <Button
                    onClick={() => handleExport(scenario.name.toLowerCase().replace(/[^a-z]/g, ''), 'pdf')}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                  <Button
                    onClick={() => handleExport(scenario.name.toLowerCase().replace(/[^a-z]/g, ''), 'excel')}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Excel
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Πεδίο
                </th>
                {scenarios.map((scenario) => (
                  <th
                    key={scenario.name}
                    className={`px-4 py-3 text-center text-sm font-semibold ${scenario.color}`}
                  >
                    {scenario.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <ComparisonRow
                label="Φορολογητέο Εισόδημα"
                values={[
                  individual?.taxableIncome,
                  company?.taxableResults,
                  employee?.totalTaxableIncome,
                  combined?.totalIncome,
                ]}
              />
              <ComparisonRow
                label="Φόρος που Αναλογεί"
                values={[
                  individual?.taxDue,
                  company?.taxDue,
                  employee?.netTaxDue,
                  combined?.totalTaxes,
                ]}
              />
              <ComparisonRow
                label="Προκαταβολή Επόμενης Χρήσης"
                values={[
                  individual?.prepaymentNextYear,
                  company?.prepaymentNextYear,
                  employee?.prepaymentNextYear,
                  combined?.totalPrepayment,
                ]}
              />
              <ComparisonRow
                label="Σύνολο Φόρου Δήλωσης"
                values={[
                  individual?.totalTaxDeclaration,
                  company?.totalTaxDeclaration,
                  employee?.totalTaxDeclaration,
                  combined?.overallTaxDeclaration,
                ]}
                highlight
              />
              <ComparisonRow
                label="Καθαρό Εισόδημα"
                values={[
                  individual?.netIncome,
                  company?.netIncome,
                  employee?.netIncome,
                  combined?.totalNetIncome,
                ]}
                highlight
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Σύνοψη</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenarios.map((scenario) => {
            if (!scenario.data) return null;
            const netIncome = scenario.data.netIncome || scenario.data.totalNetIncome || 0;
            return (
              <div key={scenario.name} className="bg-white rounded-lg p-4">
                <div className={`text-sm font-medium ${scenario.color} mb-1`}>
                  {scenario.name}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(netIncome)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Καθαρό Εισόδημα</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  values,
  highlight = false,
}: {
  label: string;
  values: (number | null | undefined)[];
  highlight?: boolean;
}) {
  return (
    <tr className={highlight ? 'bg-yellow-50' : ''}>
      <td className={`px-4 py-3 text-sm ${
        highlight ? 'font-semibold text-gray-900' : 'text-gray-700'
      }`}>
        {label}
      </td>
      {values.map((value, index) => (
        <td key={index} className="px-4 py-3 text-sm text-center">
          {value !== null && value !== undefined ? (
            <span className={highlight ? 'font-bold text-gray-900' : 'text-gray-700'}>
              {formatCurrency(value)}
            </span>
          ) : (
            <span className="text-gray-400 italic">-</span>
          )}
        </td>
      ))}
    </tr>
  );
}
