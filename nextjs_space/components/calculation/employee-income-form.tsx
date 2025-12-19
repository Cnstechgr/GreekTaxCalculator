'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateEmployeeIncome, calculatePercentageChange, type EmployeeIncomeResults } from '@/lib/tax-calculator';
import { TrendingUp, TrendingDown, Save, Briefcase, User } from 'lucide-react';

interface Props {
  businessId: string;
  currentYearData: any;
  previousYearData: any;
}

export default function EmployeeIncomeForm({ businessId, currentYearData, previousYearData }: Props) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  
  // Current year inputs
  const [year, setYear] = useState(currentYear);
  
  // Business income fields
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
  const [deemedTaxation, setDeemedTaxation] = useState(0);
  
  // Employee income
  const [employeeIncome, setEmployeeIncome] = useState(0);
  
  // Tax fields
  const [taxReductions, setTaxReductions] = useState(0);
  const [employeeWithholdings, setEmployeeWithholdings] = useState(0);
  const [businessWithholdings, setBusinessWithholdings] = useState(0);
  const [previousYearPrepayment, setPreviousYearPrepayment] = useState(0);

  // Deemed taxation indicators
  const [houseSize, setHouseSize] = useState(0);
  const [isOwned, setIsOwned] = useState(true);
  const [carCC, setCarCC] = useState(0);
  const [hasPool, setHasPool] = useState(false);
  const [privateSchool, setPrivateSchool] = useState(false);
  const [domesticWorker, setDomesticWorker] = useState(false);
  const [dependents, setDependents] = useState(0);

  const [results, setResults] = useState<EmployeeIncomeResults | null>(null);
  const [prevResults, setPrevResults] = useState<EmployeeIncomeResults | null>(null);
  const [saving, setSaving] = useState(false);

  // Calculate deemed taxation
  useEffect(() => {
    let deemed = 0;
    
    // House
    if (houseSize > 0) {
      deemed += isOwned ? houseSize * 40 : houseSize * 200;
    }
    
    // Car
    if (carCC > 0) {
      deemed += (carCC * 250) * 1.15;
    }
    
    // Pool
    if (hasPool) {
      deemed += 3000;
    }
    
    // Private school
    if (privateSchool && houseSize > 0) {
      deemed += houseSize * 100;
    }
    
    // Domestic worker
    if (domesticWorker) {
      deemed += 3000;
    }
    
    // Subtract for dependents
    deemed -= dependents * 500;
    
    setDeemedTaxation(Math.max(0, deemed));
  }, [houseSize, isOwned, carCC, hasPool, privateSchool, domesticWorker, dependents]);

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
      setEmployeeIncome(currentYearData.employeeIncome || 0);
      setTaxReductions(currentYearData.taxReductions || 0);
      setEmployeeWithholdings(currentYearData.employeeWithholdings || 0);
      setBusinessWithholdings(currentYearData.businessWithholdings || 0);
      setPreviousYearPrepayment(currentYearData.previousYearPrepayment || 0);
      
      // Deemed taxation fields
      setHouseSize(currentYearData.houseSize || 0);
      setCarCC(currentYearData.carCC || 0);
      setHasPool(currentYearData.hasPool || false);
      setPrivateSchool(currentYearData.privateSchool || false);
      setDomesticWorker(currentYearData.domesticWorker || false);
      setDependents(currentYearData.dependents || 0);
    }

    if (previousYearData) {
      const prevCalcResults = calculateEmployeeIncome({
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
        deemedTaxation: previousYearData.deemedTaxation || 0,
        employeeIncome: previousYearData.employeeIncome || 0,
        taxReductions: previousYearData.taxReductions || 0,
        employeeWithholdings: previousYearData.employeeWithholdings || 0,
        businessWithholdings: previousYearData.businessWithholdings || 0,
        previousYearPrepayment: previousYearData.previousYearPrepayment || 0,
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
      deemedTaxation,
      employeeIncome,
      taxReductions,
      employeeWithholdings,
      businessWithholdings,
      previousYearPrepayment,
    };
    
    const calcResults = calculateEmployeeIncome(inputs);
    setResults(calcResults);
  }, [
    netTurnover, otherOrdinaryIncome, inventoryChanges, purchasesGoodsMaterials,
    employeeBenefits, depreciation, otherExpensesLosses, otherIncomeGains,
    interestNet, adjustments, carriedForwardLosses, deemedTaxation,
    employeeIncome, taxReductions, employeeWithholdings, businessWithholdings,
    previousYearPrepayment,
  ]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/calculation/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId, year, netTurnover, otherOrdinaryIncome, inventoryChanges,
          purchasesGoodsMaterials, employeeBenefits, depreciation, otherExpensesLosses,
          otherIncomeGains, interestNet, adjustments, carriedForwardLosses,
          deemedTaxation, employeeIncome, taxReductions, employeeWithholdings,
          businessWithholdings, previousYearPrepayment,
          houseSize, isOwned, carCC, hasPool, privateSchool, domesticWorker, dependents,
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
        <span className="font-semibold">{Math.abs(numChange).toFixed(2)}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* General Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            Γενικές Πληροφορίες
          </h2>
          <div>
            <Label htmlFor="year">Έτος</Label>
            <Input id="year" type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} />
          </div>
        </div>

        {/* Business Income */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            Επιχειρηματικό Εισόδημα
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Κύκλος Εργασιών</Label>
                <Input type="number" step="0.01" value={netTurnover} onChange={(e) => setNetTurnover(parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <Label>Αγορές (αρνητικό)</Label>
                <Input type="number" step="0.01" value={purchasesGoodsMaterials} onChange={(e) => setPurchasesGoodsMaterials(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Λοιπά Έξοδα</Label>
                <Input type="number" step="0.01" value={otherExpensesLosses} onChange={(e) => setOtherExpensesLosses(parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <Label>Προσαρμογές</Label>
                <Input type="number" step="0.01" value={adjustments} onChange={(e) => setAdjustments(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Income */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <User className="mr-2 h-5 w-5" />
            Μισθωτό Εισόδημα
          </h2>
          <div>
            <Label>Εισόδημα από Μισθωτές Υπηρεσίες</Label>
            <Input type="number" step="0.01" value={employeeIncome} onChange={(e) => setEmployeeIncome(parseFloat(e.target.value) || 0)} />
          </div>
        </div>

        {/* Deemed Taxation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Τεκμαρτή Φορολόγηση</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Μέγεθος Κατοικίας (τ.μ.)</Label>
                <Input type="number" value={houseSize} onChange={(e) => setHouseSize(parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <Label>Αυτοκίνητο (κ.εκ.)</Label>
                <Input type="number" value={carCC} onChange={(e) => setCarCC(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Εξαρτώμενα Μέλη</Label>
                <Input type="number" value={dependents} onChange={(e) => setDependents(parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={hasPool} onChange={(e) => setHasPool(e.target.checked)} className="rounded" />
                  <span>Πισίνα</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={privateSchool} onChange={(e) => setPrivateSchool(e.target.checked)} className="rounded" />
                  <span>Ιδιωτικό Σχολείο</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={domesticWorker} onChange={(e) => setDomesticWorker(e.target.checked)} className="rounded" />
                  <span>Οικιακός Βοηθός</span>
                </label>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-sm text-gray-600">Υπολογισμένη Τεκμαρτή:</div>
              <div className="text-lg font-bold text-blue-600">€{deemedTaxation.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        {/* Withholdings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Παρακρατήσεις & Μειώσεις</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Μειώσεις από Φόρο</Label>
                <Input type="number" step="0.01" value={taxReductions} onChange={(e) => setTaxReductions(parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <Label>Παρακρατήσεις Μισθωτών</Label>
                <Input type="number" step="0.01" value={employeeWithholdings} onChange={(e) => setEmployeeWithholdings(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Παρακρατήσεις Επιχείρησης</Label>
                <Input type="number" step="0.01" value={businessWithholdings} onChange={(e) => setBusinessWithholdings(parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <Label>Προκ/λή Προηγ. Χρήσης</Label>
                <Input type="number" step="0.01" value={previousYearPrepayment} onChange={(e) => setPreviousYearPrepayment(parseFloat(e.target.value) || 0)} />
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
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-lg shadow-lg p-6 sticky top-4">
          <h2 className="text-2xl font-bold mb-6">Αποτελέσματα</h2>
          {results && (
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Συνολικό Φορολογητέο</div>
                <div className="text-2xl font-bold">€{results.totalTaxableIncome.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
                {prevResults && (
                  <div className="mt-2">{renderPercentageChange(results.totalTaxableIncome, prevResults.totalTaxableIncome)}</div>
                )}
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Φόρος Πληρωτέος</div>
                <div className="text-2xl font-bold">€{results.netTaxDue.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
                {prevResults && (
                  <div className="mt-2">{renderPercentageChange(results.netTaxDue, prevResults.netTaxDue)}</div>
                )}
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Εισφορά Αλληλεγγύης</div>
                <div className="text-2xl font-bold">€{results.solidarityContribution.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Προκ/λή Επόμ. Χρήσης</div>
                <div className="text-2xl font-bold">€{results.prepaymentNextYear.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Ελάχιστη Χρήση Κάρτας</div>
                <div className="text-2xl font-bold">€{results.minimumCardSpending.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
              </div>

              <div className="bg-white/20 rounded-lg p-4 border-2 border-white/30">
                <div className="text-sm opacity-90 mb-1">Σύνολο Φόρου</div>
                <div className="text-3xl font-bold">€{results.totalTaxDeclaration.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</div>
              </div>

              <div className="border-t border-white/20 pt-4 mt-4">
                <h3 className="font-semibold mb-3">Σύνοψη</h3>
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
