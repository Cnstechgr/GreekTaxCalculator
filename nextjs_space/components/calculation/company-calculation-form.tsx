'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateCompany, calculatePercentageChange, type CompanyCalculationResults } from '@/lib/tax-calculator';
import { TrendingUp, TrendingDown, Save } from 'lucide-react';

interface Props {
  businessId: string;
  currentYearData: any;
  previousYearData: any;
}

export default function CompanyCalculationForm({ businessId, currentYearData, previousYearData }: Props) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Current year inputs
  const [year, setYear] = useState(currentYear);
  const [netTurnover, setNetTurnover] = useState(0);
  const [otherOrdinaryIncome, setOtherOrdinaryIncome] = useState(0);
  const [inventoryChanges, setInventoryChanges] = useState(0);
  const [purchasesGoodsMaterials, setPurchasesGoodsMaterials] = useState(0);
  const [employeeBenefits, setEmployeeBenefits] = useState(0);
  const [depreciation, setDepreciation] = useState(0);
  const [otherExpensesLosses, setOtherExpensesLosses] = useState(0);
  const [otherIncomeGains, setOtherIncomeGains] = useState(0);
  const [interestNet, setInterestNet] = useState(0);
  const [adjustments, setAdjustments] = useState(0);
  const [carriedForwardLosses, setCarriedForwardLosses] = useState(0);
  const [businessWithholdings, setBusinessWithholdings] = useState(0);
  const [previousYearPrepayment, setPreviousYearPrepayment] = useState(0);
  const [professionalFee, setProfessionalFee] = useState(0);

  const [results, setResults] = useState<CompanyCalculationResults | null>(null);
  const [prevResults, setPrevResults] = useState<CompanyCalculationResults | null>(null);
  const [saving, setSaving] = useState(false);

  // Load existing data
  useEffect(() => {
    if (currentYearData) {
      setYear(currentYearData.year || currentYear);
      setNetTurnover(currentYearData.netTurnover || 0);
      setOtherOrdinaryIncome(currentYearData.otherOrdinaryIncome || 0);
      setInventoryChanges(currentYearData.inventoryChanges || 0);
      setPurchasesGoodsMaterials(currentYearData.purchasesGoodsMaterials || 0);
      setEmployeeBenefits(currentYearData.employeeBenefits || 0);
      setDepreciation(currentYearData.depreciation || 0);
      setOtherExpensesLosses(currentYearData.otherExpensesLosses || 0);
      setOtherIncomeGains(currentYearData.otherIncomeGains || 0);
      setInterestNet(currentYearData.interestNet || 0);
      setAdjustments(currentYearData.adjustments || 0);
      setCarriedForwardLosses(currentYearData.carriedForwardLosses || 0);
      setBusinessWithholdings(currentYearData.businessWithholdings || 0);
      setPreviousYearPrepayment(currentYearData.previousYearPrepayment || 0);
      setProfessionalFee(currentYearData.professionalFee || 0);
    }

    if (previousYearData) {
      const prevCalcResults = calculateCompany({
        netTurnover: previousYearData.netTurnover || 0,
        otherOrdinaryIncome: previousYearData.otherOrdinaryIncome || 0,
        inventoryChanges: previousYearData.inventoryChanges || 0,
        purchasesGoodsMaterials: previousYearData.purchasesGoodsMaterials || 0,
        employeeBenefits: previousYearData.employeeBenefits || 0,
        depreciation: previousYearData.depreciation || 0,
        otherExpensesLosses: previousYearData.otherExpensesLosses || 0,
        otherIncomeGains: previousYearData.otherIncomeGains || 0,
        interestNet: previousYearData.interestNet || 0,
        adjustments: previousYearData.adjustments || 0,
        carriedForwardLosses: previousYearData.carriedForwardLosses || 0,
        businessWithholdings: previousYearData.businessWithholdings || 0,
        previousYearPrepayment: previousYearData.previousYearPrepayment || 0,
        professionalFee: previousYearData.professionalFee || 0,
      });
      setPrevResults(prevCalcResults);
    }
  }, [currentYearData, previousYearData, currentYear]);

  // Recalculate on input change
  useEffect(() => {
    const inputs = {
      netTurnover,
      otherOrdinaryIncome,
      inventoryChanges,
      purchasesGoodsMaterials,
      employeeBenefits,
      depreciation,
      otherExpensesLosses,
      otherIncomeGains,
      interestNet,
      adjustments,
      carriedForwardLosses,
      businessWithholdings,
      previousYearPrepayment,
      professionalFee,
    };
    
    const calcResults = calculateCompany(inputs);
    setResults(calcResults);
  }, [
    netTurnover,
    otherOrdinaryIncome,
    inventoryChanges,
    purchasesGoodsMaterials,
    employeeBenefits,
    depreciation,
    otherExpensesLosses,
    otherIncomeGains,
    interestNet,
    adjustments,
    carriedForwardLosses,
    businessWithholdings,
    previousYearPrepayment,
    professionalFee,
  ]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/calculation/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          year,
          netTurnover,
          otherOrdinaryIncome,
          inventoryChanges,
          purchasesGoodsMaterials,
          employeeBenefits,
          depreciation,
          otherExpensesLosses,
          otherIncomeGains,
          interestNet,
          adjustments,
          carriedForwardLosses,
          businessWithholdings,
          previousYearPrepayment,
          professionalFee,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      alert('Τα δεδομένα αποθηκεύτηκαν επιτυχώς!');
      router.refresh();
    } catch (error) {
      alert('Σφάλμα κατά την αποθήκευση');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const renderPercentageChange = (current: number, previous: number | undefined) => {
    if (!previous && previous !== 0) return null;
    
    const change = calculatePercentageChange(current, previous);
    if (change === '-') return <span className="text-gray-400">-</span>;
    
    const numChange = typeof change === 'number' ? change : 0;
    const isPositive = numChange > 0;
    
    return (
      <div className={`flex items-center ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        <span className="font-semibold">
          {Math.abs(numChange).toFixed(2)}%
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* General Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Γενικές Πληροφορίες</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Έτος</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Income Statement */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Αποτελέσματα Χρήσης</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="netTurnover">Κύκλος Εργασιών (Καθαρός)</Label>
                <Input
                  id="netTurnover"
                  type="number"
                  step="0.01"
                  value={netTurnover}
                  onChange={(e) => setNetTurnover(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="otherOrdinaryIncome">Λοιπά Συνήθη Έσοδα</Label>
                <Input
                  id="otherOrdinaryIncome"
                  type="number"
                  step="0.01"
                  value={otherOrdinaryIncome}
                  onChange={(e) => setOtherOrdinaryIncome(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inventoryChanges">Μεταβολή Αποθεμάτων</Label>
                <Input
                  id="inventoryChanges"
                  type="number"
                  step="0.01"
                  value={inventoryChanges}
                  onChange={(e) => setInventoryChanges(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="purchases">Αγορές Αποθεμάτων/Εμπορευμάτων (αρνητικό)</Label>
                <Input
                  id="purchases"
                  type="number"
                  step="0.01"
                  value={purchasesGoodsMaterials}
                  onChange={(e) => setPurchasesGoodsMaterials(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeBenefits">Παροχές σε Εργαζομένους</Label>
                <Input
                  id="employeeBenefits"
                  type="number"
                  step="0.01"
                  value={employeeBenefits}
                  onChange={(e) => setEmployeeBenefits(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="depreciation">Αποσβέσεις</Label>
                <Input
                  id="depreciation"
                  type="number"
                  step="0.01"
                  value={depreciation}
                  onChange={(e) => setDepreciation(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="otherExpenses">Λοιπά Έξοδα/Ζημίες</Label>
                <Input
                  id="otherExpenses"
                  type="number"
                  step="0.01"
                  value={otherExpensesLosses}
                  onChange={(e) => setOtherExpensesLosses(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="otherIncome">Λοιπά Έσοδα/Κέρδη</Label>
                <Input
                  id="otherIncome"
                  type="number"
                  step="0.01"
                  value={otherIncomeGains}
                  onChange={(e) => setOtherIncomeGains(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interest">Τόκοι (Καθαροί)</Label>
                <Input
                  id="interest"
                  type="number"
                  step="0.01"
                  value={interestNet}
                  onChange={(e) => setInterestNet(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Adjustments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Φορολογικές Προσαρμογές</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adjustments">Προσαρμογές</Label>
                <Input
                  id="adjustments"
                  type="number"
                  step="0.01"
                  value={adjustments}
                  onChange={(e) => setAdjustments(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="carriedLosses">Ζημίες Προηγούμενων Ετών</Label>
                <Input
                  id="carriedLosses"
                  type="number"
                  step="0.01"
                  value={carriedForwardLosses}
                  onChange={(e) => setCarriedForwardLosses(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Withholdings and Fees */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Παρακρατήσεις & Τέλη</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="withholdings">Παρακρατούμενοι από Επιχειρηματική</Label>
                <Input
                  id="withholdings"
                  type="number"
                  step="0.01"
                  value={businessWithholdings}
                  onChange={(e) => setBusinessWithholdings(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="previousPrepayment">Προκ/λή Προηγ. Χρήσης</Label>
                <Input
                  id="previousPrepayment"
                  type="number"
                  step="0.01"
                  value={previousYearPrepayment}
                  onChange={(e) => setPreviousYearPrepayment(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="professionalFee">Τέλος Επιτηδεύματος</Label>
                <Input
                  id="professionalFee"
                  type="number"
                  step="0.01"
                  value={professionalFee}
                  onChange={(e) => setProfessionalFee(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
        </Button>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-6 sticky top-4">
          <h2 className="text-2xl font-bold mb-6">Αποτελέσματα Φορολογίας</h2>
          
          {results && (
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Αποτέλεσμα Προ Φόρων</div>
                <div className="text-2xl font-bold">€{results.resultBeforeTax.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
                {prevResults && (
                  <div className="mt-2">
                    {renderPercentageChange(results.resultBeforeTax, prevResults.resultBeforeTax)}
                  </div>
                )}
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Φορολογητέο Αποτέλεσμα</div>
                <div className="text-2xl font-bold">€{results.taxableResults.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
                {prevResults && (
                  <div className="mt-2">
                    {renderPercentageChange(results.taxableResults, prevResults.taxableResults)}
                  </div>
                )}
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Φόρος Πληρωτέος (22%)</div>
                <div className="text-2xl font-bold">€{results.taxDue.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
                {prevResults && (
                  <div className="mt-2">
                    {renderPercentageChange(results.taxDue, prevResults.taxDue)}
                  </div>
                )}
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Προκ/λή Επόμ. Χρήσης (80%)</div>
                <div className="text-2xl font-bold">€{results.prepaymentNextYear.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
                {prevResults && (
                  <div className="mt-2">
                    {renderPercentageChange(results.prepaymentNextYear, prevResults.prepaymentNextYear)}
                  </div>
                )}
              </div>

              <div className="bg-white/20 rounded-lg p-4 border-2 border-white/30">
                <div className="text-sm opacity-90 mb-1">Σύνολο Φόρου Δήλωσης</div>
                <div className="text-3xl font-bold">€{results.totalTaxDeclaration.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
                {prevResults && (
                  <div className="mt-2">
                    {renderPercentageChange(results.totalTaxDeclaration, prevResults.totalTaxDeclaration)}
                  </div>
                )}
              </div>

              <div className="border-t border-white/20 pt-4 mt-4">
                <h3 className="font-semibold mb-3">Συγκεντρωτικός Πίνακας</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Συνολικό Εισόδημα:</span>
                    <span className="font-semibold">€{results.totalIncome.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Σύνολο Φόρων:</span>
                    <span className="font-semibold">€{results.totalTaxes.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/20">
                    <span className="opacity-90 font-semibold">Καθαρό Εισόδημα:</span>
                    <span className="font-bold text-lg">€{results.netIncome.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
