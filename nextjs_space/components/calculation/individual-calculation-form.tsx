'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateIndividualBusiness, formatCurrency, calculatePercentageChange } from '@/lib/tax-calculator';
import { Save, Calculator, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface FormData {
  // Current year inputs
  netTurnover: number;
  otherOrdinaryIncome: number;
  inventoryChanges: number;
  purchasesGoodsMaterials: number;
  employeeBenefits: number;
  depreciation: number;
  otherExpensesLosses: number;
  otherIncomeGains: number;
  interestNet: number;
  adjustments: number;
  carriedForwardLosses: number;
  deemedTaxation: number;
  businessWithholdings: number;
  previousYearPrepayment: number;
}

export function IndividualCalculationForm({
  business,
  currentYear,
  currentYearData,
  previousYearData,
}: {
  business: { id: string; businessName: string; activity: string; address: string; taxId: string };
  currentYear: number;
  currentYearData: any;
  previousYearData: any;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<FormData>({
    netTurnover: currentYearData?.netTurnover || 0,
    otherOrdinaryIncome: currentYearData?.otherOrdinaryIncome || 0,
    inventoryChanges: currentYearData?.inventoryChanges || 0,
    purchasesGoodsMaterials: currentYearData?.purchasesGoodsMaterials || 0,
    employeeBenefits: currentYearData?.employeeBenefits || 0,
    depreciation: currentYearData?.depreciation || 0,
    otherExpensesLosses: currentYearData?.otherExpensesLosses || 0,
    otherIncomeGains: currentYearData?.otherIncomeGains || 0,
    interestNet: currentYearData?.interestNet || 0,
    adjustments: currentYearData?.adjustments || 0,
    carriedForwardLosses: currentYearData?.carriedForwardLosses || 0,
    deemedTaxation: currentYearData?.deemedTaxation || 0,
    businessWithholdings: currentYearData?.businessWithholdings || 0,
    previousYearPrepayment: previousYearData?.prepaymentNextYear || 0,
  });

  const [results, setResults] = useState(calculateIndividualBusiness(formData));
  const [prevResults, setPrevResults] = useState<any>(null);

  useEffect(() => {
    const calculated = calculateIndividualBusiness(formData);
    setResults(calculated);
  }, [formData]);

  useEffect(() => {
    if (previousYearData) {
      const prevCalc = calculateIndividualBusiness({
        netTurnover: previousYearData.netTurnover,
        otherOrdinaryIncome: previousYearData.otherOrdinaryIncome,
        inventoryChanges: previousYearData.inventoryChanges,
        purchasesGoodsMaterials: previousYearData.purchasesGoodsMaterials,
        employeeBenefits: previousYearData.employeeBenefits,
        depreciation: previousYearData.depreciation,
        otherExpensesLosses: previousYearData.otherExpensesLosses,
        otherIncomeGains: previousYearData.otherIncomeGains,
        interestNet: previousYearData.interestNet,
        adjustments: previousYearData.adjustments,
        carriedForwardLosses: previousYearData.carriedForwardLosses,
        deemedTaxation: previousYearData.deemedTaxation,
        businessWithholdings: previousYearData.businessWithholdings,
        previousYearPrepayment: previousYearData.previousYearPrepayment,
      });
      setPrevResults(prevCalc);
    }
  }, [previousYearData]);

  const handleChange = (field: keyof FormData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/calculation/individual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          year: currentYear,
          ...formData,
          ...results,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Σφάλμα κατά την αποθήκευση');
      } else {
        setSuccess('Ο υπολογισμός αποθηκεύτηκε επιτυχώς!');
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      setError('Σφάλμα κατά την αποθήκευση');
    } finally {
      setIsLoading(false);
    }
  };

  const renderComparison = (current: number, previous: number | null) => {
    if (previous === null) return null;
    const change = calculatePercentageChange(current, previous);
    if (change === '-') return <span className="text-gray-400">-</span>;
    const changeNum = typeof change === 'number' ? change : 0;
    const isPositive = changeNum > 0;
    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        {Math.abs(changeNum).toFixed(2)}%
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Business Header Info */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Επωνυμία:</span>
            <span className="ml-2 font-medium">{business.businessName}</span>
          </div>
          <div>
            <span className="text-gray-600">Δραστηριότητα:</span>
            <span className="ml-2 font-medium">{business.activity}</span>
          </div>
          <div>
            <span className="text-gray-600">ΑΦΜ:</span>
            <span className="ml-2 font-medium font-mono">{business.taxId}</span>
          </div>
        </div>
      </div>

      {/* Income Statement Inputs */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ΚΑΤΑΣΤΑΣΗ ΑΠΟΤΕΛΕΣΜΑΤΩΝ {currentYear}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="netTurnover">Κύκλος Εργασιών (καθαρός)</Label>
            <Input
              id="netTurnover"
              type="number"
              step="0.01"
              value={formData.netTurnover}
              onChange={(e) => handleChange('netTurnover', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherOrdinaryIncome">Λοιπά Συνήθη Έσοδα</Label>
            <Input
              id="otherOrdinaryIncome"
              type="number"
              step="0.01"
              value={formData.otherOrdinaryIncome}
              onChange={(e) => handleChange('otherOrdinaryIncome', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventoryChanges">Μεταβολές Αποθεμάτων (+/-)</Label>
            <Input
              id="inventoryChanges"
              type="number"
              step="0.01"
              value={formData.inventoryChanges}
              onChange={(e) => handleChange('inventoryChanges', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasesGoodsMaterials">Αγορές Εμπορευμάτων (αρνητικό)</Label>
            <Input
              id="purchasesGoodsMaterials"
              type="number"
              step="0.01"
              value={formData.purchasesGoodsMaterials}
              onChange={(e) => handleChange('purchasesGoodsMaterials', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeBenefits">Παροχές σε Εργαζόμενους (αρνητικό)</Label>
            <Input
              id="employeeBenefits"
              type="number"
              step="0.01"
              value={formData.employeeBenefits}
              onChange={(e) => handleChange('employeeBenefits', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="depreciation">Αποσβέσεις (αρνητικό)</Label>
            <Input
              id="depreciation"
              type="number"
              step="0.01"
              value={formData.depreciation}
              onChange={(e) => handleChange('depreciation', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherExpensesLosses">Λοιπά Έξοδα και Ζημιές (αρνητικό)</Label>
            <Input
              id="otherExpensesLosses"
              type="number"
              step="0.01"
              value={formData.otherExpensesLosses}
              onChange={(e) => handleChange('otherExpensesLosses', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherIncomeGains">Λοιπά Έσοδα και Κέρδη</Label>
            <Input
              id="otherIncomeGains"
              type="number"
              step="0.01"
              value={formData.otherIncomeGains}
              onChange={(e) => handleChange('otherIncomeGains', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestNet">Τόκοι και Συναφή Κονδύλια (καθαρό)</Label>
            <Input
              id="interestNet"
              type="number"
              step="0.01"
              value={formData.interestNet}
              onChange={(e) => handleChange('interestNet', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adjustments">Αναμορφώσεις</Label>
            <Input
              id="adjustments"
              type="number"
              step="0.01"
              value={formData.adjustments}
              onChange={(e) => handleChange('adjustments', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carriedForwardLosses">Μεταφερόμενες Ζημιές</Label>
            <Input
              id="carriedForwardLosses"
              type="number"
              step="0.01"
              value={formData.carriedForwardLosses}
              onChange={(e) => handleChange('carriedForwardLosses', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deemedTaxation">Τεκμαρτή Φορολόγηση</Label>
            <Input
              id="deemedTaxation"
              type="number"
              step="0.01"
              value={formData.deemedTaxation}
              onChange={(e) => handleChange('deemedTaxation', e.target.value)}
              className="h-11"
            />
            <p className="text-xs text-gray-500">
              Ποσό τεκμαρτής φορολόγησης από τρόπο ζωής
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessWithholdings">Παρακρατούμενοι Από Επιχείρηση</Label>
            <Input
              id="businessWithholdings"
              type="number"
              step="0.01"
              value={formData.businessWithholdings}
              onChange={(e) => handleChange('businessWithholdings', e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousYearPrepayment">Προκαταβολή Προηγ. Χρήσης</Label>
            <Input
              id="previousYearPrepayment"
              type="number"
              step="0.01"
              value={formData.previousYearPrepayment}
              onChange={(e) => handleChange('previousYearPrepayment', e.target.value)}
              className="h-11"
              disabled={!!previousYearData}
            />
            {previousYearData && (
              <p className="text-xs text-green-600">
                Αυτόματα από το {currentYear - 1}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Αποτελέσματα Υπολογισμών
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Αποτέλεσμα Προ Φόρων</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(results.resultBeforeTax)}</div>
            {prevResults && renderComparison(results.resultBeforeTax, prevResults.resultBeforeTax)}
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Φορολογητέο Εισόδημα</div>
            <div className="text-xl font-bold text-blue-600">{formatCurrency(results.taxableIncome)}</div>
            {prevResults && renderComparison(results.taxableIncome, prevResults.taxableIncome)}
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Φόρος Που Αναλογεί</div>
            <div className="text-xl font-bold text-red-600">{formatCurrency(results.taxDue)}</div>
            {prevResults && renderComparison(results.taxDue, prevResults.taxDue)}
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Προκαταβολή Επόμ. Χρήσης</div>
            <div className="text-xl font-bold text-orange-600">{formatCurrency(results.prepaymentNextYear)}</div>
            {prevResults && renderComparison(results.prepaymentNextYear, prevResults.prepaymentNextYear)}
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Σύνολο Φόρου Δήλωσης</div>
            <div className="text-xl font-bold text-purple-600">{formatCurrency(results.totalTaxDeclaration)}</div>
            {prevResults && renderComparison(results.totalTaxDeclaration, prevResults.totalTaxDeclaration)}
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Ελάχ. Δαπάνες Με Κάρτα</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(results.minimumCardSpending)}</div>
            {prevResults && renderComparison(results.minimumCardSpending, prevResults.minimumCardSpending)}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t-2 border-blue-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl">
              <div className="text-sm mb-1 opacity-90">Συνολικό Εισόδημα</div>
              <div className="text-2xl font-bold">{formatCurrency(results.totalIncome)}</div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-xl">
              <div className="text-sm mb-1 opacity-90">Σύνολο Φόρων</div>
              <div className="text-2xl font-bold">{formatCurrency(results.totalTaxes)}</div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-xl">
              <div className="text-sm mb-1 opacity-90">Καθαρό Εισόδημα</div>
              <div className="text-2xl font-bold">{formatCurrency(results.netIncome)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Αποθήκευση...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Αποθήκευση Υπολογισμού
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
