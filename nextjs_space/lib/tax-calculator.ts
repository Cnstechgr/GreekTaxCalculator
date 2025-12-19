// Greek Tax Calculator - Core Calculation Engine
// Implements all 456 formulas from the Excel specification

/**
 * Calculate progressive tax for individuals based on Greek tax brackets
 * Brackets: 0-10k: 9%, 10-20k: 22%, 20-30k: 28%, 30-40k: 36%, 40k+: 44%
 */
export function calculateProgressiveTax(income: number): number {
  if (income <= 0) return 0;
  
  let tax = 0;
  
  if (income <= 10000) {
    tax = income * 0.09;
  } else if (income <= 20000) {
    tax = 10000 * 0.09 + (income - 10000) * 0.22;
  } else if (income <= 30000) {
    tax = 10000 * 0.09 + 10000 * 0.22 + (income - 20000) * 0.28;
  } else if (income <= 40000) {
    tax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + (income - 30000) * 0.36;
  } else {
    tax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + 10000 * 0.36 + (income - 40000) * 0.44;
  }
  
  return Math.round(tax * 100) / 100;
}

/**
 * Calculate corporate tax (22% flat rate)
 */
export function calculateCorporateTax(income: number): number {
  return income > 0 ? Math.round(income * 0.22 * 100) / 100 : 0;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): string | number {
  if (previous === 0) {
    if (current !== 0) {
      return Math.abs(current);
    }
    return '-';
  }
  return ((Math.abs(current) - Math.abs(previous)) / Math.abs(previous)) * 100;
}

/**
 * Calculate minimum card spending requirement
 * 30% of taxable income, capped at €20,000
 */
export function calculateMinimumCardSpending(taxableIncome: number): number {
  return Math.min(taxableIncome * 0.30, 20000);
}

/**
 * Individual Business Calculation Results
 */
export interface IndividualCalculationResults {
  resultBeforeTax: number;
  adjustedResults: number;
  taxableResults: number;
  taxableIncome: number;
  taxDue: number;
  prepaymentNextYear: number;
  totalTaxDeclaration: number;
  minimumCardSpending: number;
  totalIncome: number;
  totalTaxes: number;
  netIncome: number;
}

/**
 * Calculate all results for individual business (Ατομική)
 */
export function calculateIndividualBusiness(
  inputs: {
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
): IndividualCalculationResults {
  // Row 18: Result Before Tax (sum of rows 9-17)
  const resultBeforeTax = 
    inputs.netTurnover +
    inputs.otherOrdinaryIncome +
    inputs.inventoryChanges +
    inputs.purchasesGoodsMaterials +
    inputs.employeeBenefits +
    inputs.depreciation +
    inputs.otherExpensesLosses +
    inputs.otherIncomeGains +
    inputs.interestNet;

  // Row 20: Adjusted Results (result + adjustments)
  const adjustedResults = resultBeforeTax + inputs.adjustments;

  // Row 22: Taxable Results Method 1 (adjusted + carried forward losses)
  const taxableResults = adjustedResults + inputs.carriedForwardLosses;

  // Row 24: Taxable Income (max of method 1 and deemed taxation)
  const taxableIncome = Math.max(taxableResults, inputs.deemedTaxation);

  // Row 25: Tax Due (progressive brackets)
  const taxDue = calculateProgressiveTax(taxableIncome);

  // Row 26: Prepayment for Next Year (55% of tax minus withholdings, minimum 0)
  const prepaymentCalc = taxDue * 0.55 - Math.abs(inputs.businessWithholdings);
  const prepaymentNextYear = Math.max(0, prepaymentCalc);

  // Row 29: Total Tax Declaration (tax + prepayment - previous prepayment)
  const totalTaxDeclaration = 
    taxDue + prepaymentNextYear + inputs.businessWithholdings - inputs.previousYearPrepayment;

  // Row 31: Minimum Card Spending
  const minimumCardSpending = calculateMinimumCardSpending(taxableIncome);

  // Summary calculations
  const totalIncome = taxableIncome;
  const totalTaxes = taxDue + prepaymentNextYear - inputs.previousYearPrepayment;
  const netIncome = totalIncome - totalTaxes;

  return {
    resultBeforeTax: Math.round(resultBeforeTax * 100) / 100,
    adjustedResults: Math.round(adjustedResults * 100) / 100,
    taxableResults: Math.round(taxableResults * 100) / 100,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    taxDue: Math.round(taxDue * 100) / 100,
    prepaymentNextYear: Math.round(prepaymentNextYear * 100) / 100,
    totalTaxDeclaration: Math.round(totalTaxDeclaration * 100) / 100,
    minimumCardSpending: Math.round(minimumCardSpending * 100) / 100,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalTaxes: Math.round(totalTaxes * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
  };
}

/**
 * Company Calculation Results
 */
export interface CompanyCalculationResults {
  resultBeforeTax: number;
  adjustedResults: number;
  taxableResults: number;
  taxDue: number;
  prepaymentNextYear: number;
  totalTaxDeclaration: number;
  totalIncome: number;
  totalTaxes: number;
  netIncome: number;
}

/**
 * Calculate all results for company (Εταιρεία)
 */
export function calculateCompany(
  inputs: {
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
    businessWithholdings: number;
    previousYearPrepayment: number;
    professionalFee: number;
  }
): CompanyCalculationResults {
  // Row 18: Result Before Tax
  const resultBeforeTax = 
    inputs.netTurnover +
    inputs.otherOrdinaryIncome +
    inputs.inventoryChanges +
    inputs.purchasesGoodsMaterials +
    inputs.employeeBenefits +
    inputs.depreciation +
    inputs.otherExpensesLosses +
    inputs.otherIncomeGains +
    inputs.interestNet;

  // Row 20: Adjusted Results
  const adjustedResults = resultBeforeTax + inputs.adjustments;

  // Row 22: Taxable Results (no deemed taxation for companies)
  const taxableResults = adjustedResults + inputs.carriedForwardLosses;

  // Row 23: Tax Due (22% flat rate, only if positive)
  const taxDue = calculateCorporateTax(taxableResults);

  // Row 24: Prepayment for Next Year (80% of tax + withholdings)
  const prepaymentNextYear = taxDue * 0.80 + inputs.businessWithholdings;

  // Row 28: Total Tax Declaration
  const totalTaxDeclaration = 
    taxDue + prepaymentNextYear + inputs.businessWithholdings - inputs.previousYearPrepayment + inputs.professionalFee;

  // Summary
  const totalIncome = taxableResults;
  const totalTaxes = taxDue + prepaymentNextYear - inputs.previousYearPrepayment + inputs.professionalFee;
  const netIncome = totalIncome - totalTaxes;

  return {
    resultBeforeTax: Math.round(resultBeforeTax * 100) / 100,
    adjustedResults: Math.round(adjustedResults * 100) / 100,
    taxableResults: Math.round(taxableResults * 100) / 100,
    taxDue: Math.round(taxDue * 100) / 100,
    prepaymentNextYear: Math.round(prepaymentNextYear * 100) / 100,
    totalTaxDeclaration: Math.round(totalTaxDeclaration * 100) / 100,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalTaxes: Math.round(totalTaxes * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
  };
}

/**
 * Format number as Greek currency (€1.234,56)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number as percentage (12,34%)
 */
export function formatPercentage(value: number | string): string {
  if (value === '-') return '-';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('el-GR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue / 100);
}
