'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { calculateCombined, calculatePercentageChange, formatCurrency, formatPercentage } from '@/lib/tax-calculator';
import { toast } from 'react-hot-toast';

interface CombinedCalculationFormProps {
  businessId: string;
  currentYear: number;
  currentData: any;
  previousData: any;
}

export function CombinedCalculationForm({
  businessId,
  currentYear,
  currentData,
  previousData,
}: CombinedCalculationFormProps) {
  const router = useRouter();

  // Individual inputs
  const [individualInputs, setIndividualInputs] = useState({
    netTurnover: 0,
    otherOrdinaryIncome: 0,
    inventoryChanges: 0,
    purchasesGoodsMaterials: 0,
    employeeBenefits: 0,
    depreciation: 0,
    otherExpensesLosses: 0,
    otherIncomeGains: 0,
    interestNet: 0,
    adjustments: 0,
    carriedForwardLosses: 0,
    deemedTaxation: 0,
    businessWithholdings: 0,
    previousYearPrepayment: 0,
  });

  // Company inputs
  const [companyInputs, setCompanyInputs] = useState({
    netTurnover: 0,
    otherOrdinaryIncome: 0,
    inventoryChanges: 0,
    purchasesGoodsMaterials: 0,
    employeeBenefits: 0,
    depreciation: 0,
    otherExpensesLosses: 0,
    otherIncomeGains: 0,
    interestNet: 0,
    adjustments: 0,
    carriedForwardLosses: 0,
    businessWithholdings: 0,
    previousYearPrepayment: 0,
    professionalFee: 0,
  });

  const [results, setResults] = useState<any>(null);
  const [previousResults, setPreviousResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing data
  useEffect(() => {
    if (currentData) {
      setIndividualInputs({
        netTurnover: currentData.individualNetTurnover || 0,
        otherOrdinaryIncome: currentData.individualOtherOrdinaryIncome || 0,
        inventoryChanges: currentData.individualInventoryChanges || 0,
        purchasesGoodsMaterials: currentData.individualPurchasesGoodsMaterials || 0,
        employeeBenefits: currentData.individualEmployeeBenefits || 0,
        depreciation: currentData.individualDepreciation || 0,
        otherExpensesLosses: currentData.individualOtherExpensesLosses || 0,
        otherIncomeGains: currentData.individualOtherIncomeGains || 0,
        interestNet: currentData.individualInterestNet || 0,
        adjustments: currentData.individualAdjustments || 0,
        carriedForwardLosses: currentData.individualCarriedForwardLosses || 0,
        deemedTaxation: currentData.individualDeemedTaxation || 0,
        businessWithholdings: currentData.individualBusinessWithholdings || 0,
        previousYearPrepayment: currentData.individualPreviousYearPrepayment || 0,
      });

      setCompanyInputs({
        netTurnover: currentData.companyNetTurnover || 0,
        otherOrdinaryIncome: currentData.companyOtherOrdinaryIncome || 0,
        inventoryChanges: currentData.companyInventoryChanges || 0,
        purchasesGoodsMaterials: currentData.companyPurchasesGoodsMaterials || 0,
        employeeBenefits: currentData.companyEmployeeBenefits || 0,
        depreciation: currentData.companyDepreciation || 0,
        otherExpensesLosses: currentData.companyOtherExpensesLosses || 0,
        otherIncomeGains: currentData.companyOtherIncomeGains || 0,
        interestNet: currentData.companyInterestNet || 0,
        adjustments: currentData.companyAdjustments || 0,
        carriedForwardLosses: currentData.companyCarriedForwardLosses || 0,
        businessWithholdings: currentData.companyBusinessWithholdings || 0,
        previousYearPrepayment: currentData.companyPreviousYearPrepayment || 0,
        professionalFee: currentData.companyProfessionalFee || 0,
      });
    }
  }, [currentData]);

  // Calculate results whenever inputs change
  useEffect(() => {
    const calculatedResults = calculateCombined(individualInputs, companyInputs);
    setResults(calculatedResults);
  }, [individualInputs, companyInputs]);

  // Calculate previous year results
  useEffect(() => {
    if (previousData) {
      const prevIndividualInputs = {
        netTurnover: previousData.individualNetTurnover || 0,
        otherOrdinaryIncome: previousData.individualOtherOrdinaryIncome || 0,
        inventoryChanges: previousData.individualInventoryChanges || 0,
        purchasesGoodsMaterials: previousData.individualPurchasesGoodsMaterials || 0,
        employeeBenefits: previousData.individualEmployeeBenefits || 0,
        depreciation: previousData.individualDepreciation || 0,
        otherExpensesLosses: previousData.individualOtherExpensesLosses || 0,
        otherIncomeGains: previousData.individualOtherIncomeGains || 0,
        interestNet: previousData.individualInterestNet || 0,
        adjustments: previousData.individualAdjustments || 0,
        carriedForwardLosses: previousData.individualCarriedForwardLosses || 0,
        deemedTaxation: previousData.individualDeemedTaxation || 0,
        businessWithholdings: previousData.individualBusinessWithholdings || 0,
        previousYearPrepayment: previousData.individualPreviousYearPrepayment || 0,
      };

      const prevCompanyInputs = {
        netTurnover: previousData.companyNetTurnover || 0,
        otherOrdinaryIncome: previousData.companyOtherOrdinaryIncome || 0,
        inventoryChanges: previousData.companyInventoryChanges || 0,
        purchasesGoodsMaterials: previousData.companyPurchasesGoodsMaterials || 0,
        employeeBenefits: previousData.companyEmployeeBenefits || 0,
        depreciation: previousData.companyDepreciation || 0,
        otherExpensesLosses: previousData.companyOtherExpensesLosses || 0,
        otherIncomeGains: previousData.companyOtherIncomeGains || 0,
        interestNet: previousData.companyInterestNet || 0,
        adjustments: previousData.companyAdjustments || 0,
        carriedForwardLosses: previousData.companyCarriedForwardLosses || 0,
        businessWithholdings: previousData.companyBusinessWithholdings || 0,
        previousYearPrepayment: previousData.companyPreviousYearPrepayment || 0,
        professionalFee: previousData.companyProfessionalFee || 0,
      };

      const prevResults = calculateCombined(prevIndividualInputs, prevCompanyInputs);
      setPreviousResults(prevResults);
    }
  }, [previousData]);

  const handleIndividualChange = (field: string, value: string) => {
    setIndividualInputs((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyInputs((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/calculation/combined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          year: currentYear,
          // Individual inputs
          individualNetTurnover: individualInputs.netTurnover,
          individualOtherOrdinaryIncome: individualInputs.otherOrdinaryIncome,
          individualInventoryChanges: individualInputs.inventoryChanges,
          individualPurchasesGoodsMaterials: individualInputs.purchasesGoodsMaterials,
          individualEmployeeBenefits: individualInputs.employeeBenefits,
          individualDepreciation: individualInputs.depreciation,
          individualOtherExpensesLosses: individualInputs.otherExpensesLosses,
          individualOtherIncomeGains: individualInputs.otherIncomeGains,
          individualInterestNet: individualInputs.interestNet,
          individualAdjustments: individualInputs.adjustments,
          individualCarriedForwardLosses: individualInputs.carriedForwardLosses,
          individualDeemedTaxation: individualInputs.deemedTaxation,
          individualBusinessWithholdings: individualInputs.businessWithholdings,
          individualPreviousYearPrepayment: individualInputs.previousYearPrepayment,
          // Company inputs
          companyNetTurnover: companyInputs.netTurnover,
          companyOtherOrdinaryIncome: companyInputs.otherOrdinaryIncome,
          companyInventoryChanges: companyInputs.inventoryChanges,
          companyPurchasesGoodsMaterials: companyInputs.purchasesGoodsMaterials,
          companyEmployeeBenefits: companyInputs.employeeBenefits,
          companyDepreciation: companyInputs.depreciation,
          companyOtherExpensesLosses: companyInputs.otherExpensesLosses,
          companyOtherIncomeGains: companyInputs.otherIncomeGains,
          companyInterestNet: companyInputs.interestNet,
          companyAdjustments: companyInputs.adjustments,
          companyCarriedForwardLosses: companyInputs.carriedForwardLosses,
          companyBusinessWithholdings: companyInputs.businessWithholdings,
          companyPreviousYearPrepayment: companyInputs.previousYearPrepayment,
          companyProfessionalFee: companyInputs.professionalFee,
          // Results
          individualResultBeforeTax: results.individualResultBeforeTax,
          individualTaxableIncome: results.individualTaxableIncome,
          individualTaxDue: results.individualTaxDue,
          individualPrepayment: results.individualPrepayment,
          individualTotalTaxDeclaration: results.individualTotalTaxDeclaration,
          individualNetIncome: results.individualNetIncome,
          companyResultBeforeTax: results.companyResultBeforeTax,
          companyTaxableResults: results.companyTaxableResults,
          companyTaxDue: results.companyTaxDue,
          companyPrepayment: results.companyPrepayment,
          companyTotalTaxDeclaration: results.companyTotalTaxDeclaration,
          companyNetIncome: results.companyNetIncome,
          totalIncome: results.totalIncome,
          totalTaxes: results.totalTaxes,
          totalNetIncome: results.totalNetIncome,
          totalPrepayment: results.totalPrepayment,
          overallTaxDeclaration: results.overallTaxDeclaration,
        }),
      });

      if (response.ok) {
        toast.success('Ο υπολογισμός αποθηκεύτηκε επιτυχώς!');
        router.refresh();
      } else {
        toast.error('Σφάλμα κατά την αποθήκευση');
      }
    } catch (error) {
      toast.error('Σφάλμα δικτύου');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'word') => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          year: currentYear,
          calculationType: 'combined',
          format,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `combined-${currentYear}.${format === 'excel' ? 'xlsx' : format === 'word' ? 'docx' : 'pdf'}`;
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

  if (!results) return <div>Φόρτωση...</div>;

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
        <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? 'Αποθήκευση...' : 'Αποθήκευση'}
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('pdf')} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button onClick={() => handleExport('excel')} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Excel
          </Button>
          <Button onClick={() => handleExport('word')} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Word
          </Button>
        </div>
      </div>

      {/* Two-column layout for individual and company */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Individual Business Column */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
            Ατομική Επιχείρηση
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label>Κύκλος εργασιών (καθαρός)</Label>
              <Input
                type="number"
                value={individualInputs.netTurnover}
                onChange={(e) => handleIndividualChange('netTurnover', e.target.value)}
              />
            </div>
            
            <div>
              <Label>Λοιπά συνήθη έσοδα</Label>
              <Input
                type="number"
                value={individualInputs.otherOrdinaryIncome}
                onChange={(e) => handleIndividualChange('otherOrdinaryIncome', e.target.value)}
              />
            </div>

            <div>
              <Label>Μεταβολές αποθεμάτων</Label>
              <Input
                type="number"
                value={individualInputs.inventoryChanges}
                onChange={(e) => handleIndividualChange('inventoryChanges', e.target.value)}
              />
            </div>

            <div>
              <Label>Αγορές εμπορευμάτων (αρνητικό)</Label>
              <Input
                type="number"
                value={individualInputs.purchasesGoodsMaterials}
                onChange={(e) => handleIndividualChange('purchasesGoodsMaterials', e.target.value)}
              />
            </div>

            <div>
              <Label>Παροχές σε εργαζόμενους (αρνητικό)</Label>
              <Input
                type="number"
                value={individualInputs.employeeBenefits}
                onChange={(e) => handleIndividualChange('employeeBenefits', e.target.value)}
              />
            </div>

            <div>
              <Label>Αποσβέσεις (αρνητικό)</Label>
              <Input
                type="number"
                value={individualInputs.depreciation}
                onChange={(e) => handleIndividualChange('depreciation', e.target.value)}
              />
            </div>

            <div>
              <Label>Λοιπά έξοδα και ζημιές (αρνητικό)</Label>
              <Input
                type="number"
                value={individualInputs.otherExpensesLosses}
                onChange={(e) => handleIndividualChange('otherExpensesLosses', e.target.value)}
              />
            </div>

            <div>
              <Label>Λοιπά έσοδα και κέρδη</Label>
              <Input
                type="number"
                value={individualInputs.otherIncomeGains}
                onChange={(e) => handleIndividualChange('otherIncomeGains', e.target.value)}
              />
            </div>

            <div>
              <Label>Τόκοι και συναφή (αρνητικό)</Label>
              <Input
                type="number"
                value={individualInputs.interestNet}
                onChange={(e) => handleIndividualChange('interestNet', e.target.value)}
              />
            </div>

            <div>
              <Label>Αναμορφώσεις</Label>
              <Input
                type="number"
                value={individualInputs.adjustments}
                onChange={(e) => handleIndividualChange('adjustments', e.target.value)}
              />
            </div>

            <div>
              <Label>Μεταφερόμενες ζημίες</Label>
              <Input
                type="number"
                value={individualInputs.carriedForwardLosses}
                onChange={(e) => handleIndividualChange('carriedForwardLosses', e.target.value)}
              />
            </div>

            <div>
              <Label>Τεκμαρτή φορολόγηση</Label>
              <Input
                type="number"
                value={individualInputs.deemedTaxation}
                onChange={(e) => handleIndividualChange('deemedTaxation', e.target.value)}
              />
            </div>

            <div>
              <Label>Παρακρατούμενοι</Label>
              <Input
                type="number"
                value={individualInputs.businessWithholdings}
                onChange={(e) => handleIndividualChange('businessWithholdings', e.target.value)}
              />
            </div>

            <div>
              <Label>Προκαταβολή προηγ. χρήσης</Label>
              <Input
                type="number"
                value={individualInputs.previousYearPrepayment}
                onChange={(e) => handleIndividualChange('previousYearPrepayment', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Company Column */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
            Εταιρεία
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label>Κύκλος εργασιών (καθαρός)</Label>
              <Input
                type="number"
                value={companyInputs.netTurnover}
                onChange={(e) => handleCompanyChange('netTurnover', e.target.value)}
              />
            </div>
            
            <div>
              <Label>Λοιπά συνήθη έσοδα</Label>
              <Input
                type="number"
                value={companyInputs.otherOrdinaryIncome}
                onChange={(e) => handleCompanyChange('otherOrdinaryIncome', e.target.value)}
              />
            </div>

            <div>
              <Label>Μεταβολές αποθεμάτων</Label>
              <Input
                type="number"
                value={companyInputs.inventoryChanges}
                onChange={(e) => handleCompanyChange('inventoryChanges', e.target.value)}
              />
            </div>

            <div>
              <Label>Αγορές εμπορευμάτων (αρνητικό)</Label>
              <Input
                type="number"
                value={companyInputs.purchasesGoodsMaterials}
                onChange={(e) => handleCompanyChange('purchasesGoodsMaterials', e.target.value)}
              />
            </div>

            <div>
              <Label>Παροχές σε εργαζόμενους (αρνητικό)</Label>
              <Input
                type="number"
                value={companyInputs.employeeBenefits}
                onChange={(e) => handleCompanyChange('employeeBenefits', e.target.value)}
              />
            </div>

            <div>
              <Label>Αποσβέσεις (αρνητικό)</Label>
              <Input
                type="number"
                value={companyInputs.depreciation}
                onChange={(e) => handleCompanyChange('depreciation', e.target.value)}
              />
            </div>

            <div>
              <Label>Λοιπά έξοδα και ζημιές (αρνητικό)</Label>
              <Input
                type="number"
                value={companyInputs.otherExpensesLosses}
                onChange={(e) => handleCompanyChange('otherExpensesLosses', e.target.value)}
              />
            </div>

            <div>
              <Label>Λοιπά έσοδα και κέρδη</Label>
              <Input
                type="number"
                value={companyInputs.otherIncomeGains}
                onChange={(e) => handleCompanyChange('otherIncomeGains', e.target.value)}
              />
            </div>

            <div>
              <Label>Τόκοι και συναφή (αρνητικό)</Label>
              <Input
                type="number"
                value={companyInputs.interestNet}
                onChange={(e) => handleCompanyChange('interestNet', e.target.value)}
              />
            </div>

            <div>
              <Label>Αναμορφώσεις</Label>
              <Input
                type="number"
                value={companyInputs.adjustments}
                onChange={(e) => handleCompanyChange('adjustments', e.target.value)}
              />
            </div>

            <div>
              <Label>Μεταφερόμενες ζημίες</Label>
              <Input
                type="number"
                value={companyInputs.carriedForwardLosses}
                onChange={(e) => handleCompanyChange('carriedForwardLosses', e.target.value)}
              />
            </div>

            <div>
              <Label>Παρακρατούμενοι</Label>
              <Input
                type="number"
                value={companyInputs.businessWithholdings}
                onChange={(e) => handleCompanyChange('businessWithholdings', e.target.value)}
              />
            </div>

            <div>
              <Label>Προκαταβολή προηγ. χρήσης</Label>
              <Input
                type="number"
                value={companyInputs.previousYearPrepayment}
                onChange={(e) => handleCompanyChange('previousYearPrepayment', e.target.value)}
              />
            </div>

            <div>
              <Label>Τέλος επιτηδεύματος</Label>
              <Input
                type="number"
                value={companyInputs.professionalFee}
                onChange={(e) => handleCompanyChange('professionalFee', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Combined Results */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
          Συνδυασμένα Αποτελέσματα
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Individual Results */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-blue-600 mb-3">Ατομική</h3>
            <ResultRow
              label="Φορολογητέο εισόδημα"
              value={results.individualTaxableIncome}
              previousValue={previousResults?.individualTaxableIncome}
            />
            <ResultRow
              label="Φόρος"
              value={results.individualTaxDue}
              previousValue={previousResults?.individualTaxDue}
            />
            <ResultRow
              label="Προκαταβολή"
              value={results.individualPrepayment}
              previousValue={previousResults?.individualPrepayment}
            />
            <ResultRow
              label="Καθαρό εισόδημα"
              value={results.individualNetIncome}
              previousValue={previousResults?.individualNetIncome}
            />
          </div>

          {/* Company Results */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-green-600 mb-3">Εταιρεία</h3>
            <ResultRow
              label="Φορολογητέα αποτελέσματα"
              value={results.companyTaxableResults}
              previousValue={previousResults?.companyTaxableResults}
            />
            <ResultRow
              label="Φόρος (22%)"
              value={results.companyTaxDue}
              previousValue={previousResults?.companyTaxDue}
            />
            <ResultRow
              label="Προκαταβολή"
              value={results.companyPrepayment}
              previousValue={previousResults?.companyPrepayment}
            />
            <ResultRow
              label="Καθαρό εισόδημα"
              value={results.companyNetIncome}
              previousValue={previousResults?.companyNetIncome}
            />
          </div>

          {/* Combined Totals */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-purple-600 mb-3">Σύνολο</h3>
            <ResultRow
              label="Συνολικό εισόδημα"
              value={results.totalIncome}
              previousValue={previousResults?.totalIncome}
            />
            <ResultRow
              label="Συνολικοί φόροι"
              value={results.totalTaxes}
              previousValue={previousResults?.totalTaxes}
            />
            <ResultRow
              label="Συνολική προκαταβολή"
              value={results.totalPrepayment}
              previousValue={previousResults?.totalPrepayment}
            />
            <ResultRow
              label="Συνολικό καθαρό"
              value={results.totalNetIncome}
              previousValue={previousResults?.totalNetIncome}
              highlight
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <span className="text-lg font-bold">ΣΥΝΟΛΟ ΦΟΡΟΥ ΔΗΛΩΣΗΣ:</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(results.overallTaxDeclaration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for displaying results with comparison
function ResultRow({
  label,
  value,
  previousValue,
  highlight = false,
}: {
  label: string;
  value: number;
  previousValue?: number;
  highlight?: boolean;
}) {
  const change = previousValue !== undefined ? calculatePercentageChange(value, previousValue) : '-';
  const isPositive = typeof change === 'number' && change > 0;
  const isNegative = typeof change === 'number' && change < 0;

  return (
    <div className={`flex justify-between items-start ${highlight ? 'bg-purple-50 p-3 rounded-lg' : ''}`}>
      <div className="flex-1">
        <div className={`text-sm text-gray-600 ${highlight ? 'font-semibold' : ''}`}>{label}</div>
        <div className={`font-bold ${highlight ? 'text-xl text-purple-600' : 'text-lg'}`}>
          {formatCurrency(value)}
        </div>
      </div>
      {change !== '-' && (
        <div className="flex items-center gap-1 text-xs">
          {isPositive && <TrendingUp className="h-3 w-3 text-green-600" />}
          {isNegative && <TrendingDown className="h-3 w-3 text-red-600" />}
          <span className={isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}>
            {typeof change === 'number' ? formatPercentage(change) : change}
          </span>
        </div>
      )}
    </div>
  );
}
